import { ApiErrorCode, BalanceType } from "./enums";

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
 * Payload for sending OTP SMS
 */
export interface OtpSmsPayload {
  msgheader: string; // Sender header (e.g., "MyBrand")
  message: string; // OTP message content (1 SMS length, no Turkish characters)
  no: string; // Recipient's phone number (format: 5XXXXXXXXX)
}

/**
 * API response structure for sending OTP SMS
 */
export interface OtpSmsResponse {
  code: string;
  jobid?: string;
  error?: string;
}
