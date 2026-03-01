import { useState, useMemo, useCallback, useRef } from 'react'
import { analyzeDna } from '../scanner.service'
import type { MutantResponse, GridState } from '../scanner.types'

/** Maximum DNA matrix size (NxN) to prevent UI freezing */
const MAX_DNA_SIZE = 20

/**
 * Normalize raw user input into a formatted DNA matrix (one row per line).
 *
 * Supports multiple input formats:
 * - One row per line: "ATGCGA\nCAGTGC\n..."
 * - JSON array: ["ATGCGA","CAGTGC",...] (with or without newlines)
 * - Comma-separated: ATGCGA,CAGTGC,... or "ATGCGA","CAGTGC",...
 * - Space-separated: ATGCGA CAGTGC TTATGT ...
 * - Continuous string: ATGCGACAGTGCTTATGT... (split by sqrt for NxN)
 */
function normalizeInput(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''

  const upper = trimmed.toUpperCase()

  // 1. JSON array — collapse newlines first so pasted multi-line JSON works
  const collapsed = upper.replace(/\s+/g, '')
  if (collapsed.startsWith('[') && collapsed.endsWith(']')) {
    try {
      const parsed = JSON.parse(collapsed.replace(/'/g, '"'))
      if (Array.isArray(parsed)) {
        return parsed.map((s: string) => String(s).trim().toUpperCase()).join('\n')
      }
    } catch { /* not valid JSON, continue */ }
  }

  // 2. Already has newlines — user is typing line by line, don't interfere
  if (raw.includes('\n')) {
    return raw
  }

  // 3. Comma-separated (with or without quotes/spaces)
  if (upper.includes(',')) {
    const parts = upper
      .split(',')
      .map((s) => s.replace(/[^ATCG]/g, ''))
      .filter((s) => s.length > 0)

    if (parts.length > 1) {
      return parts.join('\n')
    }
  }

  // 4. Space-separated: "ATGCGA CAGTGC TTATGT ..."
  if (upper.includes(' ')) {
    const parts = upper
      .split(/\s+/)
      .map((s) => s.replace(/[^ATCG]/g, ''))
      .filter((s) => s.length > 0)

    if (parts.length > 1) {
      return parts.join('\n')
    }
  }

  // 5. Continuous string: extract only DNA chars, split by sqrt(length)
  const dnaOnly = upper.replace(/[^ATCG]/g, '')
  if (dnaOnly.length >= 16) {
    const n = Math.sqrt(dnaOnly.length)
    if (Number.isInteger(n) && n >= 4) {
      const rows: string[] = []
      for (let i = 0; i < dnaOnly.length; i += n) {
        rows.push(dnaOnly.slice(i, i + n))
      }
      return rows.join('\n')
    }
  }

  return raw
}

const DNA_BASES = /^[ATCG]+$/

/**
 * Validate a parsed DNA array before sending to the API.
 * Returns an error message string, or null if valid.
 */
function validateDna(dna: string[]): string | null {
  if (dna.length === 0) return null // empty is not an error, just nothing to show
  if (dna.length < 4) return 'DNA matrix must be at least 4x4'
  if (dna.length > MAX_DNA_SIZE) return `DNA matrix cannot exceed ${MAX_DNA_SIZE}x${MAX_DNA_SIZE}`

  const n = dna.length
  for (const row of dna) {
    if (row.length !== n) {
      return `DNA must be a square ${n}x${n} matrix, found a row with ${row.length} characters`
    }
    if (!DNA_BASES.test(row)) {
      return 'Only A, T, C, G characters are allowed'
    }
  }

  return null
}

/**
 * Parse the textarea value into an array of DNA strings for the API.
 * Strips brackets, quotes, commas, and whitespace so users can paste
 * JSON arrays, comma-separated values, or plain lines interchangeably.
 */
function parseDna(raw: string): string[] {
  return raw
    .trim()
    .split('\n')
    .map((line) => line.replace(/[\[\]"',\s]/g, '').toUpperCase())
    .filter((line) => line.length > 0)
}

export function useScanner() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<MutantResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [dna, setDna] = useState<string[]>([])

  // Track in-flight request for cancellation (double-click protection)
  const abortRef = useRef<AbortController | null>(null)

  const handleInput = useCallback((value: string) => {
    setInput(normalizeInput(value))
    setResult(null)
    setError(null)
  }, [])

  // Combined live validation + preview DNA (single parse, single validate)
  const { liveValidation, previewDna } = useMemo(() => {
    const parsed = parseDna(input)
    if (parsed.length === 0) return { liveValidation: null, previewDna: [] as string[] }
    const err = validateDna(parsed)
    return {
      liveValidation: err,
      previewDna: err === null ? parsed : [],
    }
  }, [input])

  const analyze = useCallback(async () => {
    setError(null)
    setResult(null)

    const parsed = parseDna(input)
    const validationError = validateDna(parsed)

    if (validationError) {
      setError(validationError)
      return
    }

    if (parsed.length === 0) {
      setError('Enter a DNA sequence to analyze')
      return
    }

    // Cancel any previous in-flight request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setDna(parsed)
    setLoading(true)
    try {
      const response = await analyzeDna(parsed, { signal: controller.signal })
      if (!controller.signal.aborted) {
        setResult(response)
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [input])

  const clear = useCallback(() => {
    abortRef.current?.abort()
    setInput('')
    setResult(null)
    setError(null)
    setDna([])
  }, [])

  const canSubmit = !loading && input.trim().length > 0 && !liveValidation

  // Grid state machine: empty → preview → scanning → result
  const gridState: GridState = result
    ? 'result'
    : loading
      ? 'scanning'
      : previewDna.length > 0
        ? 'preview'
        : 'empty'

  return {
    input, handleInput, result, error, loading, canSubmit,
    analyze, clear, dna, previewDna, gridState, liveValidation,
  }
}
