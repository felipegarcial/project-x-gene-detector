import { Button } from '@/shared/components/ui/button'
import { CerebroHero, DnaInput, DnaGrid, ScannerResult } from './components'
import { useScanner } from './hooks'

export default function ScannerPage() {
  const { input, handleInput, result, error, loading, canSubmit, analyze, clear, dna } = useScanner()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    analyze()
  }

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="text-center space-y-4">
        <CerebroHero />
        <h1 className="text-4xl font-bold tracking-tight">
          DNA <span className="text-primary">Scanner</span>
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Analyze DNA sequences to detect mutant genes. Powered by Cerebro's detection algorithm.
        </p>
      </div>

      {/* Scanner form */}
      <div className="glass-card rounded-lg p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DnaInput value={input} onChange={handleInput} disabled={loading} />

          <div className="flex gap-3">
            <Button type="submit" disabled={!canSubmit} className="cursor-pointer">
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
            <Button type="button" variant="outline" onClick={clear} className="cursor-pointer">
              Clear
            </Button>
          </div>
        </form>

        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {result && <ScannerResult result={result} />}
      </div>

      {/* DNA grid visualization */}
      {result && dna.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground text-center">
            DNA Matrix Visualization
          </h2>
          <DnaGrid dna={dna} isMutant={result.is_mutant} />
        </div>
      )}
    </div>
  )
}
