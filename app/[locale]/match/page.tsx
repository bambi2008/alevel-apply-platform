"use client";

import { PageHeader } from "@/components/page-header";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SUBJECTS, GRADES, FIELDS, fieldLabel } from "@/lib/constants";
import { loadProfile, profileHasGrades } from "@/lib/profile/store";
import {
  getDirection, scanFeasibility, gradeTier, GRADE_TIER_NOTE,
  BUDGET_BANDS, getBudgetNote,
} from "@/lib/advisor/logic";

type Row = { subject: string; grade: string };

function guessField(majors: string[]): string {
  for (const m of majors) {
    const s = m.trim();
    const lm = s.toLowerCase();
    const f = FIELDS.find(
      (x) => x.zh.includes(s) || s.includes(x.zh) || lm.includes(x.en.toLowerCase()) || lm.includes(x.value),
    );
    if (f) return f.value;
  }
  return "cs";
}

export default function DecisionAssistantPage() {
  const locale = useLocale();
  const isEn = locale === "en";

  const [rows, setRows] = useState<Row[]>([
    { subject: "Mathematics", grade: "A*" },
    { subject: "Physics", grade: "A" },
    { subject: "Chemistry", grade: "A" },
  ]);
  const [field, setField] = useState<string>("cs");
  const [budget, setBudget] = useState<string>("unsure");
  const [submitted, setSubmitted] = useState(false);
  const [fromProfile, setFromProfile] = useState(false);

  useEffect(() => {
    loadProfile().then((p) => {
      if (p && profileHasGrades(p)) {
        setRows(p.subjects.map((s) => ({ subject: s.subject, grade: s.grade })));
        setField(guessField(p.intendedMajors ?? []));
        setFromProfile(true);
      }
    });
  }, []);

  const setRow = (i: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const addRow = () =>
    setRows((rs) => (rs.length >= 5 ? rs : [...rs, { subject: SUBJECTS[0], grade: "A" }]));
  const removeRow = (i: number) => setRows((rs) => rs.filter((_, idx) => idx !== i));

  const analysis = useMemo(() => {
    if (!submitted) return null;
    const subjects = rows.map((r) => r.subject).filter(Boolean);
    const grades = rows.map((r) => r.grade).filter(Boolean);
    const feas = scanFeasibility(subjects);
    const dir = getDirection(field);
    const tier = gradeTier(grades);
    const missingEssential = dir ? dir.essential.filter((s) => !subjects.includes(s)) : [];
    const missingRecommended = dir ? dir.recommended.filter((s) => !subjects.includes(s)) : [];
    return { feas, dir, tier, missingEssential, missingRecommended };
  }, [submitted, rows, field]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <PageHeader
        title={isEn ? "Decision Assistant" : "选校决策助手"}
        subtitle={
          isEn
            ? "Tell us your A-Level choices, predicted grades and budget. We'll show what your subjects qualify for, a UK + Hong Kong strategy, and exactly which admission tests to prepare — no school lists, just decisions."
            : "填入你的 A-Level 选科、预估成绩与预算，我们告诉你：选科能申什么、UK＋香港怎么两条腿走、该准备哪些笔试（一步跳到题库）。不罗列学校，只帮你做决定。"
        }
        icon="🧭"
      />

      {fromProfile && (
        <Link
          href="/profile"
          className="mt-3 block text-sm text-[var(--indigo)] bg-[var(--info-bg)] rounded-lg px-3 py-2 hover:bg-[var(--surface-2)]"
        >
          {isEn ? "Loaded grades from your Profile — adjust below if needed." : "已带入「我的档案」中的成绩，可在下方临时调整。"}
        </Link>
      )}

      {/* 表单 */}
      <div className="mt-6 rounded-2xl border border-[var(--border)] p-5">
        <label className="flex items-center gap-2 text-sm text-[var(--ink-soft)] mb-4">
          {isEn ? "Intended direction" : "意向专业方向"}
          <select
            className="flex-1 rounded-md border border-[var(--border)] px-3 py-2 text-sm"
            value={field}
            onChange={(e) => setField(e.target.value)}
          >
            {FIELDS.map((f) => (
              <option key={f.value} value={f.value}>{fieldLabel(f.value, locale)}</option>
            ))}
          </select>
        </label>

        <div className="text-xs text-[var(--ink-faint)] mb-2">{isEn ? "A-Level subjects & predicted grades" : "A-Level 选科与预估成绩"}</div>
        <div className="space-y-3">
          {rows.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <select
                className="flex-1 rounded-md border border-[var(--border)] px-3 py-2 text-sm"
                value={r.subject}
                onChange={(e) => setRow(i, { subject: e.target.value })}
              >
                {SUBJECTS.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
              <select
                className="w-24 rounded-md border border-[var(--border)] px-3 py-2 text-sm"
                value={r.grade}
                onChange={(e) => setRow(i, { grade: e.target.value })}
              >
                {GRADES.map((g) => (<option key={g} value={g}>{g}</option>))}
              </select>
              <button
                type="button"
                onClick={() => removeRow(i)}
                disabled={rows.length <= 1}
                className="px-2 py-2 text-[var(--ink-faint)] hover:text-[var(--danger)] disabled:opacity-30"
                aria-label="remove"
              >✕</button>
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={addRow}
            disabled={rows.length >= 5}
            className="text-sm text-[var(--indigo)] hover:underline disabled:opacity-40"
          >+ {isEn ? "Add subject" : "添加科目"}</button>
          <label className="flex items-center gap-2 text-sm text-[var(--ink-soft)] ml-auto">
            {isEn ? "Budget" : "预算"}
            <select
              className="rounded-md border border-[var(--border)] px-2 py-1.5 text-sm"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            >
              {BUDGET_BANDS.map((b) => (
                <option key={b.value} value={b.value}>{isEn ? b.en : b.zh}</option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="mt-5 w-full btn btn-primary"
        >{isEn ? "Analyse my options" : "生成决策建议"}</button>
      </div>

      {/* 结果 */}
      {analysis && (
        <div className="mt-8 space-y-8">
          {/* 1. 选科可行性扫描 */}
          <section>
            <h2 className="font-semibold text-[var(--ink)] mb-1">{isEn ? "What your subjects qualify for" : "你的选科能申什么"}</h2>
            <p className="text-sm text-[var(--ink-soft)] mb-3">
              {isEn ? "Based on the essential A-Level subjects most top UK universities require." : "依据多数英国顶尖院校对各方向的硬性选科要求。"}
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {analysis.feas.map((f) => (
                <div
                  key={f.value}
                  className={`rounded-xl border p-3 text-sm ${
                    f.status === "open"
                      ? "bg-[var(--success-bg)] text-[var(--success)] border-[color:var(--success)]/20"
                      : "bg-[var(--warning-bg)] text-[var(--warning)] border-[color:var(--warning)]/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{f.status === "open" ? "✓" : "!"}</span>
                    <span className="font-medium text-[var(--ink)]">{isEn ? f.en : f.zh}</span>
                  </div>
                  {f.status === "limited" && (
                    <div className="mt-1 text-xs">
                      {isEn ? "Usually needs: " : "通常需补："}{f.missing.join(isEn ? ", " : "、")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 2. 选定方向策略卡 */}
          {analysis.dir && (
            <section className="rounded-2xl border border-[var(--border)] p-5">
              <h2 className="font-semibold text-[var(--ink)] mb-3">
                {isEn ? `Strategy for ${analysis.dir.en}` : `${analysis.dir.zh} · 申请策略`}
              </h2>

              {analysis.missingEssential.length > 0 ? (
                <div className="mb-3 rounded-lg bg-[var(--warning-bg)] text-[var(--warning)] px-3 py-2 text-sm">
                  {isEn
                    ? `Heads up: most top universities require ${analysis.missingEssential.join(", ")} for this direction, which isn't in your current subjects.`
                    : `注意：多数顶尖院校该方向要求 ${analysis.missingEssential.join("、")}，你当前选科里没有。`}
                </div>
              ) : (
                <div className="mb-3 rounded-lg bg-[var(--success-bg)] text-[var(--success)] px-3 py-2 text-sm">
                  {isEn ? "Your subjects meet the essential requirements for this direction." : "你的选科满足该方向的硬性选科要求。"}
                </div>
              )}

              {analysis.missingRecommended.length > 0 && (
                <p className="text-sm text-[var(--ink-soft)] mb-3">
                  {isEn ? "Recommended (boosts competitiveness): " : "推荐加修（更有竞争力）："}
                  {analysis.missingRecommended.join(isEn ? ", " : "、")}
                </p>
              )}

              <p className="text-sm text-[var(--ink-soft)] mb-2 leading-relaxed">
                {GRADE_TIER_NOTE[analysis.tier][isEn ? "en" : "zh"]}
              </p>

              <div className="space-y-2 text-sm text-[var(--ink-soft)] leading-relaxed mt-3">
                <p><span className="font-medium text-[var(--ink)]">🇬🇧 {isEn ? "UK: " : "英国："}</span>{analysis.dir.ukNote}</p>
                <p><span className="font-medium text-[var(--ink)]">🇭🇰 {isEn ? "Hong Kong: " : "香港："}</span>{analysis.dir.hkNote}</p>
                <p><span className="font-medium text-[var(--ink)]">💰 {isEn ? "Budget: " : "预算："}</span>{getBudgetNote(budget)}</p>
                {analysis.dir.interview && (
                  <p><span className="font-medium text-[var(--ink)]">🎤 {isEn ? "Interview: " : "面试："}</span>
                    {isEn ? "Top universities (esp. Oxbridge / medicine / law) often interview — prepare early." : "顶尖院校（尤其牛剑／医学／法律）常有面试，宜尽早准备。"}
                    {" "}
                    <Link href="/interview" className="text-[var(--indigo)] hover:underline">{isEn ? "Interview prep →" : "去面试准备 →"}</Link>
                  </p>
                )}
              </div>
            </section>
          )}

          {/* 3. 要准备的笔试 → 深链题库 */}
          {analysis.dir && analysis.dir.tests.length > 0 && (
            <section>
              <h2 className="font-semibold text-[var(--ink)] mb-1">{isEn ? "Admission tests to prepare" : "该方向要准备的笔试"}</h2>
              <p className="text-sm text-[var(--ink-soft)] mb-3">
                {isEn ? "Click a test to jump straight into practice." : "点击笔试直接进入题库练习。"}
              </p>
              <div className="space-y-2">
                {analysis.dir.tests.map((tst) =>
                  tst.id ? (
                    <Link
                      key={tst.abbr}
                      href={`/tests/${tst.id}`}
                      className="flex items-center gap-3 notion-lift rounded-xl border border-[var(--border)] p-3 bg-white group"
                    >
                      <span className="text-sm font-semibold text-[var(--indigo)] w-14 shrink-0">{tst.abbr}</span>
                      <span className="text-sm text-[var(--ink-soft)]">{tst.note}</span>
                      <span className="ml-auto text-[var(--ink-faint)] group-hover:text-[var(--indigo)]">→</span>
                    </Link>
                  ) : (
                    <div key={tst.abbr} className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3 bg-[var(--surface-2)]">
                      <span className="text-sm font-semibold text-[var(--ink-soft)] w-14 shrink-0">{tst.abbr}</span>
                      <span className="text-sm text-[var(--ink-soft)]">{tst.note}</span>
                    </div>
                  ),
                )}
              </div>
              <Link href="/tests" className="inline-block mt-3 text-sm text-[var(--indigo)] hover:underline">
                {isEn ? "See all admission tests →" : "查看全部入学笔试 →"}
              </Link>
            </section>
          )}

          {/* 4. 文书 + 看学校信息 */}
          <section className="rounded-2xl border border-[color:var(--indigo)]/20 bg-[var(--info-bg)] p-5">
            <h2 className="font-semibold text-[var(--ink)] mb-2">{isEn ? "Next steps" : "接下来"}</h2>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link href="/statements" className="btn btn-primary">{isEn ? "Personal statement coach" : "文书教练"}</Link>
              <Link href="/universities" className="btn btn-secondary">{isEn ? "Where to research schools" : "看具体学校信息"}</Link>
              <Link href="/background" className="btn btn-secondary">{isEn ? "Background boosting" : "背景提升"}</Link>
            </div>
          </section>

          <p className="text-xs text-[var(--ink-faint)] leading-relaxed">
            {isEn
              ? "⚠️ Guidance only, based on typical requirements — not an admissions guarantee. Admission policies change; always verify subject requirements and tests on each university's official website for your entry year."
              : "⚠️ 以上为基于常见要求的策略建议，不构成录取保证。招生政策会调整，选科要求与笔试请以各院校当年官网为准。"}
          </p>
        </div>
      )}
    </div>
  );
}
