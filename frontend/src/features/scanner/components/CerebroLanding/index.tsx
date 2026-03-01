import { motion, type Transition } from 'motion/react'
import { Button } from '@/shared/components/ui/button'
import { CerebroHero } from '../CerebroHero'

interface CerebroLandingProps {
  started: boolean
  onStart: () => void
  transition: Transition
}

export function CerebroLanding({ started, onStart, transition }: CerebroLandingProps) {
  return (
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

      <motion.p
        layout
        className={`text-muted-foreground max-w-lg mx-auto ${started ? 'text-base' : 'text-lg'}`}
      >
        {started
          ? 'Analyze DNA sequences to detect mutant genes. Powered by Cerebro\'s detection algorithm.'
          : 'Magneto\'s mutant detection system. Analyze DNA sequences to identify mutant genes hidden in the human genome.'
        }
      </motion.p>

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
            onClick={onStart}
            className="cursor-pointer text-base px-8 py-6 glow-primary"
          >
            Start Scanning
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
