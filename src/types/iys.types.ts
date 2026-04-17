import {
  IysAddressType,
  IysConsentStatus,
  IysRecipientType,
  IysSource,
} from "../enums/iys.enums";

export interface IysLoginResponse {
  success: boolean;
  errorCode: number;
  message: string;
  data: {
    access_token: string;
    profile: {
      userid: number;
      username: string;
      usercode: string;
      aboneno: string;
      aboneid: number;
      [key: string]: unknown;
    };
  };
}

export interface IysConsentQueryParams {
  brandCode: number;
  recipient: string;
  type?: IysAddressType;
  recipientType?: IysRecipientType;
  refId?: string;
}

export interface IysConsentItem {
  type: string;
  source: string;
  recipient: string;
  status: string;
  consentDate: string;
  recipientType: string;
  creationDate: string | null;
  queryStatus: string;
}

export interface IysConsentQueryResponse {
  success: boolean;
  errorCode: number;
  message: string;
  data: IysConsentItem[];
}

export interface IysPermission {
  recipient: string;
  recipientType: IysRecipientType;
  type: IysAddressType;
  source: IysSource;
  status: IysConsentStatus;
  consentDate: string;
  retailerCode?: number;
  retailerAccess?: number[];
}

export interface IysSaveConsentParams {
  brandCode: number;
  permissions: IysPermission[];
  refId?: string;
}

export interface IysSaveConsentResponse {
  success: boolean;
  errorCode: number;
  message: string;
  data: { uid: string };
}

export interface IysWebhookParams {
  brandCode: number;
  webhookUrl: string;
}

export interface IysWebhookResponse {
  success: boolean;
  errorCode: number;
  message: string;
  data: { uid: string };
}
