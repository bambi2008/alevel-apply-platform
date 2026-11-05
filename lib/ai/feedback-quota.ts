import { createHash } from "node:crypto";
import { Prisma, type AiFeedbackKind, type PrismaClient } from "@prisma/client";
import { beijingDay } from "@/lib/beijing-time";
import { db } from "@/lib/db";
import { isMembershipActive } from "@/lib/membership/policy";
import { PLAN_QUOTAS } from "@/lib/plans";

const CACHE_TTL_MS = 365 * 86_400_000;
const LEASE_MS = 10 * 60_000;
const defaults = PLAN_QUOTAS.season_pass;
export const DEFAULT_FEEDBACK_LIMITS = { total: defaults.dailyAiFeedback, photo: defaults.dailyPhotoFeedback, statement: defaults.dailyStatementFeedback };

export function feedbackFingerprint(namespace: string, payload: unknown) {
  return createHash("sha256").update(JSON.stringify(["feedback-v4.1", namespace, payload])).digest("hex");
}

type QuotaClient = Pick<Prisma.TransactionClient, "aiFeedbackUse" | "aiFeedbackSettings">;

export async function feedbackAllowance(userId: string, client: QuotaClient = db, now = new Date()) {
  const day = beijingDay(now);
  const [settings, groups] = await Promise.all([
    client.aiFeedbackSettings.findUnique({ where: { id: "daily" }, select: { total: true, photo: true, statement: true } }),
    client.aiFeedbackUse.groupBy({
      where: { userId, dayKey: day.key, OR: [{ completedAt: { not: null } }, { leaseUntil: { gt: now } }] },
      by: ["kind"], _count: { _all: true },
    }),
  ]);
  const limits = settings ?? DEFAULT_FEEDBACK_LIMITS;
  const used = { total: 0, photo: 0, statement: 0 };
  for (const group of groups) {
    used.total += group._count._all;
    if (group.kind !== "general") used[group.kind] = group._count._all;
  }
  const total = Math.max(0, limits.total - used.total);
  return {
    limits, resetAt: day.end.toISOString(),
    remaining: { total, photo: Math.min(total, Math.max(0, limits.photo - used.photo)),
      statement: Math.min(total, Math.max(0, limits.statement - used.statement)) },
  };
}

export async function reserveFeedback(input: { userId: string; cacheKey: string; kind: AiFeedbackKind }, client: PrismaClient = db, now = new Date()) {
  return client.$transaction(async tx => {
    const user = await tx.$queryRaw<Array<{ id: string }>>(Prisma.sql`SELECT "id" FROM "User" WHERE "id" = ${input.userId} FOR UPDATE`);
    if (!user.length) return { state: "membership_required" } as const;
    const membership = await tx.membership.findUnique({ where: { userId: input.userId } });
    if (!isMembershipActive(membership, now)) return { state: membership?.plan === "trial" ? "trial_expired" : "membership_required" } as const;
    const existing = await tx.aiFeedbackUse.findUnique({ where: { userId_cacheKey: { userId: input.userId, cacheKey: input.cacheKey } } });
    if (existing) {
      if (existing.completedAt && existing.output !== null && +existing.createdAt > +now - CACHE_TTL_MS) return { state: "cached", output: existing.output } as const;
      if (!existing.completedAt && existing.leaseUntil > now) return { state: "in_progress" } as const;
      await tx.aiFeedbackUse.delete({ where: { id: existing.id } });
    }
    const allowance = await feedbackAllowance(input.userId, tx, now);
    if (!allowance.remaining.total || (input.kind !== "general" && !allowance.remaining[input.kind])) return { state: "quota" } as const;
    const row = await tx.aiFeedbackUse.create({
      data: { ...input, dayKey: beijingDay(now).key, leaseUntil: new Date(+now + LEASE_MS), createdAt: now },
      select: { id: true },
    });
    return { state: "reserved", id: row.id } as const;
  });
}

export async function finishFeedback(reservationId: string, output: Prisma.InputJsonValue, client: PrismaClient = db) {
  return (await client.aiFeedbackUse.updateMany({ where: { id: reservationId, completedAt: null }, data: { output, completedAt: new Date() } })).count === 1;
}

export async function releaseFeedback(reservationId: string, client: PrismaClient = db) {
  await client.aiFeedbackUse.deleteMany({ where: { id: reservationId, completedAt: null } });
}
