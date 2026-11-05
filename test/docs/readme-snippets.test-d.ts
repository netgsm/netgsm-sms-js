/**
 * Compile-only check: every TypeScript code block of README.md, adapted only so it compiles
 * (wrapped in async functions; `import`s hoisted; duplicate `new Netgsm(...)` lines kept as in the
 * README). Included by `npm run typecheck`. Keep this file in sync with README.md.
 */
import {
  Netgsm,
  NetgsmApiError,
  NetgsmEnvironment,
  findBalance,
  formatIysDate,
  parseCredit,
  webhookToReport,
} from '../../src/index';
import type { ReportWebhookPayload } from '../../src/index';

declare const process: { env: Record<string, string | undefined> };

// README: Quick start
export async function quickStart(): Promise<void> {
  const netgsm = new Netgsm({
    username: process.env.NETGSM_USERNAME!,
    password: process.env.NETGSM_PASSWORD!,
  });

  const sent = await netgsm.sms.send({
    sender: 'YOUR_SENDER',
    messages: [{ text: 'Hello from Netgsm', recipient: '905XXXXXXXXX' }],
  });
  console.log(sent.jobId, sent.status, sent.accepted, sent.rejected);
}

// README: Environments
export function environments(): Netgsm {
  const sandbox = new Netgsm({
    username: process.env.NETGSM_USERNAME!,
    password: process.env.NETGSM_PASSWORD!,
    baseUrl: NetgsmEnvironment.SANDBOX, // or 'http://127.0.0.1:4010' for the local mock
  });
  return sandbox;
}

// README: Sending messages (1)
export async function sending(): Promise<void> {
  const netgsm = new Netgsm({ username: process.env.NETGSM_USERNAME!, password: process.env.NETGSM_PASSWORD! });

  // Many recipients, each with its own text, in ONE request (up to 1,000,000 messages).
  const sent = await netgsm.sms.send({
    sender: 'YOUR_SENDER',
    messages: [
      { text: 'Hello Ayşe', recipient: '905XXXXXXXXX' },
      { text: 'Hello Mehmet', recipient: '905YYYYYYYYY' },
    ],
    encoding: 'TURKISH', // 'DEFAULT' | 'TURKISH' | 'UNICODE'
    iysFilter: 'NONE', // 'NONE' | 'BRAND' | 'RETAILER' | 'BRAND_AND_RETAILER'
    startAt: '2026-12-01T09:00:00+03:00', // optional scheduled start, ISO-8601 with offset
    referenceId: 'order-1234', // echoed in reports and webhooks
  });

  // Invalid entries do not stop the job; they are listed here (at most 100).
  for (const item of sent.rejectedItems) console.log(item.index, item.reason);

  // Cancel a scheduled job (status 'SCHEDULED'); jobs that are already QUEUED cannot be cancelled.
  await netgsm.sms.cancel({ jobId: sent.jobId });
}

// README: Sending messages (2)
export async function otp(): Promise<void> {
  const netgsm = new Netgsm({ username: process.env.NETGSM_USERNAME!, password: process.env.NETGSM_PASSWORD! });

  const { jobId } = await netgsm.sms.sendOtp({
    sender: 'YOUR_SENDER',
    recipient: '905XXXXXXXXX',
    text: 'Your verification code is 123456',
  });
  console.log(jobId);
}

// README: Reports
export async function reports(): Promise<void> {
  const netgsm = new Netgsm({ username: process.env.NETGSM_USERNAME!, password: process.env.NETGSM_PASSWORD! });

  const { reports } = await netgsm.sms.getReport({ jobIds: ['YOUR_JOB_ID'] });
  for (const r of reports) console.log(r.status, r.failReason, r.operator);
}

// README: Error handling
export async function errorHandling(): Promise<void> {
  const netgsm = new Netgsm({ username: process.env.NETGSM_USERNAME!, password: process.env.NETGSM_PASSWORD! });

  try {
    await netgsm.sms.send({
      sender: 'YOUR_SENDER',
      messages: [{ text: 'Hello', recipient: '905XXXXXXXXX' }],
    });
  } catch (err) {
    if (!(err instanceof NetgsmApiError)) throw err;
    console.error(err.code, err.status, err.requestId); // include requestId when you contact support
    if (err.mayHaveBeenProcessed) {
      // The job may already be queued. Do NOT resend: check sms.getReport first.
    } else if (err.retryable) {
      // Safe to retry later, honoring err.retryAfterSec when it is set.
    }
    for (const item of err.rejectedItems ?? []) console.error(item.index, item.reason);
  }
}

// README: Balance
export async function balanceSnippet(): Promise<void> {
  const netgsm = new Netgsm({ username: process.env.NETGSM_USERNAME!, password: process.env.NETGSM_PASSWORD! });

  const { balance } = await netgsm.sms.getBalance(); // entries by type
  const smsCount = findBalance(balance, 'Adet SMS'); // number | null

  const summary = await netgsm.sms.getBalance({ stip: 2 }); // one-line summary
  const credit = parseCredit(summary.balance); // "92,150" -> 92.15
  console.log(smsCount, credit);
}

// README: Webhooks (1)
export async function webhookRegister(): Promise<void> {
  const netgsm = new Netgsm({ username: process.env.NETGSM_USERNAME!, password: process.env.NETGSM_PASSWORD! });

  await netgsm.sms.registerReportWebhook({
    url: 'https://example.com/netgsm/report',
    headers: 'X-Webhook-Secret: change-me', // sent with every call; use it to verify the sender
  });
}

// README: Webhooks (2)
export function handleReportWebhook(payload: ReportWebhookPayload): void {
  for (const entry of payload.numbers) {
    const { status, failReason, operator } = webhookToReport(entry);
    console.log(entry.jobid, entry.referansID, status, failReason, operator);
  }
}

// README: İYS
export async function iys(): Promise<void> {
  const netgsm = new Netgsm({
    username: process.env.NETGSM_USERNAME!,
    password: process.env.NETGSM_PASSWORD!,
    iysBrandCode: 123456, // your İYS brand code
  });

  // Save consents the recipients really gave (1-500 records per call).
  const saved = await netgsm.iys.saveConsents([
    {
      recipient: '+905XXXXXXXXX',
      recipientType: 'BIREYSEL',
      type: 'MESAJ',
      source: 'HS_WEB',
      status: 'ONAY',
      consentDate: formatIysDate(new Date()), // the moment the consent was given
    },
  ]);
  for (const item of saved.rejected) console.error(item.index, item.field, item.message);

  // Query consents; only status === 'ONAY' means the recipient consented.
  const consents = await netgsm.iys.searchConsents(
    [{ recipient: '+905XXXXXXXXX', recipientType: 'BIREYSEL', type: 'MESAJ' }],
    { chunkSize: 100 },
  );
  console.log(consents[0]?.status, consents[0]?.errorCode);
}
