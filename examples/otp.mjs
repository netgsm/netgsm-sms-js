// Sends a one-time-password SMS.
// Defaults to the local mock. On live, the OTP route needs an OTP-enabled account.
import { randomInt } from 'node:crypto';
import { Netgsm, NetgsmApiError } from '@netgsm/sms';

const netgsm = new Netgsm({
  username: process.env.NETGSM_USERNAME ?? '8500000000',
  password: process.env.NETGSM_PASSWORD ?? 'password001',
  baseUrl: process.env.NETGSM_BASE_URL ?? 'http://127.0.0.1:4010',
});

const code = String(randomInt(100000, 1000000));

try {
  const { jobId } = await netgsm.sms.sendOtp({
    sender: process.env.NETGSM_SENDER ?? 'MOCKTEST',
    recipient: process.env.NETGSM_RECIPIENT ?? '905551112201',
    text: `Your verification code is ${code}`,
  });
  console.log('OTP queued, jobId:', jobId); // never log the code itself in production
} catch (err) {
  if (!(err instanceof NetgsmApiError)) throw err;
  console.error(
    `${err.code} (HTTP ${err.status}) requestId=${err.requestId} retryable=${err.retryable}`,
  );
  process.exitCode = 1;
}
