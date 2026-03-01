import { useState, useEffect, useCallback } from 'react'
import { fetchStats } from '../services'
import type { StatsResponse } from '../stats.types'

export function useStats() {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    fetchStats({ signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setStats(data)
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to load stats')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [retryCount])

  const retry = useCallback(() => {
    setLoading(true)
    setError(null)
    setRetryCount((c) => c + 1)
  }, [])

  const total = stats ? stats.count_mutant_dna + stats.count_human_dna : 0

  return { stats, error, loading, total, retry }
}
