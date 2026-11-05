/** Replacement for each deprecated 1.x method. */
const REPLACEMENTS: Record<string, string> = {
  sendRestSms: 'netgsm.sms.send',
  sendOtpSms: 'netgsm.sms.sendOtp',
  cancelSms: 'netgsm.sms.cancel',
  getReport: 'netgsm.sms.getReport',
  getStats: 'netgsm.sms.getStats',
  getHeaders: 'netgsm.sms.listSenders',
  getInbox: 'netgsm.sms.getInbox',
  checkBalance: 'netgsm.sms.getBalance',
};

const warned = new Set<string>();

type ProcessLike = {
  emitWarning?: (message: string, options: { type: string; code: string }) => void;
};

function emit(message: string, code: string): void {
  const proc = (globalThis as { process?: ProcessLike }).process;
  if (proc && typeof proc.emitWarning === 'function') {
    proc.emitWarning(message, { type: 'DeprecationWarning', code });
  } else if (typeof console !== 'undefined') {
    console.warn(`DeprecationWarning [${code}]: ${message}`);
  }
}

/**
 * Warns once per method per process that a 1.x method is deprecated. Goes through
 * `process.emitWarning` when available, so `--no-deprecation` / `process.noDeprecation` silence it.
 * The message never contains credentials.
 */
export function warnDeprecated(method: string): void {
  if (warned.has(method)) return;
  warned.add(method);
  const replacement = REPLACEMENTS[method];
  const hint = replacement ? `use ${replacement}() instead` : 'use the new API instead';
  emit(
    `Netgsm#${method}() is deprecated since 2.0.0 and will be removed in 3.0.0; ${hint}. See MIGRATION.md.`,
    `NETGSM_LEGACY_${method.toUpperCase()}`,
  );
}

let browserWarned = false;

/** Warns once that legacy methods expose credentials when used client-side. */
export function warnBrowserCredentials(): void {
  if (browserWarned) return;
  browserWarned = true;
  if (typeof console !== 'undefined') {
    console.warn(
      'Netgsm: the deprecated 1.x methods are being used in a browser-like environment; ' +
        'your Netgsm credentials are exposed client-side. Move Netgsm calls to a server.',
    );
  }
}

/** Test-only: forgets which warnings were already shown. Not exported from the package entry. */
export function resetDeprecationWarnings(): void {
  warned.clear();
  browserWarned = false;
}
