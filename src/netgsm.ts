/**
 * @module Netgsm
 * @description Netgsm SMS API client implementation
 */

import {
  SendSmsErrorCode,
  SendOtpSmsErrorCode,
  CancelErrorCode,
  ReportErrorCode,
  StatsErrorCode,
  MsgHeaderErrorCode,
  InboxErrorCode,
} from "./enums";
import {
  NetgsmConfig,
  ReportPayload,
  ReportResponse,
  HeaderQueryResponse,
  HeaderQueryPayload,
  BalanceResponse,
  BalancePayload,
  CancelSmsPayload,
  CancelSmsResponse,
  SmsInboxResponse,
  SmsInboxPayload,
  RestSmsPayload,
  RestSmsResponse,
  OtpSmsPayload,
  OtpSmsResponse,
  StatsPayload,
  StatsResponse,
} from "./types";

/**
 * Validates if a code exists in an enum, returns "5000" if not found
 * @param code - The code to validate
 * @param enumObj - The enum object to check against (optional)
 * @returns Valid code or "5000" for undefined errors
 */
function normalizeErrorCode(code: string | undefined | null, enumObj?: object): string {
  if (!code || typeof code !== "string") {
    return "5000";
  }

  // If enum provided, check if code exists in enum values
  if (enumObj && !Object.values(enumObj).includes(code)) {
    return "5000";
  }

  return code;
}

/**
 * Netgsm API Client
 *
 * Provides methods to interact with Netgsm's REST API for sending SMS.
 */
class Netgsm {
  private baseURL = "https://api.netgsm.com.tr";
  private headers: HeadersInit;
  private sdkAppName?: string;

