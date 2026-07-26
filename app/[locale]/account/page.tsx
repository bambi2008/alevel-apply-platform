import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AiConsentForm, ChangePasswordForm, DeleteAccountForm } from "@/components/account-security-forms";
import { PageHeader } from "@/components/page-header";

export default async function AccountPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      phone: true,
      passwordHash: true,
      consents: { select: { type: true, version: true, grantedAt: true } },
    },
  });
  if (!user) redirect("/login");

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <PageHeader title="账号与隐私" subtitle="管理登录安全，并行使访问、导出和删除个人数据的权利。" />

      <section className="border-b border-[var(--border)] py-6">
        <h2 className="text-lg font-bold">账号信息</h2>
        <dl className="mt-3 grid gap-2 text-sm">
          <div><dt className="inline text-[var(--ink-soft)]">邮箱：</dt><dd className="inline">{user.email ?? "未绑定"}</dd></div>
          <div><dt className="inline text-[var(--ink-soft)]">手机：</dt><dd className="inline">{user.phone ? `${user.phone.slice(0, 3)}****${user.phone.slice(-4)}` : "未绑定"}</dd></div>
        </dl>
      </section>

      {user.passwordHash && <section className="border-b border-[var(--border)] py-6">
        <h2 className="text-lg font-bold">修改密码</h2>
        <ChangePasswordForm />
      </section>}

      <section className="border-b border-[var(--border)] py-6">
        <h2 className="text-lg font-bold">个人数据</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">导出文件包含账号资料、申请与备考记录、同意记录和文件元数据，不包含密码或已上传文件的原始内容。</p>
        <Link href="/api/account/export" prefetch={false} className="btn btn-secondary mt-4">下载我的数据（JSON）</Link>
      </section>

      <section className="border-b border-[var(--border)] py-6">
        <h2 className="text-lg font-bold">AI 数据处理偏好</h2>
        <AiConsentForm granted={user.consents.some((consent) => consent.type === "CROSS_BORDER")} />
      </section>

      <section className="border-b border-[var(--border)] py-6">
        <h2 className="text-lg font-bold">同意记录</h2>
        <div className="mt-3 space-y-2 text-sm text-[var(--ink-soft)]">
          {user.consents.map((consent) => (
            <p key={`${consent.type}-${consent.grantedAt.toISOString()}`}>
              {consent.type} · 版本 {consent.version} · {consent.grantedAt.toLocaleString("zh-CN")}
            </p>
          ))}
        </div>
      </section>

      <section className="py-6">
        <h2 className="text-lg font-bold text-[var(--danger)]">注销账号</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">注销会永久删除账号、档案、申请记录、考试记录和上传文件，无法撤销。法律要求必须保留的最小审计记录除外。</p>
        <DeleteAccountForm hasPassword={Boolean(user.passwordHash)} />
      </section>
    </main>
  );
}
