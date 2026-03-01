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

export function DnaInput({ value, onChange, disabled }: DnaInputProps) {
  return (
    <div>
      <label htmlFor="dna-input" className="text-sm font-medium block mb-2">
        DNA Sequence
      </label>
      <textarea
        id="dna-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={PLACEHOLDER}
        rows={8}
        disabled={disabled}
        className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm font-mono uppercase placeholder:normal-case placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 transition-colors"
        spellCheck={false}
      />
      <p className="text-xs text-muted-foreground mt-1">
        Paste in any format — continuous string, comma-separated, or JSON array. It auto-formats.
      </p>
    </div>
  )
}
