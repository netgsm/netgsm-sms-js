import { describe, expectTypeOf, it } from 'vitest';
import type { IysApi, SmsApi } from '../../src/index.js';
import * as pkg from '../../src/index.js';

describe('public API types', () => {
  it('a structural fake is assignable to SmsApi and IysApi', () => {
    const smsFake: SmsApi = {
      send: () => Promise.reject(new Error('x')),
      sendTemplate: () => Promise.reject(new Error('x')),
      sendOtp: () => Promise.reject(new Error('x')),
      sendToDirectory: () => Promise.reject(new Error('x')),
      cancel: () => Promise.reject(new Error('x')),
      getReport: () => Promise.reject(new Error('x')),
      getStats: () => Promise.reject(new Error('x')),
      getInbox: () => Promise.reject(new Error('x')),
      listSenders: () => Promise.reject(new Error('x')),
      getDefaultSender: () => Promise.reject(new Error('x')),
      setDefaultSender: () => Promise.reject(new Error('x')),
      registerReportWebhook: () => Promise.reject(new Error('x')),
      deleteReportWebhook: () => Promise.resolve(),
      registerInboxWebhook: () => Promise.reject(new Error('x')),
      deleteInboxWebhook: () => Promise.resolve(),
      getBlacklist: () => Promise.reject(new Error('x')),
      measureLength: () => Promise.reject(new Error('x')),
      listTemplates: () => Promise.reject(new Error('x')),
      getBalance: (() => Promise.reject(new Error('x'))) as SmsApi['getBalance'],
    };
    const iysFake: IysApi = {
      saveConsents: () => Promise.reject(new Error('x')),
      searchConsents: () => Promise.reject(new Error('x')),
      saveWebhook: () => Promise.reject(new Error('x')),
    };
    expectTypeOf(smsFake).toMatchTypeOf<SmsApi>();
    expectTypeOf(iysFake).toMatchTypeOf<IysApi>();
  });

  it('keeps the getBalance overloads', () => {
    expectTypeOf<SmsApi['getBalance']>().toBeFunction();
    expectTypeOf<SmsApi['getBalance']>().parameters.toMatchTypeOf<[q?: unknown]>();
  });

  it('the implementation classes are not value exports', () => {
    const keys = Object.keys(pkg);
    if (keys.includes('SmsApi') || keys.includes('IysApi')) throw new Error('class exported');
  });
});
