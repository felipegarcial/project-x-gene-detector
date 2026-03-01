import { apiFetch } from '@/shared/lib/api'
import type { MutantResponse } from '../scanner.types'

// 403 is a valid response (human DNA), not an error
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
