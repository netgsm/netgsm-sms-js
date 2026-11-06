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
