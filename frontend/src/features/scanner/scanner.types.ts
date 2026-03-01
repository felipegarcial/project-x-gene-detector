/** A sequence is an array of [row, col] coordinate pairs. */
export type SequenceCoords = [number, number][]

export interface MutantResponse {
  is_mutant: boolean
  sequences: SequenceCoords[]
}
