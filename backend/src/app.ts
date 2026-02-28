import express from 'express'
import { corsMiddleware } from './shared/middlewares/cors.js'
import { mutantRouter } from './features/mutant/mutant.route.js'
import { statsRouter } from './features/stats/stats.route.js'
import { CONFIG } from './config.js'

const app = express()

app.use(corsMiddleware)
app.use(express.json())

// Health check
app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Mutant DNA Detector API' })
})

// Feature routes
app.use('/mutant', mutantRouter)
app.use('/stats', statsRouter)

if (!process.env.NODE_ENV) {
  app.listen(CONFIG.PORT, () => {
    console.log(`Server running on http://localhost:${CONFIG.PORT}`)
  })
}

export { app }
