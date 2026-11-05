/** Reads a response body as JSON. Never throws: an empty or non-JSON body yields `{}`. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function readJson(res: Response): Promise<any> {
  try {
    const text = await res.text();
    if (!text) return {};
    const parsed: unknown = JSON.parse(text);
    return parsed ?? {};
  } catch {
    return {};
  }
}
