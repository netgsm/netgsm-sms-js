// İYS consent example.
//
// WARNING: İYS has NO sandbox and the local mock does not implement it. Against the live API,
// saveConsents() WRITES LEGAL CONSENT RECORDS to the real İYS registry; they cannot be edited or
// deleted. This example therefore only READS by default. It saves a record only when you set
// NETGSM_IYS_CONFIRM_WRITE=1, and you must only ever save consents that were really obtained.
import { Netgsm, NetgsmApiError, formatIysDate, maskRecipient } from '@netgsm/sms';

const baseUrl = process.env.NETGSM_BASE_URL ?? 'http://127.0.0.1:4010';
const live = !/^http:\/\/(127\.0\.0\.1|localhost)(:|\/|$)/.test(baseUrl);
console.warn(
  live
    ? `WARNING: ${baseUrl} is not the local mock. İYS calls here hit the REAL İYS registry.`
    : 'Using the local mock. It does not implement İYS, so İYS calls are expected to fail here.',
);

const netgsm = new Netgsm({
  username: process.env.NETGSM_USERNAME ?? '8500000000',
  password: process.env.NETGSM_PASSWORD ?? 'password001',
  baseUrl,
  iysBrandCode: Number(process.env.NETGSM_IYS_BRAND_CODE ?? 1),
});

const recipient = '+905551112201'; // İYS format: +90..., not the SMS API 90... format

try {
  const [consent] = await netgsm.iys.searchConsents([
    { recipient, recipientType: 'BIREYSEL', type: 'MESAJ' },
  ]);
  console.log(maskRecipient(recipient), '->', consent.status, `(errorCode ${consent.errorCode})`);
  // Only status === 'ONAY' means the recipient has consented.

  if (process.env.NETGSM_IYS_CONFIRM_WRITE === '1') {
    const result = await netgsm.iys.saveConsents([
      {
        recipient,
        recipientType: 'BIREYSEL',
        type: 'MESAJ',
        source: 'HS_WEB',
        status: 'ONAY',
        consentDate: formatIysDate(new Date()), // use the time the consent was really given
      },
    ]);
    console.log('saved, uid:', result.uid, 'rejected:', result.rejected);
  } else {
    console.log('Skipping saveConsents (set NETGSM_IYS_CONFIRM_WRITE=1 to write a real record).');
  }
} catch (err) {
  if (!(err instanceof NetgsmApiError)) throw err;
  console.error(`İYS call failed: ${err.code} (HTTP ${err.status}), requestId=${err.requestId}`);
  if (live) process.exitCode = 1;
  else console.error('Expected: the local mock does not implement İYS, so this is not a failure.');
}
