import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/password-recovery-forms";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  return (
    <main className="mx-auto max-w-md px-5 py-12">
      <PageHeader title="设置新密码" subtitle="链接只能使用一次，并会在 30 分钟后失效。" />
      <ResetPasswordForm token={token} />
    </main>
  );
}
