import type { PrismaClient } from "@prisma/client";
import { beijingDay, DAY_MS } from "@/lib/beijing-time";
import { seasonPassOffer } from "./config";
import type { EmailAdapter } from "@/lib/email";
import { PUBLIC_CONTACT_EMAIL } from "@/lib/site-config";
import { isConfiguredAdmin } from "@/lib/admin/allowlist";

const reminderPrefix = "membership:expiry:";

function localizedReminder(endsAt: Date, plan: string, locale: string) {
  const en = locale === "en";
  const date = beijingDay(endsAt).key;
  const { priceFen, months } = seasonPassOffer();
  const title = plan === "trial"
    ? (en ? "Your 7-day trial is ending" : "7 天体验即将结束")
    : (en ? "Your Exam Season Pass is ending" : "考季卡即将到期");
  const body = en
    ? `Your access ends on ${date} (Beijing time). To continue practising, choose an Exam Season Pass (${months} months, ¥${priceFen / 100}). There is no automatic debit.`
    : `你的权益将于 ${date}（北京时间）到期。如需继续练习，可购买考季卡（${months} 个月 ¥${priceFen / 100}）。我们不会自动扣款。`;
  return { title, body, href: "/purchase" };
}

function html(text: string) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

/** Each Beijing-date window produces one site notification and at most one
 * outbound attempt. An ambiguous mail timeout cannot generate a duplicate. */
export async function runMembershipReminders({ client, email, origin, now = new Date() }: {
  client: PrismaClient; email: EmailAdapter; origin: string; now?: Date;
}) {
  const day = beijingDay(now);
  const result = { notices: 0, emailSent: 0, emailFailed: 0 };
  for (const days of [1, 7]) {
    const start = new Date(+day.start + days * DAY_MS), end = new Date(+start + DAY_MS);
    let after: string | undefined;
    while (true) {
      const members = await client.membership.findMany({
        where: { startsAt: { lte: now }, endsAt: { gte: start, lt: end }, ...(days === 7 ? { plan: "season_pass" } : {}),
          ...(after ? { id: { gt: after } } : {}) },
        orderBy: { id: "asc" }, take: 100,
        include: { user: { select: { email: true, locale: true, notificationPreference: { select: { membershipEmailEnabled: true } } } } },
      });
      for (const membership of members) {
        const sourceKey = `${reminderPrefix}${membership.plan}:${membership.endsAt.toISOString()}:${days}`;
        const content = localizedReminder(membership.endsAt, membership.plan, membership.user.locale);
        const created = await client.notification.createMany({
          data: [{ userId: membership.userId, sourceKey, ...content, category: "SYSTEM", priority: days === 1 ? "IMPORTANT" : "INFO",
            scheduledFor: now, expiresAt: membership.endsAt }],
          skipDuplicates: true,
        });
        result.notices += created.count;
        if (!membership.user.email || membership.user.notificationPreference?.membershipEmailEnabled === false) continue;
        const claimed = await client.notification.updateMany({
          where: { userId: membership.userId, sourceKey, emailAttemptedAt: null,
            user: { OR: [{ notificationPreference: null }, { notificationPreference: { membershipEmailEnabled: true } }],
              membership: { plan: membership.plan, endsAt: membership.endsAt } } },
          data: { emailAttemptedAt: now },
        });
        if (!claimed.count) continue;
        const locale = membership.user.locale === "en" ? "en" : "zh-CN";
        const link = new URL(`/${locale}/purchase`, origin).href;
        const label = locale === "en" ? "Renew access" : "一键续费";
        try {
          await email.send({
            to: membership.user.email, subject: content.title,
            text: `${content.body}\n${label}: ${link}`,
            html: `<p>${html(content.body)}</p><p><a href="${html(link)}">${label}</a></p>`,
            replyTo: PUBLIC_CONTACT_EMAIL, idempotencyKey: `${membership.id}:${sourceKey}`,
          });
          result.emailSent++;
          await client.notification.updateMany({ where: { userId: membership.userId, sourceKey }, data: { emailSentAt: now } });
        } catch { result.emailFailed++; }
      }
      if (members.length < 100) break;
      after = members.at(-1)!.id;
    }
  }
  return result;
}

export async function sendPaymentComplaintEmails({ client, email, origin, now = new Date() }: {
  client: PrismaClient; email: EmailAdapter; origin: string; now?: Date;
}) {
  const possible = await client.user.findMany({ where: { role: "ADMIN", email: { not: null } }, select: { role: true, email: true, locale: true } });
  const recipients = possible.filter(user => isConfiguredAdmin(user));
  const result = { sent: 0, failed: 0 };
  if (!recipients.length) return result;
  const complaints = await client.paymentComplaint.findMany({
    where: { emailAttemptedAt: null }, orderBy: { createdAt: "asc" }, take: 100,
    select: { id: true, orderId: true },
  });
  for (const complaint of complaints) {
    const claimed = await client.paymentComplaint.updateMany({ where: { id: complaint.id, emailAttemptedAt: null }, data: { emailAttemptedAt: now } });
    if (!claimed.count) continue;
    for (const recipient of recipients) {
      const en = recipient.locale === "en";
      const link = new URL(`/${en ? "en" : "zh-CN"}/admin/orders/${complaint.orderId}`, origin).href;
      const subject = en ? "QiaoShen payment complaint" : "桥申支付投诉";
      const content = en ? "Open the order in administration to review the complaint." : "请登录管理后台查看投诉订单。";
      try {
        await email.send({
          to: recipient.email!, subject, text: `${content}\n${link}`,
          html: `<p>${content}</p><p><a href="${html(link)}">${subject}</a></p>`,
          replyTo: PUBLIC_CONTACT_EMAIL, idempotencyKey: `complaint:${complaint.id}:${recipient.email}`,
        });
        result.sent++;
      } catch { result.failed++; }
    }
  }
  return result;
}
