/**
 * @module NetgsmClient
 * @description Base HTTP client for Netgsm API
 */

import { NetgsmConfig } from "./types";

/**
 * Validates if a code exists in an enum, returns "5000" if not found
 */
function normalizeErrorCode(code: string | undefined | null, enumObj?: object): string {
  if (!code || typeof code !== "string") {
    return "5000";
  }
  if (enumObj && !Object.values(enumObj).includes(code)) {
    return "5000";
  }
  return code;
}

/**
 * Abstract base class that handles authentication and HTTP communication
 * with the Netgsm API. All modules extend this class.
 */
export abstract class NetgsmClient {
  protected readonly baseURL = "https://api.netgsm.com.tr";
  protected readonly headers: HeadersInit;
  protected readonly sdkAppName?: string;

  constructor(protected readonly config: NetgsmConfig) {
    if (!config.username || !config.password) {
      throw new Error("Username and password are required");
    }

    const token = this.generateAuthToken(config.username, config.password);
    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`,
    };

    if (config.appname) {
      this.sdkAppName = `${config.appname}-sdk-js`;
    }
  }

  private generateAuthToken(username: string, password: string): string {
    if (typeof window !== "undefined" && typeof btoa === "function") {
      return btoa(`${username}:${password}`);
    }
    return Buffer.from(`${username}:${password}`).toString("base64");
  }

  /**
   * Makes a POST request to the given API path
   */
  protected async post<T>(path: string, body: object, errorEnum?: object): Promise<T> {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response, errorEnum);
  }

  /**
   * Makes a GET request to the given API path with optional query params
   */
  protected async get<T>(
    path: string,
    params?: Record<string, string>,
    errorEnum?: object
  ): Promise<T> {
    const url = new URL(`${this.baseURL}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.headers,
    });
    return this.handleResponse<T>(response, errorEnum);
  }

  private async handleResponse<T>(response: Response, errorCodeEnum?: object): Promise<T> {
    let data;
    try {
      data = await response.json();
    } catch (error) {
      throw {
        status: response.status,
        code: "PARSE_ERROR",
        description: `Failed to parse JSON response: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }

    if (response.status === 200 || response.status === 406) {
      if (typeof data !== "object" || data === null) {
        throw {
          status: response.status,
          code: "INVALID_RESPONSE",
          description: "Response is not a valid object",
        };
      }

      data.code = normalizeErrorCode(data.code, errorCodeEnum);

      if (data.code !== "00") {
        throw {
          status: response.status !== 200 ? response.status : 406,
          ...data,
        };
      }

      return data as T;
    }

    throw {
      status: response.status,
      code: normalizeErrorCode(data?.code, errorCodeEnum) || response.statusText,
      description: data?.description || "HTTP Error",
    };
  }
}
