import { useRef } from 'react'
import { motion } from 'motion/react'
import { Button } from '@/shared/components/ui/button'
import { CerebroHero, DnaInput, DnaGrid, ScannerResult } from './components'
import { useScanner, useScannerSession } from './hooks'

export default function ScannerPage() {
  const { started, start } = useScannerSession()

  // Track whether this mount already had "started" on first render
  // to skip intro animations when returning from another route.
  const wasStartedOnMount = useRef(started)

  const {
    input, handleInput, result, error, loading,
    canSubmit, analyze, clear, dna, previewDna, gridState, liveValidation,
  } = useScanner()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    analyze()
  }

  const gridDna = gridState === 'result' || gridState === 'scanning' ? dna : previewDna

  // Skip transition animations when returning from another route
  const skipTransition = wasStartedOnMount.current
  const transition = skipTransition
    ? { duration: 0 }
    : { duration: 0.8, ease: [0.4, 0, 0.2, 1] as const }

  return (
    <div>
      {/* Cerebro — always present, animates position & size */}
      <motion.div
        animate={{ marginTop: started ? 0 : 200 }}
        transition={transition}
        className={`text-center flex flex-col items-center ${started ? 'space-y-4 mb-10' : 'space-y-4'}`}
      >
        <motion.div
          animate={{ scale: started ? 0.65 : 1 }}
          transition={transition}
        >
          <CerebroHero className="w-80 h-80 sm:w-[28rem] sm:h-[28rem]" />
        </motion.div>

        {/* Title — morphs from "Cerebro" to "DNA Scanner" */}
        <motion.h1
          layout
          className="text-4xl sm:text-5xl font-bold tracking-tight"
        >
          {started ? (
            <>DNA <span className="text-primary glow-text">Scanner</span></>
          ) : (
            <span className="text-primary glow-text">Cerebro</span>
          )}
        </motion.h1>

        {/* Description — morphs content */}
        <motion.p
          layout
          className={`text-muted-foreground max-w-lg mx-auto ${started ? 'text-base' : 'text-lg'}`}
        >
          {started
            ? 'Analyze DNA sequences to detect mutant genes. Powered by Cerebro\'s detection algorithm.'
            : 'Magneto\'s mutant detection system. Analyze DNA sequences to identify mutant genes hidden in the human genome.'
          }
        </motion.p>

        {/* Start button — inside the same container so it animates up together */}
        {!started && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="pt-4"
          >
            <Button
              size="lg"
              onClick={start}
              className="cursor-pointer text-base px-8 py-6 glow-primary"
            >
              Start Scanning
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Scanner — slides in from below */}
      {started && (
        <motion.div
          initial={skipTransition ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={skipTransition ? { duration: 0 } : { duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          className="bg-background rounded-lg p-6 shadow-lg shadow-black/25 border border-border/30"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1 w-full">
                <DnaInput value={input} onChange={handleInput} disabled={loading} />
              </div>
              <div className="flex items-start justify-center md:min-w-[260px]">
                <DnaGrid
                  dna={gridDna}
                  state={gridState}
                  sequences={result?.sequences}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={clear} className="cursor-pointer">
                Clear
              </Button>
              <Button type="submit" disabled={!canSubmit} className="cursor-pointer">
                {loading ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>
          </form>

          {liveValidation && !error && !result && (
            <div className="rounded-md border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary/80 mt-4">
              {liveValidation}
            </div>
          )}

          {error && (
            <div role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive mt-4">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-4">
              <ScannerResult result={result} />
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
