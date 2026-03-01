import { statsRepository } from './stats.repository.js'
import type { StatsResponse } from '../../shared/types/index.js'

export async function getStats(): Promise<StatsResponse> {
  const [countMutant, countHuman] = await Promise.all([
    statsRepository.countMutants(),
    statsRepository.countHumans(),
  ])

  const ratio = countHuman === 0 ? 0 : countMutant / countHuman

  return {
    count_mutant_dna: countMutant,
    count_human_dna: countHuman,
    ratio: parseFloat(ratio.toFixed(2)),
  }
}
