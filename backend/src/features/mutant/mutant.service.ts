import { DEFAULTS } from '../../config.js'

const { SEQUENCE_LENGTH, MIN_SEQUENCES_FOR_MUTANT } = DEFAULTS

/** Horizontal, vertical, diagonal-right, diagonal-left. */
const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
] as const

export type SequenceCoords = [number, number][]

export interface MutantResult {
  is_mutant: boolean
  sequences: SequenceCoords[]
}

function findSequence(
  dna: string[],
  used: boolean[][],
  row: number,
  col: number,
  dr: number,
  dc: number,
  n: number
): SequenceCoords | null {
  const endRow = row + dr * (SEQUENCE_LENGTH - 1)
  const endCol = col + dc * (SEQUENCE_LENGTH - 1)
  if (endRow < 0 || endRow >= n || endCol < 0 || endCol >= n) return null

  const base = dna[row][col]

  for (let k = 1; k < SEQUENCE_LENGTH; k++) {
    const r = row + dr * k
    const c = col + dc * k
    if (dna[r][c] !== base || used[r][c]) return null
  }

  // Check origin last — fail fast on downstream cells first
  if (used[row][col]) return null

  const coords: SequenceCoords = []
  for (let k = 0; k < SEQUENCE_LENGTH; k++) {
    const r = row + dr * k
    const c = col + dc * k
    used[r][c] = true
    coords.push([r, c])
  }

  return coords
}

/**
 * Detects if a DNA sequence belongs to a mutant.
 *
 * Uses position-first traversal: at each cell, all 4 directions are checked
 * before moving to the next cell. This avoids directional bias where a
 * direction-first approach would consume cells needed by later directions.
 *
 * Early returns as soon as 2 sequences are found. O(N²) time and space.
 */
export function isMutant(dna: string[]): MutantResult {
  const n = dna.length
  const used: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false))
  const sequences: SequenceCoords[] = []

  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      for (const [dr, dc] of DIRECTIONS) {
        const coords = findSequence(dna, used, row, col, dr, dc, n)
        if (coords) {
          sequences.push(coords)
          if (sequences.length >= MIN_SEQUENCES_FOR_MUTANT) {
            return { is_mutant: true, sequences }
          }
        }
      }
    }
  }

  return { is_mutant: false, sequences }
}
