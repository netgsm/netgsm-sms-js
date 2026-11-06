import { beforeEach, describe, expect, it } from 'vitest';
import { Netgsm, NetgsmApiError, findBalance } from '../../src/index';
import {
  MOCK_PASS, MOCK_SENDER, MOCK_USER, getScenarios, mockUrl, resetMock, setScenario,
} from './helpers';

function client(fetchImpl?: typeof fetch) {
  return new Netgsm({ username: MOCK_USER, password: MOCK_PASS, baseUrl: mockUrl(), fetch: fetchImpl });
}

async function catchError(p: Promise<unknown>): Promise<NetgsmApiError> {
  try {
    await p;
  } catch (e) {
    expect(e).toBeInstanceOf(NetgsmApiError);
    return e as NetgsmApiError;
  }
  throw new Error('expected rejection');
}

describe('Netgsm SDK against the local mock', () => {
  beforeEach(resetMock);

  it('send_then_report', async () => {
    const sms = client().sms;
    const sent = await sms.send({
      sender: MOCK_SENDER,
      messages: ['905551112201', '905551112202', '905551112203'].map((recipient) => ({ text: 'merhaba', recipient })),
    });
    expect(sent.jobId).toBeTruthy();
    expect(sent.accepted).toBe(3);
    const report = await sms.getReport({ jobIds: [sent.jobId] });
    expect(report.reports).toHaveLength(3);
  });

  it('rejected_items_returned', async () => {
    const sent = await client().sms.send({
      sender: MOCK_SENDER,
      messages: [
        { text: 'a', recipient: '905551112201' },
        { text: 'b', recipient: '123' },
      ],
    });
    expect(sent.rejected).toBe(1);
    expect(sent.rejectedItems[0].index).toBe(1);
  });

  it('otp_plus_prefix_accepted', async () => {
    const r = await client().sms.sendOtp({ sender: MOCK_SENDER, text: 'Kod: 123456', recipient: '+905551112233' });
    expect(r.jobId).toBeTruthy();
  });

  it('balance_default_list', async () => {
    const r = await client().sms.getBalance();
    expect(typeof findBalance(r.balance, 'Adet SMS')).toBe('number');
  });

  it('balance_invalid_service_400', async () => {
    const e = await catchError(client().sms.getBalance({ service: 'xyz' }));
    expect(e.status).toBe(400);
  });

  it('scenario_503_on_send_not_retried', async () => {
    const sms = client().sms;
    await sms.getBalance(); // warm the token so the scenario targets /send only
    await setScenario({ code: 'SERVICE_UNAVAILABLE', path: '/sms/v3/send' });
    const e = await catchError(
      sms.send({ sender: MOCK_SENDER, messages: [{ text: 'x', recipient: '905551112201' }] }),
    );
    expect(e.status).toBe(503);
    expect(e.mayHaveBeenProcessed).toBe(true);
    expect(await getScenarios()).toMatchObject({ scenarios: [] });
  });

  it('token_reused', async () => {
    let tokenCalls = 0;
    const counting: typeof fetch = (input, init) => {
      const url = input instanceof Request ? input.url : String(input);
      if (url.endsWith('/auth/v3/token')) tokenCalls++;
      return fetch(input, init);
    };
    const sms = client(counting).sms;
    for (let i = 0; i < 5; i++) await sms.getBalance();
    expect(tokenCalls).toBe(1);
  });
});
