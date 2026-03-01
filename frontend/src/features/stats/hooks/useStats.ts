import { useState, useEffect } from 'react'
import { fetchStats } from '../stats.service'
import type { StatsResponse } from '../stats.types'

export function useStats() {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load stats'))
      .finally(() => setLoading(false))
  }, [])

  const total = stats ? stats.count_mutant_dna + stats.count_human_dna : 0

  return { stats, error, loading, total }
}
