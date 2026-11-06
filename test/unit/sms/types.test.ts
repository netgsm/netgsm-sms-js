import { describe, expectTypeOf, it } from 'vitest';
import type {
  BalanceQuery, BalanceService, Encoding, RejectedItem, RejectedMessage, ReportEntry, ReportRow, SmsSendRequest,
} from '../../../src/sms/types.js';

describe('sms types', () => {
  it('encodes spec enums', () => {
    expectTypeOf<SmsSendRequest['encoding']>().toEqualTypeOf<Encoding | undefined>();
    expectTypeOf<Encoding>().toEqualTypeOf<'DEFAULT' | 'TURKISH' | 'UNICODE'>();
    expectTypeOf<ReportRow>().toEqualTypeOf<ReportEntry>();
    expectTypeOf<ReportEntry['failReason']>().toBeNullable();
    expectTypeOf<RejectedMessage>().toExtend<RejectedItem>();
    expectTypeOf<BalanceQuery['stip']>().toEqualTypeOf<1 | 2 | 3 | undefined>();
    expectTypeOf<'sms' | 'ucret'>().toExtend<BalanceService>();
  });
});
