import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/__tests__/integration/**/*.test.ts'],
    setupFiles: ['src/__tests__/integration/setup.ts'],
    testTimeout: 15_000,
    fileParallelism: false,
    sequence: {
      concurrent: false,
    },
    env: {
      // Load .env.test if it exists (for TEST_SUPABASE_URL, TEST_SUPABASE_ANON_KEY)
      NODE_ENV: 'test',
    },
  },
})
