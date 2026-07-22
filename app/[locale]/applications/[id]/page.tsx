"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AlertCircle, Check, CheckCircle2, ClipboardCopy, ExternalLink, FileText, Link2, RefreshCw, Send, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface DocumentItem { id: string; type: string; fileName: string; version: number; validUntil: string | null; createdAt: string }
interface MaterialItem {
  id: string; key: string; label: string; category: string; required: boolean; acceptedTypes: string[];
  status: "MISSING" | "READY" | "NEEDS_UPDATE" | "WAIVED"; documentId: string | null; document: DocumentItem | null; notes: string | null;
}
interface CommandData {
  application: { id: string; status: string; choiceType: string; externalRef: string | null; submittedAt: string | null; feePaid: boolean; program: { name: string; nameZh: string | null; university: { name: string; nameZh: string | null } } };
  materials: MaterialItem[];
  documents: DocumentItem[];
  references: Array<{ id: string; recommenderName: string; recommenderEmail: string | null; status: string; expiresAt: string; submittedAt: string | null }>;
  readiness: { score: number; ready: number; required: number; canSubmit: boolean; blockers: Array<{ label: string; status: string }> };
}

const statusLabel = { MISSING: "缺失", READY: "已就绪", NEEDS_UPDATE: "需更新", WAIVED: "已豁免" } as const;

