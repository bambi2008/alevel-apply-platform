"use client";

import { useMemo, useState } from "react";
import type { ProgramWithUniversity } from "@/lib/data/types";
import { AddToApplication } from "@/components/add-to-application";
import { NavIcon } from "@/components/nav-icons";

type QsBand = "all" | "20" | "50" | "100" | "200";
type IeltsBand = "all" | "6" | "6.5" | "7";

const QS_BANDS: { v: QsBand; label: string }[] = [
  { v: "all", label: "不限排名" },
  { v: "20", label: "QS 前 20" },
  { v: "50", label: "QS 前 50" },
  { v: "100", label: "QS 前 100" },
  { v: "200", label: "QS 前 200" },
];
const IELTS_BANDS: { v: IeltsBand; label: string }[] = [
  { v: "all", label: "雅思不限" },
  { v: "6", label: "≤ 6.0" },
  { v: "6.5", label: "≤ 6.5" },
  { v: "7", label: "≤ 7.0" },
];

export function UniversityExplorer({
  programs,
  isEn,
  initialQ = "",
}: {
  programs: ProgramWithUniversity[];
  isEn: boolean;
  initialQ?: string;
}) {
  const [q, setQ] = useState(initialQ);
  const [region, setRegion] = useState<"ALL" | "UK" | "HK">("ALL");
  const [field, setField] = useState<string>("all");
  const [qs, setQs] = useState<QsBand>("all");
  const [ielts, setIelts] = useState<IeltsBand>("all");
  const [needTest, setNeedTest] = useState(false);
  const [needInterview, setNeedInterview] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  // 可选专业领域
  const fields = useMemo(() => {
    const s = new Set<string>();
    programs.forEach((p) => p.field && s.add(p.field));
    return Array.from(s).sort();
  }, [programs]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return programs.filter((p) => {
      if (region !== "ALL" && p.university.region !== region) return false;
      if (field !== "all" && p.field !== field) return false;
      if (qs !== "all") {
        const r = p.university.qsRankWorld;
        if (!r || r > Number(qs)) return false;
      }
      if (ielts !== "all") {
        if (p.ielts && p.ielts > Number(ielts)) return false;
      }
      if (needTest && !p.admissionsTest) return false;
      if (needInterview && !p.interviewRequired) return false;
      if (term) {
        const hay = [p.name, p.nameZh, p.university.name, p.university.nameZh, p.field, p.university.city]
          .filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [programs, q, region, field, qs, ielts, needTest, needInterview]);

  const toggleCompare = (id: string) => {
    setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= 3 ? c : [...c, id]));
  };
  const compareItems = programs.filter((p) => compare.includes(p.id));

  const resetFilters = () => {
    setQ(""); setRegion("ALL"); setField("all"); setQs("all"); setIelts("all");
    setNeedTest(false); setNeedInterview(false);
  };

  return (
    <div className="mt-6 grid lg:grid-cols-[220px_1fr] gap-6">
      {/* 筛选器侧栏 */}
      <aside className="lg:sticky lg:top-20 h-max space-y-5">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)]">
            <NavIcon name="search" width={16} height={16} />
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索院校 / 专业"
            className="input pl-9"
          />
        </div>

        <FilterGroup label="地区">
          <div className="flex gap-1.5 flex-wrap">
            {(["ALL", "UK", "HK"] as const).map((r) => (
              <Chip key={r} active={region === r} onClick={() => setRegion(r)}>
                {r === "ALL" ? "全部" : r === "UK" ? "英国" : "香港"}
              </Chip>
            ))}
          </div>
        </FilterGroup>

        {fields.length > 0 && (
          <FilterGroup label="专业领域">
            <select value={field} onChange={(e) => setField(e.target.value)} className="input">
              <option value="all">全部领域</option>
              {fields.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </FilterGroup>
        )}

        <FilterGroup label="排名">
          <select value={qs} onChange={(e) => setQs(e.target.value as QsBand)} className="input">
            {QS_BANDS.map((b) => <option key={b.v} value={b.v}>{b.label}</option>)}
          </select>
        </FilterGroup>

        <FilterGroup label="雅思要求">
          <select value={ielts} onChange={(e) => setIelts(e.target.value as IeltsBand)} className="input">
            {IELTS_BANDS.map((b) => <option key={b.v} value={b.v}>{b.label}</option>)}
          </select>
        </FilterGroup>

        <FilterGroup label="其它">
          <label className="flex items-center gap-2 text-sm text-[var(--ink-soft)] cursor-pointer">
            <input type="checkbox" checked={needTest} onChange={(e) => setNeedTest(e.target.checked)} className="accent-[var(--indigo)]" />
            需要入学笔试
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--ink-soft)] cursor-pointer mt-1.5">
            <input type="checkbox" checked={needInterview} onChange={(e) => setNeedInterview(e.target.checked)} className="accent-[var(--indigo)]" />
            需要面试
          </label>
        </FilterGroup>

        <button type="button" onClick={resetFilters} className="text-sm text-[var(--indigo)] hover:underline">
          重置筛选
        </button>
      </aside>

      {/* 结果 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-[var(--ink-soft)]">
            找到 <span className="font-semibold text-[var(--ink)]">{filtered.length}</span> 个专业
          </p>
          {compare.length > 0 && (
            <button type="button" onClick={() => setShowCompare(true)} className="btn btn-primary text-sm">
              对比 ({compare.length})
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
            <p className="text-[var(--ink-soft)]">没有符合条件的专业</p>
            <button type="button" onClick={resetFilters} className="mt-3 btn btn-secondary text-sm">重置筛选</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {filtered.map((p) => {
              const checked = compare.includes(p.id);
              return (
                <div key={p.id} className={`card p-4 flex flex-col ${checked ? "ring-2 ring-[color:var(--indigo)]/30" : ""}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[var(--ink)] leading-snug">{isEn ? p.name : p.nameZh}</h3>
                      <p className="text-xs text-[var(--ink-faint)] mt-0.5">
                        {isEn ? p.university.name : p.university.nameZh} · {p.university.city}
                        {p.university.qsRankWorld ? ` · QS #${p.university.qsRankWorld}` : ""}
                      </p>
                    </div>
                    <label className="shrink-0 flex items-center gap-1 text-xs text-[var(--ink-soft)] cursor-pointer">
                      <input type="checkbox" checked={checked} onChange={() => toggleCompare(p.id)} className="accent-[var(--indigo)]" />
                      对比
                    </label>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.alevelOfferTypical && <span className="badge badge-neutral">A-Level {p.alevelOfferTypical}</span>}
                    {p.ielts && <span className="badge badge-neutral">IELTS {p.ielts}</span>}
                    {p.admissionsTest && <span className="badge badge-brand">{p.admissionsTest}</span>}
                    {p.interviewRequired && <span className="badge badge-warning">需面试</span>}
                  </div>

                  <div className="mt-3 pt-3 border-t border-[var(--border-soft)]">
                    <AddToApplication programId={p.id} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 对比抽屉 */}
      {showCompare && compareItems.length > 0 && (
        <CompareModal items={compareItems} isEn={isEn} onClose={() => setShowCompare(false)} onRemove={toggleCompare} />
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--ink-faint)] mb-2">{label}</p>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
        active ? "bg-[var(--indigo)] text-white border-[var(--indigo)]" : "border-[var(--border)] text-[var(--ink-soft)] hover:bg-[var(--surface)]"
      }`}
    >
      {children}
    </button>
  );
}

function CompareModal({
  items, isEn, onClose, onRemove,
}: {
  items: ProgramWithUniversity[];
  isEn: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
}) {
  const rows: { label: string; get: (p: ProgramWithUniversity) => React.ReactNode }[] = [
    { label: "院校", get: (p) => (isEn ? p.university.name : p.university.nameZh) },
    { label: "城市", get: (p) => p.university.city },
    { label: "QS 排名", get: (p) => (p.university.qsRankWorld ? `#${p.university.qsRankWorld}` : "—") },
    { label: "典型 offer", get: (p) => p.alevelOfferTypical ?? "—" },
    { label: "最低 offer", get: (p) => p.alevelOfferMinimum ?? "—" },
    { label: "雅思", get: (p) => (p.ielts ? String(p.ielts) : "—") },
    { label: "入学笔试", get: (p) => p.admissionsTest ?? "—" },
    { label: "面试", get: (p) => (p.interviewRequired ? "需要" : "不需要") },
    { label: "学费/年", get: (p) => (p.annualTuitionGbp ? `£${p.annualTuitionGbp.toLocaleString()}` : p.annualTuitionHkd ? `HK$${p.annualTuitionHkd.toLocaleString()}` : "—") },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-[var(--shadow-lg)] max-w-3xl w-full max-h-[85vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-[var(--border)] px-5 py-3 flex items-center justify-between">
          <h3 className="font-semibold text-[var(--ink)]">专业对比</h3>
          <button type="button" onClick={onClose} className="text-[var(--ink-faint)] hover:text-[var(--ink)]">✕</button>
        </div>
        <div className="p-5 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 text-[var(--ink-faint)] font-medium w-24"></th>
                {items.map((p) => (
                  <th key={p.id} className="text-left p-2 align-top min-w-[160px]">
                    <div className="font-semibold text-[var(--ink)]">{isEn ? p.name : p.nameZh}</div>
                    <button type="button" onClick={() => onRemove(p.id)} className="text-xs text-[var(--ink-faint)] hover:text-[var(--danger)] mt-0.5">移除</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-[var(--border-soft)]">
                  <td className="p-2 text-[var(--ink-faint)] font-medium">{r.label}</td>
                  {items.map((p) => (
                    <td key={p.id} className="p-2 text-[var(--ink)]">{r.get(p)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
