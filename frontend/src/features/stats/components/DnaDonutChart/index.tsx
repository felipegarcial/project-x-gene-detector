import { motion } from 'motion/react'

interface DnaDonutChartProps {
  mutant: number
  human: number
}

const SIZE = 200
const PAD = 20
const VIEWBOX = SIZE + PAD * 2
const CENTER = VIEWBOX / 2
const STROKE = 24
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function DnaDonutChart({ mutant, human }: DnaDonutChartProps) {
  const total = mutant + human
  const mutantPct = total > 0 ? mutant / total : 0

  const mutantDash = mutantPct * CIRCUMFERENCE
  const humanDash = (1 - mutantPct) * CIRCUMFERENCE

  const gap = total > 0 && mutant > 0 && human > 0 ? 8 : 0
  const mutantArc = Math.max(mutantDash - gap, 0)
  const humanArc = Math.max(humanDash - gap, 0)

  const humanOffset = mutantDash + gap / 2

  if (total === 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}>
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            className="text-border/20"
          />
          <text
            x={CENTER}
            y={CENTER}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-muted-foreground text-sm"
          >
            No data
          </text>
        </svg>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        width={VIEWBOX}
        height={VIEWBOX}
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        className="overflow-visible"
      >
        <defs>
          <filter id="glow-donut" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          className="text-border/10"
        />

        <motion.circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="rgba(255, 255, 255, 0.85)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${humanArc} ${CIRCUMFERENCE - humanArc}`}
          strokeDashoffset={humanOffset}
          initial={{ strokeDasharray: `0 ${CIRCUMFERENCE}` }}
          animate={{
            strokeDasharray: `${humanArc} ${CIRCUMFERENCE - humanArc}`,
          }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          transform={`rotate(90 ${CENTER} ${CENTER})`}
          filter="url(#glow-donut)"
        />

        <motion.circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="var(--color-hero)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${mutantArc} ${CIRCUMFERENCE - mutantArc}`}
          initial={{ strokeDasharray: `0 ${CIRCUMFERENCE}` }}
          animate={{
            strokeDasharray: `${mutantArc} ${CIRCUMFERENCE - mutantArc}`,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          transform={`rotate(90 ${CENTER} ${CENTER})`}
          filter="url(#glow-donut)"
        />

        <text
          x={CENTER}
          y={CENTER - 16}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-foreground font-bold"
          style={{ fontSize: '1.75rem' }}
        >
          {Math.round(mutantPct * 100)}%
        </text>
        <text
          x={CENTER}
          y={CENTER + 10}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-muted-foreground font-semibold"
          style={{ fontSize: '0.85rem' }}
        >
          mutant
        </text>
      </svg>

      <div className="flex gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-hero)' }} />
          <span className="text-primary">Mutant DNA ({mutant})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white/85" />
          <span className="text-primary">Human DNA ({human})</span>
        </div>
      </div>
    </div>
  )
}
