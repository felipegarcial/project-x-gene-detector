import { useEffect, useRef, useState, useMemo } from 'react'

export function useCountUp(target: number, duration = 600) {
  const prefersReduced = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const isDecimal = target % 1 !== 0
  const [display, setDisplay] = useState(prefersReduced ? target : 0)
  const frameRef = useRef(0)

  useEffect(() => {
    if (prefersReduced) {
      return
    }

    const start = performance.now()
    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const value = eased * target
      setDisplay(isDecimal ? parseFloat(value.toFixed(2)) : Math.round(value))
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration, prefersReduced, isDecimal])

  return prefersReduced ? target : display
}
