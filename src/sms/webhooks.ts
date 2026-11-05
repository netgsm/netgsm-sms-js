import type { ReportWebhookEntry } from './types.js';

export type { InboxWebhookPayload, ReportWebhookEntry, ReportWebhookPayload } from './types.js';

/** Webhook `status` -> `GET /report` `failReason` (codes that carry their own reason). */
export const WEBHOOK_STATUS_REASON: Readonly<Record<number, string>> = {
  3: 'INVALID_NUMBER', 4: 'NOT_SENT_TO_OPERATOR', 8: 'OPERATOR_REJECTED', 11: 'OPERATOR_ERROR', 12: 'SEND_ERROR',
  13: 'DUPLICATE', 14: 'INSUFFICIENT_CREDIT', 15: 'BLACKLISTED', 16: 'IYS_REJECTED', 17: 'IYS_ERROR',
  18: 'MESSAGE_NOT_CREATED', 19: 'INVALID_NUMBER_FORMAT', 20: 'NTS_NOT_APPROVED', 22: 'NO_INTERNATIONAL_PERMISSION',
};

/** Webhook `errorCode` (when `status` is 2) -> `GET /report` `failReason`. */
export const WEBHOOK_ERROR_REASON: Readonly<Record<number, string>> = {
  111: 'TIMEOUT', 112: 'SMS_DISABLED_ON_DEVICE', 113: 'DEVICE_NOT_SUPPORTED', 114: 'ROUTING_FAILED',
  115: 'OPERATOR_TIMEOUT', 116: 'UNKNOWN_SUBSCRIBER', 117: 'ILLEGAL_SUBSCRIBER', 119: 'SYSTEM_ERROR',
};

/** Webhook `operator` code -> `GET /report` `operator` name. */
export function webhookOperator(code: number): string {
  if (code === 10) return 'VODAFONE';
  if (code === 20) return 'TURK_TELEKOM';
  if (code === 30) return 'TURKCELL';
  if (code === 40 || code === 41 || code === 43) return 'NETGSM';
  if (code === 45) return 'AKONTEL';
  if (code >= 210 && code <= 218) return 'INTERNATIONAL';
  return 'UNKNOWN';
}

/**
 * Translates a webhook entry's codes to the names `GET /report` uses. `errorCode` is read only when
 * `status` is 2. A `status` missing from the table counts as `NOT_DELIVERED` with `UNKNOWN`.
 */
export function webhookToReport(
  e: Pick<ReportWebhookEntry, 'status' | 'operator' | 'errorCode'>,
): { status: 'DELIVERED' | 'NOT_DELIVERED'; failReason: string | null; operator: string } {
  const operator = webhookOperator(e.operator);
  if (e.status === 1) return { status: 'DELIVERED', failReason: null, operator };
  const failReason =
    e.status === 2
      ? (WEBHOOK_ERROR_REASON[e.errorCode ?? 0] ?? 'UNKNOWN')
      : (WEBHOOK_STATUS_REASON[e.status] ?? 'UNKNOWN');
  return { status: 'NOT_DELIVERED', failReason, operator };
}
