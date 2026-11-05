import type { BalanceEntry } from './types.js';

/**
 * Converts a `Kredi Bakiye` / `stip=2` value to a number: `"92,150"` -> 92.15, `"0"` -> 0, `277` -> 277.
 * Returns null for anything unreadable; never throws.
 */
export function parseCredit(value: string | number | null | undefined): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;
  const t = value.trim();
  if (!/^-?\d+(?:[.,]\d+)?$/.test(t)) return null;
  const n = Number(t.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

/** Finds an entry by name (case-insensitive, order-independent) and returns its amount as a number, or null. */
export function findBalance(list: BalanceEntry[], name: string): number | null {
  const want = name.trim().toLocaleLowerCase('tr');
  const entry = list.find((e) => String(e.balance_name).trim().toLocaleLowerCase('tr') === want);
  return entry ? parseCredit(entry.amount) : null;
}
