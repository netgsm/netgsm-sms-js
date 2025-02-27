/**
 * @module Netgsm
 * @description Netgsm SMS API client implementation
 */

import { ApiErrorCode } from "./enums";
import {
  NetgsmConfig,
  SmsPayload,
  ApiResponse,
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
   * @param {NetgsmConfig} config - Configuration object containing usercode and password.
   */
  constructor(private config: NetgsmConfig) {
    if (!config.userCode || !config.password) {
      throw new Error("UserCode and password are required");
    }
    const authToken = this.generateAuthToken(this.config.userCode, this.config.password);
    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${authToken}`,
    };

    // Eğer appName belirtilmişse, SDK için özel format oluştur
    if (config.appName) {
      this.sdkAppName = `${config.appName}-sdk-js`;
    }
  }

  /**
   * Generate Base64 encoded authorization token
   * @param {string} userCode - User code for authentication.
   * @param {string} password - Password for authentication.
   * @returns {string} - Base64 encoded token.
   */
  private generateAuthToken(userCode: string, password: string): string {
    if (typeof window !== "undefined" && typeof btoa === "function") {
      // Browser
      return btoa(`${userCode}:${password}`);
    } else {
      // Server
      return Buffer.from(`${userCode}:${password}`).toString("base64");
    }
  }

  /**
   * Send SMS using JSON payload.
   * @deprecated Use sendRestSms instead
   * @param {SmsPayload} payload - JSON payload for sending SMS.
   * @returns {Promise<ApiResponse>} - The API response.
   */
  async sendSms(payload: SmsPayload): Promise<ApiResponse> {
    const response = await fetch(`${this.baseURL}/sms/send/rest/v1`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        msgheader: payload.msgHeader,
        startdate: payload?.startDate,
        stopdate: payload?.stopDate,
        appname: payload?.appName,
        iysfilter: payload?.iysFilter,
        partnercode: payload?.partnerCode,
        encoding: payload?.encoding,
        messages: payload.messages.map((message) => ({
          msg: message.message,
          no: message.phone,
        })),
      }),
    });

    return await this.handleResponse<ApiResponse>(response);
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
        ...(payload?.startdate && { startdate: payload.startdate }), // startdate ekleme
        ...(payload?.stopdate && { stopdate: payload.stopdate }), // stopdate ekleme
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
   * Fetch SMS report based on provided parameters.
   * @deprecated Use getReport instead
   * @param {ReportPayload} payload - JSON payload for fetching SMS report.
   * @returns {Promise<ReportResponse>} - The API response containing report details.
   */
  async fetchSmsReport(payload: ReportPayload): Promise<ReportResponse> {
    const response = await fetch(`${this.baseURL}/sms/report`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        report: {
          usercode: this.config.userCode,
          password: this.config.password,
          bulkid: payload.bulkIds?.join(","),
          type: payload?.type,
          status: payload?.status,
          version: payload?.version,
          bastar: payload?.startDate,
          bittar: payload?.stopDate,
          appname: payload?.appName || this.sdkAppName,
        },
      }),
    });

    return await this.handleResponse<ReportResponse>(response);
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
        startdate: payload.startDate,
        stopdate: payload.stopDate,
        appname: payload?.appName || this.sdkAppName,
        pagenumber: payload?.pageNumber,
        pagesize: payload?.pageSize,
      }),
    });

    return await this.handleResponse<ReportResponse>(response);
  }

  /**
   * Query registered sender IDs/headers
   * @deprecated Use getHeaders instead
   * @param {HeaderQueryPayload} payload - Optional payload for the query
   * @returns {Promise<HeaderQueryResponse>} - The API response containing header details.
   */
  async queryHeaders(payload?: HeaderQueryPayload): Promise<HeaderQueryResponse> {
    const response = await fetch(`${this.baseURL}/sms/header`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        usercode: this.config.userCode,
        password: this.config.password,
        appname: payload?.appName || this.sdkAppName,
      }),
    });

    return await this.handleResponse<HeaderQueryResponse>(response);
  }

  /**
   * Get registered sender IDs/headers using REST v2 API
   * @param {HeaderQueryPayload} payload - Optional payload for the query
   * @returns {Promise<HeaderQueryResponse>} - The API response containing header details.
   */
  async getHeaders(payload?: HeaderQueryPayload): Promise<HeaderQueryResponse> {
    const url = new URL(`${this.baseURL}/sms/rest/v2/msgheader`);

    if (payload?.appName || this.sdkAppName) {
      url.searchParams.append("appname", payload?.appName || this.sdkAppName || "");
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

    if (payload?.appName || this.sdkAppName) {
      url.searchParams.append("appname", payload?.appName || this.sdkAppName || "");
    }

    if (payload?.startDate) {
      url.searchParams.append("startdate", payload.startDate);
    }

    if (payload?.stopDate) {
      url.searchParams.append("stopdate", payload.stopDate);
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
        usercode: this.config.userCode,
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
