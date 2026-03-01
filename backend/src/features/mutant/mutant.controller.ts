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

    // Run detection (always run to get sequences, even for cached DNAs)
    const { is_mutant, sequences } = isMutant(dna)

    // Check if already analyzed — only insert if new
    const existing = await mutantRepository.findByHash(dnaHash)
    if (!existing) {
      await mutantRepository.insert({
        dna_hash: dnaHash,
        dna_sequence: dna,
        is_mutant,
      })
    }

    res.status(is_mutant ? 200 : 403).json({
      is_mutant,
      sequences,
    })
  },
}
