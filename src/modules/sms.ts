/**
 * @module SmsModule
 * @description SMS operations for the Netgsm API
 */

import {
  SendSmsErrorCode,
  SendOtpSmsErrorCode,
  CancelErrorCode,
  ReportErrorCode,
  StatsErrorCode,
  MsgHeaderErrorCode,
  InboxErrorCode,
} from "../enums";
import {
  RestSmsPayload,
  RestSmsResponse,
  OtpSmsPayload,
  OtpSmsResponse,
  CancelSmsPayload,
  CancelSmsResponse,
  ReportPayload,
  ReportResponse,
  StatsPayload,
  StatsResponse,
  HeaderQueryPayload,
  HeaderQueryResponse,
  SmsInboxPayload,
  SmsInboxResponse,
  BalancePayload,
  BalanceResponse,
} from "../types";
import { NetgsmClient } from "../client";

/**
 * Handles all SMS-related operations: sending, reporting, inbox, headers and balance.
 */
export class SmsModule extends NetgsmClient {
  /**
   * Send SMS via REST v2 API
   */
  async send(payload: RestSmsPayload): Promise<RestSmsResponse> {
    return this.post<RestSmsResponse>(
      "/sms/rest/v2/send",
      {
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
      },
      SendSmsErrorCode
    );
  }

  /**
   * Send OTP SMS via REST v2 API
   */
  async sendOtp(payload: OtpSmsPayload): Promise<OtpSmsResponse> {
    return this.post<OtpSmsResponse>(
      "/sms/rest/v2/otp",
      {
        msgheader: payload.msgheader,
        ...(payload?.appname
          ? { appname: payload.appname }
          : this.sdkAppName
            ? { appname: this.sdkAppName }
            : {}),
        msg: payload.msg,
        no: payload.no,
      },
      SendOtpSmsErrorCode
    );
  }

  /**
   * Cancel a scheduled SMS
   */
  async cancel(payload: CancelSmsPayload): Promise<CancelSmsResponse> {
    return this.post<CancelSmsResponse>(
      "/sms/rest/v2/cancel",
      {
        jobid: payload.jobid,
        ...(payload?.appname
          ? { appname: payload.appname }
          : this.sdkAppName
            ? { appname: this.sdkAppName }
            : {}),
      },
      CancelErrorCode
    );
  }

  /**
   * Get SMS delivery report
   */
  async getReport(payload: ReportPayload): Promise<ReportResponse> {
    return this.post<ReportResponse>(
      "/sms/rest/v2/report",
      {
        jobids: payload.bulkIds,
        startdate: payload.startdate,
        stopdate: payload.stopdate,
        appname: payload?.appname || this.sdkAppName,
        pagenumber: payload?.pageNumber,
        pagesize: payload?.pageSize,
      },
      ReportErrorCode
    );
  }

  /**
   * Get SMS statistics
   */
  async getStats(payload: StatsPayload): Promise<StatsResponse> {
    return this.post<StatsResponse>(
      "/sms/rest/v2/stats",
      {
        jobid: payload.jobid,
        sendDate: payload?.senddate,
        appname: payload?.appname || this.sdkAppName,
      },
      StatsErrorCode
    );
  }

  /**
   * Get registered sender headers
   */
  async getHeaders(payload?: HeaderQueryPayload): Promise<HeaderQueryResponse> {
    const params: Record<string, string> = {};
    const appname = payload?.appname || this.sdkAppName;
    if (appname) params.appname = appname;

    return this.get<HeaderQueryResponse>("/sms/rest/v2/msgheader", params, MsgHeaderErrorCode);
  }

  /**
   * Get inbox messages
   */
  async getInbox(payload?: SmsInboxPayload): Promise<SmsInboxResponse> {
    const params: Record<string, string> = {};
    const appname = payload?.appname || this.sdkAppName;
    if (appname) params.appname = appname;
    if (payload?.startdate) params.startdate = payload.startdate;
    if (payload?.stopdate) params.stopdate = payload.stopdate;

    return this.get<SmsInboxResponse>("/sms/rest/v2/inbox", params, InboxErrorCode);
  }

  /**
   * Check SMS credit or package balance
   */
  async checkBalance(payload: BalancePayload): Promise<BalanceResponse> {
    const response = await fetch(`${this.baseURL}/balance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usercode: this.config.username,
        password: this.config.password,
        stip: payload.stip,
        ...(payload?.appkey && { appkey: payload.appkey }),
      }),
    });

    const data = await response.json();

    if (response.status !== 200) {
      throw { status: response.status, ...data };
    }

    return data;
  }
}
