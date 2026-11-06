// A 1.x-style ESM program: default and named imports, enums subpath, sendRestSms through a fake fetch.
process.noDeprecation = true;
import Netgsm, { Netgsm as Named, SendSmsErrorCode as RootCode } from '@netgsm/sms';
import { SendSmsErrorCode, BalanceType } from '@netgsm/sms/enums';

const calls = [];
const fakeFetch = async (url, init) => {
  calls.push({ url, init });
  return new Response(JSON.stringify({ code: '00', jobid: '778', description: 'ok' }), { status: 200 });
};

try {
  if (Named !== Netgsm || RootCode !== SendSmsErrorCode || BalanceType.CREDIT !== 2) throw new Error('exports differ');
  const client = new Netgsm({ username: 'u', password: 'p', appname: 'app', fetch: fakeFetch });
  const r = await client.sendRestSms({ msgheader: 'T', messages: [{ msg: 'm', no: '5551234567' }] });
  if (r.code !== SendSmsErrorCode.SUCCESS || r.jobid !== '778') throw new Error('unexpected 1.x response');
  if (calls[0].url !== 'https://api.netgsm.com.tr/sms/rest/v2/send') throw new Error('wrong url ' + calls[0].url);
  console.log('LEGACY_ESM_OK ' + r.jobid);
} catch (e) {
  console.error(e);
  process.exit(1);
}
