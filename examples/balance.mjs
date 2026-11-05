// Reads the account balance. Call it once before a campaign, not in a loop:
// the endpoint is limited to 60 requests per minute and answers are cached for 10 seconds.
import { Netgsm, findBalance, parseCredit } from '@netgsm/sms';

const netgsm = new Netgsm({
  username: process.env.NETGSM_USERNAME ?? '8500000000',
  password: process.env.NETGSM_PASSWORD ?? 'password001',
  baseUrl: process.env.NETGSM_BASE_URL ?? 'http://127.0.0.1:4010',
});

const { balance } = await netgsm.sms.getBalance();
for (const entry of balance) console.log(`${entry.balance_name}: ${entry.amount}`);

console.log('SMS packages:', findBalance(balance, 'Adet SMS'));

const summary = await netgsm.sms.getBalance({ stip: 2 });
console.log('summary:', summary.balance, '=>', parseCredit(summary.balance));
