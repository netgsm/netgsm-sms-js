import { describe, expect, it } from 'vitest';
import { findBalance, parseCredit } from '../../../src/sms/balance.js';

describe('parseCredit', () => {
  it('parses Turkish decimal comma', () => expect(parseCredit('92,150')).toBe(92.15));
  it('parses zero', () => expect(parseCredit('0')).toBe(0));
  it('passes finite numbers through', () => expect(parseCredit(277)).toBe(277));
  it('rejects thousands separators', () => expect(parseCredit('1.234,5')).toBeNull());
  it('returns null for undefined/null/NaN', () => {
    expect(parseCredit(undefined)).toBeNull();
    expect(parseCredit(null)).toBeNull();
    expect(parseCredit(Number.NaN)).toBeNull();
  });
});

describe('findBalance', () => {
  it('matches case-insensitively and converts amount', () => {
    expect(findBalance([{ amount: '300', balance_name: 'Adet OTP Sms' }], 'adet otp sms')).toBe(300);
  });
  it('returns null when missing', () => {
    expect(findBalance([], 'Adet SMS')).toBeNull();
  });
});