export default function ApplicationCommandCenterPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [data, setData] = useState<CommandData | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "unauthorized" | "error">("loading");
  const [externalRef, setExternalRef] = useState("");
  const [recommenderName, setRecommenderName] = useState("");
  const [recommenderEmail, setRecommenderEmail] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch(`/api/applications/${id}/command-center`);
      if (response.status === 401) { setState("unauthorized"); return; }
      if (!response.ok) throw new Error("load failed");
      const next = await response.json() as CommandData;
      setData(next); setExternalRef(next.application.externalRef ?? ""); setState("ready");
    } catch { setState("error"); }
  }, [id]);
  useEffect(() => { const timer = window.setTimeout(() => void refresh(), 0); return () => window.clearTimeout(timer); }, [refresh]);

  const patchApplication = async (body: Record<string, unknown>) => {
    setBusy(true);
    try {
      const response = await fetch(`/api/applications/${id}/command-center`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      if (response.ok) { const next = await response.json() as CommandData; setData(next); }
    } finally { setBusy(false); }
  };
  const patchMaterial = async (materialId: string, body: Record<string, unknown>) => {
    const response = await fetch(`/api/applications/${id}/materials/${materialId}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    if (response.ok) setData(await response.json() as CommandData);
  };
  const createReference = async () => {
    if (!recommenderName.trim()) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/applications/${id}/references`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ recommenderName, recommenderEmail, expiresDays: 14 }) });
      if (response.ok) { const result = await response.json() as { url: string }; setGeneratedUrl(result.url); setRecommenderName(""); setRecommenderEmail(""); await refresh(); }
    } finally { setBusy(false); }
  };
  const copyLink = async () => { if (generatedUrl) await navigator.clipboard.writeText(generatedUrl); };

  if (state === "loading") return <main className="mx-auto max-w-6xl px-4 py-12"><div className="h-72 animate-pulse bg-[var(--surface)]" /></main>;
  if (state === "unauthorized") return <main className="mx-auto max-w-xl px-4 py-20 text-center"><ShieldCheck className="mx-auto size-8 text-[var(--indigo)]" /><h1 className="mt-4 text-2xl font-bold">登录后管理申请材料</h1><Link href="/login" className="mt-5 inline-flex rounded-md bg-[var(--indigo)] px-5 py-2.5 text-sm font-medium text-white">前往登录</Link></main>;
  if (state === "error" || !data) return <main className="mx-auto max-w-4xl px-4 py-16 text-center text-[var(--danger)]">申请作战室暂时无法加载。</main>;

  const app = data.application;
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="border-b border-[var(--border)] pb-6">
        <Link href="/applications" className="text-xs font-semibold text-[var(--indigo)]">返回申请列表</Link>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
          <div><div className="text-xs font-semibold text-[var(--ink-faint)]">{app.choiceType === "UCAS_CHOICE" ? "UCAS" : "HK DIRECT"} · {app.status}</div><h1 className="mt-1 text-3xl font-bold">{app.program.university.nameZh || app.program.university.name}</h1><p className="mt-1 text-sm text-[var(--ink-soft)]">{app.program.nameZh || app.program.name}</p></div>
          <div className="min-w-60"><div className="flex items-center justify-between text-sm"><span className="font-medium">申请就绪度</span><strong className="text-xl">{data.readiness.score}%</strong></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200"><div className={`h-full ${data.readiness.canSubmit ? "bg-[var(--success)]" : "bg-[var(--indigo)]"}`} style={{ width: `${data.readiness.score}%` }} /></div><p className="mt-1 text-xs text-[var(--ink-faint)]">{data.readiness.ready}/{data.readiness.required} 项必需材料已就绪</p></div>
        </div>
      </header>

      <div className="grid gap-8 py-7 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="min-w-0">
          <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold">材料台账</h2><p className="mt-1 text-sm text-[var(--ink-soft)]">从资料库绑定文件；一个文件可以复用于多份申请。</p></div><Link href="/documents" className="inline-flex items-center gap-1 text-sm font-medium text-[var(--indigo)]">资料库 <ExternalLink className="size-3.5" /></Link></div>
          <div className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {data.materials.map((material) => {
              const choices = data.documents.filter((doc) => material.acceptedTypes.includes(doc.type));
              return <div key={material.id} className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,18rem)] sm:items-center">
                <div className="flex gap-3"><span className={`mt-1 flex size-7 shrink-0 items-center justify-center rounded-md ${material.status === "READY" ? "bg-[var(--success-bg)] text-[var(--success)]" : material.status === "NEEDS_UPDATE" ? "bg-[var(--warning-bg)] text-[var(--warning)]" : "bg-[var(--surface)] text-[var(--ink-faint)]"}`}>{material.status === "READY" ? <Check className="size-4" /> : <FileText className="size-4" />}</span><div><div className="text-sm font-semibold">{material.label} {material.required && <span className="text-[var(--danger)]">*</span>}</div><div className="mt-0.5 text-xs text-[var(--ink-faint)]">{statusLabel[material.status]}{material.document ? ` · ${material.document.fileName} · v${material.document.version}` : ""}</div></div></div>
                <div className="flex items-center gap-2"><select value={material.documentId ?? ""} onChange={(event) => void patchMaterial(material.id, { documentId: event.target.value || null })} className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm"><option value="">选择资料库文件</option>{choices.map((doc) => <option key={doc.id} value={doc.id}>{doc.fileName} · v{doc.version}</option>)}</select>{!material.required && material.status !== "WAIVED" && <button type="button" title="此申请不需要" onClick={() => void patchMaterial(material.id, { status: "WAIVED" })} className="shrink-0 text-xs text-[var(--ink-soft)]">豁免</button>}</div>
              </div>;
            })}
          </div>
        </div>

        <aside className="space-y-7 border-t border-[var(--border)] pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
          <section><h2 className="text-base font-bold">提交检查</h2>{data.readiness.blockers.length ? <div className="mt-3 space-y-2">{data.readiness.blockers.map((item) => <div key={item.label} className="flex gap-2 text-sm text-[var(--ink-soft)]"><AlertCircle className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" />{item.label}</div>)}</div> : <p className="mt-3 flex gap-2 text-sm text-[var(--success)]"><CheckCircle2 className="size-4" />必需材料已齐全</p>}
            <label className="mt-4 block text-xs font-medium">申请编号<input value={externalRef} onChange={(event) => setExternalRef(event.target.value)} onBlur={() => void patchApplication({ externalRef: externalRef || null })} placeholder="提交后填写" className="mt-1 block w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm font-normal" /></label>
            <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={app.feePaid} onChange={(event) => void patchApplication({ feePaid: event.target.checked })} />申请费已支付</label>
            {data.readiness.canSubmit && !app.feePaid && <p className="mt-3 text-xs text-[var(--warning)]">确认支付申请费后才能记录提交。</p>}
            {app.status !== "SUBMITTED" && <button type="button" disabled={!data.readiness.canSubmit || !app.feePaid || busy} onClick={() => void patchApplication({ action: "submit", externalRef: externalRef || null, feePaid: app.feePaid })} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--indigo)] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"><Send className="size-4" />确认已提交</button>}
          </section>

          {data.materials.some((item) => item.key === "reference") && <section className="border-t border-[var(--border)] pt-6"><h2 className="text-base font-bold">推荐信协作</h2><p className="mt-1 text-xs leading-5 text-[var(--ink-soft)]">生成一次性安全链接，由推荐老师直接上传。</p>
            <input value={recommenderName} onChange={(event) => setRecommenderName(event.target.value)} placeholder="推荐人姓名" className="mt-3 block w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm" /><input type="email" value={recommenderEmail} onChange={(event) => setRecommenderEmail(event.target.value)} placeholder="邮箱（可选）" className="mt-2 block w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm" /><button type="button" disabled={!recommenderName.trim() || busy} onClick={() => void createReference()} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md border border-[var(--border)] px-3 py-2 text-sm font-medium disabled:opacity-40"><Link2 className="size-4" />生成 14 天链接</button>
            {generatedUrl && <div className="mt-3 border-l-2 border-[var(--success)] pl-3"><p className="break-all text-xs text-[var(--ink-soft)]">{generatedUrl}</p><button type="button" onClick={() => void copyLink()} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--indigo)]"><ClipboardCopy className="size-3.5" />复制链接</button></div>}
            {data.references.length > 0 && <div className="mt-4 space-y-2">{data.references.map((ref) => <div key={ref.id} className="flex items-center justify-between gap-2 text-xs"><span className="truncate">{ref.recommenderName}</span><span className={ref.status === "SUBMITTED" ? "text-[var(--success)]" : "text-[var(--ink-faint)]"}>{ref.status === "SUBMITTED" ? "已提交" : ref.status === "PENDING" ? "等待中" : "已失效"}</span></div>)}</div>}
          </section>}
          <button type="button" onClick={() => void refresh()} className="inline-flex items-center gap-1 text-xs text-[var(--ink-faint)]"><RefreshCw className="size-3.5" />刷新状态</button>
        </aside>
      </div>
    </main>
  );
}
