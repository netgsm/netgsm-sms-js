import { describe, expect, it } from 'vitest';
import { webhookOperator, webhookToReport } from '../../../src/sms/webhooks.js';

describe('webhookToReport', () => {
  it('maps delivered', () => {
    expect(webhookToReport({ status: 1, operator: 30, errorCode: null })).toEqual({
      status: 'DELIVERED', failReason: null, operator: 'TURKCELL',
    });
  });
  it('maps errorCode when status is 2', () => {
    expect(webhookToReport({ status: 2, operator: 10, errorCode: 116 }).failReason).toBe('UNKNOWN_SUBSCRIBER');
  });
  it('maps status-specific reasons', () => {
    const r = webhookToReport({ status: 15, operator: 0, errorCode: 0 });
    expect(r).toEqual({ status: 'NOT_DELIVERED', failReason: 'BLACKLISTED', operator: 'UNKNOWN' });
  });
  it('falls back to UNKNOWN', () => {
    expect(webhookToReport({ status: 99, operator: 0, errorCode: null }).failReason).toBe('UNKNOWN');
    expect(webhookToReport({ status: 2, operator: 0, errorCode: 0 }).failReason).toBe('UNKNOWN');
  });
});

describe('webhookOperator', () => {
  it('maps codes', () => {
    expect(webhookOperator(214)).toBe('INTERNATIONAL');
    expect(webhookOperator(20)).toBe('TURK_TELEKOM');
    expect(webhookOperator(41)).toBe('NETGSM');
    expect(webhookOperator(45)).toBe('AKONTEL');
    expect(webhookOperator(7)).toBe('UNKNOWN');
  });
});
