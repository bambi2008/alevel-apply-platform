"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, Check, GitCompareArrows, ListPlus, Plus, Scale, ShieldCheck, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { FIELDS } from "@/lib/constants";

type Category = "safety" | "match" | "reach" | "out_of_reach";
interface ProgramView {
  id: string; name: string; nameZh: string | null; field: string | null; applyRoute: string;
  typicalOffer: string | null; minimumOffer: string | null; ielts: number | null; admissionsTest: string | null;
  tuitionGbp: number | null; tuitionHkd: number | null;
  university: { id: string; name: string; nameZh: string | null; region: "UK" | "HK"; city: string | null; qsRankWorld: number | null };
}
interface MatchView { category: Category; eligible: boolean; meetsSubjects: boolean; meetsEnglish: boolean; reasons: string[] }
interface Candidate { program: ProgramView; match: MatchView; shortlisted?: boolean; applicationId: string | null }
interface ShortlistEntry extends Candidate { id: string; note: string | null; priority: number }
interface WorkbenchData {
  needsProfile: boolean; shortlist: ShortlistEntry[]; recommendations: Candidate[];
  analysis?: { score: number; balanced: boolean; counts: Record<Category | "UK" | "HK", number>; issues: Array<{ code: string; severity: "warning" | "critical"; message: string }> };
}

const categoryMeta = {
  safety: { label: "稳妥", className: "bg-[var(--success-bg)] text-[var(--success)]" },
  match: { label: "匹配", className: "bg-[var(--info-bg)] text-[var(--indigo)]" },
  reach: { label: "冲刺", className: "bg-[var(--warning-bg)] text-[var(--warning)]" },
  out_of_reach: { label: "暂不建议", className: "bg-[var(--danger-bg)] text-[var(--danger)]" },
};

function tuition(program: ProgramView) {
  if (program.university.region === "UK") return program.tuitionGbp ? `£${program.tuitionGbp.toLocaleString()}/年` : "待核对";
  return program.tuitionHkd ? `HK$${program.tuitionHkd.toLocaleString()}/年` : "待核对";
}

