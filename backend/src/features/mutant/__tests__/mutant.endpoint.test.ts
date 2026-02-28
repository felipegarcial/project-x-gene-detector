import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../../../app.js'

// Mock the repository so tests don't need Supabase
vi.mock('../../mutant/mutant.repository.js', () => ({
  mutantRepository: {
    findByHash: vi.fn().mockResolvedValue(null),
    insert: vi.fn().mockResolvedValue({}),
  },
}))

describe('POST /mutant', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 200 for a mutant DNA', async () => {
    const response = await request(app)
      .post('/mutant')
      .send({
        dna: ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'],
      })

    expect(response.status).toBe(200)
    expect(response.body.is_mutant).toBe(true)
  })

  it('should return 403 for a human DNA', async () => {
    const response = await request(app)
      .post('/mutant')
      .send({
        dna: ['ATGCGA', 'CAGTGC', 'TTATTT', 'AGACGG', 'GCGTCA', 'TCACTG'],
      })

    expect(response.status).toBe(403)
    expect(response.body.is_mutant).toBe(false)
  })

  it('should return 400 for invalid input', async () => {
    const response = await request(app)
      .post('/mutant')
      .send({
        dna: ['INVALID'],
      })

    expect(response.status).toBe(400)
    expect(response.body.error).toBeDefined()
  })

  it('should return 400 when dna field is missing', async () => {
    const response = await request(app)
      .post('/mutant')
      .send({})

    expect(response.status).toBe(400)
  })
})
