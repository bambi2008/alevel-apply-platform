"use client";

import { BookOpenCheck, FilePenLine, FlaskConical, MessagesSquare } from "lucide-react";
import { Link } from "@/i18n/navigation";

const CENTERS = [
  { href: "/tests", title: "考试训练", subtitle: "入学考试与 A-Level", description: "专项练习、完整模考、知识点复习和真实学情分析。", action: "进入考试训练", icon: BookOpenCheck, tone: "border-blue-200 bg-blue-50 text-blue-700", tags: ["入学考试", "A-Level", "计时模考"] },
  { href: "/background", title: "竞赛与专业实践", subtitle: "把学术兴趣做成成果", description: "竞赛训练、研究课题和专业实践集中在一个工作区。", action: "进入提升中心", icon: FlaskConical, tone: "border-amber-200 bg-amber-50 text-amber-800", tags: ["BMO / BPhO", "研究课题", "专业实践"] },
  { href: "/interview", title: "面试训练", subtitle: "高质量计算与表达", description: "练习建模、推导、口头计算、追问和临场修正。", action: "开始面试训练", icon: MessagesSquare, tone: "border-emerald-200 bg-emerald-50 text-emerald-800", tags: ["学科面试", "计算表达", "追问训练"] },
  { href: "/statements", title: "文书", subtitle: "从素材到成稿", description: "整理经历证据，完成 UCAS 与英港申请文书。", action: "进入文书工作台", icon: FilePenLine, tone: "border-rose-200 bg-rose-50 text-rose-800", tags: ["素材整理", "结构打磨", "版本管理"] },
] as const;

export function CoreDashboard({ email }: { email?: string | null }) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <header className="mb-9 max-w-3xl">
        <p className="text-sm font-semibold text-[var(--indigo)]">桥申训练中心</p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--ink)] sm:text-4xl">今天要完成哪项训练？</h1>
        <p className="mt-3 text-base leading-7 text-[var(--ink-soft)]">四个核心入口，直接开始。你的练习、模考、面试和文书记录会持续保留。</p>
        {email && <p className="mt-2 text-xs text-[var(--ink-faint)]">当前账号：{email}</p>}
      </header>
      <section className="grid gap-4 sm:grid-cols-2" aria-label="四个核心训练中心">
        {CENTERS.map((center) => {
          const Icon = center.icon;
          return (
            <Link key={center.href} href={center.href} className="group flex min-h-[250px] flex-col rounded-lg border border-[var(--border)] bg-white p-6 transition hover:border-[color:var(--indigo)]/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--indigo)]">
              <div className="flex items-start justify-between gap-4">
                <span className={`flex size-11 items-center justify-center rounded-lg border ${center.tone}`}><Icon className="size-5" aria-hidden="true" /></span>
                <span className="text-xl text-[var(--ink-faint)] transition group-hover:translate-x-1 group-hover:text-[var(--indigo)]">→</span>
              </div>
              <h2 className="mt-5 text-xl font-bold text-[var(--ink)]">{center.title}</h2>
              <p className="mt-1 text-sm font-medium text-[var(--ink-soft)]">{center.subtitle}</p>
              <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">{center.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">{center.tags.map((tag) => <span key={tag} className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--ink-soft)]">{tag}</span>)}</div>
              <span className="mt-auto pt-6 text-sm font-semibold text-[var(--indigo)]">{center.action} →</span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
