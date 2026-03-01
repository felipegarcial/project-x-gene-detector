import express, { type Request, type Response, type NextFunction } from 'express'
import helmet from 'helmet'
import { corsMiddleware } from './shared/middlewares/cors.js'
import { requestLogger } from './shared/middlewares/logger.js'
import { mutantRouter } from './features/mutant/mutant.route.js'
import { statsRouter } from './features/stats/stats.route.js'
import { getDb } from './shared/lib/db/index.js'
import { logger } from './shared/lib/logger.js'

const app = express()

app.use(helmet())
app.use(corsMiddleware)
app.use(express.json({ limit: '1mb' }))
app.use(requestLogger)

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Mutant DNA Detector API' })
})

app.get('/health', async (_req, res) => {
  try {
    const { error } = await getDb()
      .from('dna_records')
      .select('id', { count: 'exact', head: true })
      .limit(0)

    if (error) throw error
    res.json({ status: 'ok', db: 'connected' })
  } catch {
    res.status(503).json({ status: 'error', db: 'unreachable' })
  }
})

app.use('/mutant', mutantRouter)
app.use('/stats', statsRouter)

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({ error: 'Origin not allowed' })
    return
  }

  if ('type' in err && (err as { type: string }).type === 'entity.parse.failed') {
    res.status(400).json({ error: 'Invalid JSON' })
    return
  }

  logger.error({ err }, 'Unhandled error')
  res.status(500).json({ error: 'Internal server error' })
})

export { app }
