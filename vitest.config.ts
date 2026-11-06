import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/unit/**/*.test.ts'],
    environment: 'node',
    setupFiles: ['test/setup/quiet-deprecations.ts'],
  },
});
