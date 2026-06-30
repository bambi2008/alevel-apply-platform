"use client";

import { useEffect, useState, useCallback } from "react";
import {
  APPLY_GUIDE_MODULES,
  loadProgress,
  saveProgress,
  type GuideModule,
  type ModuleProgress,
} from "@/lib/apply-guide";

function progressOf(data: ModuleProgress[], id: string): ModuleProgress {
  return data.find((d) => d.moduleId === id) ?? { moduleId: id, checked: [], done: false };
}

function patchProgress(data: ModuleProgress[], id: string, patch: Partial<ModuleProgress>): ModuleProgress[] {
  const existing = progressOf(data, id);
  const updated = { ...existing, ...patch };
  return [...data.filter((d) => d.moduleId !== id), updated];
}

function completedCount(data: ModuleProgress[]): number {
  return APPLY_GUIDE_MODULES.filter((m) => {
    const p = progressOf(data, m.id);
    return p.done;
  }).length;
}

export default function ApplyGuidePage() {
  const [progress, setProgress] = useState<ModuleProgress[]>([]);
  const [activeId, setActiveId] = useState<string | null>(APPLY_GUIDE_MODULES[0].id);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadProgress().then((p) => {
      setProgress(p);
      setLoaded(true);
    });
  }, []);

  const update = useCallback((id: string, patch: Partial<ModuleProgress>) => {
    setProgress((prev) => {
      const next = patchProgress(prev, id, patch);
      saveProgress(next);
      return next;
    });
  }, []);

  const toggleCheck = (moduleId: string, item: string) => {
    const p = progressOf(progress, moduleId);
    const checked = p.checked.includes(item)
      ? p.checked.filter((c) => c !== item)
      : [...p.checked, item];
    update(moduleId, { checked });
  };

  const toggleDone = (moduleId: string) => {
    const p = progressOf(progress, moduleId);
    update(moduleId, { done: !p.done });
  };

  const done = completedCount(progress);
  const total = APPLY_GUIDE_MODULES.length;

  const activeModule = APPLY_GUIDE_MODULES.find((m) => m.id === activeId) ?? APPLY_GUIDE_MODULES[0];

  if (!loaded) {
    return <div className="mx-auto max-w-5xl px-4 py-10 text-neutral-400">加载中…</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">UCAS 申请表填写指南</h1>
        <p className="mt-2 text-neutral-600">
          UCAS Application Form Guide — 8 个模块 · 逐项说明 · 大陆学生特别提示
        </p>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden max-w-xs">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${(done / total) * 100}%` }}
            />
          </div>
          <span className="text-sm text-neutral-500">
            已完成 {done} / {total} 模块
          </span>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 hidden md:block">
          <nav className="space-y-1 sticky top-20">
            {APPLY_GUIDE_MODULES.map((m) => {
              const p = progressOf(progress, m.id);
              const isActive = m.id === activeId;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveId(m.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  <span className="text-base shrink-0">{m.icon}</span>
                  <span className="flex-1 min-w-0 truncate">{m.title}</span>
                  {p.done && (
                    <span className="w-4 h-4 rounded-full bg-green-500 text-white text-[10px] flex items-center justify-center shrink-0">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden w-full mb-4">
          <select
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            value={activeId ?? ""}
            onChange={(e) => setActiveId(e.target.value)}
          >
            {APPLY_GUIDE_MODULES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.num}. {m.title} {m.titleEn}
              </option>
            ))}
          </select>
        </div>

        {/* Main content */}
        <ModuleDetail
          module={activeModule}
          progress={progressOf(progress, activeModule.id)}
          onToggleCheck={toggleCheck}
          onToggleDone={toggleDone}
          onNext={() => {
            const idx = APPLY_GUIDE_MODULES.findIndex((m) => m.id === activeId);
            if (idx < APPLY_GUIDE_MODULES.length - 1) {
              setActiveId(APPLY_GUIDE_MODULES[idx + 1].id);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          hasNext={APPLY_GUIDE_MODULES.findIndex((m) => m.id === activeId) < APPLY_GUIDE_MODULES.length - 1}
        />
      </div>
    </div>
  );
}

function ModuleDetail({
  module: m,
  progress,
  onToggleCheck,
  onToggleDone,
  onNext,
  hasNext,
}: {
  module: GuideModule;
  progress: ModuleProgress;
  onToggleCheck: (moduleId: string, item: string) => void;
  onToggleDone: (moduleId: string) => void;
  onNext: () => void;
  hasNext: boolean;
}) {
  return (
    <div className="flex-1 min-w-0 space-y-6">
      {/* Module header */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{m.icon}</span>
              <div>
                <h2 className="text-xl font-bold">
                  第 {m.num} 步 · {m.title}
                </h2>
                <p className="text-sm text-neutral-500">{m.titleEn}</p>
              </div>
            </div>
            <p className="text-neutral-700">{m.summary}</p>
          </div>
          <a
            href={m.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            UCAS 官网 ↗
          </a>
        </div>
      </div>

      {/* Overview */}
      <div>
        <h3 className="font-semibold text-neutral-800 mb-2">模块说明</h3>
        <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 rounded-xl p-4">
          {m.overview}
        </p>
      </div>

      {/* Fields */}
      <div>
        <h3 className="font-semibold text-neutral-800 mb-3">字段填写参考</h3>
        <div className="space-y-3">
          {m.fields.map((f, i) => (
            <div key={i} className="rounded-xl border border-neutral-200 p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                    {f.field}
                  </span>
                  <span className="ml-2 text-sm font-medium text-neutral-900">{f.fieldZh}</span>
                </div>
              </div>
              {f.example && (
                <div className="flex gap-2 items-start text-sm">
                  <span className="text-neutral-400 shrink-0 text-xs mt-0.5">填写示例</span>
                  <span className="font-mono text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded flex-1 break-words leading-relaxed">
                    {f.example}
                  </span>
                </div>
              )}
              {f.note && (
                <p className="text-xs text-neutral-600 leading-relaxed pl-2 border-l-2 border-neutral-200">
                  {f.note}
                </p>
              )}
              {f.warning && (
                <div className="flex gap-1.5 items-start text-xs text-red-700 bg-red-50 rounded-lg px-3 py-2">
                  <span className="shrink-0 mt-0.5">⚠️</span>
                  <span className="leading-relaxed">{f.warning}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* China-specific note */}
      {m.chinaNote && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 leading-relaxed">
          <span className="font-semibold">🇨🇳 大陆学生特别提示：</span>
          <span className="ml-1">{m.chinaNote}</span>
        </div>
      )}

      {/* Checklist */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-neutral-800">提交前自查</h3>
          <span className="text-xs text-neutral-400">
            {progress.checked.length} / {m.checklist.length} 项已勾选
          </span>
        </div>
        <div className="space-y-2">
          {m.checklist.map((item) => {
            const isChecked = progress.checked.includes(item);
            return (
              <label
                key={item}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition ${
                    isChecked
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-neutral-300 group-hover:border-blue-400"
                  }`}
                  onClick={() => onToggleCheck(m.id, item)}
                >
                  {isChecked && <span className="text-xs">✓</span>}
                </div>
                <span
                  className={`text-sm leading-relaxed transition ${
                    isChecked ? "text-neutral-400 line-through" : "text-neutral-700"
                  }`}
                  onClick={() => onToggleCheck(m.id, item)}
                >
                  {item}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Done button + next */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => onToggleDone(m.id)}
          className={`px-5 py-2.5 rounded-lg font-medium text-sm transition ${
            progress.done
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {progress.done ? "✓ 已完成此模块" : "标记为已完成"}
        </button>
        {hasNext && (
          <button
            type="button"
            onClick={onNext}
            className="px-5 py-2.5 rounded-lg border border-neutral-300 text-sm font-medium hover:bg-neutral-50 transition"
          >
            下一模块 →
          </button>
        )}
      </div>
    </div>
  );
}
