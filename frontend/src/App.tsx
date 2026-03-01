import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Header, ErrorBoundary, NotFound } from '@/shared/components'
import { ScannerSessionProvider } from '@/features/scanner/components'

const ScannerPage = lazy(() => import('@/features/scanner/ScannerPage'))
const StatsPage = lazy(() => import('@/features/stats/StatsPage'))

function App() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <ScannerSessionProvider>
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-10">
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span>Loading...</span>
                  </div>
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<ScannerPage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
      </ScannerSessionProvider>
    </div>
  )
}

export default App
