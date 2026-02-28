import { describe, it, expect } from 'vitest'
import { isMutant } from '../mutant.service.js'

describe('isMutant', () => {
  // --- Cases from the PDF ---

  it('should return true for the mutant example from the PDF', () => {
    // Sequences: diagonal A's (col 0 down-right) + horizontal C's (row 4)
    const dna = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG']
    expect(isMutant(dna)).toBe(true)
  })

  it('should return false for the not-mutant example from the PDF', () => {
    const dna = ['ATGCGA', 'CAGTGC', 'TTATTT', 'AGACGG', 'GCGTCA', 'TCACTG']
    expect(isMutant(dna)).toBe(false)
  })

  // --- Direction-specific tests ---

  it('should detect mutant with 2 horizontal sequences', () => {
    const dna = [
      'AAAATG', // AAAA horizontal
      'CCCCTG', // CCCC horizontal
      'TGATGT',
      'AGACGG',
      'GCGTCA',
      'TCACTG',
    ]
    expect(isMutant(dna)).toBe(true)
  })

  it('should detect mutant with 2 vertical sequences', () => {
    //  Col 0: A,A,A,A  Col 1: T,T,T,T
    const dna = [
      'ATGCGA',
      'ATGCGA',
      'ATGCGA',
      'ATGCGA',
      'CCGTCA',
      'TCACTG',
    ]
    expect(isMutant(dna)).toBe(true)
  })

  it('should detect mutant with diagonal down-left sequence + horizontal', () => {
    //  Row 0 col 3: A, then (1,2)=A, (2,1)=A, (3,0)=A → diagonal down-left AAAA
    //  Row 4: CCCC horizontal
    const dna = [
      'TGGATG',
      'TGATGC',
      'TAATGT',
      'AGTCGG',
      'CCCCCA',
      'TCACTG',
    ]
    expect(isMutant(dna)).toBe(true)
  })

  // --- Edge cases ---

  it('should return false with only 1 sequence (not enough for mutant)', () => {
    // Only one horizontal AAAA, rest is random with no 4 consecutive
    const dna = [
      'AAAATG',
      'TGCATC',
      'CTAGTG',
      'GATCGA',
      'TGCATC',
      'CTAGTG',
    ]
    expect(isMutant(dna)).toBe(false)
  })

  it('should handle minimum 4x4 matrix — mutant', () => {
    // Two horizontal sequences fit in a 4x4
    const dna = [
      'AAAA',
      'CCCC',
      'TGTG',
      'GTGT',
    ]
    expect(isMutant(dna)).toBe(true)
  })

  it('should handle minimum 4x4 matrix — human', () => {
    // Only one horizontal sequence in a 4x4
    const dna = [
      'AAAA',
      'TGTG',
      'GTGT',
      'TGTG',
    ]
    expect(isMutant(dna)).toBe(false)
  })

  it('should return false when no sequences exist', () => {
    // Alternating pattern, no 4 consecutive equal letters anywhere
    const dna = [
      'ATGC',
      'CGTA',
      'TACG',
      'GCAT',
    ]
    expect(isMutant(dna)).toBe(false)
  })

  it('should handle all identical letters', () => {
    // Many possible sequences, with no-overlap still finds >= 2
    const dna = [
      'AAAAAA',
      'AAAAAA',
      'AAAAAA',
      'AAAAAA',
      'AAAAAA',
      'AAAAAA',
    ]
    expect(isMutant(dna)).toBe(true)
  })

  it('should respect no-overlap rule', () => {
    // Row 0: AAAA horizontal uses cells (0,0)-(0,3)
    // Diagonal from (0,0) would need (0,0) but it's already used
    // No other sequence available → human
    const dna = [
      'AAAATG',
      'CGTCGC',
      'TCTCGT',
      'GTGCGG',
      'GCGTCA',
      'TCACTG',
    ]
    expect(isMutant(dna)).toBe(false)
  })

  it('should detect sequences at the bottom and right edges', () => {
    // Col 0 rows 0-3: T,T,T,T vertical
    // Row 5: CCCC horizontal at the bottom edge
    const dna = [
      'TGATGA',
      'TGCTGC',
      'TGATGA',
      'TGATGA',
      'GCGTCA',
      'CCCCGA',
    ]
    expect(isMutant(dna)).toBe(true)
  })
})
