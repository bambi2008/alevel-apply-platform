"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  evaluateMatch,
  CATEGORY_LABEL,
  type MatchCategory,
  type ProgramRequirement,
} from "@/lib/matching";
import type { ProgramWithUniversity, IeltsSubscores } from "@/lib/data/types";
import { SUBJECTS, GRADES, FIELDS, fieldLabel } from "@/lib/constants";
import { loadProfile, profileHasGrades } from "@/lib/profile/store";
import { AddToApplication } from "@/components/add-to-application";

type Row = { subject: string; grade: string };

const CATEGORY_ORDER: MatchCategory[] = ["safety", "match", "reach", "out_of_reach"];
const CATEGORY_STYLE: Record<MatchCategory, string> = {
  safety: "bg-green-50 text-green-700 border-green-200",
  match: "bg-blue-50 text-blue-700 border-blue-200",
  reach: "bg-amber-50 text-amber-700 border-amber-200",
  out_of_reach: "bg-neutral-100 text-neutral-500 border-neutral-200",
};

function guessField(majors: string[]): string {
  for (const m of majors) {
    const s = m.trim();
    const lm = s.toLowerCase();
    const f = FIELDS.find(
      (x) => x.zh.includes(s) || s.includes(x.zh) || lm.includes(x.en.toLowerCase()) || lm.includes(x.value),
    );
    if (f) return f.value;
  }
  return "all";
}

