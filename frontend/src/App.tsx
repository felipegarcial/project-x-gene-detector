import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from '@/shared/components/Header'

const ScannerPage = lazy(() => import('@/features/scanner/ScannerPage'))
const StatsPage = lazy(() => import('@/features/stats/StatsPage'))

function App() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
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
