import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { boundedJson, privateNoStore } from "@/lib/security/json-request";
import { getPaymentProvider } from "@/lib/payments/mianbaoduo";
import { reconcileNotification } from "@/lib/payments/orders";

export const runtime = "nodejs";
const documentedAddresses = "49.233.5.148,140.143.158.124";

function respond(value: unknown, status = 200) {
  return NextResponse.json(value, { status, headers: privateNoStore });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ token?: string[] }> }) {
  const path = (await params).token ?? [];
  const expected = process.env.MBD_WEBHOOK_PATH_TOKEN?.trim();
  if (expected) {
    const received = Buffer.from(path[0] ?? ""), secret = Buffer.from(expected);
    if (path.length !== 1 || received.length !== secret.length || !timingSafeEqual(received, secret)) return respond({ error: "not_found" }, 404);
  } else if (path.length) return respond({ error: "not_found" }, 404);

  const ips = (process.env.MBD_WEBHOOK_IP_ALLOWLIST ?? documentedAddresses).split(",").map(ip => ip.trim()).filter(Boolean);
  // Production reverse proxy overwrites untrusted forwarded-for values.
  const peer = request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  if (ips.length && (!peer || !ips.includes(peer))) return respond({ error: "forbidden_sender" }, 403);
  const provider = getPaymentProvider();
  if (!provider) return respond({ error: "payment_channel_unavailable" }, 503);
  const body = await boundedJson(request, 8192);
  if (!body.ok) return body.response;
  if (!provider.verifyNotification(body.value)) return respond({ error: "invalid_signature" }, 400);
  const notification = provider.parseNotification(body.value);
  if (!notification) return respond({ error: "invalid_notification" }, 400);
  if (notification.type === "complaint" && !ips.length && !expected) {
    const payload = body.value as { sign?: unknown; data?: { sign?: unknown } };
    if (!payload.sign && !payload.data?.sign) return respond({ error: "unauthenticated_complaint" }, 403);
  }
  try {
    if (!await reconcileNotification(notification, provider)) return respond({ error: "payment_not_verified" }, 409);
    return respond({ success: true });
  } catch {
    return respond({ error: "verification_unavailable" }, 503);
  }
}
