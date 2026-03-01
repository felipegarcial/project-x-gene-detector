import { describe, it, expect } from 'vitest'
import { normalizeInput, validateDna, parseDna } from '../useScanner'

describe('normalizeInput', () => {
  it('returns empty string for whitespace-only input', () => {
    expect(normalizeInput('   ')).toBe('')
  })

  it('parses JSON array format', () => {
    const input = '["ATGCGA","CAGTGC","TTATGT","AGAAGG"]'
    expect(normalizeInput(input)).toBe('ATGCGA\nCAGTGC\nTTATGT\nAGAAGG')
  })

  it('parses JSON array with single quotes', () => {
    const input = "['ATGCGA','CAGTGC','TTATGT','AGAAGG']"
    expect(normalizeInput(input)).toBe('ATGCGA\nCAGTGC\nTTATGT\nAGAAGG')
  })

  it('preserves newline-separated input as-is', () => {
    const input = 'ATGCGA\nCAGTGC'
    expect(normalizeInput(input)).toBe('ATGCGA\nCAGTGC')
  })

  it('converts comma-separated values to newlines', () => {
    const input = 'ATGCGA,CAGTGC,TTATGT,AGAAGG'
    expect(normalizeInput(input)).toBe('ATGCGA\nCAGTGC\nTTATGT\nAGAAGG')
  })

  it('converts space-separated values to newlines', () => {
    const input = 'ATGCGA CAGTGC TTATGT AGAAGG'
    expect(normalizeInput(input)).toBe('ATGCGA\nCAGTGC\nTTATGT\nAGAAGG')
  })

  it('auto-detects flat string and splits into square grid', () => {
    const input = 'ATGCATGCATGCATGC'
    const result = normalizeInput(input)
    expect(result).toBe('ATGC\nATGC\nATGC\nATGC')
  })

  it('converts lowercase to uppercase', () => {
    const input = '["atgcga","cagtgc","ttatgt","agaagg"]'
    expect(normalizeInput(input)).toBe('ATGCGA\nCAGTGC\nTTATGT\nAGAAGG')
  })

  it('returns raw input when flat string is not a perfect square', () => {
    const input = 'ATGCGA'
    expect(normalizeInput(input)).toBe('ATGCGA')
  })
})

describe('parseDna', () => {
  it('splits by newline and strips non-DNA characters', () => {
    expect(parseDna('ATGCGA\nCAGTGC')).toEqual(['ATGCGA', 'CAGTGC'])
  })

  it('handles brackets, quotes, and commas', () => {
    expect(parseDna('["ATGCGA",\n"CAGTGC"]')).toEqual(['ATGCGA', 'CAGTGC'])
  })

  it('filters empty lines', () => {
    expect(parseDna('ATGCGA\n\nCAGTGC\n')).toEqual(['ATGCGA', 'CAGTGC'])
  })

  it('converts to uppercase', () => {
    expect(parseDna('atgcga\ncagtgc')).toEqual(['ATGCGA', 'CAGTGC'])
  })

  it('returns empty array for empty string', () => {
    expect(parseDna('')).toEqual([])
  })
})

describe('validateDna', () => {
  it('returns null for valid 4x4 DNA', () => {
    expect(validateDna(['ATGC', 'ATGC', 'ATGC', 'ATGC'])).toBeNull()
  })

  it('returns null for valid 6x6 DNA', () => {
    expect(validateDna(['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'])).toBeNull()
  })

  it('returns null for empty array (no error, just nothing to validate)', () => {
    expect(validateDna([])).toBeNull()
  })

  it('rejects matrix smaller than 4x4', () => {
    expect(validateDna(['ATG', 'ATG', 'ATG'])).toBe('DNA matrix must be at least 4x4')
  })

  it('rejects matrix larger than 20x20', () => {
    const rows = Array(21).fill('A'.repeat(21))
    expect(validateDna(rows)).toContain('cannot exceed')
  })

  it('rejects non-square matrix', () => {
    expect(validateDna(['ATGC', 'ATG', 'ATGC', 'ATGC'])).toContain('square')
  })

  it('rejects invalid characters', () => {
    expect(validateDna(['ATGX', 'ATGC', 'ATGC', 'ATGC'])).toContain('Only A, T, C, G')
  })
})
