import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { privateNoStore, sameOriginWrite } from "@/lib/security/json-request";
import { getPaymentProvider } from "@/lib/payments/mianbaoduo";
import { publicOrder, recoverOrder } from "@/lib/payments/orders";

type Context = { params: Promise<{ id: string }> };
function respond(value: unknown, status = 200) {
  return NextResponse.json(value, { status, headers: privateNoStore });
}

async function ownOrder(context: Context) {
  const userId = (await auth())?.user.id;
  if (!userId) return { error: respond({ error: "unauthenticated" }, 401) } as const;
  const { id } = await context.params;
  const order = id.length <= 100 && await db.paymentOrder.findFirst({ where: { id, userId } });
  if (!order) return { error: respond({ error: "not_found" }, 404) } as const;
  return { order };
}

export async function GET(_request: NextRequest, context: Context) {
  const result = await ownOrder(context);
  return result.error ?? respond(publicOrder(result.order!));
}

export async function POST(request: NextRequest, context: Context) {
  const originError = sameOriginWrite(request);
  if (originError) return originError;
  const result = await ownOrder(context);
  if (result.error) return result.error;
  const provider = getPaymentProvider();
  if (!provider || result.order.provider !== "mianbaoduo") return respond({ error: "payment_channel_unavailable" }, 503);
  try { await recoverOrder(result.order, provider); }
  catch { return respond({ error: "payment_query_unavailable" }, 503); }
  return respond({ checked: true });
}
