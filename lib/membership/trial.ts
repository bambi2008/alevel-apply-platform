import { createHmac } from "node:crypto";
import type { Prisma, PrismaClient } from "@prisma/client";
import { normalizeEmail } from "@/lib/auth/security";
import { trialWindow } from "./policy";

export function trialProgrammeEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.TRIAL_PROGRAM_ENABLED === "true" && !env.TRIAL_PROGRAM_ENDED_AT;
}

/** A dedicated stable key: rotating AUTH_SECRET must not reset trial eligibility. */
export function trialEmailDigest(email: string, secret: string | undefined = process.env.TRIAL_DEDUP_SECRET): string {
  if (!secret || Buffer.byteLength(secret, "utf8") < 32 || /^(change|replace|example)/i.test(secret)) {
    throw new Error("TRIAL_DEDUP_SECRET must be a dedicated non-placeholder secret of at least 32 bytes");
  }
  const normalized = normalizeEmail(email);
  if (!normalized || !normalized.includes("@")) throw new Error("A normalized account email is required");
  return createHmac("sha256", secret).update("qiaoshen:new-user-trial:v1\0").update(normalized).digest("hex");
}

/** Call inside the user-creation transaction. A rollback also rolls back the claim. */
export async function grantRegistrationTrial(tx: Prisma.TransactionClient, userId: string, email: string, registeredAt: Date): Promise<boolean> {
  if (!trialProgrammeEnabled()) return false;
  const emailDigest = trialEmailDigest(email);
  // PostgreSQL uniqueness serializes concurrent claims; skipDuplicates does not
  // replace an existing claim or reset its original timestamp.
  const claimed = await tx.trialClaim.createMany({ data: [{ emailDigest, claimedAt: registeredAt }], skipDuplicates: true });
  if (claimed.count !== 1) return false;
  await tx.membership.create({ data: { userId, plan: "trial", ...trialWindow(registeredAt) } });
  return true;
}

/** Only a deliberately recorded programme end makes claims eligible for deletion. */
export function trialClaimPurgeDue(env: Record<string, string | undefined> = process.env, now = new Date()): boolean {
  if (env.TRIAL_PROGRAM_ENABLED !== "false" || !env.TRIAL_PROGRAM_ENDED_AT) return false;
  const endedAt = new Date(env.TRIAL_PROGRAM_ENDED_AT);
  return Number.isFinite(endedAt.getTime()) && endedAt.getTime() <= now.getTime();
}

/** Run alongside daily retention, separately from study-data's 365-day policy. */
export async function purgeEndedTrialClaims(client: Pick<PrismaClient, "trialClaim">, dryRun = true, now = new Date()): Promise<number> {
  if (!trialClaimPurgeDue(process.env, now)) return 0;
  return dryRun ? client.trialClaim.count() : (await client.trialClaim.deleteMany({})).count;
}
