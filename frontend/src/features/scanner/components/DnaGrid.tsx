import { useMemo } from 'react'
import { motion } from 'motion/react'
import type { SequenceCoords } from '../scanner.types'

interface DnaGridProps {
  dna: string[]
  sequences: SequenceCoords[]
}

/**
 * Visual DNA matrix grid with animated base cells.
 * Only cells belonging to detected sequences are highlighted.
 * Non-sequence cells render in a muted, neutral style.
 */
export function DnaGrid({ dna, sequences }: DnaGridProps) {
  const n = dna.length

  // Build a Set of "row,col" keys for O(1) lookup
  const highlightedCells = useMemo(() => {
    const set = new Set<string>()
    for (const seq of sequences) {
      for (const [r, c] of seq) {
        set.add(`${r},${c}`)
      }
    }
    return set
  }, [sequences])

  return (
    <div className="flex flex-col items-center gap-1">
      {dna.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1">
          {row.split('').map((base, colIdx) => {
            const delay = (rowIdx * n + colIdx) * 0.02
            const isHighlighted = highlightedCells.has(`${rowIdx},${colIdx}`)

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
                  ${isHighlighted
                    ? 'border-primary/60 bg-primary/20 text-primary shadow-md shadow-primary/20'
                    : 'border-border/30 bg-card/30 text-muted-foreground/50'
                  }
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
