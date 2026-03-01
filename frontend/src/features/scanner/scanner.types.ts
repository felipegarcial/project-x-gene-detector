/** A sequence is an array of [row, col] coordinate pairs. */
export type SequenceCoords = [number, number][]

export interface MutantResponse {
  is_mutant: boolean
  sequences: SequenceCoords[]
}

/** Visual state of the DNA grid */
export type GridState = 'empty' | 'preview' | 'scanning' | 'result'
