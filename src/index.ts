import { Netgsm } from './netgsm.js';

export { Netgsm };
export type { NetgsmOptions, SmsApi, IysApi } from './netgsm.js';
export { NetgsmEnvironment } from './environment.js';
export { NetgsmApiError } from './core/errors.js';
export type { NetgsmApiErrorInit, RejectedItem, Violation } from './core/errors.js';
export type {
  NetgsmConfig,
  BasePayload,
  RestSmsPayload,
  OtpSmsPayload,
  ApiError,
  RestSmsResponse,
  OtpSmsResponse,
  ReportPayload,
  LegacyReportResponse,
  StatsPayload,
  LegacyStatsResponse,
  HeaderQueryPayload,
  HeaderQueryResponse,
  CancelSmsPayload,
  CancelSmsResponse,
  SmsInboxPayload,
  SmsInboxResponse,
  BalancePayload,
  BalanceResponse,
} from './legacy/types.js';
export {
  ApiErrorCode,
  BalanceType,
  OperatorCode,
  SmsStatus,
  SendSmsErrorCode,
  SendOtpSmsErrorCode,
  InboxErrorCode,
  ReportErrorCode,
  MsgHeaderErrorCode,
  CancelErrorCode,
} from './legacy/enums.js';
export { VERSION } from './version.js';
export { parseCredit, findBalance } from './sms/balance.js';
export {
  webhookToReport,
  webhookOperator,
  WEBHOOK_STATUS_REASON,
  WEBHOOK_ERROR_REASON,
} from './sms/webhooks.js';
export { formatIysDate, toIysRecipient, maskRecipient } from './iys/helpers.js';
export type * from './sms/types.js';
export type * from './iys/types.js';

export default Netgsm;
