export type SequenceCoords = [number, number][]

export interface MutantResponse {
  is_mutant: boolean
  sequences: SequenceCoords[]
}

export type GridState = 'empty' | 'preview' | 'scanning' | 'result'
