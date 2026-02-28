/**
 * Integration test setup.
 *
 * Skips all integration tests if TEST_SUPABASE_URL is not configured.
 * When present, overrides the default Supabase credentials so integration
 * tests hit an isolated test database instead of production.
 *
 * ## Testing strategy chosen: Skip if no test DB
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
 * - Correct but heavyweight for a technical test project.
 *
 * ### 5. Separate schema/tables for tests
 * - Same DB but tables with a `test_` prefix or a dedicated schema.
 * - Requires modifying queries to be schema-aware, adds unnecessary
 *   complexity without real isolation benefits.
 */

/**
 * Integration test setup.
 *
 * Loads .env.test and checks for test database credentials.
 * If TEST_SUPABASE_URL and TEST_SUPABASE_ANON_KEY are not set,
 * tests will be skipped via `describeIntegration` (see helpers.ts).
 *
 * ## Testing strategy chosen: Skip if no test DB
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
 * - Correct but heavyweight for a technical test project.
 *
 * ### 5. Separate schema/tables for tests
 * - Same DB but tables with a `test_` prefix or a dedicated schema.
 * - Requires modifying queries to be schema-aware, adds unnecessary
 *   complexity without real isolation benefits.
 */

import dotenv from 'dotenv'

// Load .env.test before anything else
dotenv.config({ path: '.env.test' })

const testUrl = process.env.TEST_SUPABASE_URL
const testKey = process.env.TEST_SUPABASE_ANON_KEY

export const hasTestDb = Boolean(testUrl && testKey)

if (hasTestDb) {
  // Override default env vars so getDb() connects to the test database
  process.env.SUPABASE_URL = testUrl!
  process.env.SUPABASE_ANON_KEY = testKey!
}
