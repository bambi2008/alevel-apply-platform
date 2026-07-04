"use client";

import { useEffect, useState } from "react";
import {
  HK_UNIS,
  HK_SELF_CHECK,
  loadHkEssay,
  saveHkEssay,
  emptyHkEssay,
  type HkEssayContent,
} from "@/lib/statements/store";

type Coach = {
  strengths: string[];
  issues: string[];
  suggestions: string[];
  questions: string[];
  summary: string;
};

function countWords(s: string): number {
  const t = s.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

export function HkEssayEditor() {
  const [content, setContent] = useState<HkEssayContent>(emptyHkEssay.content);
  const [loaded, setLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [fb, setFb] = useState<{ loading?: boolean; data?: Coach; error?: string }>({});

  useEffect(() => {
    loadHkEssay().then((e) => {
      if (e) setContent(e.content);
      setLoaded(true);
    });
  }, []);

  const uni = HK_UNIS.find((u) => u.value === (content.targetUni || "HKU")) ?? HK_UNIS[0];
  const words = countWords(content.body);
  const overWords = words > uni.limit;

  const onSave = async () => {
    setSavedAt(null);
    await saveHkEssay(content);
    setSavedAt(new Date().toLocaleTimeString());
  };

  const getCoach = async () => {
    if (!content.body.trim()) {
      setFb({ error: "请先写点内容，AI 教练才能点评。" });
      return;
    }
    setFb({ loading: true });
    try {
      const res = await fetch("/api/ps-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "hk", text: content.body, targetUni: uni.label }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "点评失败");
      }
      setFb({ data: (await res.json()) as Coach });
    } catch (e) {
      setFb({ error: e instanceof Error ? e.message : "点评失败" });
    }
  };

  if (!loaded) return <div className="py-10 text-neutral-400">加载中…</div>;

  return (
    <div>
      <div className="mt-3 text-sm bg-amber-50 text-amber-800 rounded-lg px-3 py-2">
        港校文书与英国不同：要写清「为什么选这所学校、这个专业」。本工具只做批改与建议，不代写。
      </div>

      {/* 目标院校 */}
      <div className="mt-6">
        <label className="text-sm font-medium">目标院校</label>
        <select
          value={content.targetUni || "HKU"}
          onChange={(e) => setContent((c) => ({ ...c, targetUni: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-white"
        >
          {HK_UNIS.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-neutral-500 mt-1">{uni.hint}</p>
      </div>

      {/* essay 正文 */}
      <div className="mt-4">
        <label className="text-sm font-medium">个人陈述正文</label>
        <textarea
          className="mt-2 w-full min-h-72 rounded-lg border border-neutral-300 px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={content.body}
          onChange={(e) => setContent((c) => ({ ...c, body: e.target.value }))}
          placeholder="用英文写一篇个人陈述：为什么选这所学校与专业、你的相关经历与成长、未来目标与能贡献什么…"
        />
        <div className="mt-1 flex justify-between text-xs">
          <span className={overWords ? "text-red-600 font-medium" : "text-neutral-400"}>
            约 {words} 词{overWords ? `（超过建议上限 ${uni.limit}）` : `（建议 ≤ ${uni.limit}）`}
          </span>
          <span className="text-neutral-400">{content.body.length} 字符</span>
        </div>
      </div>

      {/* AI 教练 */}
      <div className="mt-3">
        <button
          type="button"
          onClick={getCoach}
          disabled={fb.loading}
          className="text-sm px-4 py-2 rounded-lg border border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50 disabled:opacity-60"
        >
          {fb.loading ? "点评中…" : "🎓 让 AI 教练点评这篇"}
        </button>
        <span className="ml-2 text-xs text-neutral-400">按港校标准诊断，不代写</span>

        {fb.error && <p className="mt-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">{fb.error}</p>}
        {fb.data && (
          <div className="mt-2 space-y-3 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
            {fb.data.summary && <p className="text-sm font-medium text-neutral-800">{fb.data.summary}</p>}
            <FbList title="✅ 写得好" items={fb.data.strengths} color="text-green-700" />
            <FbList title="⚠️ 具体问题" items={fb.data.issues} color="text-amber-700" />
            <FbList title="💡 改进方向" items={fb.data.suggestions} color="text-indigo-700" />
            <FbList title="🤔 深入追问" items={fb.data.questions} color="text-violet-700" />
            <p className="text-[11px] text-neutral-400 pt-1 border-t border-indigo-100">
              这些是教练建议。文书必须是你本人的真实、原创文字。
            </p>
          </div>
        )}
      </div>

      {/* 自检 */}
      <section className="mt-8 rounded-xl border border-neutral-200 p-5">
        <h2 className="font-semibold mb-3">港校文书自检清单</h2>
        <ul className="space-y-2 text-sm text-neutral-600">
          {HK_SELF_CHECK.map((item, i) => (
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
          保存
        </button>
        {savedAt && <span className="text-sm text-green-600">✓ 已保存（{savedAt}）</span>}
      </div>
    </div>
  );
}

function FbList({ title, items, color }: { title: string; items: string[]; color: string }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className={`text-xs font-semibold mb-1 ${color}`}>{title}</p>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="text-sm text-neutral-700 flex gap-2">
            <span className="text-neutral-300">·</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
