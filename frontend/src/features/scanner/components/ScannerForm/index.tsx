import { Button } from '@/shared/components/ui/button'
import { DnaInput } from '../DnaInput'
import { DnaGrid } from '../DnaGrid'
import { ScannerResult } from '../ScannerResult'
import type { MutantResponse, SequenceCoords, GridState } from '../../scanner.types'

interface ScannerFormProps {
  input: string
  onInputChange: (value: string) => void
  loading: boolean
  canSubmit: boolean
  onAnalyze: () => void
  onClear: () => void
  gridDna: string[]
  gridState: GridState
  sequences?: SequenceCoords[]
  liveValidation: string | null
  error: string | null
  result: MutantResponse | null
}

export function ScannerForm({
  input,
  onInputChange,
  loading,
  canSubmit,
  onAnalyze,
  onClear,
  gridDna,
  gridState,
  sequences,
  liveValidation,
  error,
  result,
}: ScannerFormProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onAnalyze()
  }

  return (
    <div className="bg-background rounded-lg p-6 shadow-lg shadow-black/25 border border-border/30">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1 w-full">
            <DnaInput value={input} onChange={onInputChange} disabled={loading} />
          </div>
          <div className="flex items-start justify-center md:min-w-[260px]">
            <DnaGrid
              dna={gridDna}
              state={gridState}
              sequences={sequences}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onClear} className="cursor-pointer">
            Clear
          </Button>
          <Button type="submit" disabled={!canSubmit} className="cursor-pointer">
            {loading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>
      </form>

      {liveValidation && !error && !result && (
        <div className="rounded-md border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary/80 mt-4">
          {liveValidation}
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive mt-4">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4">
          <ScannerResult result={result} />
        </div>
      )}
    </div>
  )
}
