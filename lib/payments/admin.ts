import { Prisma, type PaymentOrderStatus, type PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isConfiguredAdmin } from "@/lib/admin/allowlist";
import { beijingDay, beijingMonthStart, DAY_MS, parseBeijingDate } from "@/lib/beijing-time";
import { seasonPassWindow } from "@/lib/membership/policy";

export async function paymentAdmin() {
  const user = (await auth())?.user;
  return user && isConfiguredAdmin(user) ? user : null;
}

export function orderFilter(values: Record<string, string | string[] | undefined>): Prisma.PaymentOrderWhereInput {
  const text = (key: string) => typeof values[key] === "string" ? values[key].trim().slice(0, 200) : undefined;
  const query = text("q"), status = text("status");
  const from = parseBeijingDate(text("from")), until = parseBeijingDate(text("through"));
  return {
    ...(query && { OR: [
      { outTradeNo: { contains: query, mode: "insensitive" } },
      { user: { email: { equals: query, mode: "insensitive" } } },
    ] }),
    ...(status && ["pending", "paid", "failed", "closed"].includes(status) && { status: status as PaymentOrderStatus }),
    ...(from || until ? { createdAt: { gte: from, lt: until ? new Date(+until + DAY_MS) : undefined } } : {}),
    ...(text("complaints") === "1" && { complaints: { some: {} } }),
  };
}

export async function paymentRevenue(client: PrismaClient = db, now = new Date()) {
  const sum = async (start: Date) => {
    const result = await client.paymentOrder.aggregate({
      where: { status: "paid", testPayment: false, paidAt: { gte: start, lte: now } },
      _sum: { amountFen: true },
    });
    return result._sum.amountFen ?? 0;
  };
  const [today, month] = await Promise.all([sum(beijingDay(now).start), sum(beijingMonthStart(now))]);
  return { today, month };
}

export function csvCell(value: unknown) {
  let text = value === null || value === undefined ? "" : String(value);
  if (/^[\s]*[=+@-]/.test(text)) text = "'" + text;
  return `"${text.replaceAll('"', '""')}"`;
}

export async function extendMembership(input: { actorId: string; userId: string; tradeNo: string; months: number; reason: string; requestId: string }, client: PrismaClient = db, now = new Date()) {
  const reason = input.reason.trim();
  if (reason.length < 5 || reason.length > 300 || !Number.isInteger(input.months) || input.months < 1 || input.months > 36) return false;
  return client.$transaction(async tx => {
    const user = await tx.$queryRaw<Array<{ id: string }>>(Prisma.sql`SELECT "id" FROM "User" WHERE "id" = ${input.userId} FOR UPDATE`);
    if (!user.length) return false;
    const order = await tx.paymentOrder.findFirst({ where: { outTradeNo: input.tradeNo, userId: input.userId, status: "paid", testPayment: false } });
    if (!order) return false;
    if (await tx.auditLog.findFirst({ where: { action: "MEMBERSHIP_MANUAL_EXTENSION", actorId: input.actorId, entityId: input.requestId } })) return true;
    const current = await tx.membership.findUnique({ where: { userId: input.userId } });
    const window = seasonPassWindow(current, now, input.months);
    const data = { ...window, plan: "season_pass" as const, sourceOrderId: order.id };
    await tx.membership.upsert({ where: { userId: input.userId }, create: { userId: input.userId, ...data }, update: data });
    await tx.auditLog.create({
      data: {
        actorId: input.actorId, action: "MEMBERSHIP_MANUAL_EXTENSION", entity: "Membership", entityId: input.requestId,
        meta: { userId: input.userId, orderId: order.id, outTradeNo: order.outTradeNo, reason, months: input.months,
          beforeEndsAt: current?.endsAt.toISOString() ?? null, afterEndsAt: window.endsAt.toISOString() },
      },
    });
    return true;
  });
}
