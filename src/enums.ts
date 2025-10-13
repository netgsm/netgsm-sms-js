/**
 * @module Enums
 * @description Netgsm SMS API enumerations
 */

/**
 * SMS status codes
 * @enum {number}
 */
export enum SmsStatus {
  /** Message pending */
  PENDING = 0,
  /** Message sent */
  SENT = 1,
  /** Message expired */
  EXPIRED = 2,
  /** Invalid or restricted number */
  INVALID_NUMBER = 3,
  /** Not sent to operator */
  NOT_SENT = 4,
  /** Message rejected */
  REJECTED = 11,
  /** Delivery error */
  DELIVERY_ERROR = 12,
  /** Duplicate message */
  DUPLICATE = 13,
  /** Blacklisted number */
  BLACKLISTED = 14,
  /** IYS rejected */
  IYS_REJECTED = 16,
  /** IYS error */
  IYS_ERROR = 17,
  /** All messages */
  ALL = 100,
}

/**
 * API error codes
 * @enum {string}
 */
export enum ApiErrorCode {
  /** Success */
  SUCCESS = "00",
  /** Invalid username, password or API access */
  INVALID_AUTH = "30",
  /** Invalid header */
  INVALID_HEADER = "40",
  /** Insufficient balance/credit */
  INSUFFICIENT_BALANCE = "50",
  /** System error */
  SYSTEM_ERROR = "51",
  /** Parameter error */
  PARAMETER_ERROR = "70",
  /** Invalid date format */
  INVALID_DATE = "80",
  /** Time error */
  TIME_ERROR = "85",
  /** SMS cancellation error */
  CANCEL_ERROR = "60",
}

/**
 * Balance query type codes
 * @enum {number}
 */
export enum BalanceType {
  /** Package/campaign information */
  PACKAGE = 1,
  /** Credit information */
  CREDIT = 2,
}

/**
 * Operator codes
 * @enum {number}
 */
export enum OperatorCode {
  /** Vodafone */
  VODAFONE = 10,
  /** Türk Telekom */
  TURK_TELEKOM = 20,
  /** Turkcell */
  TURKCELL = 30,
  /** Netgsm STH */
  NETGSM_STH = 40,
  /** Netgsm Mobil */
  NETGSM_MOBIL = 41,
  /** Türktelekom Sabit */
  TURKTELEKOM_SABIT = 60,
  /** Tanımsız Operator */
  TANIMSIZ = 70,
  /** KKTC Vodafone */
  KKTC_VODAFONE = 160,
  /** Yurtdışı */
  YURTDISI_1 = 212,
  /** Yurtdışı */
  YURTDISI_2 = 213,
  /** Yurtdışı */
  YURTDISI_3 = 214,
  /** Yurtdışı */
  YURTDISI_4 = 215,
  /** KKTC Turkcell */
  KKTC_TURKCELL = 880,
}

/**
 * OTP SMS error codes
 * @enum {string}
 */
export enum OtpErrorCode {
  /** Success */
  SUCCESS = "0",
  /** Message text or message size error */
  MESSAGE_ERROR = "20",
  /** Invalid username, password or no API access */
  INVALID_AUTH = "30",
  /** Invalid sender name */
  INVALID_HEADER = "40",
  /** Invalid sender name (alternative) */
  INVALID_HEADER_ALT = "41",
  /** Invalid phone number */
  INVALID_NUMBER = "50",
  /** No OTP SMS Package defined in account */
  NO_OTP_PACKAGE = "60",
  /** Input parameter error */
  PARAMETER_ERROR = "70",
  /** Query limit exceeded (100 per minute) */
  RATE_LIMIT = "80",
  /** System error */
  SYSTEM_ERROR = "100",
}
