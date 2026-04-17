/**
 * @module SmsTypes
 * @description Type definitions for Netgsm SMS API
 */

import {
  SendSmsErrorCode,
  SendOtpSmsErrorCode,
  ReportErrorCode,
  CancelErrorCode,
  InboxErrorCode,
  MsgHeaderErrorCode,
  BalanceType,
  BalanceErrorCode,
  StatsErrorCode,
} from "../enums";

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
  }[];
}

/**
 * Payload for sending OTP SMS via REST v2 API
 */
export interface OtpSmsPayload {
  msgheader: string; // Sender header (e.g., "MyBrand")
  appname?: string; // Optional application key
  msg: string; // SMS content
  no: string; // Recipient's phone number
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
 * API response structure for sending SMS via REST v2 API
 */
export interface RestSmsResponse {
  code: SendSmsErrorCode;
  description: string;
  jobid?: string;
}

/**
 * API response structure for sending OTP SMS via REST v2 API
 */
export interface OtpSmsResponse {
  code: SendOtpSmsErrorCode;
  description: string;
  jobId?: string;
}

/**
 * Payload for fetching SMS reports
 */
export interface ReportPayload extends BasePayload {
  bulkIds?: string[];
  pageNumber?: number;
  pageSize?: number;
}

/**
 * API response structure for fetching SMS reports
 */
export interface ReportResponse {
  code?: ReportErrorCode;
  description?: string;
  jobs?: {
    jobid: string;
    number: string;
    status: number;
    operator: number;
    msglen: number;
    deliveredDate?: string;
    errorCode?: number;
    referansID?: string;
  }[];
}

/**
 * Payload for querying SMS statistics
 */
export interface StatsPayload {
  jobid: string;
  senddate?: string;
  appname?: string;
}

/**
 * API response structure for SMS statistics
 */
export interface StatsResponse {
  code?: StatsErrorCode;
  description: string;
  stats?: {
    status: string;
    totalMessageLength: number;
    totalSms: number;
    chargeStatement: string;
    statement: string;
    domestic: true;
  }[];
}

/**
 * Payload for querying sender headers
 */
export interface HeaderQueryPayload {
  appname?: string;
}

/**
 * Response type for header query
 */
export interface HeaderQueryResponse {
  msgheader?: string[];
  code?: MsgHeaderErrorCode;
  description?: string;
  msgheaders?: string[];
}

/**
 * Payload for cancelling a scheduled SMS
 */
export interface CancelSmsPayload {
  jobid: string;
  appname?: string;
}

/**
 * Response type for SMS cancellation
 */
export interface CancelSmsResponse {
  code: CancelErrorCode;
  description: string;
  jobid?: string;
}

/**
 * Payload for querying inbox messages
 */
export interface SmsInboxPayload {
  appname?: string;
  startdate?: string;
  stopdate?: string;
}

/**
 * Response type for inbox messages query
 */
export interface SmsInboxResponse {
  code: InboxErrorCode;
  description: string;
  messages?: {
    message: string;
    sender: string;
    receiver: string;
    datetime: string;
  }[];
}

/**
 * Payload for balance query
 */
export interface BalancePayload {
  stip: BalanceType;
  appkey?: string;
}

/**
 * API response structure for balance query
 */
export interface BalanceResponse {
  code?: BalanceErrorCode;
  balance?:
    | string
    | Array<{
        amount: number;
        balance_name: string;
      }>;
}
