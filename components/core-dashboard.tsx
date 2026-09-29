"use client";

import { BookOpenCheck, FilePenLine, FlaskConical, MessagesSquare } from "lucide-react";
import { Link } from "@/i18n/navigation";

const CENTERS = [
  { href: "/tests", title: "考试训练", subtitle: "入学考试与 A-Level", action: "进入训练", icon: BookOpenCheck, tone: "border-blue-300/45 bg-blue-300/15 text-blue-100", tags: ["入学考试", "A-Level"] },
  { href: "/background", title: "竞赛与专业实践", subtitle: "把学术兴趣做成成果", action: "进入中心", icon: FlaskConical, tone: "border-amber-300/45 bg-amber-300/15 text-amber-100", tags: ["竞赛", "研究实践"] },
  { href: "/interview", title: "面试训练", subtitle: "高质量计算与表达", action: "开始练习", icon: MessagesSquare, tone: "border-emerald-300/45 bg-emerald-300/15 text-emerald-100", tags: ["学科面试", "追问训练"] },
  { href: "/statements", title: "文书", subtitle: "从素材到成稿", action: "进入工作台", icon: FilePenLine, tone: "border-rose-300/45 bg-rose-300/15 text-rose-100", tags: ["素材整理", "版本管理"] },
] as const;

export function CoreDashboard({ email, locale }: { email?: string | null; locale: string }) {
  return (
    <div className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-[#061013] text-white">
      <iframe
        src={`/${locale}/waterlight`}
        title="鼠标划动会产生波纹的交互水面"
        tabIndex={-1}
        className="absolute inset-0 h-full w-full border-0"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,12,15,.25)_0%,rgba(2,12,15,.12)_38%,rgba(2,10,13,.72)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,.05),transparent_46%)]" />

      <div className="pointer-events-none relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col justify-center px-5 py-5 sm:py-6">
        <header className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-xs font-semibold tracking-[0.18em] text-white/70">桥申训练中心</p>
            <span className="hidden h-px w-8 bg-white/35 sm:block" aria-hidden="true" />
            <p className="text-xs text-white/55">移动鼠标，让水面回应</p>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">今天要完成哪项训练？</h1>
          <p className="mt-2 text-sm leading-6 text-white/75 sm:text-base">四个核心入口，直接开始。练习、模考、面试和文书记录会持续保留。</p>
          {email && <p className="mt-1 text-xs text-white/50">当前账号：{email}</p>}
        </header>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="四个核心训练中心">
          {CENTERS.map((center) => {
            const Icon = center.icon;
            return (
              <Link
                key={center.href}
                href={center.href}
                className="pointer-events-auto group flex min-h-[185px] flex-col rounded-xl border border-white/20 bg-[#071316]/72 p-4 shadow-[0_18px_55px_rgba(0,0,0,.2)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/45 hover:bg-[#071316]/84 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${center.tone}`}><Icon className="size-[18px]" aria-hidden="true" /></span>
                  <span className="text-lg text-white/45 transition group-hover:translate-x-1 group-hover:text-white">→</span>
                </div>
                <div className="mt-4">
                  <h2 className="text-lg font-bold text-white">{center.title}</h2>
                  <p className="mt-1 text-sm leading-5 text-white/65">{center.subtitle}</p>
                </div>
                <div className="mt-auto flex items-end justify-between gap-2 pt-4">
                  <div className="flex flex-wrap gap-1.5">{center.tags.map((tag) => <span key={tag} className="rounded-full bg-white/[.09] px-2 py-1 text-[11px] text-white/65">{tag}</span>)}</div>
                  <span className="shrink-0 text-xs font-semibold text-white/80">{center.action} →</span>
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </div>
  );
}