export default function ShortlistPage() {
  const [data, setData] = useState<WorkbenchData | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "unauthorized" | "error">("loading");
  const [field, setField] = useState("");
  const [region, setRegion] = useState("");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const refresh = useCallback(async () => {
    try {
      const query = new URLSearchParams(); if (field) query.set("field", field); if (region) query.set("region", region);
      const response = await fetch(`/api/shortlist?${query}`);
      if (response.status === 401) { setState("unauthorized"); return; }
      if (!response.ok) throw new Error("load failed");
      setData(await response.json() as WorkbenchData); setState("ready");
    } catch { setState("error"); }
  }, [field, region]);
  useEffect(() => { const timer = window.setTimeout(() => void refresh(), 0); return () => window.clearTimeout(timer); }, [refresh]);

  const command = async (action: "add" | "remove" | "apply", programId: string) => {
    setMessage("");
    const response = await fetch("/api/shortlist", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, programId }) });
    if (response.status === 409) { setMessage("UCAS 已有 5 个有效志愿，请先调整申请清单。"); return; }
    if (response.ok) await refresh();
  };
  const shortlistedIds = useMemo(() => new Set(data?.shortlist.map((item) => item.program.id) ?? []), [data]);
  const compared = (data?.shortlist ?? []).filter((item) => compareIds.includes(item.program.id));

  if (state === "loading") return <main className="mx-auto max-w-6xl px-4 py-12"><div className="h-72 animate-pulse bg-[var(--surface)]" /></main>;
  if (state === "unauthorized") return <main className="mx-auto max-w-xl px-4 py-20 text-center"><Scale className="mx-auto size-8 text-[var(--indigo)]" /><h1 className="mt-4 text-2xl font-bold">登录后建立选校组合</h1><p className="mt-2 text-sm text-[var(--ink-soft)]">候选清单和申请组合会跨设备同步。</p><Link href="/login" className="mt-5 inline-flex rounded-md bg-[var(--indigo)] px-5 py-2.5 text-sm font-medium text-white">前往登录</Link></main>;
  if (state === "error" || !data) return <main className="mx-auto max-w-4xl px-4 py-16 text-center text-[var(--danger)]">选校工作台暂时无法加载。</main>;
  if (data.needsProfile) return <main className="mx-auto max-w-xl px-4 py-20 text-center"><ShieldCheck className="mx-auto size-8 text-[var(--indigo)]" /><h1 className="mt-4 text-2xl font-bold">先完善成绩档案</h1><p className="mt-2 text-sm text-[var(--ink-soft)]">至少填写一门 A-Level 预估或实际成绩，系统才能评估专业门槛。</p><Link href="/profile" className="mt-5 inline-flex rounded-md bg-[var(--indigo)] px-5 py-2.5 text-sm font-medium text-white">完善档案</Link></main>;

  const analysis = data.analysis!;
  return <main className="mx-auto max-w-6xl px-4 py-10">
    <header className="flex flex-wrap items-end justify-between gap-5 border-b border-[var(--border)] pb-6"><div><div className="text-xs font-semibold text-[var(--indigo)]">APPLICATION PORTFOLIO</div><h1 className="mt-1 text-3xl font-bold">选校决策工作台</h1><p className="mt-2 text-sm text-[var(--ink-soft)]">用成绩门槛和组合风险做决策，不把排名当成唯一答案。</p></div><Link href="/applications" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--indigo)]">正式申请清单 <ArrowRight className="size-4" /></Link></header>

    <section className="grid gap-px overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--border)] sm:grid-cols-5 mt-6">
      <div className="bg-white p-4 sm:col-span-2"><div className="flex items-center justify-between"><span className="text-sm font-medium">组合健康度</span><strong className="text-2xl">{analysis.score}</strong></div><div className="mt-2 h-2 rounded-full bg-neutral-200"><div className={`h-full rounded-full ${analysis.score >= 80 ? "bg-[var(--success)]" : "bg-[var(--warning)]"}`} style={{ width: `${analysis.score}%` }} /></div></div>
      {(["reach", "match", "safety"] as const).map((key) => <div key={key} className="bg-white p-4"><div className="text-2xl font-bold">{analysis.counts[key]}</div><div className="text-xs text-[var(--ink-faint)]">{categoryMeta[key].label}</div></div>)}
    </section>
    {analysis.issues.length > 0 && <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-b border-[var(--border)] pb-4">{analysis.issues.map((issue) => <span key={issue.code} className={`inline-flex items-center gap-1.5 text-xs ${issue.severity === "critical" ? "text-[var(--danger)]" : "text-[var(--warning)]"}`}><AlertTriangle className="size-3.5" />{issue.message}</span>)}</div>}
    {message && <p className="mt-4 text-sm text-[var(--danger)]">{message}</p>}

    <div className="grid gap-8 py-7 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <section className="min-w-0"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-bold">专业推荐</h2><p className="mt-1 text-sm text-[var(--ink-soft)]">结果基于当前档案；录取概率仍受竞争强度和文书等因素影响。</p></div><div className="flex gap-2"><select value={field} onChange={(event) => setField(event.target.value)} className="rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm"><option value="">全部专业</option>{FIELDS.map((item) => <option key={item.value} value={item.value}>{item.zh}</option>)}</select><select value={region} onChange={(event) => setRegion(event.target.value)} className="rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm"><option value="">英国 + 香港</option><option value="UK">英国</option><option value="HK">香港</option></select></div></div>
        <div className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">{data.recommendations.map((item) => <CandidateRow key={item.program.id} item={item} added={shortlistedIds.has(item.program.id)} onAdd={() => void command("add", item.program.id)} />)}</div>
      </section>

      <aside className="border-t border-[var(--border)] pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0"><div className="flex items-center justify-between"><div><h2 className="text-xl font-bold">候选清单</h2><p className="mt-1 text-xs text-[var(--ink-faint)]">{data.shortlist.length} 个专业 · UK {analysis.counts.UK} / HK {analysis.counts.HK}</p></div><GitCompareArrows className="size-5 text-[var(--indigo)]" /></div>
        {data.shortlist.length === 0 ? <p className="mt-6 border-y border-[var(--border)] py-8 text-center text-sm text-[var(--ink-faint)]">从左侧加入候选专业</p> : <div className="mt-4 divide-y divide-[var(--border)] border-y border-[var(--border)]">{data.shortlist.map((item) => <div key={item.id} className="py-4"><div className="flex items-start gap-2"><input type="checkbox" aria-label={`对比 ${item.program.nameZh || item.program.name}`} checked={compareIds.includes(item.program.id)} onChange={(event) => setCompareIds((ids) => event.target.checked ? [...ids, item.program.id].slice(-4) : ids.filter((id) => id !== item.program.id))} className="mt-1" /><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${categoryMeta[item.match.category].className}`}>{categoryMeta[item.match.category].label}</span><span className="truncate text-sm font-semibold">{item.program.university.nameZh || item.program.university.name}</span></div><p className="mt-1 truncate text-xs text-[var(--ink-soft)]">{item.program.nameZh || item.program.name}</p></div><button type="button" title="移除" onClick={() => void command("remove", item.program.id)} className="text-[var(--ink-faint)] hover:text-[var(--danger)]"><Trash2 className="size-4" /></button></div><div className="mt-3 pl-6">{item.applicationId ? <Link href={`/applications/${item.applicationId}`} className="text-xs font-semibold text-[var(--success)]">已进入申请 · 打开作战室</Link> : <button type="button" onClick={() => void command("apply", item.program.id)} className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--indigo)]"><ListPlus className="size-3.5" />转为正式申请</button>}</div></div>)}</div>}
      </aside>
    </div>

    {compared.length >= 2 && <section className="border-t border-[var(--border)] py-7"><h2 className="text-xl font-bold">横向对比</h2><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[680px] border-collapse text-sm"><thead><tr className="border-b border-[var(--border)] text-left"><th className="py-3 pr-4 text-xs text-[var(--ink-faint)]">指标</th>{compared.map((item) => <th key={item.id} className="px-4 py-3"><div>{item.program.university.nameZh || item.program.university.name}</div><div className="mt-0.5 text-xs font-normal text-[var(--ink-soft)]">{item.program.nameZh || item.program.name}</div></th>)}</tr></thead><tbody>{[["定位", (item: ShortlistEntry) => categoryMeta[item.match.category].label],["典型成绩", (item: ShortlistEntry) => item.program.typicalOffer || "待核对"],["IELTS", (item: ShortlistEntry) => item.program.ielts?.toFixed(1) || "待核对"],["入学笔试", (item: ShortlistEntry) => item.program.admissionsTest || "无结构化要求"],["学费", (item: ShortlistEntry) => tuition(item.program)],["QS 世界排名", (item: ShortlistEntry) => item.program.university.qsRankWorld ? `#${item.program.university.qsRankWorld}` : "待核对"]] .map(([label, value]) => <tr key={label as string} className="border-b border-[var(--border)]"><td className="py-3 pr-4 text-xs text-[var(--ink-faint)]">{label as string}</td>{compared.map((item) => <td key={item.id} className="px-4 py-3">{(value as (item: ShortlistEntry) => string)(item)}</td>)}</tr>)}</tbody></table></div></section>}
  </main>;
}

function CandidateRow({ item, added, onAdd }: { item: Candidate; added: boolean; onAdd: () => void }) {
  const meta = categoryMeta[item.match.category];
  return <article className="flex gap-3 py-4"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className={`rounded px-2 py-0.5 text-xs font-semibold ${meta.className}`}>{meta.label}</span><span className="text-xs text-[var(--ink-faint)]">{item.program.university.region} · {item.program.university.city}</span>{item.program.university.qsRankWorld && <span className="text-xs text-[var(--ink-faint)]">QS #{item.program.university.qsRankWorld}</span>}</div><h3 className="mt-2 text-sm font-bold">{item.program.university.nameZh || item.program.university.name} · {item.program.nameZh || item.program.name}</h3><div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--ink-soft)]"><span>典型 {item.program.typicalOffer || "待核对"}</span><span>IELTS {item.program.ielts?.toFixed(1) || "待核对"}</span><span>{item.program.admissionsTest || "无结构化笔试要求"}</span><span>{tuition(item.program)}</span></div><p className="mt-2 line-clamp-1 text-xs text-[var(--ink-faint)]">{item.match.reasons[0]}</p></div><button type="button" disabled={added} onClick={onAdd} title={added ? "已在候选清单" : "加入候选清单"} className={`flex size-9 shrink-0 items-center justify-center rounded-md border ${added ? "border-[var(--success)] bg-[var(--success-bg)] text-[var(--success)]" : "border-[var(--border)] text-[var(--indigo)] hover:bg-[var(--surface)]"}`}>{added ? <Check className="size-4" /> : <Plus className="size-4" />}</button></article>;
}
