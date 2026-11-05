import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { VERSION } from '../../src/index';

const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));

describe('package', () => {
  it('exports VERSION 2.0.0', () => {
    expect(VERSION).toBe('2.0.0');
  });

  it('package.json declares dual exports with types first', () => {
    expect(pkg.exports['.']).toStrictEqual({
      import: { types: './dist/index.d.mts', default: './dist/index.mjs' },
      require: { types: './dist/index.d.ts', default: './dist/index.js' },
    });
    expect(pkg.exports['./enums']).toStrictEqual({
      import: { types: './dist/enums.d.mts', default: './dist/enums.mjs' },
      require: { types: './dist/enums.d.ts', default: './dist/enums.js' },
    });
    expect(pkg.engines.node).toBe('>=20');
    expect(pkg.dependencies).toBeUndefined();
    expect(pkg.sideEffects).toBe(false);
  });
});
