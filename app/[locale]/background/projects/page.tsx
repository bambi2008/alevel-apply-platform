"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  ONLINE_PROJECTS,
  PROJECT_FIELDS,
  projectFieldEmoji,
} from "@/lib/background/projects";
import {
  computeProjectPercent,
  isEnrolled,
  subscribeProjects,
} from "@/lib/background/project-store";

const DIFF = ["", "入门", "进阶", "挑战"];

export default function ProjectsPage() {
  const [tick, setTick] = useState(0);
  useEffect(() => subscribeProjects(() => setTick((t) => t + 1)), []);
  // 触发一次客户端读取
  useEffect(() => setTick((t) => t + 1), []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="text-xs text-neutral-400 mb-1">
        <Link href="/background" className="hover:underline">← 背景提升</Link>
      </div>
      <h1 className="text-2xl font-bold mb-1">在线课题</h1>
      <p className="text-sm text-[var(--ink-soft)] mb-2">
        平台自有、贴近专业、可实际完成的高含金量课题。分阶段引导你做出真实产出（报告 / 作品集），
        比「给个题让你自己做」更扎实——每个阶段都有学习引导、任务与评价标准。
      </p>
      <p className="text-xs text-amber-700 bg-amber-50 rounded px-3 py-2 mb-6">
        完成课题会如实记录你的过程与产出，可写入个人陈述或作品集。平台不提供任何「官方认证」，
        但你的产出是真实的、可展示的。
      </p>

      {PROJECT_FIELDS.map((field) => {
        const projects = ONLINE_PROJECTS.filter((p) => p.field === field.value);
        if (projects.length === 0) return null;
        return (
          <section key={field.value} className="mb-8">
            <h2 className="text-sm font-semibold text-[var(--ink-soft)] mb-3 flex items-center gap-2">
              <span className="text-lg">{field.emoji}</span> {field.label}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4" data-tick={tick}>
              {projects.map((p) => {
                const enrolled = isEnrolled(p.id);
                const percent = computeProjectPercent(p.id, p.stages.length);
                return (
                  <Link
                    key={p.id}
                    href={`/background/projects/${p.id}`}
                    className="card-hover block rounded-2xl border border-[var(--border)] bg-white p-5 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-2xl">{projectFieldEmoji(p.field)}</span>
                      <span className="text-[11px] rounded-full px-2 py-0.5 bg-brand-soft text-[var(--indigo)] font-medium">
                        {DIFF[p.difficulty]}
                      </span>
                    </div>
                    <h3 className="font-semibold text-[var(--ink)] mb-1 leading-snug">{p.title}</h3>
                    <p className="text-sm text-[var(--ink-soft)] mb-2 line-clamp-2">{p.summary}</p>
                    <div className="mb-3">
                      <span className="text-[11px] rounded px-2 py-0.5 bg-indigo-50 text-[var(--indigo)] font-medium">
                        🛠️ {p.primaryTool.name.split("（")[0]}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {p.skills.slice(0, 3).map((s) => (
                        <span key={s} className="text-[11px] rounded px-1.5 py-0.5 bg-[var(--surface)] text-[var(--ink-soft)]">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-[var(--ink-soft)]">
                      <span>{p.stages.length} 个阶段 · {p.estimatedHours}</span>
                      {enrolled ? (
                        <span className="text-[var(--indigo)] font-medium">
                          {percent >= 100 ? "已完成 ✓" : `进行中 ${percent}%`}
                        </span>
                      ) : (
                        <span className="text-neutral-400">未开始</span>
                      )}
                    </div>
                    {enrolled && (
                      <div className="mt-2 h-1.5 rounded-full bg-[var(--surface)] overflow-hidden">
                        <div className="h-full bg-brand rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
