import { Router } from 'express'
import { mutantController } from './mutant.controller.js'

export const mutantRouter = Router()

mutantRouter.post('/', mutantController.check)
