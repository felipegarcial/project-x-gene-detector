import type { MutantResponse } from '../scanner.types'

interface ScannerResultProps {
  result: MutantResponse
}

export function ScannerResult({ result }: ScannerResultProps) {
  const isMutant = result.is_mutant

  return (
    <div
      className={`rounded-lg border px-5 py-4 ${
        isMutant
          ? 'border-teal-500/40 bg-teal-500/10 glow-teal'
          : 'border-amber-500/40 bg-amber-500/10'
      }`}
    >
      <p className={`text-lg font-bold ${isMutant ? 'text-teal-400' : 'text-amber-400'}`}>
        {isMutant ? 'Mutant Detected' : 'Human — Not a Mutant'}
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        {isMutant
          ? 'This DNA contains two or more sequences of 4 identical bases.'
          : 'No mutant gene sequences found in this DNA sample.'}
      </p>
    </div>
  )
}
