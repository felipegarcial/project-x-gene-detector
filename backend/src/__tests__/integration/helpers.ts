import { describe } from 'vitest'
import { getDb } from '../../shared/lib/db/index.js'
import { hasTestDb } from './setup.js'

export const describeIntegration = (hasTestDb ? describe : describe.skip) as any as typeof describe

export async function cleanupByHashes(hashes: string[]) {
  if (hashes.length === 0) return

  const { error } = await getDb()
    .from('dna_records')
    .delete()
    .in('dna_hash', hashes)

  if (error) console.warn('Cleanup failed:', error.message)
}
