"use client";

import { PageHeader } from "@/components/page-header";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  UCAS_TOTAL_LIMIT,
  UCAS_PER_QUESTION_MIN,
  loadUcasPs,
  saveUcasPs,
  totalChars,
  emptyUcasPs,
  type UcasPsContent,
} from "@/lib/statements/store";
import { ImportFromProjects } from "@/components/statements/import-from-projects";
import { HkEssayEditor } from "@/components/statements/hk-essay-editor";

const KEYS: (keyof UcasPsContent)[] = ["q1", "q2", "q3"];

type Coach = {
  strengths: string[];
  issues: string[];
  suggestions: string[];
  questions: string[];
  summary: string;
};

export default function StatementsPage() {
  const t = useTranslations("statements");
  const tc = useTranslations("common");
  const [content, setContent] = useState<UcasPsContent>(emptyUcasPs.content);
  const [loaded, setLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [fb, setFb] = useState<Record<string, { loading?: boolean; data?: Coach; error?: string }>>({});
  const [overall, setOverall] = useState<{ loading?: boolean; data?: Coach; error?: string }>({});
  const [region, setRegion] = useState<"uk" | "hk">("uk");

  useEffect(() => {
    loadUcasPs().then((existing) => {
      if (existing) setContent(existing.content);
      setLoaded(true);
    });
  }, []);

  const total = totalChars(content);
  const overLimit = total > UCAS_TOTAL_LIMIT;
  const pct = Math.min(100, Math.round((total / UCAS_TOTAL_LIMIT) * 100));

  const onSave = async () => {
    setSavedAt(null);
    await saveUcasPs(content);
    setSavedAt(new Date().toLocaleTimeString());
  };

  const getCoach = async (key: keyof UcasPsContent) => {
    const text = content[key];
    if (!text.trim()) {
      setFb((f) => ({ ...f, [key]: { error: "请先写点内容，AI 教练才能点评这一题。" } }));
      return;
    }
    setFb((f) => ({ ...f, [key]: { loading: true } }));
    try {
      const res = await fetch("/api/ps-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: key, text }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "点评失败");
      }
      const data = (await res.json()) as Coach;
      setFb((f) => ({ ...f, [key]: { data } }));
    } catch (e) {
      setFb((f) => ({ ...f, [key]: { error: e instanceof Error ? e.message : "点评失败" } }));
    }
  };

  const getOverall = async () => {
    if (!content.q1.trim() && !content.q2.trim() && !content.q3.trim()) {
      setOverall({ error: "请先写点内容再做整体点评。" });
      return;
    }
    setOverall({ loading: true });
    try {
      const res = await fetch("/api/ps-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "overall", q1: content.q1, q2: content.q2, q3: content.q3 }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "点评失败");
      }
      const data = (await res.json()) as Coach;
      setOverall({ data });
    } catch (e) {
      setOverall({ error: e instanceof Error ? e.message : "点评失败" });
    }
  };

  if (!loaded) return <div className="mx-auto max-w-3xl px-4 py-10 text-neutral-400">{tc("loading")}</div>;

  const questions = t.raw("questions") as { title: string; hint: string }[];
  const selfCheck = t.raw("selfCheck") as string[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader title={t("title")} subtitle={t("intro")} icon="✍️" />

      {/* 英国 / 香港 切换 */}
      <div className="mt-4 inline-flex rounded-lg border border-neutral-200 p-1 bg-neutral-50">
        <button
          type="button"
          onClick={() => setRegion("uk")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium ${region === "uk" ? "bg-white shadow text-neutral-900" : "text-neutral-500"}`}
        >
          🇬🇧 英国 UCAS（三问）
        </button>
        <button
          type="button"
          onClick={() => setRegion("hk")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium ${region === "hk" ? "bg-white shadow text-neutral-900" : "text-neutral-500"}`}
        >
          🇭🇰 香港（单篇）
        </button>
      </div>

      {/* 参考资源（学生自学，不代写） */}
      <div className="mt-4 text-sm rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-neutral-600">
        📚 想看各专业优秀文书长什么样？可参考{" "}
        <a
          href="https://firstclasseducation.org.uk/guides/category/Personal+Statement"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline font-medium"
        >
          First Class Education 各专业 PS 指南
        </a>
        （含工程 / CS / 经济 / 数学 / 生物 / 物理等，附最新牛剑录取数据）。仅供学习参考——请务必用自己的话原创，切勿照搬（UCAS 有相似度检测）。
      </div>

      {region === "hk" && <HkEssayEditor />}

      {region === "uk" && (
        <>
      <div className="mt-3 text-sm bg-amber-50 text-amber-800 rounded-lg px-3 py-2">{t("aiNotice")}</div>

      {/* Total character progress */}
      <div className="mt-6 sticky top-14 bg-white/95 backdrop-blur py-2 z-[5]">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">{t("totalChars")}</span>
          <span className={overLimit ? "text-red-600 font-medium" : "text-neutral-700"}>
            {total} / {UCAS_TOTAL_LIMIT}
          </span>
        </div>
        <div className="mt-1 h-2 rounded-full bg-neutral-100 overflow-hidden">
          <div className={`h-full ${overLimit ? "bg-red-500" : "bg-blue-600"}`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Three questions */}
      <div className="mt-4 space-y-6">
        {questions.map((q, i) => {
          const key = KEYS[i];
          const val = content[key];
          const tooShort = val.length > 0 && val.length < UCAS_PER_QUESTION_MIN;
          const f = fb[key];
          return (
            <div key={key}>
              <label className="font-medium">{q.title}</label>
              <p className="text-sm text-neutral-500 mt-0.5">{q.hint}</p>
              <textarea
                className="mt-2 w-full min-h-40 rounded-lg border border-neutral-300 px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={val}
                onChange={(e) => setContent((c) => ({ ...c, [key]: e.target.value }))}
                placeholder={t("placeholder")}
              />
              <div className="mt-1 flex justify-between text-xs">
                <span className={tooShort ? "text-amber-600" : "text-neutral-400"}>
                  {tooShort ? t("minHint", { min: UCAS_PER_QUESTION_MIN }) : " "}
                </span>
                <span className="text-neutral-400">{t("chars", { n: val.length })}</span>
              </div>

              {/* AI 教练 */}
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => getCoach(key)}
                  disabled={f?.loading}
                  className="text-sm px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50 disabled:opacity-60"
                >
                  {f?.loading ? "点评中…" : "🎓 让 AI 教练点评这一题"}
                </button>
                <span className="ml-2 text-xs text-neutral-400">不代写，只给诊断、建议与追问</span>

                {f?.error && (
                  <p className="mt-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">{f.error}</p>
                )}

                {f?.data && (
                  <div className="mt-2 space-y-3 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
                    {f.data.summary && <p className="text-sm font-medium text-neutral-800">{f.data.summary}</p>}
                    <FbList title="✅ 写得好" items={f.data.strengths} color="text-green-700" />
                    <FbList title="⚠️ 具体问题" items={f.data.issues} color="text-amber-700" />
                    <FbList title="💡 改进方向" items={f.data.suggestions} color="text-indigo-700" />
                    <FbList title="🤔 深入追问" items={f.data.questions} color="text-violet-700" />
                    <p className="text-[11px] text-neutral-400 pt-1 border-t border-indigo-100">
                      这些是教练建议。文书必须是你本人的真实想法与文字（UCAS 有相似度检测）。
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 从我的课题导入素材 */}
      <ImportFromProjects content={content} />

      {/* 整体统读点评 */}
      <section className="mt-8 rounded-xl border border-indigo-200 bg-indigo-50/30 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-neutral-800">📋 整体点评</h2>
            <p className="text-sm text-neutral-500 mt-0.5">把三题当一个整体通读：查重复、篇幅分配、整体连贯（招生官正是这样读的）。</p>
          </div>
          <button
            type="button"
            onClick={getOverall}
            disabled={overall.loading}
            className="shrink-0 text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {overall.loading ? "点评中…" : "通读三题·整体点评"}
          </button>
        </div>

        {overall.error && (
          <p className="mt-3 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">{overall.error}</p>
        )}

        {overall.data && (
          <div className="mt-3 space-y-3 rounded-xl border border-indigo-100 bg-white p-4">
            {overall.data.summary && <p className="text-sm font-medium text-neutral-800">{overall.data.summary}</p>}
            <FbList title="✅ 整体优点" items={overall.data.strengths} color="text-green-700" />
            <FbList title="⚠️ 整体问题（重复 / 篇幅 / 连贯）" items={overall.data.issues} color="text-amber-700" />
            <FbList title="💡 改进方向" items={overall.data.suggestions} color="text-indigo-700" />
            <FbList title="🤔 深入追问" items={overall.data.questions} color="text-violet-700" />
            <p className="text-[11px] text-neutral-400 pt-1 border-t border-indigo-100">
              这些是教练建议。文书必须是你本人的真实想法与文字（UCAS 有相似度检测）。
            </p>
          </div>
        )}
      </section>

      {/* Self-check */}
      <section className="mt-8 rounded-xl border border-neutral-200 p-5">
        <h2 className="font-semibold mb-3">{t("selfCheckTitle")}</h2>
        <ul className="space-y-2 text-sm text-neutral-600">
          {selfCheck.map((item, i) => (
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
          {t("save")}
        </button>
        {savedAt && <span className="text-sm text-green-600">✓ {t("savedAt")}（{savedAt}）</span>}
      </div>
        </>
      )}
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
