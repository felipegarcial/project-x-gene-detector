import type { Request, Response } from 'express'
import crypto from 'crypto'
import { dnaSchema } from './mutant.schema.js'
import { isMutant } from './mutant.service.js'
import { mutantRepository } from './mutant.repository.js'

export const mutantController = {
  async check(req: Request, res: Response) {
    const result = dnaSchema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json({ error: result.error.flatten() })
      return
    }

    const { dna } = result.data

    const dnaHash = crypto
      .createHash('sha256')
      .update(dna.join(','))
      .digest('hex')

    const { is_mutant, sequences } = isMutant(dna)

    await mutantRepository.upsert({
      dna_hash: dnaHash,
      dna_sequence: dna,
      is_mutant,
    })

    // API contract: 200 = mutant, 403 = human
    res.status(is_mutant ? 200 : 403).json({
      is_mutant,
      sequences,
    })
  },
}
