import type { Request, Response, NextFunction } from 'express'
import { logger } from '../lib/logger.js'

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    const status = res.statusCode

    const data = {
      method: req.method,
      url: req.originalUrl,
      status,
      duration: `${duration}ms`,
    }

    if (status >= 500) {
      logger.error(data, 'request failed')
    } else if (status >= 400) {
      logger.warn(data, 'request error')
    } else {
      logger.info(data, 'request completed')
    }
  })

  next()
}
