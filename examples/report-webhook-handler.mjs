// A minimal delivery-report webhook receiver.
// Netgsm POSTs { numbers: [...] } to the address you register with sms.registerReportWebhook().
// Any 2xx answer counts as delivered. Netgsm does NOT resend reports, so acknowledge fast and
// reconcile gaps with sms.getReport().
//   node examples/report-webhook-handler.mjs            self-test: posts a sample payload, exits
//   node examples/report-webhook-handler.mjs --serve    keeps listening on PORT (default 3000)
import { createServer } from 'node:http';
import { webhookToReport } from '@netgsm/sms';

const server = createServer((req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405).end();
    return;
  }
  const chunks = [];
  req.on('data', (c) => chunks.push(c));
  req.on('end', () => {
    try {
      const payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      for (const e of payload.numbers) {
        const { status, failReason, operator } = webhookToReport(e);
        // Do not log full phone numbers.
        console.log(
          `job ${e.jobid} ref ${e.referansID ?? '-'}: ${status} ${failReason ?? ''} (${operator})`,
        );
      }
      res.writeHead(200).end('ok');
    } catch {
      res.writeHead(400).end();
    }
  });
});

const serve = process.argv.includes('--serve');
server.listen(serve ? Number(process.env.PORT ?? 3000) : 0, '127.0.0.1', async () => {
  const { port } = server.address();
  console.log(`listening on http://127.0.0.1:${port}`);
  if (serve) return;
  const sample = {
    numbers: [
      { jobid: 'J1', number: '905551112201', status: 1, operator: 30, msglen: 12, deliveredDate: '2026-11-05 10:00:00', errorCode: null, referansID: 'order-1' },
      { jobid: 'J1', number: '905551112202', status: 2, operator: 10, msglen: 12, deliveredDate: '', errorCode: 116, referansID: 'order-1' },
      { jobid: 'J1', number: '905551112203', status: 15, operator: 0, msglen: 12, deliveredDate: '', errorCode: null, referansID: null },
    ],
  };
  const r = await fetch(`http://127.0.0.1:${port}/`, {
    method: 'POST',
    body: JSON.stringify(sample),
  });
  console.log('handler answered', r.status);
  server.close();
});
