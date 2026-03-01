import type { MutantResponse } from '../scanner.types'

interface ScannerResultProps {
  result: MutantResponse
}

export function ScannerResult({ result }: ScannerResultProps) {
  const isMutant = result.is_mutant

  return (
    <div
      className={`rounded-md border px-4 py-3 text-sm ${
        isMutant
          ? 'border-green-500/50 bg-green-500/10 text-green-400'
          : 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400'
      }`}
    >
      <span className="font-semibold">
        {isMutant ? 'Mutant detected' : 'Human (not a mutant)'}
      </span>
    </div>
  )
}
