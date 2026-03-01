import { getDb } from '../../shared/lib/db/index.js'
import type { DnaRecord } from '../../shared/types/index.js'

export const mutantRepository = {
  async findByHash(dnaHash: string): Promise<DnaRecord | null> {
    const { data, error } = await getDb()
      .from('dna_records')
      .select('*')
      .eq('dna_hash', dnaHash)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async upsert(record: Omit<DnaRecord, 'id' | 'created_at'>): Promise<DnaRecord> {
    const { data, error } = await getDb()
      .from('dna_records')
      .upsert(record, { onConflict: 'dna_hash' })
      .select()
      .single()

    if (error) throw error
    return data
  },
}
