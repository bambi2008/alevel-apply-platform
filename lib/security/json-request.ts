import { NextRequest, NextResponse } from "next/server";

export const privateNoStore = { "Cache-Control": "private, no-store" };

export function sameOriginWrite(request: NextRequest): NextResponse | null {
  const origin = request.headers.get("origin");
  if (!origin || ![request.nextUrl.origin, process.env.APP_ORIGIN].filter(Boolean).includes(origin)
    || request.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ error: "forbidden_origin" }, { status: 403, headers: privateNoStore });
  }
  return null;
}

export async function boundedJson(request: NextRequest, maxBytes: number): Promise<{ ok: true; value: unknown } | { ok: false; response: NextResponse }> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) return { ok: false, response: NextResponse.json({ error: "invalid_body" }, { status: 415, headers: privateNoStore }) };
  const reader = request.body?.getReader();
  if (!reader) return { ok: false, response: NextResponse.json({ error: "invalid_body" }, { status: 400, headers: privateNoStore }) };
  let size = 0, text = "";
  const decoder = new TextDecoder();
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        return { ok: false, response: NextResponse.json({ error: "too_large" }, { status: 413, headers: privateNoStore }) };
      }
      text += decoder.decode(chunk.value, { stream: true });
    }
    return { ok: true, value: JSON.parse(text + decoder.decode()) };
  } catch {
    return { ok: false, response: NextResponse.json({ error: "invalid_body" }, { status: 400, headers: privateNoStore }) };
  } finally { reader.releaseLock(); }
}
