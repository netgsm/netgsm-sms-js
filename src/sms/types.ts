/** Types for the Netgsm SMS v3 API (`/sms/v3`), named after the OpenAPI `components.schemas`. */
import type { RejectedItem } from '../core/errors.js';

export type { RejectedItem };

/** Message encoding. `UNICODE` is not accepted by the directory send. */
export type Encoding = 'DEFAULT' | 'TURKISH' | 'UNICODE';

/** İYS filter applied to the recipients. */
export type IysFilter = 'NONE' | 'BRAND' | 'RETAILER' | 'BRAND_AND_RETAILER';

/** Service group accepted by `GET /balance?service=`. */
export type BalanceService =
  | 'sms' | 'otp' | 'ses' | 'fax' | 'whatsapp' | 'santral'
  | 'netsipp' | 'gsm' | 'internet' | 'numara' | 'ai' | 'ucret';

export type DeliveryStatus = 'PENDING' | 'DELIVERED' | 'NOT_DELIVERED';

// --- Send ----------------------------------------------------------------------------------------

export interface SmsMessage {
  text: string;
  /** `90XXXXXXXXXX` (12 digits) or an international number written as `-` plus 9 to 17 digits. */
  recipient: string;
}

export interface SmsSendRequest {
  /** Sender header, 1 to 35 characters, matched exactly (case-sensitive). */
  sender: string;
  /** 1 to 1,000,000 messages. */
  messages: SmsMessage[];
  /** Defaults to `DEFAULT`. */
  encoding?: Encoding;
  /** Defaults to `NONE`. */
  iysFilter?: IysFilter;
  /** Scheduled start, ISO-8601 with offset (e.g. `2026-08-31T09:00:00+03:00`). */
  startAt?: string;
  /** Latest delivery time, ISO-8601 with offset. */
  stopAt?: string;
  /** Max 32 characters. */
  partnerCode?: string;
  /** Max 50 characters; returned in reports and webhooks as `referenceId` / `referansID`. */
  referenceId?: string;
  /** Max 50 characters. */
  appName?: string;
}

/** Reason a message was not queued. */
export type RejectedMessageReason =
  | 'INVALID_RECIPIENT' | 'INVALID_MESSAGE' | 'MESSAGE_TOO_LONG'
  | 'MALFORMED_ENTRY' | 'DUPLICATE_RECIPIENT' | 'NO_INTERNATIONAL_PERMISSION';

export interface RejectedMessage {
  /** Zero-based position in the request. */
  index: number;
  recipient: string | null;
  reason: RejectedMessageReason;
}

export interface SmsSendResponse {
  jobId: string;
  status: 'QUEUED' | 'SCHEDULED';
  accepted: number;
  rejected: number;
  /** At most 100 entries; see `rejectedItemsTruncated`. */
  rejectedItems: RejectedMessage[];
  rejectedItemsTruncated: boolean;
  referenceId: string | null;
}

export interface TemplateMessage {
  templateId: number;
  /** Max 17 characters, same format as `SmsMessage.recipient`. */
  recipient: string;
  /** Placeholder values keyed by parameter name. */
  params?: Record<string, string>;
}

export interface TemplateSendRequest {
  sender: string;
  /** 1 to 20 entries. */
  templates: TemplateMessage[];
  encoding?: Encoding;
  iysFilter?: IysFilter;
  startAt?: string;
  stopAt?: string;
  partnerCode?: string;
  referenceId?: string;
  appName?: string;
}

export interface DirectoryContact {
  /** 1 to 20 characters. */
  number: string;
  name?: string;
  surname?: string;
  address?: string;
}

export interface DirectorySendRequest {
  sender: string;
  /** 1 to 917 characters. */
  text: string;
  /** Directory send does not accept `UNICODE`. */
  encoding?: 'DEFAULT' | 'TURKISH';
  iysFilter?: IysFilter;
  groupIds?: number[];
  contacts?: DirectoryContact[];
  recipients?: string[];
  address1?: string;
  address2?: string;
  /** 0 to 17; defaults to 0. */
  addressType?: number;
  startAt?: string;
  stopAt?: string;
}

export interface DirectorySendResponse {
  jobId: string;
  status: 'QUEUED';
  review: 'NONE' | 'ADMIN_APPROVAL' | 'FORBIDDEN_WORD' | 'UNKNOWN';
}

