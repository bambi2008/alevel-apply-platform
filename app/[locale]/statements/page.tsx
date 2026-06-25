"use client";

import { useEffect, useState } from "react";
import {
  UCAS_QUESTIONS,
  UCAS_TOTAL_LIMIT,
  UCAS_PER_QUESTION_MIN,
  SELF_CHECK,
  loadUcasPs,
  saveUcasPs,
  totalChars,
  emptyUcasPs,
  type UcasPsContent,
} from "@/lib/statements/store";

export default function StatementsPage() {
  const [content, setContent] = useState<UcasPsContent>(emptyUcasPs.content);
  const [loaded, setLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const existing = loadUcasPs();
    if (existing) setContent(existing.content);
    setLoaded(true);
  }, []);

  const total = totalChars(content);
  const overLimit = total > UCAS_TOTAL_LIMIT;
  const pct = Math.min(100, Math.round((total / UCAS_TOTAL_LIMIT) * 100));

  const onSave = () => {
    saveUcasPs(content);
    setSavedAt(new Date().toLocaleTimeString());
  };

  if (!loaded) return <div className="mx-auto max-w-3xl px-4 py-10 text-neutral-400">加载中…</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">文书工作台</h1>
      <p className="mt-2 text-neutral-600">
        UCAS 个人陈述（2026 入学起为 3 个结构化问题）。结构化引导 + 字数与格式自查，帮你自己写出高质量 PS。
      </p>
      <div className="mt-3 text-sm bg-amber-50 text-amber-800 rounded-lg px-3 py-2">
        ⚠️ 本工具仅辅助，不代写。个人陈述须为你本人原创——UCAS 内置相似度检测，代写有风险。AI 润色建议即将上线。
      </div>

      {/* 总字数进度 */}
      <div className="mt-6 sticky top-14 bg-white/95 backdrop-blur py-2 z-[5]">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">合计字符</span>
          <span className={overLimit ? "text-red-600 font-medium" : "text-neutral-700"}>
            {total} / {UCAS_TOTAL_LIMIT}
          </span>
        </div>
        <div className="mt-1 h-2 rounded-full bg-neutral-100 overflow-hidden">
          <div
            className={`h-full ${overLimit ? "bg-red-500" : "bg-blue-600"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* 三个问题 */}
      <div className="mt-4 space-y-6">
        {UCAS_QUESTIONS.map((q) => {
          const val = content[q.key];
          const tooShort = val.length > 0 && val.length < UCAS_PER_QUESTION_MIN;
          return (
            <div key={q.key}>
              <label className="font-medium">{q.title}</label>
              <p className="text-sm text-neutral-500 mt-0.5">{q.hint}</p>
              <textarea
                className="mt-2 w-full min-h-40 rounded-lg border border-neutral-300 px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={val}
                onChange={(e) => setContent((c) => ({ ...c, [q.key]: e.target.value }))}
                placeholder="在此撰写…"
              />
              <div className="mt-1 flex justify-between text-xs">
                <span className={tooShort ? "text-amber-600" : "text-neutral-400"}>
                  {tooShort ? `建议不少于 ${UCAS_PER_QUESTION_MIN} 字符` : " "}
                </span>
                <span className="text-neutral-400">{val.length} 字符</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 自查清单 */}
      <section className="mt-8 rounded-xl border border-neutral-200 p-5">
        <h2 className="font-semibold mb-3">提交前自查</h2>
        <ul className="space-y-2 text-sm text-neutral-600">
          {SELF_CHECK.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-neutral-300">☐</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={onSave}
          className="rounded-lg bg-blue-600 text-white px-6 py-2.5 font-medium hover:bg-blue-700"
        >
          保存草稿
        </button>
        {savedAt && <span className="text-sm text-green-600">✓ 已保存（{savedAt}）</span>}
      </div>
    </div>
  );
}
