import { DEFAULTS } from '../../config.js'

const { SEQUENCE_LENGTH, MIN_SEQUENCES_FOR_MUTANT } = DEFAULTS

type Direction = [number, number]

const DIRECTIONS: Direction[] = [
  [0, 1],   // horizontal (right)
  [1, 0],   // vertical (down)
  [1, 1],   // diagonal down-right
  [1, -1],  // diagonal down-left
]

/**
 * Detects if a DNA sequence belongs to a mutant.
 * A mutant has more than one sequence of 4 identical consecutive letters
 * (horizontal, vertical, or diagonal). Cells used in one sequence
 * cannot be reused in another.
 */
export function isMutant(dna: string[]): boolean {
  const n = dna.length
  const used: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false))
  let sequencesFound = 0

  for (const [dr, dc] of DIRECTIONS) {
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        // Check bounds: can we fit a sequence of 4 from here?
        const endRow = row + dr * (SEQUENCE_LENGTH - 1)
        const endCol = col + dc * (SEQUENCE_LENGTH - 1)

        if (endRow < 0 || endRow >= n || endCol < 0 || endCol >= n) continue

        const base = dna[row][col]
        let valid = true
        const cells: [number, number][] = []

        for (let k = 0; k < SEQUENCE_LENGTH; k++) {
          const r = row + dr * k
          const c = col + dc * k

          if (dna[r][c] !== base || used[r][c]) {
            valid = false
            break
          }
          cells.push([r, c])
        }

        if (valid) {
          for (const [r, c] of cells) {
            used[r][c] = true
          }
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
