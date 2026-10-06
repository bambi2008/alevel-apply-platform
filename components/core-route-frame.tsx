"use client";

import type { ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";

const CORE_ROUTES = [
  { key: "tests", href: "/tests", index: "01", title: "考试训练" },
  { key: "background", href: "/background", index: "02", title: "竞赛与专业实践" },
  { key: "interview", href: "/interview", index: "03", title: "面试训练" },
  { key: "statements", href: "/statements", index: "04", title: "文书" },
] as const;

const ROUTE_LABELS: Record<string, string> = {
  learn: "知识学习",
  practice: "专项练习",
  mock: "计时训练",
  paper: "计时作答",
  review: "错题复测",
  history: "历史报告",
  projects: "在线课题",
  "my-projects": "我的项目",
  new: "新建实践",
  maths: "数学面试",
  physics: "物理面试",
  chemistry: "化学面试",
  biology: "生物面试",
  engineering: "工程面试",
  compsci: "计算机面试",
  medicine: "医学面试",
  economics: "经济面试",
  law: "法律面试",
};

function routeLabel(segments: string[]) {
  const last = segments.at(-1) ?? "";
  if (ROUTE_LABELS[last]) return ROUTE_LABELS[last];
  if (segments[0] === "tests" && segments.length === 2) {
    return last.replace(/^caie/i, "CAIE ").replace(/([a-z])([0-9])/gi, "$1 $2").toUpperCase();
  }
  if (segments[0] === "background" && segments.includes("projects") && segments.length > 2) return "课题详情";
  if (segments[0] === "interview" && segments.length > 1) return "学科训练";
  return "当前工作区";
}

export function CoreRouteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "zh-CN" || segments[0] === "en") segments.shift();

  const current = CORE_ROUTES.find((route) => route.key === segments[0]);
  if (!current) return children;

  const nested = segments.length > 1;

  return (
    <div className="core-route-frame min-h-[calc(100svh-4rem)]">
      {nested ? (
        <aside className="core-route-masthead border-b border-black/15" aria-label="当前核心路径">
          <div className="mx-auto max-w-6xl px-5 py-5 sm:px-8 sm:py-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <Link href={current.href} className="group inline-flex w-fit items-baseline gap-3 text-[#101817]">
                <span className="text-xs font-semibold tracking-[0.2em] text-black/40">CORE {current.index} / 04</span>
                <span className="text-lg font-semibold tracking-[-0.025em] group-hover:underline group-hover:underline-offset-4">{current.title}</span>
              </Link>
              <p className="text-xs font-semibold tracking-[0.16em] text-black/35">
                LEVEL {String(segments.length).padStart(2, "0")} · {routeLabel(segments)}
              </p>
            </div>
            <nav className="mt-4 grid grid-cols-2 border-y border-black/15 sm:grid-cols-4" aria-label="四个核心路径">
              {CORE_ROUTES.map((route) => {
                const active = route.key === current.key;
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center gap-2 border-black/15 px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#101817] sm:border-r sm:last:border-r-0 ${
                      active ? "bg-[#101817] text-white" : "text-black/45 hover:bg-white/55 hover:text-black"
                    }`}
                  >
                    <span className={active ? "text-white/55" : "text-black/30"}>{route.index}</span>
                    <span className="truncate">{route.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
      ) : null}
      {children}
    </div>
  );
}
