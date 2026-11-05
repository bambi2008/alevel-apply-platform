import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { isConfiguredAdmin } from "@/lib/admin/allowlist";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, locale] = await Promise.all([auth(), getLocale()]);
  if (!isConfiguredAdmin(session?.user)) notFound();
  const en = locale === "en";

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-neutral-200 pb-3">
        <span className="text-lg font-bold">{en ? "Administration" : "管理后台"}</span>
        <nav className="order-3 flex w-full gap-1 overflow-x-auto whitespace-nowrap text-sm [&>a]:shrink-0 sm:order-none sm:w-auto">
          <Link
            href="/admin"
            className="px-3 py-1.5 rounded-md text-neutral-600 hover:bg-neutral-100"
          >
            {en ? "Overview" : "总览"}
          </Link>
          <Link
            href="/admin/users"
            className="px-3 py-1.5 rounded-md text-neutral-600 hover:bg-neutral-100"
          >
            {en ? "Accounts" : "用户管理"}
          </Link>
          <Link
            href="/admin/beta"
            className="px-3 py-1.5 rounded-md text-neutral-600 hover:bg-neutral-100"
          >
            {en ? "Usage" : "使用数据"}
          </Link>
          <Link
            href="/admin/content"
            className="px-3 py-1.5 rounded-md text-neutral-600 hover:bg-neutral-100"
          >
            {en ? "Content" : "内容管理"}
          </Link>
          <Link
            href="/admin/question-audit"
            className="px-3 py-1.5 rounded-md text-neutral-600 hover:bg-neutral-100"
          >
            {en ? "Question audit" : "题库审计"}
          </Link>
          <Link href="/admin/content-priorities" className="px-3 py-1.5 rounded-md text-neutral-600 hover:bg-neutral-100">{en ? "Question priorities" : "补题优先级"}</Link>
          <Link href="/admin/orders" className="px-3 py-1.5 rounded-md text-neutral-600 hover:bg-neutral-100">{en ? "Orders" : "订单管理"}</Link>
          <Link href="/admin/members" className="px-3 py-1.5 rounded-md text-neutral-600 hover:bg-neutral-100">{en ? "Memberships" : "会员管理"}</Link>
          <Link href="/admin/settings" className="px-3 py-1.5 rounded-md text-neutral-600 hover:bg-neutral-100">{en ? "AI settings" : "AI 设置"}</Link>
          <Link
            href="/admin/question-studio"
            className="px-3 py-1.5 rounded-md text-neutral-600 hover:bg-neutral-100"
          >
            {en ? "Question studio" : "题库工作台"}
          </Link>
          <Link
            href="/admin/operations"
            className="px-3 py-1.5 rounded-md text-neutral-600 hover:bg-neutral-100"
          >
            {en ? "Operations" : "运行状态"}
          </Link>
        </nav>
        <Link href="/" className="ml-auto shrink-0 text-sm text-blue-600 hover:underline">
          {en ? "← Back to QiaoShen" : "← 返回站点"}
        </Link>
      </div>
      {children}
    </div>
  );
}
