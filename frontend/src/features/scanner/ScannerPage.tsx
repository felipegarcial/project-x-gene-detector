import { useState } from 'react'
import { motion } from 'motion/react'
import { XGeneLanding, ScannerForm } from './components'
import { useScannerSession, useScanner } from './hooks'

export default function ScannerPage() {
  const { started, start } = useScannerSession()
  const {
    input,
    handleInput,
    result,
    error,
    loading,
    canSubmit,
    analyze,
    clear,
    dna,
    previewDna,
    gridState,
    liveValidation,
  } = useScanner()

  const [wasStartedOnMount] = useState(started)
  const skipTransition = wasStartedOnMount
  const transition = skipTransition
    ? { duration: 0 }
    : { duration: 0.8, ease: [0.4, 0, 0.2, 1] as const }

  const gridDna = gridState === 'result' || gridState === 'scanning' ? dna : previewDna

  return (
    <div>
      <XGeneLanding started={started} onStart={start} transition={transition} />

      {started && (
        <motion.div
          initial={skipTransition ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            skipTransition ? { duration: 0 } : { duration: 0.6, delay: 0.4, ease: 'easeOut' }
          }
        >
          <ScannerForm
            input={input}
            onInputChange={handleInput}
            loading={loading}
            canSubmit={canSubmit}
            onAnalyze={analyze}
            onClear={clear}
            gridDna={gridDna}
            gridState={gridState}
            sequences={result?.sequences}
            liveValidation={liveValidation}
            error={error}
            result={result}
          />
        </motion.div>
      )}
    </div>
  )
}
