import type { SmsTransport } from './transport.js';
import type {
  BalanceListResponse,
  BalanceQuery,
  BalanceSummaryResponse,
  BlacklistQuery,
  BlacklistResponse,
  CancelRequest,
  CancelResponse,
  DefaultSenderChangeRequest,
  DefaultSenderResponse,
  DirectorySendRequest,
  DirectorySendResponse,
  InboxQuery,
  InboxResponse,
  LengthRequest,
  LengthResponse,
  OtpSendRequest,
  OtpSendResponse,
  ReportQuery,
  ReportResponse,
  SendersResponse,
  SmsSendRequest,
  SmsSendResponse,
  StatsQuery,
  StatsResponse,
  TemplateListResponse,
  TemplateQuery,
  TemplateSendRequest,
  WebhookRequest,
  WebhookResponse,
} from './types.js';

export interface SmsApiOptions {
  /** Sends `x-client: enterprise` on `sendOtp` (enterprise OTP accounts only). */
  enterpriseOtp: boolean;
}

/** Thin typed layer over {@link SmsTransport}: one method per SMS API v3 operation. */
export class SmsApi {
  readonly #transport: SmsTransport;
  readonly #options: SmsApiOptions;

  constructor(transport: SmsTransport, options: SmsApiOptions) {
    this.#transport = transport;
    this.#options = options;
  }

  send(req: SmsSendRequest): Promise<SmsSendResponse> {
    return this.#transport.request('POST', '/send', { body: req });
  }

  sendTemplate(req: TemplateSendRequest): Promise<SmsSendResponse> {
    return this.#transport.request('POST', '/send/template', { body: req });
  }

  sendOtp(req: OtpSendRequest): Promise<OtpSendResponse> {
    return this.#transport.request('POST', '/send/otp', {
      body: req,
      ...(this.#options.enterpriseOtp ? { headers: { 'x-client': 'enterprise' } } : {}),
    });
  }

  sendToDirectory(req: DirectorySendRequest): Promise<DirectorySendResponse> {
    return this.#transport.request('POST', '/directory/send', { body: req });
  }

  cancel(req: CancelRequest): Promise<CancelResponse> {
    return this.#transport.request('POST', '/cancel', { body: req });
  }

  getReport(q?: ReportQuery): Promise<ReportResponse> {
    return this.#transport.request('GET', '/report', { query: { ...q } });
  }

  getStats(q: StatsQuery): Promise<StatsResponse> {
    return this.#transport.request('GET', '/stats', { query: { ...q } });
  }

  getInbox(q?: InboxQuery): Promise<InboxResponse> {
    return this.#transport.request('GET', '/inbox', { query: { ...q } });
  }

  listSenders(): Promise<SendersResponse> {
    return this.#transport.request('GET', '/senders');
  }

  getDefaultSender(): Promise<DefaultSenderResponse> {
    return this.#transport.request('GET', '/senders/default');
  }

  setDefaultSender(req: DefaultSenderChangeRequest): Promise<DefaultSenderResponse> {
    return this.#transport.request('PUT', '/senders/default', { body: req });
  }

  registerReportWebhook(req: WebhookRequest): Promise<WebhookResponse> {
    return this.#transport.request('POST', '/webhooks/report', { body: req });
  }

  deleteReportWebhook(): Promise<void> {
    return this.#transport.request('DELETE', '/webhooks/report');
  }

  registerInboxWebhook(req: WebhookRequest): Promise<WebhookResponse> {
    return this.#transport.request('POST', '/webhooks/inbox', { body: req });
  }

  deleteInboxWebhook(): Promise<void> {
    return this.#transport.request('DELETE', '/webhooks/inbox');
  }

  getBlacklist(q?: BlacklistQuery): Promise<BlacklistResponse> {
    return this.#transport.request('GET', '/blacklist', { query: { ...q } });
  }

  measureLength(req: LengthRequest): Promise<LengthResponse> {
    return this.#transport.request('POST', '/length', { body: req });
  }

  listTemplates(q?: TemplateQuery): Promise<TemplateListResponse> {
    return this.#transport.request('GET', '/templates', { query: { ...q } });
  }

  getBalance(q: BalanceQuery & { stip: 2 }): Promise<BalanceSummaryResponse>;
  getBalance(q?: BalanceQuery): Promise<BalanceListResponse>;
  getBalance(q?: BalanceQuery): Promise<BalanceSummaryResponse | BalanceListResponse> {
    return this.#transport.request('GET', '/balance', { query: { ...q } });
  }
}
