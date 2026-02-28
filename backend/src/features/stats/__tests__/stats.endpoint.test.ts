import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import { app } from '../../../app.js'

// Mock the stats repository
vi.mock('../../stats/stats.repository.js', () => ({
  statsRepository: {
    countMutants: vi.fn(),
    countHumans: vi.fn(),
  },
}))

// Also mock mutant repository since app imports both routes
vi.mock('../../mutant/mutant.repository.js', () => ({
  mutantRepository: {
    findByHash: vi.fn().mockResolvedValue(null),
    insert: vi.fn().mockResolvedValue({}),
  },
}))

import { statsRepository } from '../stats.repository.js'

describe('GET /stats', () => {
  it('should return correct stats with mutants and humans', async () => {
    vi.mocked(statsRepository.countMutants).mockResolvedValue(40)
    vi.mocked(statsRepository.countHumans).mockResolvedValue(100)

    const response = await request(app).get('/stats')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      count_mutant_dna: 40,
      count_human_dna: 100,
      ratio: 0.4,
    })
  })

  it('should return ratio 0 when there are no humans (division by zero)', async () => {
    vi.mocked(statsRepository.countMutants).mockResolvedValue(5)
    vi.mocked(statsRepository.countHumans).mockResolvedValue(0)

    const response = await request(app).get('/stats')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      count_mutant_dna: 5,
      count_human_dna: 0,
      ratio: 0,
    })
  })

  it('should return all zeros when database is empty', async () => {
    vi.mocked(statsRepository.countMutants).mockResolvedValue(0)
    vi.mocked(statsRepository.countHumans).mockResolvedValue(0)

    const response = await request(app).get('/stats')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      count_mutant_dna: 0,
      count_human_dna: 0,
      ratio: 0,
    })
  })

  it('should return correct ratio when mutants > humans', async () => {
    vi.mocked(statsRepository.countMutants).mockResolvedValue(2)
    vi.mocked(statsRepository.countHumans).mockResolvedValue(1)

    const response = await request(app).get('/stats')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      count_mutant_dna: 2,
      count_human_dna: 1,
      ratio: 2,
    })
  })
})
