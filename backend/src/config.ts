import dotenv from 'dotenv'

dotenv.config()

export const CONFIG = {
  PORT: parseInt(process.env.PORT || '3001'),
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
}

export const DEFAULTS = {
  SEQUENCE_LENGTH: 4,
  MIN_SEQUENCES_FOR_MUTANT: 2,
}

export function validateConfig(): void {
  const required: Array<[string, string]> = [
    ['SUPABASE_URL', CONFIG.SUPABASE_URL],
    ['SUPABASE_ANON_KEY', CONFIG.SUPABASE_ANON_KEY],
  ]

  const missing = required.filter(([, value]) => !value).map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. Check your .env file.`
    )
  }
}
