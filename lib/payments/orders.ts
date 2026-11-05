import { createHash, randomBytes } from "node:crypto";
import { Prisma, type PaymentOrder, type PrismaClient } from "@prisma/client";
import { db } from "@/lib/db";
import { seasonPassWindow } from "@/lib/membership/policy";
import { PURCHASE_TERMS_VERSION } from "./config";
import type { PaymentChannel, PaymentNotification, PaymentProvider, ProviderOrder } from "./provider";

export const PAYMENT_RECOVERY_MS = 10 * 60_000;

export async function createOrder(input: {
  userId: string; requestId: string; priceFen: number; months: number; testPayment: boolean; channel: PaymentChannel;
}, client: PrismaClient = db) {
  const requestKey = createHash("sha256").update(`${input.userId}\0${input.requestId}`).digest("hex");
  const outTradeNo = `qs${randomBytes(14).toString("hex")}`;
  const saved = await client.paymentOrder.createMany({
    data: [{
      userId: input.userId, requestKey, outTradeNo, amountFen: input.priceFen, months: input.months,
      provider: "mianbaoduo", payway: input.channel, agreedAt: new Date(), termsVersion: PURCHASE_TERMS_VERSION,
      testPayment: input.testPayment,
    }],
    skipDuplicates: true,
  });
  const order = await client.paymentOrder.findUniqueOrThrow({ where: { requestKey } });
  return { order, created: saved.count === 1 };
}

export function verifiedPayment(order: PaymentOrder, query: ProviderOrder | null, notification?: PaymentNotification) {
  return !!query && (query.state === 1 || query.state === 2)
    && query.amountFen === order.amountFen && query.refundState === 0 && query.refundAmount === 0
    && query.payway === order.payway
    && (!notification || (notification.chargeId === query.chargeId && notification.payway === query.payway
      && notification.amountFen === query.amountFen));
}

export async function fulfilOrder(order: PaymentOrder, query: ProviderOrder, client: PrismaClient = db, now = new Date()) {
  if (!verifiedPayment(order, query)) return false;
  return client.$transaction(async tx => {
    // Lock user before order. A user's concurrent payments must both extend
    // their membership. Account deletion takes locks in this same order.
    const userExists = order.userId && (await tx.$queryRaw<Array<{ id: string }>>(
      Prisma.sql`SELECT "id" FROM "User" WHERE "id" = ${order.userId} FOR UPDATE`,
    )).length > 0;
    await tx.$queryRaw(Prisma.sql`SELECT "id" FROM "PaymentOrder" WHERE "id" = ${order.id} FOR UPDATE`);
    const currentOrder = await tx.paymentOrder.findUnique({ where: { id: order.id } });
    if (!currentOrder) return false;
    if (currentOrder.status === "paid") return currentOrder.providerChargeId === query.chargeId;
    if (currentOrder.status !== "pending" || !verifiedPayment(currentOrder, query)) return false;
    const existingCharge = await tx.paymentOrder.findUnique({
      where: { provider_providerChargeId: { provider: currentOrder.provider, providerChargeId: query.chargeId } },
      select: { id: true },
    });
    if (existingCharge && existingCharge.id !== currentOrder.id) return false;

    const paidAt = query.paidAt && +query.paidAt >= +currentOrder.createdAt - 1_000 && +query.paidAt <= +now
      ? query.paidAt : now;
    let membershipEndsAt: Date | undefined;
    if (userExists && currentOrder.userId === order.userId && order.userId) {
      const current = await tx.membership.findUnique({ where: { userId: order.userId } });
      // Older callbacks can arrive after a newer purchase was already credited.
      const renewalAnchor = current && current.startsAt > paidAt ? current.startsAt : paidAt;
      const window = seasonPassWindow(current, renewalAnchor, currentOrder.months);
      const access = { ...window, plan: "season_pass" as const, sourceOrderId: currentOrder.id };
      await tx.membership.upsert({ where: { userId: order.userId }, update: access, create: { userId: order.userId, ...access } });
      membershipEndsAt = window.endsAt;
    }
    await tx.paymentOrder.update({
      where: { id: currentOrder.id },
      data: { status: "paid", providerChargeId: query.chargeId, paidAt, membershipEndsAt },
    });
    return true;
  }).catch(error => {
    // A competing different order cannot reuse the same provider charge.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return false;
    throw error;
  });
}

export async function reconcileNotification(notification: PaymentNotification, provider: PaymentProvider, client: PrismaClient = db) {
  const order = await client.paymentOrder.findUnique({ where: { outTradeNo: notification.outTradeNo } });
  if (!order || order.provider !== "mianbaoduo" || order.amountFen !== notification.amountFen) return false;
  if (notification.type === "charge_succeeded" && order.status === "paid") {
    return order.providerChargeId === notification.chargeId && order.payway === notification.payway;
  }
  if (notification.type === "charge_succeeded" && (order.status !== "pending" || order.payway !== notification.payway)) return false;
  const query = await provider.queryOrder(order.outTradeNo);
  if (notification.type === "charge_succeeded") {
    if (!query || !verifiedPayment(order, query, notification)) return false;
    return fulfilOrder(order, query, client);
  }

  if (order.status !== "paid" || !query || query.amountFen !== order.amountFen || query.chargeId !== order.providerChargeId
    || ![3, 4, 5, 6].includes(query.state) || !notification.detail) return false;
  const fingerprint = createHash("sha256").update(`${order.id}\0${notification.detail}`).digest("hex");
  await client.paymentComplaint.createMany({
    data: [{ orderId: order.id, fingerprint, detail: notification.detail, payerPhone: notification.payerPhone }],
    skipDuplicates: true,
  });
  return true;
}

export async function recoverOrder(order: PaymentOrder, provider: PaymentProvider, client: PrismaClient = db, now = new Date()) {
  if (!order.userId) return;
  const claimed = await client.paymentOrder.updateMany({
    where: { id: order.id, userId: order.userId, status: "pending", recoveryCheckedAt: null,
      createdAt: { lte: new Date(+now - PAYMENT_RECOVERY_MS) } },
    data: { recoveryCheckedAt: now },
  });
  if (claimed.count !== 1) return;
  const result = await provider.queryOrder(order.outTradeNo);
  if (result && verifiedPayment(order, result)) await fulfilOrder(order, result, client, now);
}

export function publicOrder(order: PaymentOrder, now = new Date()) {
  return {
    id: order.id, status: order.status, amountFen: order.amountFen, membershipEndsAt: order.membershipEndsAt,
    canRecover: order.status === "pending" && !order.recoveryCheckedAt && +now - +order.createdAt >= PAYMENT_RECOVERY_MS,
  };
}
