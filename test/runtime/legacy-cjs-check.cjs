'use strict';
// A 1.x-style program: default import, enums subpath, sendRestSms. The injected fake fetch means no network.
process.noDeprecation = true;
const Netgsm = require('@netgsm/sms').default;
const { SendSmsErrorCode, BalanceType } = require('@netgsm/sms/enums');
const { Netgsm: Named, SendSmsErrorCode: RootCode } = require('@netgsm/sms');

const calls = [];
const fakeFetch = async (url, init) => {
  calls.push({ url, init });
  return new Response(JSON.stringify({ code: '00', jobid: '777', description: 'ok' }), { status: 200 });
};

(async () => {
  if (Named !== Netgsm || RootCode.SUCCESS !== SendSmsErrorCode.SUCCESS || BalanceType.CREDIT !== 2) throw new Error('exports differ');
  const client = new Netgsm({ username: 'u', password: 'p', appname: 'app', fetch: fakeFetch });
  const r = await client.sendRestSms({ msgheader: 'T', messages: [{ msg: 'm', no: '5551234567' }] });
  if (r.code !== SendSmsErrorCode.SUCCESS || r.jobid !== '777') throw new Error('unexpected 1.x response');
  if (calls[0].url !== 'https://api.netgsm.com.tr/sms/rest/v2/send') throw new Error('wrong url ' + calls[0].url);
  console.log('LEGACY_CJS_OK ' + r.jobid);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