export default function MatchPage() {
  const t = useTranslations("match");
  const locale = useLocale();
  const isEn = locale === "en";
  const [field, setField] = useState<string>("all");

  const [rows, setRows] = useState<Row[]>([
    { subject: "Mathematics", grade: "A*" },
    { subject: "Physics", grade: "A" },
    { subject: "Chemistry", grade: "A" },
  ]);
  const [ielts, setIelts] = useState<string>("6.5");
  const [submitted, setSubmitted] = useState(false);
  const [fromProfile, setFromProfile] = useState(false);
  const [ieltsSub, setIeltsSub] = useState<IeltsSubscores | null>(null);

  useEffect(() => {
    const p = loadProfile();
    if (p && profileHasGrades(p)) {
      setRows(p.subjects.map((s) => ({ subject: s.subject, grade: s.grade })));
      setIelts(p.ielts != null ? String(p.ielts) : "");
      setIeltsSub(p.ieltsSubscores ?? null);
      setField(guessField(p.intendedMajors ?? []));
      setFromProfile(true);
    }
  }, []);

  const [programs, setPrograms] = useState<ProgramWithUniversity[]>([]);
  useEffect(() => {
    fetch("/api/programs")
      .then((r) => r.json())
      .then(setPrograms)
      .catch(() => {});
  }, []);

  const results = useMemo(() => {
    if (!submitted) return null;
    const grades = rows.filter((r) => r.subject && r.grade);
    const studentIelts = ielts ? Number(ielts) : null;
    const pool = field === "all" ? programs : programs.filter((p) => p.field === field);
    const evaluated = pool.map((p) => {
      const req: ProgramRequirement = {
        typicalOffer: p.alevelOfferTypical,
        minimumOffer: p.alevelOfferMinimum,
        requiredSubjects: p.requiredSubjects,
        excludedSubjects: p.excludedSubjects,
        ielts: p.ielts,
        ieltsSubscores: p.ieltsSubscores,
      };
      return {
        program: p,
        result: evaluateMatch({ grades, ielts: studentIelts, ieltsSubscores: ieltsSub }, req),
      };
    });
    const grouped: Record<MatchCategory, typeof evaluated> = {
      safety: [], match: [], reach: [], out_of_reach: [],
    };
    for (const e of evaluated) grouped[e.result.category].push(e);
    return grouped;
  }, [submitted, rows, ielts, ieltsSub, programs, field]);

  const setRow = (i: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const addRow = () =>
    setRows((rs) => (rs.length >= 4 ? rs : [...rs, { subject: SUBJECTS[0], grade: "A" }]));
  const removeRow = (i: number) => setRows((rs) => rs.filter((_, idx) => idx !== i));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-neutral-600">{t("intro")}</p>

      {fromProfile && (
        <Link
          href="/profile"
          className="mt-3 block text-sm text-blue-700 bg-blue-50 rounded-lg px-3 py-2 hover:bg-blue-100"
        >
          {t("fromProfile")}
        </Link>
      )}

      {/* Form */}
      <div className="mt-6 rounded-xl border border-neutral-200 p-5">
        <label className="flex items-center gap-2 text-sm text-neutral-600 mb-4">
          {t("field")}
          <select
            className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
            value={field}
            onChange={(e) => setField(e.target.value)}
          >
            <option value="all">{t("allFields")}</option>
            {FIELDS.map((f) => (
              <option key={f.value} value={f.value}>{fieldLabel(f.value, locale)}</option>
            ))}
          </select>
        </label>
        <div className="space-y-3">
          {rows.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <select
                className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
                value={r.subject}
                onChange={(e) => setRow(i, { subject: e.target.value })}
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                className="w-24 rounded-md border border-neutral-300 px-3 py-2 text-sm"
                value={r.grade}
                onChange={(e) => setRow(i, { grade: e.target.value })}
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeRow(i)}
                disabled={rows.length <= 1}
                className="px-2 py-2 text-neutral-400 hover:text-red-500 disabled:opacity-30"
                aria-label="remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-4">
          <button
            type="button"
            onClick={addRow}
            disabled={rows.length >= 4}
            className="text-sm text-blue-600 hover:underline disabled:opacity-40"
          >
            + {t("addSubject")}
          </button>
          <label className="flex items-center gap-2 text-sm text-neutral-600 ml-auto">
            {t("ielts")}
            <input
              type="number"
              step="0.5"
              min="0"
              max="9"
              value={ielts}
              onChange={(e) => setIelts(e.target.value)}
              className="w-20 rounded-md border border-neutral-300 px-2 py-1.5"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="mt-5 w-full rounded-lg bg-blue-600 text-white py-2.5 font-medium hover:bg-blue-700"
        >
          {t("start")}
        </button>
      </div>

      {/* Results */}
      {results &&
        (CATEGORY_ORDER.some((c) => results[c].length > 0) ? (
        <div className="mt-8 space-y-8">
          {isEn && <p className="text-xs text-neutral-400">{t("reasonsNote")}</p>}
          {CATEGORY_ORDER.map((cat) => {
            const items = results[cat];
            if (items.length === 0) return null;
            return (
              <section key={cat}>
                <h2 className="flex items-center gap-2 font-semibold mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${CATEGORY_STYLE[cat]}`}>
                    {CATEGORY_LABEL[cat][isEn ? "en" : "zh"]}
                  </span>
                  <span className="text-neutral-400 text-sm">
                    {t("programCount", { count: items.length })}
                  </span>
                </h2>
                <div className="space-y-3">
                  {items.map(({ program, result }) => (
                    <div key={program.id} className="rounded-xl border border-neutral-200 p-4">
                      <div className="flex justify-between gap-3">
                        <div>
                          <div className="font-medium">
                            {(isEn ? program.university.name : program.university.nameZh)} ·{" "}
                            {isEn ? program.name : program.nameZh}
                          </div>
                          <div className="text-sm text-neutral-500">
                            {isEn ? program.university.nameZh : program.university.name} —{" "}
                            {isEn ? program.nameZh : program.name}
                          </div>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap">
                          <div className="text-neutral-700">{t("typical")} {program.alevelOfferTypical ?? "—"}</div>
                          <div className="text-neutral-400">{t("minimum")} {program.alevelOfferMinimum ?? "—"}</div>
                        </div>
                      </div>
                      <ul className="mt-2 text-sm text-neutral-600 space-y-0.5">
                        {result.reasons.map((reason, idx) => (
                          <li key={idx}>· {reason}</li>
                        ))}
                      </ul>
                      <div className="mt-3">
                        <AddToApplication programId={program.id} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
          <p className="text-xs text-neutral-400">{t("disclaimer")}</p>
        </div>
        ) : (
          <p className="mt-8 text-neutral-500">{t("noneInField")}</p>
        ))}

      <p className="mt-8 text-sm text-neutral-500">
        <Link href="/universities" className="text-blue-600 hover:underline">
          {t("toUniversities")}
        </Link>
      </p>
    </div>
  );
}
