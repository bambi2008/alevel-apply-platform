"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/actions";
import {
  BETA_COHORT,
  BETA_INVITE_LOCK_ID,
  BETA_REGISTRATION_LIMIT,
  createInviteCode,
  hashInviteCode,
  parseInviteEmails,
} from "@/lib/beta/invites";

const emailSchema = z.string().email();

export type BetaInviteRow = {
  id: string;
  email: string;
  status: "AVAILABLE" | "USED" | "REVOKED";
  usedAt: string | null;
  createdAt: string;
};

export async function listBetaInvitesAction(): Promise<{
  rows: BetaInviteRow[];
  limit: number;
  used: number;
  reserved: number;
}> {
  await requireAdmin();
  const rows = await db.betaInvite.findMany({
    where: { cohort: BETA_COHORT },
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, status: true, usedAt: true, createdAt: true },
  });
  return {
    rows: rows.map((row) => ({
      ...row,
      usedAt: row.usedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
    })),
    limit: BETA_REGISTRATION_LIMIT,
    used: rows.filter((row) => row.status === "USED").length,
    reserved: rows.filter((row) => row.status === "AVAILABLE").length,
  };
}

export type CreateBetaInvitesResult = {
  ok: boolean;
  created: Array<{ email: string; code: string }>;
  skipped: Array<{ email: string; reason: "INVALID_EMAIL" | "ALREADY_INVITED" | "ALREADY_USED" | "LIMIT_REACHED" }>;
};

export async function createBetaInvitesAction(rawEmails: string): Promise<CreateBetaInvitesResult> {
  const actorId = await requireAdmin();
  const emails = parseInviteEmails(rawEmails);
  const invalid = emails.filter((email) => !emailSchema.safeParse(email).success);
  const valid = emails.filter((email) => emailSchema.safeParse(email).success);
  if (emails.length === 0) return { ok: false, created: [], skipped: [] };

  const result = await db.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(${BETA_INVITE_LOCK_ID})`;
    const existing = await tx.betaInvite.findMany({
      where: { cohort: BETA_COHORT, email: { in: valid } },
      select: { id: true, email: true, status: true },
    });
    const byEmail = new Map(existing.map((invite) => [invite.email, invite]));
    const reserved = await tx.betaInvite.count({
      where: { cohort: BETA_COHORT, status: { in: ["AVAILABLE", "USED"] } },
    });
    let remaining = Math.max(0, BETA_REGISTRATION_LIMIT - reserved);
    const created: Array<{ email: string; code: string }> = [];
    const skipped: CreateBetaInvitesResult["skipped"] = invalid.map((email) => ({
      email,
      reason: "INVALID_EMAIL",
    }));

    for (const email of valid) {
      const prior = byEmail.get(email);
      if (prior?.status === "AVAILABLE") {
        skipped.push({ email, reason: "ALREADY_INVITED" });
        continue;
      }
      if (prior?.status === "USED") {
        skipped.push({ email, reason: "ALREADY_USED" });
        continue;
      }
      if (remaining === 0) {
        skipped.push({ email, reason: "LIMIT_REACHED" });
        continue;
      }

      const code = createInviteCode();
      if (prior) {
        await tx.betaInvite.update({
          where: { id: prior.id },
          data: { codeHash: hashInviteCode(code), status: "AVAILABLE", usedAt: null, usedByUserId: null },
        });
      } else {
        await tx.betaInvite.create({
          data: { email, cohort: BETA_COHORT, codeHash: hashInviteCode(code) },
        });
      }
      created.push({ email, code });
      remaining -= 1;
    }

    await tx.auditLog.create({
      data: {
        actorId,
        action: "BETA_INVITES_CREATED",
        entity: "BetaInvite",
        meta: { cohort: BETA_COHORT, emails: created.map((item) => item.email), skipped: skipped.length },
      },
    });
    return { ok: created.length > 0, created, skipped };
  });
  revalidatePath("/[locale]/admin/beta", "page");
  return result;
}

export async function revokeBetaInviteAction(inviteId: string): Promise<{ ok: boolean }> {
  const actorId = await requireAdmin();
  const updated = await db.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(${BETA_INVITE_LOCK_ID})`;
    const result = await tx.betaInvite.updateMany({
      where: { id: inviteId, cohort: BETA_COHORT, status: "AVAILABLE" },
      data: { status: "REVOKED" },
    });
    if (result.count) {
      await tx.auditLog.create({
        data: { actorId, action: "BETA_INVITE_REVOKED", entity: "BetaInvite", entityId: inviteId },
      });
    }
    return result.count === 1;
  });
  revalidatePath("/[locale]/admin/beta", "page");
  return { ok: updated };
}