export interface OtpSendRequest {
  sender: string;
  text: string;
  recipient: string;
  appName?: string;
}

export interface OtpSendResponse {
  jobId: string;
}

// --- Cancel --------------------------------------------------------------------------------------

export interface CancelRequest {
  /** 1 to 64 characters. */
  jobId: string;
}

export interface CancelResponse {
  jobId: string;
  /** ISO-8601 with offset. */
  cancelledAt: string;
}

// --- Reports -------------------------------------------------------------------------------------

export type ReportOperator =
  | 'VODAFONE' | 'TURK_TELEKOM' | 'TURKCELL' | 'NETGSM' | 'AKONTEL' | 'INTERNATIONAL' | 'UNKNOWN';

export type ReportFailReason =
  | 'INVALID_NUMBER' | 'NOT_SENT_TO_OPERATOR' | 'OPERATOR_REJECTED' | 'OPERATOR_ERROR' | 'SEND_ERROR'
  | 'DUPLICATE' | 'INSUFFICIENT_CREDIT' | 'BLACKLISTED' | 'IYS_REJECTED' | 'IYS_ERROR'
  | 'MESSAGE_NOT_CREATED' | 'INVALID_NUMBER_FORMAT' | 'NTS_NOT_APPROVED' | 'REPORT_NOT_FORWARDED'
  | 'NO_INTERNATIONAL_PERMISSION' | 'TIMEOUT' | 'SMS_DISABLED_ON_DEVICE' | 'DEVICE_NOT_SUPPORTED'
  | 'ROUTING_FAILED' | 'OPERATOR_TIMEOUT' | 'UNKNOWN_SUBSCRIBER' | 'ILLEGAL_SUBSCRIBER'
  | 'SYSTEM_ERROR' | 'UNKNOWN';

export interface ReportEntry {
  jobId: string | null;
  number: string | null;
  status: DeliveryStatus | null;
  operator: ReportOperator | null;
  messageLength: number | null;
  /** ISO-8601 with offset. */
  deliveredAt: string | null;
  failReason: ReportFailReason | null;
  referenceId: string | null;
}

/** Alias of {@link ReportEntry}. */
export type ReportRow = ReportEntry;

export interface ReportResponse {
  count: number;
  page: number;
  reports: ReportEntry[];
}

export interface ReportQuery {
  jobIds?: string[];
  /** ISO-8601 with offset; only together with `stopAt`. */
  startAt?: string;
  stopAt?: string;
  page?: number;
}

export type StatFailReason =
  | 'INVALID_NUMBER' | 'NOT_SENT_TO_OPERATOR' | 'OPERATOR_REJECTED' | 'OPERATOR_ERROR' | 'SEND_ERROR'
  | 'DUPLICATE' | 'INSUFFICIENT_CREDIT' | 'BLACKLISTED' | 'IYS_REJECTED' | 'MESSAGE_NOT_CREATED'
  | 'TIMEOUT' | 'UNKNOWN';

export interface StatEntry {
  status: DeliveryStatus | null;
  failReason: StatFailReason | null;
  messageCount: number | null;
  totalParts: number | null;
  domestic: boolean;
  charging: string | null;
  chargeDescription: string | null;
}

export interface StatsResponse {
  jobId: string;
  /** `yyyy-MM`. */
  month: string;
  count: number;
  stats: StatEntry[];
}

export interface StatsQuery {
  jobId: string;
  /** `yyyy-MM`; defaults to the current month. */
  month?: string;
}

// --- Inbox ---------------------------------------------------------------------------------------

export interface InboxMessage {
  id: string | null;
  jobId: string | null;
  sender: string | null;
  text: string | null;
  operator: string | null;
  /** ISO-8601 with offset. */
  receivedAt: string | null;
}

export interface InboxResponse {
  count: number;
  messages: InboxMessage[];
  truncated: boolean;
}

export interface InboxQuery {
  /** ISO-8601 with offset; only together with `stopAt`. */
  startAt?: string;
  stopAt?: string;
}

// --- Senders -------------------------------------------------------------------------------------

export interface SenderEntry {
  name: string | null;
  type: 'ALPHANUMERIC' | 'SUBSCRIBER_NUMBER' | 'UNKNOWN';
  brandCode: number;
  usable: boolean;
  reason: 'ROUTING_CODE_MISSING' | 'SUBSCRIBER_NUMBER_RESTRICTED' | null;
}

