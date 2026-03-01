interface DnaInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const PLACEHOLDER = `ATGCGA
CAGTGC
TTATGT
AGAAGG
CCCCTA
TCACTG`

const EXAMPLE_MUTANT = `ATGCGA
CAGTGC
TTATGT
AGAAGG
CCCCTA
TCACTG`

const EXAMPLE_HUMAN = `ATGCGA
CAGTGC
TTATTT
AGACGG
GCGTCA
TCACTG`

export function DnaInput({ value, onChange, disabled }: DnaInputProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="dna-input" className="text-sm font-medium">
          DNA Sequence
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange(EXAMPLE_MUTANT)}
            disabled={disabled}
            className="text-xs text-primary/70 hover:text-primary transition-colors disabled:opacity-50 cursor-pointer"
          >
            Try Mutant
          </button>
          <span className="text-xs text-muted-foreground/40">|</span>
          <button
            type="button"
            onClick={() => onChange(EXAMPLE_HUMAN)}
            disabled={disabled}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
          >
            Try Human
          </button>
        </div>
      </div>
      <textarea
        id="dna-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={PLACEHOLDER}
        rows={8}
        disabled={disabled}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono uppercase placeholder:normal-case placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 transition-colors"
        spellCheck={false}
      />
      <p className="text-xs text-muted-foreground mt-1.5">
        Enter one row per line using only A, T, C, G bases. The matrix must be square (NxN), min 4x4, max 20x20. You can also paste a JSON array or comma separated values.
      </p>
    </div>
  )
}
