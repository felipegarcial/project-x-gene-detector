import { getDb } from '../../shared/lib/db/index.js'

export const statsRepository = {
  async countMutants(): Promise<number> {
    const { count, error } = await getDb()
      .from('dna_records')
      .select('*', { count: 'exact', head: true })
      .eq('is_mutant', true)

    if (error) throw error
    return count ?? 0
  },

  async countHumans(): Promise<number> {
    const { count, error } = await getDb()
      .from('dna_records')
      .select('*', { count: 'exact', head: true })
      .eq('is_mutant', false)

    if (error) throw error
    return count ?? 0
  },
}
