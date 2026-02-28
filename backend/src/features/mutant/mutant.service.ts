import { DEFAULTS } from '../../config.js'

const { SEQUENCE_LENGTH, MIN_SEQUENCES_FOR_MUTANT } = DEFAULTS

/**
 * Search directions for sequence detection:
 * - Horizontal (right)
 * - Vertical (down)
 * - Diagonal (down-right)
 * - Diagonal (down-left)
 *
 * Only "forward" directions are needed since we scan top-to-bottom,
 * left-to-right. Reverse directions would find the same sequences.
 */
const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
] as const

/**
 * Attempts to find a sequence of SEQUENCE_LENGTH identical letters
 * starting at (row, col) in the direction (dr, dc).
 *
 * Returns true if a valid sequence is found AND marks those cells
 * as used to prevent overlap with other sequences.
 *
 * Optimization: checks remaining cells (k=1..3) before the origin
 * cell (k=0) to fail fast — if any downstream cell doesn't match,
 * we skip the origin check entirely.
 */
function findSequence(
  dna: string[],
  used: boolean[][],
  row: number,
  col: number,
  dr: number,
  dc: number,
  n: number
): boolean {
  // Bounds check: verify the last cell of the sequence fits in the grid
  const endRow = row + dr * (SEQUENCE_LENGTH - 1)
  const endCol = col + dc * (SEQUENCE_LENGTH - 1)
  if (endRow < 0 || endRow >= n || endCol < 0 || endCol >= n) return false

  const base = dna[row][col]

  // Verify cells k=1..3 match the base letter and are not already used
  for (let k = 1; k < SEQUENCE_LENGTH; k++) {
    const r = row + dr * k
    const c = col + dc * k
    if (dna[r][c] !== base || used[r][c]) return false
  }

  // Deferred check: verify the origin cell is also unused
  if (used[row][col]) return false

  // Valid sequence found — mark all cells as used
  for (let k = 0; k < SEQUENCE_LENGTH; k++) {
    used[row + dr * k][col + dc * k] = true
  }

  return true
}

/**
 * Detects if a DNA sequence belongs to a mutant.
 *
 * A human is a mutant if more than one sequence of 4 identical
 * consecutive letters is found horizontally, vertically, or diagonally.
 * Cells used in one sequence cannot be reused in another (no overlap).
 *
 * ## Algorithm: Position-First Traversal
 *
 * The naive approach iterates direction-first: find all horizontals,
 * then all verticals, then all diagonals. This creates a directional
 * bias — earlier directions consume cells that could have formed valid
 * sequences in later directions.
 *
 * Example of the bias problem:
 * ```
 *   A A A A      Direction-first: horizontal finds AAAA in row 0,
 *   A . . .      marks (0,0)-(0,3). Then vertical tries AAAA in col 0
 *   A . . .      but (0,0) is already used. Result: 1 sequence (human).
 *   A . . .      Correct answer: 2 sequences (mutant).
 * ```
 *
 * This implementation uses position-first traversal: at each cell,
 * all 4 directions are checked before moving to the next cell.
 * This distributes detection evenly across directions and avoids
 * the bias described above.
 *
 * ## Early Return
 *
 * As soon as 2 sequences are found, returns true immediately
 * without scanning the rest of the matrix.
 *
 * ## Complexity
 *
 * - Time:  O(N² × D × K) where D=4 directions, K=4 sequence length → O(N²)
 * - Space: O(N²) for the boolean matrix tracking used cells
 *
 * @param dna - Array of N strings, each of length N, containing only A/T/C/G
 * @returns true if the DNA belongs to a mutant (>= 2 sequences found)
 */
export function isMutant(dna: string[]): boolean {
  const n = dna.length
  const used: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false))
  let sequencesFound = 0

  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      for (const [dr, dc] of DIRECTIONS) {
        if (findSequence(dna, used, row, col, dr, dc, n)) {
          sequencesFound++
          if (sequencesFound >= MIN_SEQUENCES_FOR_MUTANT) {
            return true
          }
        }
      }
    }
  }

  return false
}
