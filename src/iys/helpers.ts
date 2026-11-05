const IYS_PHONE = /^\+90\d{10}$/;

/**
 * Date -> 'YYYY-MM-DD HH:mm:ss'. The contract does not name a time zone; the default is Turkish time
 * ('Europe/Istanbul'). Confirm the zone you use with the official İYS documentation.
 */
export function formatIysDate(date: Date, timeZone = 'Europe/Istanbul'): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}

/** SMS API v3 format (905XXXXXXXXX) -> İYS format (+905XXXXXXXXX). */
export function toIysRecipient(smsRecipient: string): string {
  if (!/^90\d{10}$/.test(smsRecipient)) {
    throw new TypeError('SMS API v3 number must be in the 90XXXXXXXXXX format');
  }
  return `+${smsRecipient}`;
}

/** For logs: '+905321234567' -> '+90532*****67', 'ad@alan.com' -> 'a***@alan.com'. */
export function maskRecipient(recipient: string): string {
  if (recipient.includes('@')) {
    const [user = '', domain = ''] = recipient.split('@');
    return `${user.slice(0, 1)}***@${domain}`;
  }
  return recipient.length > 8
    ? `${recipient.slice(0, 6)}${'*'.repeat(recipient.length - 8)}${recipient.slice(-2)}`
    : '***';
}

/** Splits an array into chunks of at most `size` items. */
export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/** Throws a TypeError (never mentioning the recipient) unless it is '+90XXXXXXXXXX' or an e-mail. */
export function assertRecipient(recipient: string, where: string): void {
  if (typeof recipient !== 'string') throw new TypeError(`${where}: recipient must be a string`);
  if (recipient.includes('@')) return;
  if (!IYS_PHONE.test(recipient)) {
    throw new TypeError(
      `${where}: phone number must be in the +90XXXXXXXXXX format (not the SMS API 90... format)`,
    );
  }
}
