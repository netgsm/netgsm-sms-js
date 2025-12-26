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
  /** Insuficient credit */
  INSUFFICIENT_BALANCE = 14,  
  /** Blacklisted number */
  BLACKLISTED = 15,
  /** IYS rejected */
  IYS_REJECTED = 16,
  /** IYS error */
  IYS_ERROR = 17,
  /** All messages */
  ALL = 100,
}

/**
 * /sms/rest/v2/send API error codes
 * @enum {string}
 */
export enum SendSmsErrorCode {
  /** Operation successful */
  SUCCESS = "00",
  /** Could not be sent due to a problem in the message text or exceeded the standard maximum message character count */
  MESSAGE_TEXT_ERROR = "20",
  /** Invalid username, password or no API access. If IP restriction exists, request may have been made from an unauthorized IP */
  INVALID_AUTH = "30",
  /** Message header (sender name) is not defined in the system */
  INVALID_HEADER = "40",
  /** IYS controlled submissions cannot be made with your subscriber account */
  IYS_CONTROLLED = "50",
  /** No IYS Brand information found for your subscription */
  NO_IYS_BRAND = "51",
  /** Invalid query. One of the parameters is incorrect or a required field is missing */
  PARAMETER_ERROR = "70",
  /** Sending rate limit exceeded */
  SENDING_RATE_LIMIT_EXCEEDED = "80",
  /** Duplicate sending rate limit exceeded. Cannot create more than 20 tasks for the same number within 1 minute */
  DUPLICATE_RATE_LIMIT_EXCEEDED = "85",
  /** System error */
  SYSTEM_ERROR_100 = "100",
  /** System error */
  SYSTEM_ERROR_101 = "101",
  /** Undefined error */
  UNDEFINED_ERROR = "5000",
}

/**
 * /sms/rest/v2/otp API error codes
 * @enum {string}
 */
export enum SendOtpSmsErrorCode {
  /** Operation successful */
  SUCCESS = "00",
  /** Could not be sent due to a problem in the message text or exceeded the standard maximum message character count */
  MESSAGE_TEXT_ERROR = "20",
  /** Invalid username, password or no API access. If IP restriction exists, request may have been made from an unauthorized IP */
  INVALID_AUTH = "30",
  /** Message header (sender name) is not defined in the system */
  UNDEFINED_HEADER = "40",
  /** Message header (sender name) is not valid in the system */
  INVALID_HEADER = "41",
  /** Check for Number */
  CHECK_NUMBER_50 = "50",
  /** Check for Number */
  CHECK_NUMBER_51 = "51",
  /** Check for Number */
  CHECK_NUMBER_52 = "52",
  /** No Credit for OTP */
  NO_CREDIT = "60",
  /** Invalid query. One of the parameters is incorrect or a required field is missing */
  PARAMETER_ERROR = "70",
  /** System error */
  SYSTEM_ERROR_100 = "100",
  /** System error */
  SYSTEM_ERROR_101 = "101",
  /** Undefined error */
  UNDEFINED_ERROR = "5000",
}

/**
 * /sms/rest/v2/inbox API error codes
 * @enum {string}
 */
export enum InboxErrorCode {
  /** Operation successful */
  SUCCESS = "00",
  /** Invalid username, password or no API access. If IP restriction exists, request may have been made from an unauthorized IP */
  INVALID_AUTH = "30",
  /** Indicates that you have no messages to display. If you are not using the startdate and stopdate parameters, you can only list your messages once with the API. Listed messages will not appear in your other queries. */
  NO_MESSAGES = "40",
  /** Invalid query. One of the parameters is incorrect or a required field is missing */
  PARAMETER_ERROR = "70",
  /** System error */
  SYSTEM_ERROR_100 = "100",
  /** System error */
  SYSTEM_ERROR_101 = "101",
  /** Undefined error */
  UNDEFINED_ERROR = "5000",
}

/**
 * /sms/rest/v2/report API error codes
 * @enum {string}
 */
export enum ReportErrorCode {
  /** Operation successful */
  SUCCESS = "00",
  /** Invalid username, password or no API access. If IP restriction exists, request may have been made from an unauthorized IP */
  INVALID_AUTH = "30",
  /** Indicates that there are no records to be listed according to your search criteria. */
  NO_RECORDS = "60",
  /** Invalid query. One of the parameters is incorrect or a required field is missing */
  PARAMETER_ERROR = "70",
  /** Limit exceeded, can be queried 10 times per minute. */
  RATE_LIMIT_EXCEEDED = "80",
  /** System error */
  SYSTEM_ERROR_100 = "100",
  /** System error */
  SYSTEM_ERROR_110 = "110",
  /** Undefined error */
  UNDEFINED_ERROR = "5000",
}

/**
 * /sms/rest/v2/stats API error codes
 * @enum {string}
 */
export enum StatsErrorCode {
  /** Operation successful */
  SUCCESS = "00",
  /** Invalid username, password or no API access. If IP restriction exists, request may have been made from an unauthorized IP */
  INVALID_AUTH = "30",
  /** Invalid query. One of the parameters is incorrect or a required field is missing */
  PARAMETER_ERROR = "70",
  /** Undefined error */
  UNDEFINED_ERROR = "5000",
}

/**
 * /sms/rest/v2/balance API error codes
 * @enum {string}
 */
export enum BalanceErrorCode {
  /** Operation successful */
  SUCCESS = "00",
  /** Invalid username, password or no API access. If IP restriction exists, request may have been made from an unauthorized IP */
  INVALID_AUTH = "30",
  /** Indicates that there are no records to be listed according to your search criteria. */
  NO_RECORDS = "60",
  /** Invalid query. One of the parameters is incorrect or a required field is missing */
  PARAMETER_ERROR = "70",
  /** Undefined error */
  UNDEFINED_ERROR = "5000",
}

/**
 * /sms/rest/v2/msgheader API error codes
 * @enum {string}
 */
export enum MsgHeaderErrorCode {
  /** Operation successful */
  SUCCESS = "00",
  /** Invalid username, password or no API access. If IP restriction exists, request may have been made from an unauthorized IP */
  INVALID_AUTH = "30",
  /** Invalid query. One of the parameters is incorrect or a required field is missing */
  PARAMETER_ERROR = "70",
  /** System error */
  SYSTEM_ERROR_100 = "100",
  /** System error */
  SYSTEM_ERROR_101 = "101",
  /** Undefined error */
  UNDEFINED_ERROR = "5000",
}

/**
 * /sms/rest/v2/cancel API error codes
 * @enum {string}
 */
export enum CancelErrorCode {
  /** Operation successful */
  SUCCESS = "00",
  /** Invalid username, password or no API access. If IP restriction exists, request may have been made from an unauthorized IP */
  INVALID_AUTH = "30",
  /** Specified JobID not found */
  JOB_ID_NOT_FOUND = "60",
  /** Invalid query. One of the parameters is incorrect or a required field is missing */
  PARAMETER_ERROR = "70",
  /** System error */
  SYSTEM_ERROR_100 = "100",
  /** System error */
  SYSTEM_ERROR_101 = "101",
  /** Undefined error */
  UNDEFINED_ERROR = "5000",
}

/**
 * @deprecated Use SendSmsErrorCode, or other specific error code enums instead
 * Legacy API error codes enum - kept for backward compatibility
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
  /** Credit and Package/campaign informations */
  ALLASSETS = 3,
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
