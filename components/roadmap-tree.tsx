"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { getRoadmapProgress, type RoadmapProgress } from "@/lib/roadmap/actions";

type NodeDef = {
  id: string;
  label: string;
  icon: string;
  href: string;
  desc: string;
  branch?: boolean; // 并行分叉节点
};

// 时间顺序 + 分叉：准备期的「背景提升 / 考试备考」两条支线并行
const NODES: NodeDef[] = [
  { id: "profile", label: "完善档案", icon: "👤", href: "/profile", desc: "填好成绩、科目、目标——一切的起点" },
  { id: "match", label: "选校匹配", icon: "🎯", href: "/match", desc: "定专业方向、匹配并加入意向院校" },
  { id: "background", label: "背景提升", icon: "🌟", href: "/background", desc: "竞赛 / 科研 / 夏校 / 课题", branch: true },
  { id: "tests", label: "考试备考", icon: "📐", href: "/tests", desc: "ESAT / 笔试练习与计时模考", branch: true },
  { id: "statements", label: "文书写作", icon: "✍️", href: "/statements", desc: "UCAS 三题 + 港校 essay" },
  { id: "prep", label: "填表准备", icon: "📋", href: "/apply-prep", desc: "逐栏准备申请表内容" },
  { id: "submit", label: "申请提交", icon: "📮", href: "/applications", desc: "加入志愿、追踪申请状态" },
];

type Status = "done" | "active" | "upcoming";

function ProgressRing({ pct, status, icon }: { pct: number; status: Status; icon: string }) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const off = circ - (pct / 100) * circ;
  return (
    <div className="relative w-[68px] h-[68px] shrink-0">
      <svg viewBox="0 0 68 68" className="w-full h-full -rotate-90">
        <circle cx="34" cy="34" r={r} fill="none" stroke="var(--border)" strokeWidth="5" />
        <circle
          cx="34" cy="34" r={r} fill="none"
          stroke="url(#ringGrad)" strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.2,0.7,0.2,1)" }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="60%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
      <div
        className={`absolute inset-0 flex items-center justify-center text-2xl ${status === "upcoming" ? "grayscale opacity-50" : ""}`}
      >
        {status === "done" ? "✅" : icon}
      </div>
    </div>
  );
}

function statusOf(nodes: RoadmapProgress["nodes"]): Record<string, Status> {
  const out: Record<string, Status> = {};
  let activeSet = false;
  for (const n of NODES) {
    const pct = nodes[n.id]?.pct ?? 0;
    if (pct >= 100) out[n.id] = "done";
    else if (!activeSet) {
      out[n.id] = "active";
      activeSet = true;
    } else out[n.id] = "upcoming";
  }
  return out;
}

export function RoadmapTree() {
  const [data, setData] = useState<RoadmapProgress | null>(null);

  useEffect(() => {
    getRoadmapProgress().then(setData);
  }, []);

  if (!data) return <div className="py-8 text-neutral-400 text-sm">加载路线图…</div>;

  const nodes = data.nodes;
  const statuses = statusOf(nodes);
  const overall = Math.round(
    NODES.reduce((a, n) => a + (nodes[n.id]?.pct ?? 0), 0) / NODES.length
  );
  const activeNode = NODES.find((n) => statuses[n.id] === "active");

  return (
    <div className="mesh-hero grain relative overflow-hidden rounded-3xl border border-[var(--border)] p-6 sm:p-8 mb-8">
      <div className="pointer-events-none absolute -top-16 right-0 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.14),transparent_70%)] floaty-slow" />

      {/* 顶部：总进度 + 下一步提示 */}
      <div className="relative flex items-end justify-between gap-4 flex-wrap mb-7">
        <div>
          <p className="text-xs font-semibold text-[var(--indigo)] tracking-wide uppercase mb-1">你的申请路线图</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
            总进度 <span className="stat-num">{overall}%</span>
          </h2>
          {activeNode && (
            <p className="mt-1.5 text-sm text-[var(--ink-soft)]">
              下一步建议：<Link href={activeNode.href} className="text-[var(--indigo)] font-medium hover:underline">{activeNode.icon} {activeNode.label}</Link>
            </p>
          )}
        </div>
        <div className="w-full sm:w-56">
          <div className="h-2 rounded-full bg-white/60 overflow-hidden">
            <div className="h-full bg-brand transition-all duration-700" style={{ width: `${overall}%` }} />
          </div>
        </div>
      </div>

      {/* 科技树主体 */}
      <div className="relative space-y-3">
        {NODES.map((n, i) => {
          const st = statuses[n.id];
          const pct = nodes[n.id]?.pct ?? 0;
          const isActive = st === "active";
          const prev = NODES[i - 1];
          const showFork = n.branch && prev && !prev.branch; // 分叉起点

          return (
            <div key={n.id} className="relative">
              {/* 连接线 */}
              {i > 0 && (
                <div className="absolute left-[33px] -top-3 h-3 w-0.5 bg-gradient-to-b from-[var(--violet)]/40 to-[var(--violet)]/40" />
              )}
              {showFork && (
                <p className="text-[11px] text-[var(--ink-soft)] ml-[84px] mb-1">↓ 准备期 · 两条支线可并行推进</p>
              )}
              <Link
                href={n.href}
                className={`group flex items-center gap-4 rounded-2xl border p-3.5 transition-all ${
                  isActive
                    ? "border-[var(--violet)] bg-white shadow-[0_10px_30px_-12px_rgba(124,58,237,0.5)] ring-2 ring-[var(--violet)]/20"
                    : st === "done"
                    ? "border-green-200 bg-green-50/40 hover:bg-white"
                    : "border-[var(--border)] bg-white/60 hover:bg-white hover:border-indigo-200"
                } ${n.branch ? "sm:ml-10" : ""}`}
              >
                <ProgressRing pct={pct} status={st} icon={n.icon} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-semibold ${st === "upcoming" ? "text-[var(--ink-soft)]" : "text-[var(--ink)]"}`}>
                      {n.label}
                    </h3>
                    {isActive && (
                      <span className="text-[11px] font-bold text-white bg-brand rounded-full px-2 py-0.5 animate-pulse">
                        你在这里
                      </span>
                    )}
                    {n.branch && (
                      <span className="text-[11px] text-[var(--violet)] bg-brand-soft rounded-full px-2 py-0.5">支线</span>
                    )}
                    <span className="ml-auto text-sm font-bold stat-num">{pct}%</span>
                  </div>
                  <p className="text-sm text-[var(--ink-soft)] mt-0.5 truncate">{n.desc}</p>
                </div>
                <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[var(--indigo)] shrink-0">→</span>
              </Link>
            </div>
          );
        })}
      </div>

      <p className="relative mt-5 text-xs text-[var(--ink-soft)]">
        进度由系统根据你的真实数据自动计算。考试类节点“做多做少看个人”，显示的是练习/模考的完成比例。
      </p>
    </div>
  );
}
