import { createContext, useContext } from 'react'

interface ScannerSession {
  started: boolean
  start: () => void
}

export const ScannerSessionContext = createContext<ScannerSession | null>(null)

/**
 * Access the scanner session state (whether the user has clicked "Start Scanning").
 * Must be used within a ScannerSessionProvider.
 */
export function useScannerSession(): ScannerSession {
  const ctx = useContext(ScannerSessionContext)
  if (!ctx) throw new Error('useScannerSession must be used within ScannerSessionProvider')
  return ctx
}
