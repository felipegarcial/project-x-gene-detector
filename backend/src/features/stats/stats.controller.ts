import type { Request, Response } from 'express'
import { statsRepository } from './stats.repository.js'
import type { StatsResponse } from '../../shared/types/index.js'

export const statsController = {
  async getStats(_req: Request, res: Response) {
    const [countMutant, countHuman] = await Promise.all([
      statsRepository.countMutants(),
      statsRepository.countHumans(),
    ])

    const ratio = countHuman === 0 ? 0 : countMutant / countHuman

    const response: StatsResponse = {
      count_mutant_dna: countMutant,
      count_human_dna: countHuman,
      ratio: parseFloat(ratio.toFixed(2)),
    }

    res.json(response)
  },
}
