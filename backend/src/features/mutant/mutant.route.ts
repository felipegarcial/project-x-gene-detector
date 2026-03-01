import { Router } from 'express'
import { mutantController } from './mutant.controller.js'
import { mutantRateLimit } from '../../shared/middlewares/rate-limit.js'

export const mutantRouter = Router()

mutantRouter.post('/', mutantRateLimit, mutantController.check)
