interface StatCardProps {
  label: string
  value: number
  accent?: 'teal' | 'cyan' | 'default'
}

const ACCENT_STYLES = {
  teal: 'border-teal-500/30 shadow-teal-500/10',
  cyan: 'border-cyan-500/30 shadow-cyan-500/10',
  default: 'border-border',
}

const VALUE_STYLES = {
  teal: 'text-teal-400',
  cyan: 'text-cyan-400',
  default: 'text-foreground',
}

export function StatCard({ label, value, accent = 'default' }: StatCardProps) {
  return (
    <div className={`glass-card rounded-lg px-5 py-6 shadow-lg ${ACCENT_STYLES[accent]}`}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`text-4xl font-bold mt-2 tracking-tight ${VALUE_STYLES[accent]}`}>
        {value}
      </p>
    </div>
  )
}
