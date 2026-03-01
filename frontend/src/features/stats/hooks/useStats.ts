import { useState, useEffect, useCallback } from 'react'
import { fetchStats } from '../stats.service'
import type { StatsResponse } from '../stats.types'

export function useStats() {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback((signal?: AbortSignal) => {
    setLoading(true)
    setError(null)
    fetchStats({ signal })
      .then((data) => {
        if (!signal?.aborted) setStats(data)
      })
      .catch((err) => {
        if (!signal?.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to load stats')
        }
      })
      .finally(() => {
        if (!signal?.aborted) setLoading(false)
      })
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [load])

  const retry = useCallback(() => load(), [load])

  const total = stats ? stats.count_mutant_dna + stats.count_human_dna : 0

  return { stats, error, loading, total, retry }
}
