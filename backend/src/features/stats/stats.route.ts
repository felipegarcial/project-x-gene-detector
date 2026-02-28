import { Router } from 'express'
import { statsController } from './stats.controller.js'

export const statsRouter = Router()

statsRouter.get('/', statsController.getStats)
