import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/enums.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  target: 'es2022',
  clean: true,
  outExtension: ({ format }) => ({ js: format === 'esm' ? '.mjs' : '.js' }),
});
