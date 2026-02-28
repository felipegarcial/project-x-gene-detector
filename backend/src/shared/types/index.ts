export interface DnaRecord {
  id?: string
  dna_hash: string
  dna_sequence: string[]
  is_mutant: boolean
  created_at?: string
}

export interface StatsResponse {
  count_mutant_dna: number
  count_human_dna: number
  ratio: number
}
