import type { MutantResponse } from '../scanner.types'

interface ScannerResultProps {
  result: MutantResponse
}

export function ScannerResult({ result }: ScannerResultProps) {
  const isMutant = result.is_mutant

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`rounded-lg border px-5 py-4 ${
        isMutant
           ? 'border-primary/40 bg-primary/10 glow-hero'
          : 'border-muted-foreground/30 bg-muted/30'
      }`}
    >
      <p className={`text-lg font-bold ${isMutant ? 'text-primary' : 'text-muted-foreground'}`}>
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
