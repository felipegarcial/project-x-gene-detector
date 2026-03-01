import { describe } from 'vitest'
import { getDb } from '../../shared/lib/db/index.js'
import { hasTestDb } from './setup.js'

/**
 * Wrapper around `describe` that skips the entire suite when
 * test database credentials are not configured.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const describeIntegration = (hasTestDb ? describe : describe.skip) as any as typeof describe

/**
 * Delete test DNA records by their hashes.
 * Used to clean up after integration tests.
 */
export async function cleanupByHashes(hashes: string[]) {
  if (hashes.length === 0) return

  const { error } = await getDb()
    .from('dna_records')
    .delete()
    .in('dna_hash', hashes)

  if (error) console.warn('Cleanup failed:', error.message)
}
