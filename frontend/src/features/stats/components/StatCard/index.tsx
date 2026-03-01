interface StatCardProps {
  label: string
  displayValue: number
  accent?: 'primary' | 'secondary' | 'default'
}

const SHADOW_STYLES = {
  primary: 'shadow-primary/15',
  secondary: 'shadow-accent/15',
  default: 'shadow-foreground/10',
}

const VALUE_STYLES = {
  primary: 'text-primary',
  secondary: 'text-accent',
  default: 'text-foreground',
}

export function StatCard({ label, displayValue, accent = 'default' }: StatCardProps) {
  return (
    <div className={`bg-background rounded-lg px-5 py-6 shadow-lg ${SHADOW_STYLES[accent]}`}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`text-4xl font-bold mt-2 tracking-tight tabular-nums ${VALUE_STYLES[accent]}`}>
        {displayValue}
      </p>
    </div>
  )
}
