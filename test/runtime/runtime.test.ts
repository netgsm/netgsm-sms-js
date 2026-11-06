import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

function run(script: string) {
  const file = fileURLToPath(new URL(script, import.meta.url));
  return spawnSync(process.execPath, [file], {
    env: { ...process.env, NETGSM_MOCK_URL: process.env.NETGSM_MOCK_URL },
    encoding: 'utf8',
    cwd: fileURLToPath(new URL('../..', import.meta.url)),
  });
}

describe('works_without_buffer', () => {
  it('dist bundles never reference Buffer', () => {
    for (const f of ['index.js', 'index.mjs']) {
      const src = readFileSync(fileURLToPath(new URL(`../../dist/${f}`, import.meta.url)), 'utf8');
      expect(src).not.toMatch(/\bBuffer\b/);
    }
  });

  it('CJS build loads and sends without Buffer', () => {
    const r = run('./cjs-check.cjs');
    expect(r.stderr).toBe('');
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('CJS_OK');
  });

  it('ESM build loads and sends without Buffer', () => {
    const r = run('./esm-check.mjs');
    expect(r.stderr).toBe('');
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('ESM_OK');
  });

  it('1.x-style CJS program (default import, enums subpath) works unchanged', () => {
    const r = run('./legacy-cjs-check.cjs');
    expect(r.stderr).toBe('');
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('LEGACY_CJS_OK');
  });

  it('1.x-style ESM program (default and named imports, enums subpath) works unchanged', () => {
    const r = run('./legacy-esm-check.mjs');
    expect(r.stderr).toBe('');
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('LEGACY_ESM_OK');
  });
});
