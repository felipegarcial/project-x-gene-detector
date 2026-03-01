import { apiFetch } from '@/shared/lib/api'
import type { StatsResponse } from './stats.types'

/**
 * Fetch DNA verification statistics.
 */
export async function fetchStats(options?: { signal?: AbortSignal }): Promise<StatsResponse> {
  const { data } = await apiFetch<StatsResponse>('/stats', {
    signal: options?.signal,
  })
  return data
}
