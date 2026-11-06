// Run with: NETGSM_MOCK_URL=http://127.0.0.1:4010 bun test/runtime/bun-smoke.mjs (after npm run build)
import Netgsm from '../../dist/index.mjs';

const baseUrl = process.env.NETGSM_MOCK_URL;
if (!baseUrl) throw new Error('NETGSM_MOCK_URL is not set');

const sms = new Netgsm({ username: '8500000000', password: 'password001', baseUrl }).sms;
const r = await sms.send({
  sender: 'MOCKTEST',
  messages: [{ text: 'bun', recipient: '905551112233' }],
});
if (!r.jobId) throw new Error('unexpected result: ' + JSON.stringify(r));
console.log('BUN_OK ' + r.jobId);
