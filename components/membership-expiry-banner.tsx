import { db } from "@/lib/db";
import { Link } from "@/i18n/navigation";
import { beijingDay, DAY_MS } from "@/lib/beijing-time";
import { isMembershipActive } from "@/lib/membership/policy";

export async function MembershipExpiryBanner({ userId, en }: { userId: string; en: boolean }) {
  if (process.env.MEMBERSHIP_REMINDERS_ENABLED !== "true") return null;
  const membership = await db.membership.findUnique({ where: { userId }, select: { plan: true, startsAt: true, endsAt: true } });
  if (!membership || !isMembershipActive(membership)) return null;
  const date = beijingDay(membership.endsAt);
  const days = Math.round((+date.start - +beijingDay().start) / DAY_MS);
  if (days > (membership.plan === "trial" ? 1 : 7)) return null;
  return <aside className="border-b border-black/15 bg-amber-50 px-5 py-2 text-sm text-neutral-900" aria-label={en ? "Access expiry" : "到期提醒"}>
    <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4">
      <p>{en ? `Your access ends on ${date.key} (Beijing time).` : `你的权益将于 ${date.key}（北京时间）到期。`}</p>
      <Link href="/purchase" className="inline-flex min-h-11 items-center font-semibold underline">{en ? "Renew access" : "一键续费"}</Link>
    </div>
  </aside>;
}
