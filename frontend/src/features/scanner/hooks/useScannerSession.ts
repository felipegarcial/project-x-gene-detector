import { createContext, useContext } from 'react'

interface ScannerSession {
  started: boolean
  start: () => void
}

export const ScannerSessionContext = createContext<ScannerSession | null>(null)

export function useScannerSession(): ScannerSession {
  const ctx = useContext(ScannerSessionContext)
  if (!ctx) throw new Error('useScannerSession must be used within ScannerSessionProvider')
  return ctx
}
