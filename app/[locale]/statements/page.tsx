"use client";

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

const KEYS: (keyof UcasPsContent)[] = ["q1", "q2", "q3"];

export default function StatementsPage() {
  const t = useTranslations("statements");
  const tc = useTranslations("common");
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

  if (!loaded) return <div className="mx-auto max-w-3xl px-4 py-10 text-neutral-400">{tc("loading")}</div>;

  const questions = t.raw("questions") as { title: string; hint: string }[];
  const selfCheck = t.raw("selfCheck") as string[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-neutral-600">{t("intro")}</p>
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
            </div>
          );
        })}
      </div>

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
    </div>
  );
}
