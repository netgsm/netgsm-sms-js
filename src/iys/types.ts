export type RecipientType = 'BIREYSEL' | 'TACIR';
export type ConsentType = 'ARAMA' | 'MESAJ' | 'EPOSTA';
export type ConsentStatus = 'ONAY' | 'RET';
export type IysPath = 'SANTRAL' | 'SMSAPI' | 'WEBPORTAL';
export type ConsentSource =
  | 'HS_FIZIKSEL_ORTAM'
  | 'HS_ISLAK_IMZA'
  | 'HS_WEB'
  | 'HS_CAGRI_MERKEZI'
  | 'HS_SOSYAL_MEDYA'
  | 'HS_EPOSTA'
  | 'HS_MESAJ'
  | 'HS_MOBIL'
  | 'HS_EORTAM'
  | 'HS_ETKINLIK'
  | 'HS_2015'
  | 'HS_ATM'
  | 'HS_KARAR';

export interface ConsentRecord {
  /** '+90XXXXXXXXXX' or an e-mail address. */
  recipient: string;
  recipientType: RecipientType;
  type: ConsentType;
  source: ConsentSource;
  status: ConsentStatus;
  /** When the consent was given, 'YYYY-MM-DD HH:mm:ss' (see formatIysDate). */
  consentDate: string;
  retailerCode?: number | null;
  retailerAccess?: number[] | null;
}

export interface RejectedConsent {
  index: number;
  field: string;
  message: string;
}

export interface SaveConsentsResult {
  uid: string;
  /** Records rejected by İYS; `index` is the zero-based position in `permissions`. Empty when none. */
  rejected: RejectedConsent[];
  /** The X-Request-Id that was sent. */
  requestId: string;
}

export interface ConsentQuery {
  recipient: string;
  recipientType: RecipientType;
  type: ConsentType;
  refId?: string;
}

export interface Consent {
  type: string | null;
  source: string | null;
  recipient: string;
  status: string | null;
  consentDate: string | null;
  recipientType: string;
  /** Per-record result: 0 success, 81 not found, 120 bad request, 112 no answer from İYS. */
  errorCode: number;
  message: string | null;
}
