import { Button } from '@/shared/components/ui/button'
import { StatCard } from './components'
import { useStats } from './hooks'

export default function StatsPage() {
  const { stats, error, loading, total, retry } = useStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading statistics...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <div role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
        <Button variant="outline" onClick={retry} className="cursor-pointer">
          Retry
        </Button>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          DNA <span className="text-primary">Statistics</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Global DNA verification results from Cerebro's database.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Mutant DNA" value={stats.count_mutant_dna} accent="primary" />
        <StatCard label="Human DNA" value={stats.count_human_dna} accent="secondary" />
        <StatCard label="Ratio" value={stats.ratio} />
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Total analyzed: <span className="font-medium text-foreground">{total}</span>
      </p>
    </div>
  )
}
