import { describe, it, expect } from 'vitest'
import { dnaSchema } from '../mutant.schema.js'

describe('dnaSchema', () => {
  it('should accept a valid 6x6 DNA matrix', () => {
    const result = dnaSchema.safeParse({
      dna: ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'],
    })
    expect(result.success).toBe(true)
  })

  it('should accept a valid 4x4 DNA matrix (minimum size)', () => {
    const result = dnaSchema.safeParse({
      dna: ['ATGC', 'CGTA', 'TACG', 'GCAT'],
    })
    expect(result.success).toBe(true)
  })

  it('should reject DNA with invalid characters', () => {
    const result = dnaSchema.safeParse({
      dna: ['ATXCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'],
    })
    expect(result.success).toBe(false)
  })

  it('should reject lowercase letters', () => {
    const result = dnaSchema.safeParse({
      dna: ['atgc', 'cgta', 'tacg', 'gcat'],
    })
    expect(result.success).toBe(false)
  })

  it('should reject a non-square matrix (rows have different lengths)', () => {
    const result = dnaSchema.safeParse({
      dna: ['ATGCGA', 'CAG', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'],
    })
    expect(result.success).toBe(false)
  })

  it('should reject a matrix smaller than 4x4', () => {
    const result = dnaSchema.safeParse({
      dna: ['ATG', 'CGT', 'TAC'],
    })
    expect(result.success).toBe(false)
  })

  it('should reject an empty array', () => {
    const result = dnaSchema.safeParse({
      dna: [],
    })
    expect(result.success).toBe(false)
  })

  it('should reject missing dna field', () => {
    const result = dnaSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('should reject numbers instead of strings', () => {
    const result = dnaSchema.safeParse({
      dna: [1234, 5678, 9012, 3456],
    })
    expect(result.success).toBe(false)
  })
})
