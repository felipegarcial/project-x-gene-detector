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
