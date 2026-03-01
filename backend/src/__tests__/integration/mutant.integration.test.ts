import { it, expect, beforeAll, afterAll } from 'vitest'
import crypto from 'crypto'
import request from 'supertest'
import { app } from '../../app.js'
import { describeIntegration, cleanupByHashes } from './helpers.js'

/** Compute the same SHA-256 hash the controller uses. */
function hashDna(dna: string[]): string {
  return crypto.createHash('sha256').update(dna.join(',')).digest('hex')
}

const MUTANT_DNA = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG']
const HUMAN_DNA = ['ATGCGA', 'CAGTGC', 'TTATTT', 'AGACGG', 'GCGTCA', 'TCACTG']

const testHashes = [hashDna(MUTANT_DNA), hashDna(HUMAN_DNA)]

describeIntegration('POST /mutant (integration)', () => {
  beforeAll(async () => {
    await cleanupByHashes(testHashes)
  })

  afterAll(async () => {
    await cleanupByHashes(testHashes)
  })
  it('should detect mutant DNA and persist to database', async () => {
    const res = await request(app).post('/mutant').send({ dna: MUTANT_DNA })

    expect(res.status).toBe(200)
    expect(res.body.is_mutant).toBe(true)
    expect(res.body.sequences).toBeDefined()
    expect(res.body.sequences.length).toBeGreaterThanOrEqual(2)
  })

  it('should detect human DNA and persist to database', async () => {
    const res = await request(app).post('/mutant').send({ dna: HUMAN_DNA })

    expect(res.status).toBe(403)
    expect(res.body.is_mutant).toBe(false)
    expect(res.body.sequences).toBeDefined()
  })

  it('should return cached result for duplicate mutant DNA', async () => {
    const res = await request(app).post('/mutant').send({ dna: MUTANT_DNA })

    expect(res.status).toBe(200)
    expect(res.body.is_mutant).toBe(true)
  })

  it('should return cached result for duplicate human DNA', async () => {
    const res = await request(app).post('/mutant').send({ dna: HUMAN_DNA })

    expect(res.status).toBe(403)
    expect(res.body.is_mutant).toBe(false)
  })

  it('should reject invalid DNA without touching database', async () => {
    const res = await request(app)
      .post('/mutant')
      .send({ dna: ['XYZ'] })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })
})
