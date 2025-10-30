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
    ],
  },
});
