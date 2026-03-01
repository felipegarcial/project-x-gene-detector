import { useState, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import { ScannerSessionContext } from '../hooks/useScannerSession'

/**
 * Provides scanner session state to child components.
 * Placed at the App level so "started" persists across route changes.
 */
export function ScannerSessionProvider({ children }: { children: ReactNode }) {
  const [started, setStarted] = useState(false)

  const start = useCallback(() => setStarted(true), [])

  const value = useMemo(() => ({ started, start }), [started, start])

  return (
    <ScannerSessionContext.Provider value={value}>
      {children}
    </ScannerSessionContext.Provider>
  )
}
