import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from '@/shared/components/Header'

const ScannerPage = lazy(() => import('@/features/scanner/ScannerPage'))
const StatsPage = lazy(() => import('@/features/stats/StatsPage'))

function App() {
  return (
    <div className="dark min-h-screen bg-background text-foreground bg-grid">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Suspense fallback={<div className="text-muted-foreground text-center py-20">Loading...</div>}>
          <Routes>
            <Route path="/" element={<ScannerPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default App
