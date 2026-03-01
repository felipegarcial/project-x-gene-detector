import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { CONFIG } from '../../../config.js'

let client: SupabaseClient | null = null

export function getDb(): SupabaseClient {
  if (!client) {
    if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY) {
      throw new Error(
        'Supabase credentials not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env',
      )
    }
    client = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY)
  }
  return client
}
