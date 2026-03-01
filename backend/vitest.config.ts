import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/features/**/__tests__/**/*.test.ts'],
    exclude: ['src/__tests__/integration/**'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/__tests__/**',
        'src/shared/lib/db/**',
        'src/shared/types/**',
        'src/**/*.repository.ts',
        'src/server.ts',
      ],
    },
  },
})