export interface SendersResponse {
  count: number;
  senders: SenderEntry[];
}

export interface DefaultSenderResponse {
  sender: SenderEntry | null;
}

export interface DefaultSenderChangeRequest {
  name: string;
}

// --- Webhook registration ------------------------------------------------------------------------

export interface WebhookRequest {
  /** Max 1024 characters. */
  url: string;
  /** Header string sent with each call; max 500 characters. */
  headers?: string;
}

export interface WebhookResponse {
  url: string;
  headers: string | null;
  /** ISO-8601 with offset. */
  registeredAt: string;
}

// --- Blacklist, length, templates ----------------------------------------------------------------

export interface BlacklistResponse {
  count: number;
  page: number | null;
  number: string | null;
  numbers: string[];
}

export interface BlacklistQuery {
  page?: number;
  number?: string;
}

export interface LengthRequest {
  /** Max 10,000 characters. */
  text: string;
  encoding?: Encoding;
  /** Defaults to false. */
  alphanumericSender?: boolean;
}

export interface LengthResponse {
  encoding: Encoding;
  length: number;
  parts: number;
  limit: number;
  fits: boolean;
  remaining: number;
  remainingUntilNextPart: number;
}

export interface TemplateParameter {
  name: string;
  type: 'BIGINT' | 'FLOAT' | 'TEXT' | 'DATE' | 'DATETIME';
  maxLength: number | null;
}

export interface TemplateEntry {
  templateId: number;
  /** Placeholders are written `${name}`. */
  content: string;
  /** e.g. `AUTH_OTP`, `SECURITY_ALERT`, `SERVICE_ALERT`. */
  type: string;
  description: string | null;
  public: boolean;
  parameters: TemplateParameter[];
  /** ISO-8601 with offset. */
  createdAt: string | null;
}

export interface TemplateListResponse {
  count: number;
  page: number;
  total: number;
  totalPages: number;
  templates: TemplateEntry[];
}

export interface TemplateQuery {
  /** `false` lists only the account's own templates. Defaults to true. */
  includePublic?: boolean;
  /** Exact match. */
  type?: string;
  /** Case-insensitive match on the description. */
  search?: string;
  /** Case-insensitive match on the template text. */
  content?: string;
  /** Zero-based; defaults to 0. */
  page?: number;
  /** 1 to 100; defaults to 20. */
  size?: number;
}

// --- Balance -------------------------------------------------------------------------------------

export interface BalanceEntry {
  /** A string for a single record (`"767"`, or `"92,150"` for `Kredi Bakiye`), a number for aggregated records. */
  amount: string | number;
  balance_name: string;
}

export interface BalanceListResponse {
  balance: BalanceEntry[];
}

export interface BalanceSummaryResponse {
  code: '00';
  /** Credit in TL (`"92,150"`), an SMS count, or `"0"` on postpaid accounts; absent when neither exists. */
  balance?: string;
  type?: 'AdetSMS';
}

export interface BalanceQuery {
  /** 1: entries by type (default), 2: one-line summary, 3: entries plus credit. */
  stip?: 1 | 2 | 3;
  service?: BalanceService | (string & {});
}

// --- Webhook payloads ----------------------------------------------------------------------------

export interface ReportWebhookEntry {
  jobid: string;
  number: string;
  /** 1 delivered; 2 not delivered (reason in `errorCode`); 3, 4, 8, 11-20, 22 carry their own reason. */
  status: number;
  /** 10 Vodafone, 20 Turk Telekom, 30 Turkcell, 40/41/43 Netgsm, 45 Akontel, 210-218 international, 0 unknown. */
  operator: number;
  msglen: number;
  /** `yyyy-MM-dd HH:mm:ss` in Turkey time; `""` when not delivered. */
  deliveredDate: string;
  /** Only meaningful when `status` is 2; 0 or null means unknown. */
  errorCode: number | null;
  /** The `referenceId` of the send; null when not given. */
  referansID: string | null;
}

export interface ReportWebhookPayload {
  numbers: ReportWebhookEntry[];
}

export interface InboxWebhookPayload {
  messageId: string;
  messageDateTime: string;
  sourceNumber: string;
  content: string;
  subscriberNumber: string;
}
