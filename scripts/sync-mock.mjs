#!/usr/bin/env node
// Usage: node scripts/sync-mock.mjs <path-to-netgsm-sms-mock.mjs> [commit]
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const [src, commit = 'unknown'] = process.argv.slice(2);
if (!src) {
  console.error('usage: node scripts/sync-mock.mjs <path-to-mock> [commit]');
  process.exit(1);
}
// The header must be line 1, so a leading shebang (invalid on line 2) is dropped; the fixture is run via node.
const body = readFileSync(resolve(src), 'utf8')
  .replace(/^\/\/ Source: .*\r?\n/, '')
  .replace(/^#!.*\r?\n/, '');
const header =
  `// Source: github.com/netgsm/skills @ ${commit} ` +
  '(plugins/sms-skills/skills/netgsm-sms/scripts/netgsm-sms-mock.mjs), MIT License, Copyright (c) 2026 Netgsm\n';
const dest = resolve(dirname(fileURLToPath(import.meta.url)), '../test/fixtures/netgsm-sms-mock.mjs');
writeFileSync(dest, header + body);
console.log(`wrote ${dest}`);
