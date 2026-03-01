import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../../../app.js'

// Mock the repository so tests don't need Supabase
vi.mock('../../mutant/mutant.repository.js', () => ({
  mutantRepository: {
    findByHash: vi.fn().mockResolvedValue(null),
    upsert: vi.fn().mockResolvedValue({}),
  },
}))

import { mutantRepository } from '../mutant.repository.js'

describe('POST /mutant', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(mutantRepository.findByHash).mockResolvedValue(null)
    vi.mocked(mutantRepository.upsert).mockResolvedValue({} as never)
  })

  it('should return 200 for a mutant DNA with sequences', async () => {
    const response = await request(app)
      .post('/mutant')
      .send({
        dna: ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'],
      })

    expect(response.status).toBe(200)
    expect(response.body.is_mutant).toBe(true)
    expect(response.body.sequences).toBeDefined()
    expect(response.body.sequences.length).toBeGreaterThanOrEqual(2)
  })

  it('should return 403 for a human DNA with sequences', async () => {
    const response = await request(app)
      .post('/mutant')
      .send({
        dna: ['ATGCGA', 'CAGTGC', 'TTATTT', 'AGACGG', 'GCGTCA', 'TCACTG'],
      })

    expect(response.status).toBe(403)
    expect(response.body.is_mutant).toBe(false)
    expect(response.body.sequences).toBeDefined()
  })

  it('should return cached result with sequences for previously analyzed DNA', async () => {
    vi.mocked(mutantRepository.findByHash).mockResolvedValue({
      dna_hash: 'abc',
      dna_sequence: ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'],
      is_mutant: true,
    })

    const response = await request(app)
      .post('/mutant')
      .send({
        dna: ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'],
      })

    expect(response.status).toBe(200)
    expect(response.body.is_mutant).toBe(true)
    expect(response.body.sequences).toBeDefined()
    expect(response.body.sequences.length).toBeGreaterThanOrEqual(2)
    expect(mutantRepository.upsert).not.toHaveBeenCalled()
  })

  it('should still return result when database persistence fails', async () => {
    vi.mocked(mutantRepository.upsert).mockRejectedValue(new Error('DB down'))

    const response = await request(app)
      .post('/mutant')
      .send({
        dna: ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'],
      })

    expect(response.status).toBe(200)
    expect(response.body.is_mutant).toBe(true)
    expect(response.body.sequences).toBeDefined()
  })

  it('should compute result when cache lookup fails', async () => {
    vi.mocked(mutantRepository.findByHash).mockRejectedValue(new Error('DB unreachable'))

    const response = await request(app)
      .post('/mutant')
      .send({
        dna: ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'],
      })

    expect(response.status).toBe(200)
    expect(response.body.is_mutant).toBe(true)
    expect(response.body.sequences).toBeDefined()
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
    const response = await request(app).post('/mutant').send({})

    expect(response.status).toBe(400)
  })
})
