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
    const res = await request(app)
      .post('/mutant')
      .send({ dna: MUTANT_DNA })

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ is_mutant: true })
  })

  it('should detect human DNA and persist to database', async () => {
    const res = await request(app)
      .post('/mutant')
      .send({ dna: HUMAN_DNA })

    expect(res.status).toBe(403)
    expect(res.body).toEqual({ is_mutant: false })
  })

  it('should return cached result for duplicate mutant DNA', async () => {
    // MUTANT_DNA was already inserted in the first test
    const res = await request(app)
      .post('/mutant')
      .send({ dna: MUTANT_DNA })

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ is_mutant: true })
  })

  it('should return cached result for duplicate human DNA', async () => {
    // HUMAN_DNA was already inserted in the second test
    const res = await request(app)
      .post('/mutant')
      .send({ dna: HUMAN_DNA })

    expect(res.status).toBe(403)
    expect(res.body).toEqual({ is_mutant: false })
  })

  it('should reject invalid DNA without touching database', async () => {
    const res = await request(app)
      .post('/mutant')
      .send({ dna: ['XYZ'] })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })
})
