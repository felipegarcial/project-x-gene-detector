import { apiFetch } from '@/shared/lib/api'
import type { MutantResponse } from './scanner.types'

/**
 * Analyze a DNA sequence to detect if it belongs to a mutant.
 *
 * The API returns 200 for mutants and 403 for humans — both are valid results,
 * so we pass 403 as an accepted status to avoid throwing.
 */
export async function analyzeDna(
  dna: string[],
  options?: { signal?: AbortSignal },
): Promise<MutantResponse> {
  const { data } = await apiFetch<MutantResponse>('/mutant', {
    method: 'POST',
    body: JSON.stringify({ dna }),
    validStatuses: [403],
    signal: options?.signal,
  })

  return data
}
