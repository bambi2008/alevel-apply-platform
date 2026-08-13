import { ForgotPasswordForm } from "@/components/password-recovery-forms";
import { PageHeader } from "@/components/page-header";

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <main className="mx-auto max-w-md px-5 py-12">
      <PageHeader title="找回密码" subtitle="我们只会向已注册邮箱发送重置链接，不会在页面透露账号是否存在。" />
      <ForgotPasswordForm locale={locale} />
    </main>
  );
}
