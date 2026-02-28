import type { Request, Response } from 'express'
import crypto from 'crypto'
import { dnaSchema } from './mutant.schema.js'
import { isMutant } from './mutant.service.js'
import { mutantRepository } from './mutant.repository.js'

export const mutantController = {
  async check(req: Request, res: Response) {
    // Validate input
    const result = dnaSchema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json({ error: result.error.flatten() })
      return
    }

    const { dna } = result.data

    // Hash the DNA to check for duplicates
    const dnaHash = crypto
      .createHash('sha256')
      .update(dna.join(','))
      .digest('hex')

    // Check if already analyzed
    const existing = await mutantRepository.findByHash(dnaHash)
    if (existing) {
      res.status(existing.is_mutant ? 200 : 403).json({
        is_mutant: existing.is_mutant,
      })
      return
    }

    // Run detection
    const result_mutant = isMutant(dna)

    // Store in DB
    await mutantRepository.insert({
      dna_hash: dnaHash,
      dna_sequence: dna,
      is_mutant: result_mutant,
    })

    res.status(result_mutant ? 200 : 403).json({
      is_mutant: result_mutant,
    })
  },
}
