import type { Request, Response } from 'express'
import { getStats } from './stats.service.js'

export const statsController = {
  async getStats(_req: Request, res: Response) {
    const stats = await getStats()
    res.json(stats)
  },
}
