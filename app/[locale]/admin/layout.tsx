import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center gap-4 border-b border-neutral-200 pb-3 mb-6">
        <span className="text-lg font-bold">管理后台</span>
        <nav className="flex gap-1 text-sm">
          <Link
            href="/admin"
            className="px-3 py-1.5 rounded-md text-neutral-600 hover:bg-neutral-100"
          >
            总览
          </Link>
          <Link
            href="/admin/users"
            className="px-3 py-1.5 rounded-md text-neutral-600 hover:bg-neutral-100"
          >
            用户管理
          </Link>
          <Link
            href="/admin/content"
            className="px-3 py-1.5 rounded-md text-neutral-600 hover:bg-neutral-100"
          >
            内容管理
          </Link>
        </nav>
        <Link href="/" className="ml-auto text-sm text-blue-600 hover:underline">
          ← 返回站点
        </Link>
      </div>
      {children}
    </div>
  );
}
