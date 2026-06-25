import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "桥申 · A-Level 英国/香港大学申请平台",
  description:
    "为中国大陆 A-Level 学生提供低成本、透明、流程化的英国（UCAS）与香港大学申请工具：选校匹配、院校数据库、申请追踪、文书工具。",
};

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/match", label: "选校匹配" },
  { href: "/universities", label: "院校库" },
  { href: "/profile", label: "我的档案" },
  { href: "/#pricing", label: "定价" },
];

function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white/90 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          桥申<span className="text-blue-600">·</span>
          <span className="text-sm font-normal text-neutral-500 ml-1">A-Level 英港申请</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/match"
            className="ml-2 px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            免费选校
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-neutral-200 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-500 flex flex-col sm:flex-row justify-between gap-2">
        <span>© {new Date().getFullYear()} 桥申 · 仅供参考，院校要求以官方为准</span>
        <span>本平台不代写文书、不承诺录取结果</span>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
