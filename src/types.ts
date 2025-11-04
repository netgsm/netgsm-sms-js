import {
  ApiErrorCode,
  BalanceType,
  IysConsentType,
  IysRecipientType,
  IysSource,
  IysStatus,
} from "./enums";

/**
 * @module Types
 * @description Type definitions for Netgsm API
 */

/**
 * Configuration interface for Netgsm client
 */
export interface NetgsmConfig {
  /** Netgsm API username */
  username: string;
  /** Netgsm API password */
  password: string;
  /** Optional application name for tracking */
  appname?: string;
}

/**
 * Base payload interface for API requests
 */
export interface BasePayload {
  startdate?: string; // Start date (format: ddMMyyyyHHmmss)
  stopdate?: string; // End date (format: ddMMyyyyHHmmss)
  appname?: string; // Optional application key
}

/**
 * Payload for sending SMS via REST v2 API
 */
export interface RestSmsPayload {
  msgheader: string; // Sender header (e.g., "MyBrand")
  appname?: string; // Optional application key
  iysfilter?: string; // Message Management System filter
  partnercode?: string; // Partner code
  encoding?: string; // Message encoding type (e.g., "TR")
  startdate?: string; // Start date (format: ddMMyyyyHHmmss)
  stopdate?: string; // End date (format: ddMMyyyyHHmmss)
  messages: {
    msg: string; // SMS content
    no: string; // Recipient's phone number
  }[]; // Array of messages with their content and recipient details
}

/**
 * API error response structure
 */
export interface ApiError extends Error {
  status: number;
  statusText: string;
  code?: string;
  description?: string;
  headers?: Headers;
  url?: string;
}

/**
 * API response structure for sending SMS.
 */
export interface ApiResponse {
  code: ApiErrorCode;
  description?: string;
  jobid?: string;
}

/**
 * API response structure for sending SMS via REST v2 API.
 */
export interface RestSmsResponse {
  code: string;
  description: string;
  jobid?: string;
}

/**
 * Payload for fetching SMS reports via Netgsm API.
 */
export interface ReportPayload extends BasePayload {
  bulkIds?: string[]; // Bulk message ID(s), comma-separated if multiple
  pageNumber?: number; // Page number for pagination
  pageSize?: number; // Page size for pagination
}

/**
 * API response structure for fetching SMS reports.
 */
export interface ReportResponse {
  code?: string;
  description?: string;
  jobs?: {
    jobid: string; // Unique delivery ID
    number: string; // Recipient's phone number
    status: number; // Delivery status code
    operator: number; // Operator code
    msglen: number; // Message length
    deliveredDate?: string; // Date and time of delivery
    errorCode?: number; // Error code, if applicable
    referansID?: string; // Reference ID
  }[];
}

/**
 * Payload for querying sender IDs/headers
 */
export interface HeaderQueryPayload {
  appname?: string; // Optional application key
}

/**
 * Response type for header query
 */
export interface HeaderQueryResponse {
  msgheader?: string[]; // Array of registered sender IDs/headers
  code?: string;
  description?: string;
  msgheaders?: string[]; // Array of registered sender IDs/headers (v2 API)
}

/**
 * Payload for cancelling SMS
 */
export interface CancelSmsPayload {
  jobid: string; // Job ID of the SMS to cancel
  appname?: string; // Optional application key
}

/**
 * Response type for SMS cancellation
 */
export interface CancelSmsResponse {
  code: string;
  description: string;
  jobid?: string;
}

/**
 * Payload for querying inbox messages
 */
export interface SmsInboxPayload {
  appname?: string; // Optional application key
  startdate?: string; // Start date (format: ddMMyyyyHHmmss)
  stopdate?: string; // End date (format: ddMMyyyyHHmmss)
}

/**
 * Response type for inbox messages query
 */
export interface SmsInboxResponse {
  code: string;
  description: string;
  messages?: {
    message: string; // SMS message content
    sender: string; // Sender number
    receiver: string; // Recipient number
    datetime: string; // Send date and time
  }[];
}

export interface BalancePayload {
  stip: BalanceType; // Query type (PACKAGE or CREDIT)
  appkey?: string; // Optional: Application key
}

/**
 * API response structure for balance query
 * stip=1: Package/campaign information
 * stip=2: Credit information
 */
export interface BalanceResponse {
  code?: string;
  balance?:
    | string
    | Array<{
        amount: number;
        balance_name: string;
      }>;
}

/**
 * IYS recipient data structure
 */
export interface IysRecipient {
  type: IysConsentType | string;
  source: IysSource | string;
  recipient: string;
  status: IysStatus | string;
  consentDate: string; // Format: YYYY-MM-DD HH:mm:ss
  recipientType: IysRecipientType | string;
}

/**
 * Payload for adding IYS recipients
 */
export interface IysAddPayload {
  brandCode: string;
  refid?: string;
  data: IysRecipient[];
}

/**
 * Response for adding IYS recipients
 */
export interface IysAddResponse {
  code: string;
  error: string; // "false" on success
  uid?: string;
  erroritem?: {
    [key: string]: { [key: string]: string };
  };
}

/**
 * IYS recipient data structure for search
 */
export interface IysSearchRecipient {
  type: IysConsentType | string;
  recipient: string;
  recipientType: IysRecipientType | string;
  refid?: string;
}

/**
 * Payload for searching IYS recipients
 */
export interface IysSearchPayload {
  brandCode: string;
  data: IysSearchRecipient[];
}

/**
 * Response for searching IYS recipients
 */
export interface IysSearchResponse {
  code: string;
  error: string; // "false" on success
  query?: {
    consentDate: string;
    source: string;
    recipient: string;
    recipientType: IysRecipientType | string;
    type: IysConsentType | string;
    status: IysStatus | string;
    creationDate: string;
    retailerAccessCount: number;
    querystatus: string | null;
  };
}
