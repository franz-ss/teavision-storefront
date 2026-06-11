import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}', 'tests/setup/**/*.test.ts'],
    restoreMocks: true,
    clearMocks: true,
  },
})
