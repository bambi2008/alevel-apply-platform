import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AiConsentForm, ChangePasswordForm, DeleteAccountForm } from "@/components/account-security-forms";
import { PageHeader } from "@/components/page-header";
import { saveMembershipEmailPreference } from "@/lib/membership/reminder-actions";
import { Link } from "@/i18n/navigation";
import { beijingDay } from "@/lib/beijing-time";

export default async function AccountPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ reminderSaved?: string }> }) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const en = locale === "en";
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect(`/${locale}/login`);

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      phone: true,
      passwordHash: true,
      consents: { select: { type: true, version: true, grantedAt: true } },
      membership: { select: { plan: true, endsAt: true } },
      notificationPreference: { select: { membershipEmailEnabled: true } },
    },
  });
  if (!user) redirect(`/${locale}/login`);

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <PageHeader title={en ? "Account and privacy" : "账号与隐私"} subtitle={en ? "Manage account security and access, export or delete your personal data." : "管理登录安全，并行使访问、导出和删除个人数据的权利。"} />

      <section className="border-b border-[var(--border)] py-6">
        <h2 className="text-lg font-bold">{en ? "Account information" : "账号信息"}</h2>
        <dl className="mt-3 grid gap-2 text-sm">
          <div><dt className="inline text-[var(--ink-soft)]">{en ? "Email: " : "邮箱："}</dt><dd className="inline">{user.email ?? (en ? "None" : "未绑定")}</dd></div>
          <div><dt className="inline text-[var(--ink-soft)]">{en ? "Phone: " : "手机："}</dt><dd className="inline">{user.phone ? `${user.phone.slice(0, 3)}****${user.phone.slice(-4)}` : en ? "None" : "未绑定"}</dd></div>
        </dl>
      </section>

      <section className="border-b border-[var(--border)] py-6">
        <h2 className="text-lg font-bold">{en ? "Membership and reminders" : "会员权益与提醒"}</h2>
        {user.membership && <p className="mt-2 text-sm">
          {en ? "Access expiry (Beijing time): " : "权益到期日（北京时间）："}{beijingDay(user.membership.endsAt).key}
          {" · "}<Link href="/purchase" className="underline">{en ? "Renew access" : "一键续费"}</Link>
        </p>}
        <form action={saveMembershipEmailPreference} className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <input type="hidden" name="locale" value={locale} />
          <label className="flex min-h-11 items-center gap-2">
            <input type="checkbox" name="membershipEmailEnabled" defaultChecked={user.notificationPreference?.membershipEmailEnabled !== false} />
            {en ? "Email me before access expires" : "到期前发邮件提醒我"}
          </label>
          <button className="btn btn-secondary">{en ? "Save preference" : "保存设置"}</button>
        </form>
        {query.reminderSaved === "1" && <p className="mt-2 text-sm" role="status">{en ? "Reminder preference saved." : "提醒设置已保存。"}</p>}
      </section>

      {user.passwordHash && <section className="border-b border-[var(--border)] py-6">
        <h2 className="text-lg font-bold">{en ? "Change password" : "修改密码"}</h2>
        <ChangePasswordForm />
      </section>}

      <section className="border-b border-[var(--border)] py-6">
        <h2 className="text-lg font-bold">{en ? "Personal data" : "个人数据"}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{en ? "Export your account, application and practice records, consent history and file metadata." : "导出账号资料、申请与备考记录、同意记录和文件元数据。"}</p>
        <a href="/api/account/export" download className="btn btn-secondary mt-4">{en ? "Download my data (JSON)" : "下载我的数据（JSON）"}</a>
      </section>

      <section className="border-b border-[var(--border)] py-6">
        <h2 className="text-lg font-bold">{en ? "AI data processing" : "AI 数据处理偏好"}</h2>
        <AiConsentForm granted={user.consents.some((consent) => consent.type === "CROSS_BORDER")} />
      </section>

      <section className="border-b border-[var(--border)] py-6">
        <h2 className="text-lg font-bold">{en ? "Consent history" : "同意记录"}</h2>
        <div className="mt-3 space-y-2 text-sm text-[var(--ink-soft)]">
          {user.consents.map((consent) => (
            <p key={`${consent.type}-${consent.grantedAt.toISOString()}`}>
              {consent.type} · {en ? "Version" : "版本"} {consent.version} · {consent.grantedAt.toLocaleString(en ? "en-GB" : "zh-CN", { timeZone: "Asia/Shanghai" })}
            </p>
          ))}
        </div>
      </section>

      <section className="py-6">
        <h2 className="text-lg font-bold text-[var(--danger)]">{en ? "Delete account" : "注销账号"}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{en ? "Deletion permanently removes your account, profile, application and exam records and uploads. Required financial and audit records have separate retention periods." : "注销会永久删除账号、档案、申请记录、考试记录和上传文件。必须保存的账务和审计记录适用单独期限。"}</p>
        <DeleteAccountForm hasPassword={Boolean(user.passwordHash)} />
        <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">{locale === "en" ? "A keyed trial-eligibility identifier and its first claim time remain after deletion solely to prevent repeated new-user trials, until the trial programme ends. This does not retain your original email or answers. See the separate disclosure in the Privacy Policy." : "注销后，用于防止重复领取新用户体验的邮箱加密去重标识与首次领取时间仍会保留，直至体验活动结束，不保留邮箱原文或作答内容。用途与期限已在隐私政策中单独披露。"}</p>
      </section>
    </main>
  );
}
