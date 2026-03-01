import { z } from 'zod'

const DNA_BASES = /^[ATCG]+$/

export const dnaSchema = z.object({
  dna: z
    .array(z.string().regex(DNA_BASES, 'DNA strings can only contain A, T, C, G'))
    .min(4, 'DNA matrix must be at least 4x4')
    .max(1000, 'DNA matrix cannot exceed 1000x1000')
    .refine(
      (dna) => {
        const n = dna.length
        return dna.every((row) => row.length === n)
      },
      { message: 'DNA must be a square NxN matrix' },
    ),
})

export type DnaInput = z.infer<typeof dnaSchema>
