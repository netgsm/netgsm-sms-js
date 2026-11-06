import { spawn, type ChildProcess } from 'node:child_process';
import { fileURLToPath } from 'node:url';

let child: ChildProcess | undefined;

export async function setup(): Promise<void> {
  const mock = fileURLToPath(new URL('../fixtures/netgsm-sms-mock.mjs', import.meta.url));
  const proc = spawn(process.execPath, [mock, '--port', '0', '--quiet'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child = proc;
  let stdout = '';
  let stderr = '';
  proc.stderr!.setEncoding('utf8');
  proc.stderr!.on('data', (c: string) => (stderr += c));
  proc.stdout!.setEncoding('utf8');

  const url = await new Promise<string>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Netgsm mock did not report a URL within 15s. stderr:\n${stderr}`)),
      15000,
    );
    proc.stdout!.on('data', (c: string) => {
      stdout += c;
      const m = /http:\/\/127\.0\.0\.1:\d+/.exec(stdout);
      if (m) {
        clearTimeout(timer);
        resolve(m[0]);
      }
    });
    proc.on('error', (e) => {
      clearTimeout(timer);
      reject(new Error(`Failed to start Netgsm mock: ${e.message}`));
    });
    proc.on('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`Netgsm mock exited early (code ${code}). stderr:\n${stderr}`));
    });
  });
  process.env.NETGSM_MOCK_URL = url;
}

export async function teardown(): Promise<void> {
  child?.kill();
  child = undefined;
}
