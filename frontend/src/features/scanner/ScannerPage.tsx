import { Button } from '@/shared/components/ui/button'
import { DnaInput, ScannerResult } from './components'
import { useScanner } from './hooks'

export default function ScannerPage() {
  const { input, handleInput, result, error, loading, canSubmit, analyze, clear } = useScanner()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    analyze()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">DNA Scanner</h1>
        <p className="text-muted-foreground mt-1">
          Analyze DNA sequences to detect mutants. Enter one row per line.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <DnaInput value={input} onChange={handleInput} disabled={loading} />

        <div className="flex gap-3">
          <Button type="submit" disabled={!canSubmit}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </Button>
          <Button type="button" variant="outline" onClick={clear}>
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
  )
}
