"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { getRoadmapProgress, type RoadmapProgress } from "@/lib/roadmap/actions";
import { NavIcon } from "@/components/nav-icons";

// 时间顺序节点 + 行动文案（与科技树一致的顺序）
const STEPS: { id: string; label: string; href: string; cta: string; why: string }[] = [
  { id: "profile", label: "完善档案", href: "/profile", cta: "去完善", why: "填好成绩与目标，系统才能为你个性化推荐。" },
  { id: "match", label: "选校匹配", href: "/match", cta: "去匹配", why: "定专业方向、把心仪院校加入你的清单。" },
  { id: "background", label: "背景提升", href: "/background", cta: "去规划", why: "竞赛/科研/夏校，让申请更有竞争力。" },
  { id: "tests", label: "考试备考", href: "/tests", cta: "去练习", why: "ESAT 等笔试的练习与计时模考。" },
  { id: "statements", label: "文书写作", href: "/statements", cta: "去写作", why: "UCAS 三题 + 港校 essay，写出真诚有力的文书。" },
  { id: "prep", label: "填表准备", href: "/apply-prep", cta: "去准备", why: "逐栏准备申请表内容，最后自己誊到官方系统。" },
  { id: "submit", label: "申请提交", href: "/applications", cta: "去追踪", why: "加入志愿、追踪每一所的申请状态。" },
];

export function NextActionBar() {
  const [data, setData] = useState<RoadmapProgress | null>(null);

  useEffect(() => {
    getRoadmapProgress().then(setData);
  }, []);

  if (!data || !data.authed) return null;

  const next = STEPS.find((s) => (data.nodes[s.id]?.pct ?? 0) < 100);

  // 全部完成
  if (!next) {
    return (
      <div className="rounded-2xl bg-[var(--ink)] text-white p-6 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
          <NavIcon name="check" width={22} height={22} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">你的下一步</p>
          <p className="text-lg font-bold mt-0.5">申请路线已全部推进完毕 🎉 保持关注各校截止日期与状态。</p>
        </div>
      </div>
    );
  }

  const pct = data.nodes[next.id]?.pct ?? 0;

  return (
    <div className="rounded-2xl bg-[var(--ink)] text-white p-6 flex items-center gap-5 flex-wrap sm:flex-nowrap">
      <div className="w-11 h-11 rounded-xl bg-[var(--indigo)] flex items-center justify-center shrink-0">
        <NavIcon name="target" width={22} height={22} className="text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">你的下一步</p>
        <p className="text-lg font-bold mt-0.5 truncate">{next.label}</p>
        <p className="text-sm text-white/70 mt-0.5">{next.why}</p>
      </div>
      {pct > 0 && (
        <div className="text-right shrink-0 hidden sm:block">
          <div className="text-2xl font-extrabold tabular-nums">{pct}%</div>
          <div className="text-xs text-white/50">已完成</div>
        </div>
      )}
      <Link
        href={next.href}
        className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-white text-[var(--ink)] px-5 py-2.5 font-semibold text-sm hover:bg-white/90 transition-colors"
      >
        {next.cta} <span>→</span>
      </Link>
    </div>
  );
}