  /**
   * Initialize the Netgsm client.
   * @param {NetgsmConfig} config - Configuration object containing username and password.
   */
  constructor(private config: NetgsmConfig) {
    if (!config.username || !config.password) {
      throw new Error("Username and password are required");
    }
    const authToken = this.generateAuthToken(this.config.username, this.config.password);
    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${authToken}`,
    };

    // Eğer appname belirtilmişse, SDK için özel format oluştur
    if (config.appname) {
      this.sdkAppName = `${config.appname}-sdk-js`;
    }
  }

  /**
   * Generate Base64 encoded authorization token
   * @param {string} username - Username for authentication.
   * @param {string} password - Password for authentication.
   * @returns {string} - Base64 encoded token.
   */
  private generateAuthToken(username: string, password: string): string {
    if (typeof window !== "undefined" && typeof btoa === "function") {
      // Browser
      return btoa(`${username}:${password}`);
    } else {
      // Server
      return Buffer.from(`${username}:${password}`).toString("base64");
    }
  }

  /**
   * Send SMS using REST v2 API
   * @param {RestSmsPayload} payload - JSON payload for sending SMS.
   * @returns {Promise<RestSmsResponse>} - The API response.
   */
  async sendRestSms(payload: RestSmsPayload): Promise<RestSmsResponse> {
    const response = await fetch(`${this.baseURL}/sms/rest/v2/send`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        msgheader: payload.msgheader,
        ...(payload?.appname
          ? { appname: payload.appname }
          : this.sdkAppName
            ? { appname: this.sdkAppName }
            : {}),
        ...(payload?.iysfilter && { iysfilter: payload.iysfilter }),
        ...(payload?.partnercode && { partnercode: payload.partnercode }),
        ...(payload?.encoding && { encoding: payload.encoding }),
        messages: payload.messages,
        ...(payload?.startdate && { startdate: payload.startdate }),
        ...(payload?.stopdate && { stopdate: payload.stopdate }),
      }),
    });

    return await this.handleResponse<RestSmsResponse>(response, SendSmsErrorCode);
  }

  /**
   * Send OTP SMS using REST v2 API
   * @param {OtpSmsPayload} payload - JSON payload for sending OTP SMS.
   * @returns {Promise<OtpSmsResponse>} - The API response.
   */
  async sendOtpSms(payload: OtpSmsPayload): Promise<OtpSmsResponse> {
    const response = await fetch(`${this.baseURL}/sms/rest/v2/otp`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        msgheader: payload.msgheader,
        ...(payload?.appname
          ? { appname: payload.appname }
          : this.sdkAppName
            ? { appname: this.sdkAppName }
            : {}),
        msg: payload.msg,
        no: payload.no,
      }),
    });

    return await this.handleResponse<OtpSmsResponse>(response, SendOtpSmsErrorCode);
  }

  /**
   * Cancel a scheduled SMS
   * @param {CancelSmsPayload} payload - JSON payload for cancelling SMS.
   * @returns {Promise<CancelSmsResponse>} - The API response.
   */
  async cancelSms(payload: CancelSmsPayload): Promise<CancelSmsResponse> {
    const response = await fetch(`${this.baseURL}/sms/rest/v2/cancel`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        jobid: payload.jobid,
        ...(payload?.appname
          ? { appname: payload.appname }
          : this.sdkAppName
            ? { appname: this.sdkAppName }
            : {}),
      }),
    });

    return await this.handleResponse<CancelSmsResponse>(response, CancelErrorCode);
  }

  /**
   * Get SMS report using REST v2 API
   * @param {ReportPayload} payload - JSON payload for fetching SMS report.
   * @returns {Promise<ReportResponse>} - The API response containing report details.
   */
  async getReport(payload: ReportPayload): Promise<ReportResponse> {
    const response = await fetch(`${this.baseURL}/sms/rest/v2/report`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        jobids: payload.bulkIds,
        startdate: payload.startdate,
        stopdate: payload.stopdate,
        appname: payload?.appname || this.sdkAppName,
        pagenumber: payload?.pageNumber,
        pagesize: payload?.pageSize,
      }),
    });

    return await this.handleResponse<ReportResponse>(response, ReportErrorCode);
  }

  /**
   * Get SMS statistics using REST v2 API
   * @param {StatsPayload} payload - JSON payload for fetching SMS report.
   * @returns {Promise<StatsResponse>} - The API response containing report details.
   */
  async getStats(payload: StatsPayload): Promise<StatsResponse> {
    const response = await fetch(`${this.baseURL}/sms/rest/v2/stats`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        jobid: payload.jobid,
        sendDate: payload?.senddate,
        appname: payload?.appname || this.sdkAppName,
      }),
    });

    return await this.handleResponse<StatsResponse>(response, StatsErrorCode);
  }

  /**
   * Get registered sender IDs/headers using REST v2 API
   * @param {HeaderQueryPayload} payload - Optional payload for the query
   * @returns {Promise<HeaderQueryResponse>} - The API response containing header details.
   */
  async getHeaders(payload?: HeaderQueryPayload): Promise<HeaderQueryResponse> {
    const url = new URL(`${this.baseURL}/sms/rest/v2/msgheader`);

    if (payload?.appname || this.sdkAppName) {
      url.searchParams.append("appname", payload?.appname || this.sdkAppName || "");
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.headers,
    });

    return await this.handleResponse<HeaderQueryResponse>(response, MsgHeaderErrorCode);
  }

  /**
   * Get inbox messages
   * @param {SmsInboxPayload} payload - Optional payload for the query
   * @returns {Promise<SmsInboxResponse>} - The API response containing inbox messages.
   */
  async getInbox(payload?: SmsInboxPayload): Promise<SmsInboxResponse> {
    const url = new URL(`${this.baseURL}/sms/rest/v2/inbox`);

    if (payload?.appname || this.sdkAppName) {
      url.searchParams.append("appname", payload?.appname || this.sdkAppName || "");
    }

    if (payload?.startdate) {
      url.searchParams.append("startdate", payload.startdate);
    }

    if (payload?.stopdate) {
      url.searchParams.append("stopdate", payload.stopdate);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.headers,
    });

    return await this.handleResponse<SmsInboxResponse>(response, InboxErrorCode);
  }

  /**
   * Checks balance/package information
   * @param payload Balance query parameters
   * @returns Balance information
   */
  async checkBalance(payload: BalancePayload): Promise<BalanceResponse> {
    const url = `${this.baseURL}/balance`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usercode: this.config.username,
        password: this.config.password,
        stip: payload.stip,
        ...(payload?.appkey && { appkey: payload.appkey }),
      }),
    });

    const data = await response.json();

    if (response.status !== 200) {
      throw {
        status: response.status,
        ...data,
      };
    }

    return data;
  }

  private async handleResponse<T>(response: Response, errorCodeEnum?: object): Promise<T> {
    // Try to parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (error) {
      // If JSON parsing fails, throw HTTP error
      throw {
        status: response.status,
        code: "PARSE_ERROR",
        description: `Failed to parse JSON response: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }

    // Check if response is success status
    if (response.status === 200 || response.status === 406) {
      // Validate data structure
      if (typeof data !== "object" || data === null) {
        throw {
          status: response.status,
          code: "INVALID_RESPONSE",
          description: "Response is not a valid object",
        };
      }

      // Normalize error code - if code is missing or not in enum, set to "5000"
      data.code = normalizeErrorCode(data.code, errorCodeEnum);

      // Check if API returned an error code
      if (data.code !== "00") {
        throw {
          status: response.status !== 200 ? response.status : 406,
          ...data,
        };
      }

      // Success case
      return data as T;
    }

    // HTTP error cases (non-200/406 status codes)
    throw {
      status: response.status,
      code: normalizeErrorCode(data?.code, errorCodeEnum) || response.statusText,
      description: data?.description || "HTTP Error",
    };
  }
}

export default Netgsm;
