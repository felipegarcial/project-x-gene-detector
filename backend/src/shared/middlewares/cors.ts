import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:3001',
]

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
      callback(null, true)
      return
    }
    callback(new Error('Not allowed by CORS'))
  },
})
