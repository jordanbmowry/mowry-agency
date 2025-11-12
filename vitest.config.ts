import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/node_modules.backup/**',
      '**/dist/**',
      '**/.nuxt/**',
      '**/coverage/**',
      '**/tests/e2e/**', // Exclude Playwright e2e tests
      '**/playwright-report/**',
      '**/test-results/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.nuxt/**',
        '**/coverage/**',
        '**/tests/e2e/**',
        '**/playwright-report/**',
        '**/test-results/**',
        '**/*.config.{js,ts}',
        '**/test/**',
      ],
    },
  },
});
