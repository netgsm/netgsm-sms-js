import { describe, expect, it } from 'vitest';
import { NetgsmApiError } from '../../../src/core/errors';

const base = {
  api: 'sms' as const,
  operation: 'POST /sms/v3/send',
  status: 429,
  code: 'RATE_LIMITED',
  detail: 'slow down',
  requestId: 'req-1',
  retryAfterSec: 3,
  retryable: true,
  mayHaveBeenProcessed: false,
};

describe('NetgsmApiError', () => {
  it('is an Error with the right name and message', () => {
    const err = new NetgsmApiError(base);
    expect(err).toBeInstanceOf(NetgsmApiError);
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('NetgsmApiError');
    expect(err.message).toBe('POST /sms/v3/send → 429 RATE_LIMITED: slow down (requestId req-1)');
  });

  it('uses "-" when requestId is null and defaults optional fields', () => {
    const err = new NetgsmApiError({ ...base, requestId: null, retryAfterSec: undefined });
    expect(err.message).toContain('(requestId -)');
    expect(err.retryAfterSec).toBeNull();
  });

  it('error_never_contains_secrets', () => {
    const err = new NetgsmApiError(base);
    expect(Object.keys(err.toJSON())).toEqual([
      'name', 'api', 'operation', 'status', 'code', 'requestId',
      'retryAfterSec', 'retryable', 'mayHaveBeenProcessed', 'message',
    ]);
    expect('cause' in err).toBe(false);
  });

  it('adds rejectedItems and data to toJSON only when given', () => {
    const err = new NetgsmApiError({
      ...base,
      rejectedItems: [{ index: 0, recipient: 'x', reason: 'bad' }],
      data: { erroritem: [] },
      violations: [{ field: 'f', message: 'm' }],
    });
    expect(Object.keys(err.toJSON())).toEqual([
      'name', 'api', 'operation', 'status', 'code', 'requestId',
      'retryAfterSec', 'retryable', 'mayHaveBeenProcessed', 'message',
      'rejectedItems', 'data', 'violations',
    ]);
  });
});
