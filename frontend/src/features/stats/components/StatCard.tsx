import { useCountUp } from '../hooks'

interface StatCardProps {
  label: string
  value: number
  accent?: 'primary' | 'secondary' | 'default'
}

const ACCENT_STYLES = {
  primary: 'border-primary/30 shadow-primary/10',
  secondary: 'border-accent/30 shadow-accent/10',
  default: 'border-border',
}

const VALUE_STYLES = {
  primary: 'text-primary',
  secondary: 'text-accent',
  default: 'text-foreground',
}

export function StatCard({ label, value, accent = 'default' }: StatCardProps) {
  const display = useCountUp(value)

  return (
    <div className={`glass-card rounded-lg px-5 py-6 shadow-lg ${ACCENT_STYLES[accent]}`}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`text-4xl font-bold mt-2 tracking-tight tabular-nums ${VALUE_STYLES[accent]}`}>
        {display}
      </p>
    </div>
  )
}
