import { NetgsmClient } from "../client";
import { IYS_BASE_URL } from "../constants";
import { IysClientType, IysPath } from "../enums/iys.enums";
import {
  IysConsentQueryParams,
  IysConsentQueryResponse,
  IysLoginResponse,
  IysSaveConsentParams,
  IysSaveConsentResponse,
  IysWebhookParams,
  IysWebhookResponse,
} from "../types/iys.types";

export class IysModule extends NetgsmClient {
  private accessToken: string | null = null;

  private async login(): Promise<void> {
    const response = await fetch(`${IYS_BASE_URL}/iys/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientType: IysClientType.API,
        username: this.config.username,
        password: this.config.password,
      }),
    });

    let data: IysLoginResponse;
    try {
      data = await response.json();
    } catch {
      throw { code: "PARSE_ERROR", description: "Failed to parse IYS login response" };
    }

    if (!data.success) {
      throw { code: data.errorCode, description: data.message };
    }

    this.accessToken = data.data.access_token;
  }

  private async iysRequest<T>(
    method: "GET" | "POST",
    path: string,
    options: { body?: object; params?: Record<string, string> } = {},
    isRetry = false
  ): Promise<T> {
    if (!this.accessToken) {
      await this.login();
    }

    const url = new URL(`${IYS_BASE_URL}${path}`);
    if (options.params) {
      Object.entries(options.params).forEach(([k, v]) => url.searchParams.set(k, v));
    }

    const response = await fetch(url.toString(), {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (response.status === 401 && !isRetry) {
      this.accessToken = null;
      await this.login();
      return this.iysRequest<T>(method, path, options, true);
    }

    const data = await response.json();

    if (!data.success) {
      throw { code: data.errorCode, description: data.message };
    }

    return data as T;
  }

  async queryConsent(params: IysConsentQueryParams): Promise<IysConsentQueryResponse> {
    const queryParams: Record<string, string> = {
      brandCode: String(params.brandCode),
      recipient: params.recipient,
      path: IysPath.SMSAPI,
    };

    if (params.type) queryParams.type = params.type;
    if (params.recipientType) queryParams.recipientType = params.recipientType;
    if (params.refId) queryParams.refId = params.refId;

    return this.iysRequest<IysConsentQueryResponse>("GET", "/iys/v1/consents", {
      params: queryParams,
    });
  }

  async saveConsents(params: IysSaveConsentParams): Promise<IysSaveConsentResponse> {
    return this.iysRequest<IysSaveConsentResponse>("POST", "/iys/v1/consents", {
      body: { ...params, path: IysPath.SMSAPI },
    });
  }

  async setWebhook(params: IysWebhookParams): Promise<IysWebhookResponse> {
    return this.iysRequest<IysWebhookResponse>("POST", "/iys/v1/webhooks", {
      body: { ...params, path: IysPath.SMSAPI },
    });
  }
}
