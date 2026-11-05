import { NetgsmApiError } from '../core/errors.js';
import { assertRecipient, chunk } from './helpers.js';
import type { IysTransport } from './transport.js';
import type {
  Consent,
  ConsentQuery,
  ConsentRecord,
  IysPath,
  SaveConsentsResult,
} from './types.js';

export interface IysApiOptions {
  /** Default brand code (`NetgsmOptions.iysBrandCode`); a method's `brandCode` overrides it. */
  brandCode?: number;
}

/** İYS API v1: consent records and the consent webhook. Writes legal records: errors are never swallowed. */
export class IysApi {
  private readonly transport: IysTransport;
  private readonly defaultBrandCode: number | undefined;

  constructor(transport: IysTransport, opts: IysApiOptions = {}) {
    this.transport = transport;
    this.defaultBrandCode = opts.brandCode;
  }

  private brand(override: number | undefined): number {
    const b = override ?? this.defaultBrandCode;
    if (b === undefined || !Number.isInteger(b) || b < 1) {
      throw new TypeError(
        'İYS brandCode is required: set iysBrandCode in the client options or pass brandCode',
      );
    }
    return b;
  }

  /**
   * POST /iys/v1/consents, 1-500 records. WRITES LEGAL RECORDS to the live İYS: send only consents
   * (or rejections) that were really obtained. Always inspect `rejected` in the result.
   */
  async saveConsents(
    permissions: ConsentRecord[],
    opts: { brandCode?: number; refId?: string; path?: IysPath; requestId?: string } = {},
  ): Promise<SaveConsentsResult> {
    if (permissions.length < 1 || permissions.length > 500) {
      throw new RangeError('saveConsents accepts 1-500 records per request; split larger lists');
    }
    const brandCode = this.brand(opts.brandCode);
    permissions.forEach((p, i) => assertRecipient(p.recipient, `permissions[${i}]`));
    const body = {
      brandCode,
      ...(opts.path ? { path: opts.path } : {}),
      ...(opts.refId ? { refId: opts.refId } : {}),
      permissions,
    };
    const { json, requestId } = await this.transport.request('POST', '/consents', {
      body,
      requestId: opts.requestId,
    });
    return {
      uid: json.data?.uid,
      rejected: Array.isArray(json.data?.erroritem) ? json.data.erroritem : [],
      requestId,
    };
  }

  /**
   * GET /iys/v1/consents, multi-query. Queries are split into requests of `chunkSize` (default 100,
   * max 1000); results come back in input order. Only `status === 'ONAY'` means consent.
   */
  async searchConsents(
    queries: ConsentQuery[],
    opts: { brandCode?: number; chunkSize?: number; refId?: string; path?: IysPath } = {},
  ): Promise<Consent[]> {
    const size = opts.chunkSize ?? 100;
    if (!Number.isInteger(size) || size < 1 || size > 1000) {
      throw new RangeError('chunkSize must be an integer between 1 and 1000');
    }
    const brandCode = this.brand(opts.brandCode);
    queries.forEach((q, i) => assertRecipient(q.recipient, `queries[${i}]`));
    const out: Consent[] = [];
    for (const part of chunk(queries, size)) {
      const qs = new URLSearchParams({ brandCode: String(brandCode) });
      if (opts.path) qs.set('path', opts.path);
      if (opts.refId) qs.set('refId', opts.refId);
      part.forEach((q, i) => {
        qs.set(`data[${i}][recipient]`, q.recipient); // URLSearchParams encodes '+' as %2B
        qs.set(`data[${i}][recipientType]`, q.recipientType);
        qs.set(`data[${i}][type]`, q.type);
        if (q.refId) qs.set(`data[${i}][refId]`, q.refId);
      });
      try {
        const { json } = await this.transport.request('GET', '/consents', { query: qs });
        const rows: Consent[] = Array.isArray(json.data) ? json.data : [];
        // A single-record request may answer without a per-record errorCode.
        out.push(
          ...rows.map((r) => ({
            ...r,
            errorCode: typeof r.errorCode === 'number' ? r.errorCode : 0,
            message: r.message ?? null,
          })),
        );
      } catch (err) {
        // A single query that finds nothing may fail as a whole (404 / 81): report it as per-record 81.
        const only = part[0];
        if (part.length === 1 && only && err instanceof NetgsmApiError && err.code === '81') {
          out.push({
            type: only.type,
            source: null,
            recipient: only.recipient,
            status: null,
            consentDate: null,
            recipientType: only.recipientType,
            errorCode: 81,
            message: null,
          });
          continue;
        }
        throw err;
      }
    }
    return out;
  }

  /** POST /iys/v1/webhooks. Replaces the brand's previous address. Changes the live account setting. */
  async saveWebhook(
    webhookUrl: string,
    opts: { brandCode?: number; path?: IysPath; requestId?: string } = {},
  ): Promise<{ uid: string; requestId: string }> {
    const brandCode = this.brand(opts.brandCode);
    const body = { brandCode, ...(opts.path ? { path: opts.path } : {}), webhookUrl };
    const { json, requestId } = await this.transport.request('POST', '/webhooks', {
      body,
      requestId: opts.requestId,
    });
    return { uid: json.data?.uid, requestId };
  }
}
