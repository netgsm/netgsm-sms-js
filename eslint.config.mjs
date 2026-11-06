import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

const nodeGlobals = {
  process: 'readonly',
  console: 'readonly',
  require: 'readonly',
  Response: 'readonly',
};

export default tseslint.config(
  { ignores: ['test/fixtures/netgsm-sms-mock.mjs', 'dist/**', 'node_modules/**', 'coverage/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['test/runtime/*.{cjs,mjs}', 'scripts/*.mjs'],
    languageOptions: { globals: nodeGlobals },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
);
