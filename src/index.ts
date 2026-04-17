/**
 * @module @netgsm/sms
 * @description Netgsm SMS API client for Node.js
 */

import {
  ApiErrorCode,
  BalanceType,
  OperatorCode,
  SmsStatus,
  SendSmsErrorCode,
  SendOtpSmsErrorCode,
  StatsErrorCode,
  InboxErrorCode,
  ReportErrorCode,
  MsgHeaderErrorCode,
  CancelErrorCode,
  IysRecipientType,
  IysAddressType,
  IysConsentStatus,
  IysSource,
} from "./enums";
import Netgsm from "./netgsm";
import { SmsModule } from "./modules/sms";
import { IysModule } from "./modules/iys";

export { Netgsm, SmsModule, IysModule };
export default Netgsm;

// Export all types
export * from "./types";

// Export all enums
export {
  ApiErrorCode,
  BalanceType,
  OperatorCode,
  SmsStatus,
  SendSmsErrorCode,
  SendOtpSmsErrorCode,
  StatsErrorCode,
  InboxErrorCode,
  ReportErrorCode,
  MsgHeaderErrorCode,
  CancelErrorCode,
  IysRecipientType,
  IysAddressType,
  IysConsentStatus,
  IysSource,
};
