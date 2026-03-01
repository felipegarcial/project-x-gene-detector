import { StatCard } from './components'
import { useStats } from './hooks'

export default function StatsPage() {
  const { stats, error, loading, total } = useStats()

  if (loading) {
    return <p className="text-muted-foreground">Loading statistics...</p>
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {error}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Statistics</h1>
        <p className="text-muted-foreground mt-1">
          DNA verification statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Mutant DNA" value={stats.count_mutant_dna} />
        <StatCard label="Human DNA" value={stats.count_human_dna} />
        <StatCard label="Ratio" value={stats.ratio} />
      </div>

      <p className="text-sm text-muted-foreground">
        Total analyzed: {total}
      </p>
    </div>
  )
}
