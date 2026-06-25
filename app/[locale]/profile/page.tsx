"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SUBJECTS, GRADES, GRADE_KINDS, REGIONS } from "@/lib/constants";
import {
  emptyProfile,
  loadProfile,
  saveProfile,
  type ProfileSubject,
  type UserProfile,
} from "@/lib/profile/store";
import type { Region } from "@/lib/data/types";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const tc = useTranslations("common");
  const [p, setP] = useState<UserProfile>(emptyProfile);
  const [loaded, setLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const existing = loadProfile();
    if (existing) setP(existing);
    setLoaded(true);
  }, []);

  const set = (patch: Partial<UserProfile>) => setP((cur) => ({ ...cur, ...patch }));

  const setSubject = (i: number, patch: Partial<ProfileSubject>) =>
    setP((cur) => ({
      ...cur,
      subjects: cur.subjects.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    }));
  const addSubject = () =>
    setP((cur) =>
      cur.subjects.length >= 5
        ? cur
        : { ...cur, subjects: [...cur.subjects, { subject: SUBJECTS[0], grade: "A", kind: "PREDICTED" }] },
    );
  const removeSubject = (i: number) =>
    setP((cur) => ({ ...cur, subjects: cur.subjects.filter((_, idx) => idx !== i) }));

  const toggleRegion = (r: Region) =>
    setP((cur) => ({
      ...cur,
      targetRegions: cur.targetRegions.includes(r)
        ? cur.targetRegions.filter((x) => x !== r)
        : [...cur.targetRegions, r],
    }));

  const onSave = () => {
    saveProfile(p);
    setSavedAt(new Date().toLocaleTimeString());
  };

  if (!loaded) return <div className="mx-auto max-w-3xl px-4 py-10 text-neutral-400">{tc("loading")}</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-neutral-600">{t("intro")}</p>

      {/* Basic info */}
      <section className="mt-6 rounded-xl border border-neutral-200 p-5 space-y-4">
        <h2 className="font-semibold">{t("basicInfo")}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="text-sm">
            <span className="text-neutral-500">{t("fullName")}</span>
            <input
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
              value={p.fullName ?? ""}
              onChange={(e) => set({ fullName: e.target.value })}
            />
          </label>
          <label className="text-sm">
            <span className="text-neutral-500">{t("school")}</span>
            <input
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
              value={p.school ?? ""}
              onChange={(e) => set({ school: e.target.value })}
            />
          </label>
          <label className="text-sm">
            <span className="text-neutral-500">{t("intakeYear")}</span>
            <input
              type="number"
              min={2025}
              max={2035}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
              value={p.intakeYear ?? ""}
              onChange={(e) => set({ intakeYear: e.target.value ? Number(e.target.value) : undefined })}
            />
          </label>
          <label className="text-sm">
            <span className="text-neutral-500">{t("intendedMajors")}</span>
            <input
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
              value={p.intendedMajors.join("，")}
              onChange={(e) =>
                set({ intendedMajors: e.target.value.split(/[，,]/).map((s) => s.trim()).filter(Boolean) })
              }
              placeholder={t("intendedMajorsPlaceholder")}
            />
          </label>
        </div>
        <div className="text-sm">
          <span className="text-neutral-500">{t("targetRegions")}</span>
          <div className="mt-1 flex gap-2">
            {REGIONS.map((r) => {
              const active = p.targetRegions.includes(r.value);
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => toggleRegion(r.value)}
                  className={`px-4 py-1.5 rounded-full border text-sm ${
                    active ? "bg-blue-600 text-white border-blue-600" : "border-neutral-300 text-neutral-600"
                  }`}
                >
                  {tc(r.value.toLowerCase())}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* A-Level grades */}
      <section className="mt-4 rounded-xl border border-neutral-200 p-5">
        <h2 className="font-semibold mb-3">{t("grades")}</h2>
        <div className="space-y-3">
          {p.subjects.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <select
                className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
                value={s.subject}
                onChange={(e) => setSubject(i, { subject: e.target.value })}
              >
                {SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
              <select
                className="w-28 rounded-md border border-neutral-300 px-2 py-2 text-sm"
                value={s.kind}
                onChange={(e) => setSubject(i, { kind: e.target.value as ProfileSubject["kind"] })}
              >
                {GRADE_KINDS.map((k) => (
                  <option key={k.value} value={k.value}>{tc(k.value.toLowerCase())}</option>
                ))}
              </select>
              <select
                className="w-20 rounded-md border border-neutral-300 px-2 py-2 text-sm"
                value={s.grade}
                onChange={(e) => setSubject(i, { grade: e.target.value })}
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeSubject(i)}
                disabled={p.subjects.length <= 1}
                className="px-2 py-2 text-neutral-400 hover:text-red-500 disabled:opacity-30"
                aria-label="remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={addSubject}
            disabled={p.subjects.length >= 5}
            className="text-sm text-blue-600 hover:underline disabled:opacity-40"
          >
            + {t("addSubject")}
          </button>
          <label className="flex items-center gap-2 text-sm text-neutral-600">
            {t("ielts")}
            <input
              type="number"
              step="0.5"
              min={0}
              max={9}
              className="w-20 rounded-md border border-neutral-300 px-2 py-1.5"
              value={p.ielts ?? ""}
              onChange={(e) => set({ ielts: e.target.value ? Number(e.target.value) : null })}
            />
          </label>
        </div>
      </section>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={onSave}
          className="rounded-lg bg-blue-600 text-white px-6 py-2.5 font-medium hover:bg-blue-700"
        >
          {t("save")}
        </button>
        {savedAt && (
          <span className="text-sm text-green-600">
            ✓ {t("savedAt")}（{savedAt}）·{" "}
            <Link href="/match" className="text-blue-600 hover:underline">{t("goMatch")}</Link>
          </span>
        )}
      </div>
    </div>
  );
}
