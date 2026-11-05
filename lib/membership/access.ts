import { db } from "@/lib/db";
import { isMembershipActive } from "./policy";

export async function membershipAccess(userId: string, now = new Date()) {
  const membership = await db.membership.findUnique({ where: { userId }, select: { plan: true, startsAt: true, endsAt: true } });
  const expiredTrial = membership?.plan === "trial" && membership.endsAt <= now ? membership : null;
  return { active: isMembershipActive(membership, now), membership, expiredTrial };
}
