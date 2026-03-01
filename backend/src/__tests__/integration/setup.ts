/**
 * ## Testing strategy: Skip if no test DB
 *
 * We evaluated several approaches for integration testing against a real
 * database. Below is the analysis for future reference:
 *
 * ### 1. Skip if no test DB (chosen)
 * - Integration tests are skipped unless TEST_SUPABASE_URL is set.
 * - Unit tests (92%+ coverage) always run without external dependencies.
 * - Pragmatic for small/medium projects and open-source repos.
 * - Used by: Prisma, Drizzle, many OSS projects.
 *
 * ### 2. Ephemeral containers (Docker / Testcontainers)
 * - Spin up a Postgres container before tests, destroy it after.
 * - Fully isolated, zero risk to any real database.
 * - Industry best practice for companies, but overkill here because
 *   Supabase is more than just Postgres (auth, RLS, storage, etc.)
 *   and reproducing the full Supabase stack locally adds complexity.
 *
 * ### 3. Transaction rollback per test
 * - Each test runs inside a transaction that rolls back at the end.
 * - Guarantees zero data residue in the database.
 * - Not viable here: the Supabase JS client doesn't expose raw
 *   transaction control. Would require switching to a direct pg driver.
 *
 * ### 4. Separate DB per environment
 * - One Supabase project for dev, another for test, another for prod.
 * - Correct but heavyweight for this project scope.
 *
 * ### 5. Separate schema/tables for tests
 * - Same DB but tables with a `test_` prefix or a dedicated schema.
 * - Requires modifying queries to be schema-aware, adds unnecessary
 *   complexity without real isolation benefits.
 */

import dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

const testUrl = process.env.TEST_SUPABASE_URL
const testKey = process.env.TEST_SUPABASE_ANON_KEY

export const hasTestDb = Boolean(testUrl && testKey)

if (hasTestDb) {
  process.env.SUPABASE_URL = testUrl!
  process.env.SUPABASE_ANON_KEY = testKey!
}
