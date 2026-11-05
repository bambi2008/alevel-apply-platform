/** Access intervals are half-open: startsAt <= now < endsAt. */
export type MembershipWindow = { startsAt: Date; endsAt: Date };
export const TRIAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const BEIJING_OFFSET_MS = 8 * 60 * 60 * 1000;

export function isMembershipActive(membership: MembershipWindow | null, now = new Date()): boolean {
  return !!membership && membership.startsAt.getTime() <= now.getTime() && now.getTime() < membership.endsAt.getTime();
}

/** Preserve Beijing wall-clock time; clamp Jan 31 + 3 months to Apr 30. */
export function addBeijingCalendarMonths(value: Date, months: number): Date {
  if (!Number.isFinite(value.getTime()) || !Number.isSafeInteger(months) || months < 1 || months > 36) {
    throw new Error("Invalid membership duration");
  }
  const local = new Date(value.getTime() + BEIJING_OFFSET_MS);
  const lastDay = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth() + months + 1, 0)).getUTCDate();
  return new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth() + months,
    Math.min(local.getUTCDate(), lastDay), local.getUTCHours(), local.getUTCMinutes(),
    local.getUTCSeconds(), local.getUTCMilliseconds()) - BEIJING_OFFSET_MS);
}

/** An active membership extends from its end; an expired one restarts at payment. */
export function seasonPassWindow(current: (MembershipWindow & { plan: string }) | null, paidAt: Date, months: number): MembershipWindow {
  if (!Number.isFinite(paidAt.getTime())) throw new Error("Invalid payment time");
  const renewing = !!current && isMembershipActive(current, paidAt);
  return {
    startsAt: renewing ? current.startsAt : paidAt,
    endsAt: addBeijingCalendarMonths(renewing ? current.endsAt : paidAt, months),
  };
}

export function trialWindow(registeredAt: Date): MembershipWindow {
  if (!Number.isFinite(registeredAt.getTime())) throw new Error("Invalid registration time");
  return { startsAt: registeredAt, endsAt: new Date(registeredAt.getTime() + TRIAL_DURATION_MS) };
}
