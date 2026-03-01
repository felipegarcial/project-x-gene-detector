import type { Request, Response } from 'express'
import { getStats } from './stats.service.js'
import { logger } from '../../shared/lib/logger.js'

export const statsController = {
  async getStats(_req: Request, res: Response) {
    try {
      const stats = await getStats()
      res.json(stats)
    } catch (err) {
      logger.error({ err }, 'Failed to retrieve stats')
      res.status(503).json({ error: 'Unable to retrieve stats at this time' })
    }
  },
}
