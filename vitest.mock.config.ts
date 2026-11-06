import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/mock/**/*.test.ts', 'test/runtime/**/*.test.ts'],
    environment: 'node',
    globalSetup: ['test/setup/mock-server.ts'],
    testTimeout: 20000,
    // All files share one mock process and each resets it, so files must not overlap.
    fileParallelism: false,
  },
});
