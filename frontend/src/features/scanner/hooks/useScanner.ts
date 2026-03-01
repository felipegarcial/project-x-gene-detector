import { useState } from 'react'
import { analyzeDna } from '../scanner.service'
import type { MutantResponse } from '../scanner.types'

/**
 * Normalize raw user input into a formatted DNA matrix (one row per line).
 *
 * Supports multiple input formats:
 * - Already formatted (one row per line): "ATGCGA\nCAGTGC\n..."
 * - JSON array: ["ATGCGA","CAGTGC",...]
 * - Comma/space separated with quotes: "ATGCGA","CAGTGC",...
 * - Continuous string: ATGCGACAGTGCTTATGT... (split by sqrt of length)
 */
function normalizeInput(raw: string): string {
  const trimmed = raw.trim().toUpperCase()
  if (!trimmed) return ''

  // Already has newlines — user is typing line by line, don't interfere
  if (raw.includes('\n')) {
    return raw
  }

  // JSON array: ["ATGCGA","CAGTGC",...] or ['ATGCGA','CAGTGC',...]
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed.replace(/'/g, '"'))
      if (Array.isArray(parsed)) {
        return parsed.map((s: string) => String(s).trim().toUpperCase()).join('\n')
      }
    } catch { /* not valid JSON, continue */ }
  }

  // Comma or space separated (with or without quotes):
  // "ATGCGA","CAGTGC" or "ATGCGA", "CAGTGC" or ATGCGA,CAGTGC
  if (trimmed.includes(',')) {
    const parts = trimmed
      .split(',')
      .map((s) => s.replace(/["'\s]/g, '').trim())
      .filter((s) => s.length > 0)

    if (parts.length > 1) {
      return parts.join('\n')
    }
  }

  // Continuous string: ATGCGACAGTGCTTATGT...
  // Only DNA chars, no separators — split by sqrt(length) for NxN matrix
  const dnaOnly = trimmed.replace(/[^ATCG]/g, '')
  if (dnaOnly.length === trimmed.length && dnaOnly.length >= 16) {
    const n = Math.sqrt(dnaOnly.length)
    if (Number.isInteger(n)) {
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
  if (dna.length === 0) return 'Enter at least one DNA row'
  if (dna.length < 4) return 'DNA matrix must be at least 4x4'

  const n = dna.length
  for (const row of dna) {
    if (row.length !== n) {
      return `DNA must be a square ${n}x${n} matrix — found a row with ${row.length} characters`
    }
    if (!DNA_BASES.test(row)) {
      return 'Only A, T, C, G characters are allowed'
    }
  }

  return null
}

/**
 * Parse the textarea value into an array of DNA strings for the API.
 */
function parseDna(raw: string): string[] {
  return raw
    .trim()
    .split('\n')
    .map((line) => line.trim().toUpperCase())
    .filter((line) => line.length > 0)
}

export function useScanner() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<MutantResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [dna, setDna] = useState<string[]>([])

  function handleInput(value: string) {
    setInput(normalizeInput(value))
  }

  async function analyze() {
    setError(null)
    setResult(null)

    const parsed = parseDna(input)
    const validationError = validateDna(parsed)

    if (validationError) {
      setError(validationError)
      return
    }

    setDna(parsed)
    setLoading(true)
    try {
      const response = await analyzeDna(parsed)
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  function clear() {
    setInput('')
    setResult(null)
    setError(null)
    setDna([])
  }

  const canSubmit = !loading && input.trim().length > 0

  return { input, handleInput, result, error, loading, canSubmit, analyze, clear, dna }
}
