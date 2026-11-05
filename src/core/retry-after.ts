/** Resolves after `ms` milliseconds. */
export const sleep = (ms: number): Promise<void> =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Small random extra delay (0-249 ms) so concurrent waiters do not wake at the same instant. */
export const jitterMs = (): number => Math.floor(Math.random() * 250);

/**
 * Parses a Retry-After header value (delta-seconds or HTTP-date) into whole seconds, rounded up.
 * Returns null when the value is absent or unreadable. Dates in the past yield 0.
 */
export function parseRetryAfter(value: string | null, nowMs: number): number | null {
  if (value === null || value.trim() === '') return null;
  const sec = Number(value);
  if (Number.isFinite(sec) && sec >= 0) return Math.ceil(sec);
  const at = Date.parse(value);
  return Number.isNaN(at) ? null : Math.max(0, Math.ceil((at - nowMs) / 1000));
}
