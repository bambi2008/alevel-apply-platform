import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { paymentOffer, PURCHASE_TERMS_VERSION } from "@/lib/payments/config";
import { getPaymentProvider } from "@/lib/payments/mianbaoduo";
import { createOrder, publicOrder } from "@/lib/payments/orders";
import { boundedJson, privateNoStore, sameOriginWrite } from "@/lib/security/json-request";
import { consumePersistentRateLimit, rateLimitKey } from "@/lib/security/rate-limit";

const checkout = z.object({
  agreed: z.literal(true), termsVersion: z.string(), offer: z.string(), requestId: z.uuid(),
  channel: z.enum(["wechat", "alipay"]), locale: z.enum(["en", "zh-CN"]),
}).strict();

function respond(value: unknown, status = 200) {
  return NextResponse.json(value, { status, headers: privateNoStore });
}

export async function POST(request: NextRequest) {
  const originError = sameOriginWrite(request);
  if (originError) return originError;
  const user = (await auth())?.user;
  if (!user) return respond({ error: "unauthenticated" }, 401);
  const body = await boundedJson(request, 2048);
  if (!body.ok) return body.response;
  const parsed = checkout.safeParse(body.value);
  if (!parsed.success) return respond({ error: "agreement_required" }, 400);
  const offer = paymentOffer(user);
  const provider = getPaymentProvider();
  if (!offer.enabled || !provider) return respond({ error: "payments_disabled" }, 403);
  const { termsVersion, offer: expected, channel, requestId, locale } = parsed.data;
  if (termsVersion !== PURCHASE_TERMS_VERSION || expected !== `${offer.priceFen}:${offer.months}`) return respond({ error: "offer_changed" }, 409);
  if (/MicroMessenger/i.test(request.headers.get("user-agent") ?? "")) return respond({ error: "external_browser_required" }, 400);
  if (!/Mobile|Android|iPhone|iPad/i.test(request.headers.get("user-agent") ?? "")) return respond({ error: "mobile_browser_required" }, 400);
  const limit = await consumePersistentRateLimit(rateLimitKey("payment-order", user.id), { limit: 8, windowMs: 3_600_000 });
  if (!limit.allowed) return respond({ error: "rate_limited" }, 429);
  const { order, created } = await createOrder({ userId: user.id, requestId, channel, ...offer });
  const returnPath = `/${locale}/purchase/orders/${order.id}`;
  if (!created) return respond({ order: publicOrder(order), returnPath });
  try {
    const returnUrl = new URL(returnPath, process.env.APP_ORIGIN).href;
    const instruction = await provider.createPayment({ outTradeNo: order.outTradeNo, amountFen: order.amountFen, channel, returnUrl });
    return respond({ order: publicOrder(order), instruction, returnPath }, 201);
  } catch {
    await db.paymentOrder.updateMany({ where: { id: order.id, status: "pending" }, data: { status: "failed" } });
    return respond({ error: "payment_channel_unavailable", returnPath }, 502);
  }
}
