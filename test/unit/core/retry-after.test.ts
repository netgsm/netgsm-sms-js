import { describe, expect, it } from 'vitest';
import { jitterMs, parseRetryAfter, sleep } from '../../../src/core/retry-after';

describe('parseRetryAfter', () => {
  it('parses integer seconds', () => expect(parseRetryAfter('7', 0)).toBe(7));
  it('rounds fractional seconds up', () => expect(parseRetryAfter('1.2', 0)).toBe(2));
  it('parses HTTP dates relative to nowMs', () => {
    expect(parseRetryAfter(new Date(10_000).toUTCString(), 0)).toBe(10);
  });
  it('never returns negative for past dates', () => {
    expect(parseRetryAfter(new Date(0).toUTCString(), 10_000)).toBe(0);
  });
  it('returns null when unreadable', () => {
    expect(parseRetryAfter('soon', 0)).toBeNull();
    expect(parseRetryAfter(null, 0)).toBeNull();
    expect(parseRetryAfter('', 0)).toBeNull();
  });
});

describe('jitterMs / sleep', () => {
  it('jitter is an integer within 0..249', () => {
    for (let i = 0; i < 200; i++) {
      const j = jitterMs();
      expect(Number.isInteger(j)).toBe(true);
      expect(j).toBeGreaterThanOrEqual(0);
      expect(j).toBeLessThanOrEqual(249);
    }
  });
  it('sleep(0) resolves', async () => {
    await expect(sleep(0)).resolves.toBeUndefined();
  });
});
