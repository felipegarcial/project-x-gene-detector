import { motion } from 'motion/react'

interface DnaGridProps {
  dna: string[]
  isMutant: boolean
}

const BASE_COLORS: Record<string, string> = {
  A: 'text-teal-400 border-teal-500/40',
  T: 'text-cyan-400 border-cyan-500/40',
  C: 'text-violet-400 border-violet-500/40',
  G: 'text-amber-400 border-amber-500/40',
}

const BASE_GLOW: Record<string, string> = {
  A: 'shadow-teal-500/30',
  T: 'shadow-cyan-500/30',
  C: 'shadow-violet-500/30',
  G: 'shadow-amber-500/30',
}

/**
 * Visual DNA matrix grid with animated base cells.
 * Each cell shows the base letter with a color-coded accent.
 * On mutant detection, cells animate in with a stagger effect.
 */
export function DnaGrid({ dna, isMutant }: DnaGridProps) {
  const n = dna.length

  return (
    <div className="flex flex-col items-center gap-1">
      {dna.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1">
          {row.split('').map((base, colIdx) => {
            const delay = (rowIdx * n + colIdx) * 0.02
            const color = BASE_COLORS[base] ?? 'text-muted-foreground border-border'
            const glow = isMutant ? (BASE_GLOW[base] ?? '') : ''

            return (
              <motion.div
                key={`${rowIdx}-${colIdx}`}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay,
                  duration: 0.25,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className={`
                  w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center
                  rounded-sm border font-mono text-xs sm:text-sm font-bold
                  bg-card/50 backdrop-blur-sm
                  ${color}
                  ${isMutant ? `shadow-md ${glow}` : ''}
                `}
              >
                {base}
              </motion.div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
