/**
 * @module Netgsm
 * @description Netgsm SMS API client implementation
 */

import { ApiErrorCode, OtpErrorCode } from "./enums";
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
} from "./types";

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

    return await this.handleResponse<RestSmsResponse>(response);
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

    const data = await response.json();

    // cancelSms için özel hata kontrolü
    if (data.code && data.code !== ApiErrorCode.SUCCESS && data.code !== "00") {
      throw {
        status: response.status !== 200 ? response.status : 406,
        code: data.code,
        jobid: data.jobid || null,
        description: data.description || "API Error",
      };
    }

    return data as CancelSmsResponse;
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

    return await this.handleResponse<ReportResponse>(response);
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

    return await this.handleResponse<HeaderQueryResponse>(response);
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

    return await this.handleResponse<SmsInboxResponse>(response);
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

  /**
   * Send OTP SMS
   * @param {OtpSmsPayload} payload - Payload for sending OTP SMS.
   * @returns {Promise<OtpSmsResponse>} - The API response.
   */
  async sendOtpSms(payload: OtpSmsPayload): Promise<OtpSmsResponse> {
    const xmlData = `<?xml version="1.0"?>
<mainbody>
   <header>
       <usercode>${this.config.username}</usercode>
       <password>${this.config.password}</password>
       <msgheader>${payload.msgheader}</msgheader>
   </header>
   <body>
       <msg><![CDATA[${payload.message}]]></msg>
       <no>${payload.no}</no>
   </body>
</mainbody>`;

    const response = await fetch(`${this.baseURL}/sms/send/otp`, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml",
      },
      body: xmlData,
    });

    const xmlText = await response.text();
    return this.parseOtpXmlResponse(xmlText);
  }

  /**
   * Parse XML response from OTP SMS API
   * @param {string} xmlText - XML response text
   * @returns {OtpSmsResponse} - Parsed response
   */
  private parseOtpXmlResponse(xmlText: string): OtpSmsResponse {
    const codeMatch = xmlText.match(/<code>(.*?)<\/code>/);
    const jobIdMatch = xmlText.match(/<jobID>(.*?)<\/jobID>/);
    const errorMatch = xmlText.match(/<error>(.*?)<\/error>/);

    const code = codeMatch ? codeMatch[1] : "";
    const jobid = jobIdMatch ? jobIdMatch[1] : undefined;
    const error = errorMatch ? errorMatch[1] : undefined;

    if (code !== OtpErrorCode.SUCCESS) {
      throw {
        status: 406,
        code,
        error,
      };
    }

    return {
      code,
      jobid,
      error,
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    // Successful report response case
    if (data.response?.job || data.jobid || response.status === 200) {
      return data as T;
    }

    // API error codes (30, 40, 60, 70, etc.)
    if (!data.response && data.code !== ApiErrorCode.SUCCESS) {
      // Throw object containing HTTP status and API error details
      const error = {
        status: response.status !== 200 ? response.status : 406,
        ...data,
      };
      throw error;
    }

    // HTTP error cases
    if (!response.ok) {
      const error = {
        status: response.status,
        code: response.statusText,
        description: "HTTP Error",
      };
      throw error;
    }

    return data as T;
  }
}

export default Netgsm;
