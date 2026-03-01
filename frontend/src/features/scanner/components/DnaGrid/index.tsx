import { motion, AnimatePresence } from 'motion/react'
import type { SequenceCoords, GridState } from '../../scanner.types'
import { useDnaGridHighlight } from './hooks/useDnaGridHighlight'

interface DnaGridProps {
  dna: string[]
  state: GridState
  sequences?: SequenceCoords[]
}

const DUMMY_SIZE = 6

export function DnaGrid({ dna, state, sequences = [] }: DnaGridProps) {
  const n = state === 'empty' ? DUMMY_SIZE : dna.length || DUMMY_SIZE
  const isEmpty = state === 'empty' || dna.length === 0

  const highlightedCells = useDnaGridHighlight(state, sequences)

  const rows: (string | null)[][] = isEmpty
    ? Array.from({ length: DUMMY_SIZE }, () => Array(DUMMY_SIZE).fill(null))
    : dna.map((row) => row.split(''))

  return (
    <div className="flex flex-col items-center gap-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={`grid-${n}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-1"
        >
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-1">
              {row.map((base, colIdx) => {
                const cellKey = `${rowIdx},${colIdx}`
                const isHighlighted = highlightedCells.has(cellKey)

                return (
                  <Cell
                    key={`${rowIdx}-${colIdx}`}
                    base={base}
                    state={state}
                    isHighlighted={isHighlighted}
                    index={rowIdx * n + colIdx}
                  />
                )
              })}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

interface CellProps {
  base: string | null
  state: GridState
  isHighlighted: boolean
  index: number
}

function Cell({ base, state, isHighlighted, index }: CellProps) {
  const delay = index * 0.015

  if (state === 'empty' || base === null) {
    return <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-sm border border-border/15 bg-card/10" />
  }

  if (state === 'scanning') {
    return (
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{
          delay: delay,
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-sm border border-primary/30 bg-primary/5 font-mono text-xs sm:text-sm font-bold text-primary/50"
      >
        {base}
      </motion.div>
    )
  }

  if (state === 'result') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay,
          duration: 0.25,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className={`
          w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center
          rounded-sm border font-mono text-xs sm:text-sm font-bold
          ${
            isHighlighted
              ? 'border-primary/60 bg-primary/20 text-primary shadow-md shadow-primary/20'
              : 'border-border/20 bg-card/20 text-muted-foreground/40'
          }
        `}
      >
        {base}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.5, duration: 0.15 }}
      className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-sm border border-border/25 bg-card/20 font-mono text-xs sm:text-sm font-bold text-muted-foreground/60"
    >
      {base}
    </motion.div>
  )
}
