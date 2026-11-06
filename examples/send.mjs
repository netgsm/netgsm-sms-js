// Sends one SMS and reads its delivery report.
// Defaults to the local mock, so nothing reaches the live API unless you set NETGSM_BASE_URL.
//   node test/fixtures/netgsm-sms-mock.mjs --port 4010 --quiet
//   node examples/send.mjs
import { Netgsm, NetgsmApiError } from '@netgsm/sms';

const netgsm = new Netgsm({
  username: process.env.NETGSM_USERNAME ?? '8500000000',
  password: process.env.NETGSM_PASSWORD ?? 'password001',
  baseUrl: process.env.NETGSM_BASE_URL ?? 'http://127.0.0.1:4010',
});

const sender = process.env.NETGSM_SENDER ?? 'MOCKTEST';
const recipient = process.env.NETGSM_RECIPIENT ?? '905551112201';

try {
  const sent = await netgsm.sms.send({
    sender,
    messages: [{ text: 'Merhaba from @netgsm/sms', recipient }],
    encoding: 'TURKISH',
    referenceId: 'example-send-1',
  });
  console.log('queued:', {
    jobId: sent.jobId,
    status: sent.status,
    accepted: sent.accepted,
    rejected: sent.rejected,
  });
  for (const item of sent.rejectedItems) console.log('rejected:', item.index, item.reason);

  // Reports can take a while on the live API; prefer a report webhook in production (see README).
  const report = await netgsm.sms.getReport({ jobIds: [sent.jobId] });
  console.log(
    'report:',
    report.reports.map((r) => ({ status: r.status, failReason: r.failReason })),
  );
} catch (err) {
  if (!(err instanceof NetgsmApiError)) throw err;
  console.error(`${err.code} (HTTP ${err.status}) requestId=${err.requestId}`);
  if (err.mayHaveBeenProcessed) {
    console.error('The send may have been accepted: check the report before resending.');
  }
  process.exitCode = 1;
}
