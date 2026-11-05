/** A recipient the API refused to deliver to (422 NO_DELIVERABLE_MESSAGES). */
export interface RejectedItem {
  index: number;
  recipient: string | null;
  reason: string;
}

export interface NetgsmApiErrorInit {
  api: 'identity' | 'sms' | 'iys';
  /** e.g. `POST /sms/v3/send` */
  operation: string;
  status: number;
  code: string;
  detail: string;
  requestId: string | null;
  retryAfterSec?: number | null;
  retryable: boolean;
  mayHaveBeenProcessed?: boolean;
  rejectedItems?: RejectedItem[];
  data?: unknown;
}

/**
 * Error for any non-success Netgsm API response. It never stores request headers, bodies,
 * credentials or `cause`, so it is safe to log.
 */
export class NetgsmApiError extends Error {
  readonly api: 'identity' | 'sms' | 'iys';
  readonly operation: string;
  readonly status: number;
  readonly code: string;
  readonly requestId: string | null;
  readonly retryAfterSec: number | null;
  readonly retryable: boolean;
  /** true when the request may have been accepted despite the failure; check status before resending. */
  readonly mayHaveBeenProcessed: boolean;
  readonly rejectedItems?: RejectedItem[];
  /** İYS `data` payload (e.g. `erroritem`). */
  readonly data?: unknown;

  constructor(init: NetgsmApiErrorInit) {
    super(
      `${init.operation} → ${init.status} ${init.code}: ${init.detail} (requestId ${init.requestId ?? '-'})`,
    );
    this.name = 'NetgsmApiError';
    this.api = init.api;
    this.operation = init.operation;
    this.status = init.status;
    this.code = init.code;
    this.requestId = init.requestId;
    this.retryAfterSec = init.retryAfterSec ?? null;
    this.retryable = init.retryable;
    this.mayHaveBeenProcessed = init.mayHaveBeenProcessed ?? false;
    if (init.rejectedItems !== undefined) this.rejectedItems = init.rejectedItems;
    if (init.data !== undefined) this.data = init.data;
  }

  toJSON(): Record<string, unknown> {
    const json: Record<string, unknown> = {
      name: this.name,
      api: this.api,
      operation: this.operation,
      status: this.status,
      code: this.code,
      requestId: this.requestId,
      retryAfterSec: this.retryAfterSec,
      retryable: this.retryable,
      mayHaveBeenProcessed: this.mayHaveBeenProcessed,
      message: this.message,
    };
    if (this.rejectedItems !== undefined) json.rejectedItems = this.rejectedItems;
    if (this.data !== undefined) json.data = this.data;
    return json;
  }
}
