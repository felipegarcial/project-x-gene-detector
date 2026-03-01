import { it, expect, beforeAll, afterAll } from 'vitest'
import crypto from 'crypto'
import request from 'supertest'
import { app } from '../../app.js'
import { describeIntegration, cleanupByHashes } from './helpers.js'

function hashDna(dna: string[]): string {
  return crypto.createHash('sha256').update(dna.join(',')).digest('hex')
}

/**
 * Use unique DNA sequences exclusive to this test file
 * to avoid collisions with other tests or manual runs.
 */
const MUTANT_A = ['AAAATC', 'AAAATC', 'AATTGC', 'GTCATA', 'CCCCGT', 'TTGTCA']
const HUMAN_A = ['TTGCAA', 'GCATGT', 'AGTCCA', 'CATGAT', 'TGCAGT', 'AGTCCA']

const testHashes = [hashDna(MUTANT_A), hashDna(HUMAN_A)]

describeIntegration('GET /stats (integration)', () => {
  beforeAll(async () => {
    await cleanupByHashes(testHashes)
  })

  afterAll(async () => {
    await cleanupByHashes(testHashes)
  })
  it('should return stats structure with valid numbers', async () => {
    const res = await request(app).get('/stats')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('count_mutant_dna')
    expect(res.body).toHaveProperty('count_human_dna')
    expect(res.body).toHaveProperty('ratio')
    expect(typeof res.body.count_mutant_dna).toBe('number')
    expect(typeof res.body.count_human_dna).toBe('number')
    expect(typeof res.body.ratio).toBe('number')
  })

  it('should reflect newly inserted records in stats', async () => {
    // Get baseline stats
    const baseline = await request(app).get('/stats')
    const baseMutants = baseline.body.count_mutant_dna
    const baseHumans = baseline.body.count_human_dna

    // Insert one mutant and one human
    await request(app).post('/mutant').send({ dna: MUTANT_A })
    await request(app).post('/mutant').send({ dna: HUMAN_A })

    // Verify stats updated
    const updated = await request(app).get('/stats')

    expect(updated.body.count_mutant_dna).toBe(baseMutants + 1)
    expect(updated.body.count_human_dna).toBe(baseHumans + 1)
  })
})
