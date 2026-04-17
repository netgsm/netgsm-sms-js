/**
 * @module Netgsm
 * @description Netgsm API client
 */

import { NetgsmConfig } from "./types";
import { SmsModule } from "./modules/sms";
import { IysModule } from "./modules/iys";
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
} from "./types";

/**
 * Netgsm API Client
 *
 * @example
 * ```ts
 * const netgsm = new Netgsm({ username: "...", password: "..." });
 *
 * // New modular API:
 * await netgsm.sms.send({ ... });
 * await netgsm.iys.saveConsents({ ... });
 * ```
 */
class Netgsm {
  /** SMS operations: send, sendOtp, cancel, getReport, getStats, getHeaders, getInbox, checkBalance */
  readonly sms: SmsModule;

  /** IYS consent management operations */
  readonly iys: IysModule;

  constructor(config: NetgsmConfig) {
    this.sms = new SmsModule(config);
    this.iys = new IysModule(config);
  }

  // -------------------------------------------------------------------------
  // Deprecated methods — kept for backward compatibility
  // -------------------------------------------------------------------------

  /**
   * @deprecated Use `netgsm.sms.send()` instead
   */
  async sendRestSms(payload: RestSmsPayload): Promise<RestSmsResponse> {
    return this.sms.send(payload);
  }

  /**
   * @deprecated Use `netgsm.sms.sendOtp()` instead
   */
  async sendOtpSms(payload: OtpSmsPayload): Promise<OtpSmsResponse> {
    return this.sms.sendOtp(payload);
  }

  /**
   * @deprecated Use `netgsm.sms.cancel()` instead
   */
  async cancelSms(payload: CancelSmsPayload): Promise<CancelSmsResponse> {
    return this.sms.cancel(payload);
  }

  /**
   * @deprecated Use `netgsm.sms.getReport()` instead
   */
  async getReport(payload: ReportPayload): Promise<ReportResponse> {
    return this.sms.getReport(payload);
  }

  /**
   * @deprecated Use `netgsm.sms.getStats()` instead
   */
  async getStats(payload: StatsPayload): Promise<StatsResponse> {
    return this.sms.getStats(payload);
  }

  /**
   * @deprecated Use `netgsm.sms.getHeaders()` instead
   */
  async getHeaders(payload?: HeaderQueryPayload): Promise<HeaderQueryResponse> {
    return this.sms.getHeaders(payload);
  }

  /**
   * @deprecated Use `netgsm.sms.getInbox()` instead
   */
  async getInbox(payload?: SmsInboxPayload): Promise<SmsInboxResponse> {
    return this.sms.getInbox(payload);
  }

  /**
   * @deprecated Use `netgsm.sms.checkBalance()` instead
   */
  async checkBalance(payload: BalancePayload): Promise<BalanceResponse> {
    return this.sms.checkBalance(payload);
  }
}

export default Netgsm;
