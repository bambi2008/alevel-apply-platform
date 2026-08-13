"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, FileUp, LockKeyhole } from "lucide-react";
import { useParams } from "next/navigation";

interface RequestInfo {
  status: "PENDING" | "SUBMITTED" | "REVOKED" | "EXPIRED";
  recommenderName: string;
  message: string | null;
  expiresAt: string;
  studentName: string | null;
  program: { name: string; nameZh: string | null; university: string; universityZh: string | null };
}

export default function ReferenceUploadPage() {
  const { token } = useParams<{ token: string }>();
  const [info, setInfo] = useState<RequestInfo | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "invalid" | "uploading" | "done" | "error">("loading");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const response = await fetch(`/api/references/${encodeURIComponent(token)}`);
    if (!response.ok) { setState("invalid"); return; }
    const result = await response.json() as RequestInfo;
    setInfo(result);
    setState(result.status === "SUBMITTED" ? "done" : result.status === "PENDING" ? "ready" : "invalid");
  }, [token]);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  const upload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setState("uploading");
    const form = new FormData(); form.append("file", file);
    const response = await fetch(`/api/references/${encodeURIComponent(token)}`, { method: "POST", body: form });
    setState(response.ok ? "done" : "error");
  };

  if (state === "loading") return <main className="mx-auto max-w-xl px-4 py-20"><div className="h-64 animate-pulse bg-[var(--surface)]" /></main>;
  if (state === "invalid") return <main className="mx-auto max-w-lg px-4 py-24 text-center"><LockKeyhole className="mx-auto size-8 text-[var(--ink-faint)]" /><h1 className="mt-4 text-2xl font-bold">此链接已失效</h1><p className="mt-2 text-sm text-[var(--ink-soft)]">请联系学生重新生成推荐信上传链接。</p></main>;
  if (state === "done") return <main className="mx-auto max-w-lg px-4 py-24 text-center"><CheckCircle2 className="mx-auto size-10 text-[var(--success)]" /><h1 className="mt-4 text-2xl font-bold">推荐信已安全提交</h1><p className="mt-2 text-sm text-[var(--ink-soft)]">学生的材料清单已经自动更新，无需再次上传。</p></main>;
  if (!info) return null;

  return <main className="mx-auto max-w-xl px-4 py-16">
    <header className="border-b border-[var(--border)] pb-6"><div className="flex items-center gap-2 text-xs font-semibold text-[var(--success)]"><LockKeyhole className="size-4" />安全推荐信上传</div><h1 className="mt-3 text-3xl font-bold">您好，{info.recommenderName}</h1><p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">{info.studentName || "该学生"} 邀请您为以下本科申请提交推荐信。此页面只用于接收推荐信文件。</p></header>
    <section className="border-b border-[var(--border)] py-6"><div className="text-xs text-[var(--ink-faint)]">申请项目</div><div className="mt-1 text-lg font-bold">{info.program.universityZh || info.program.university}</div><div className="mt-1 text-sm text-[var(--ink-soft)]">{info.program.nameZh || info.program.name}</div>{info.message && <div className="mt-4 border-l-2 border-[var(--indigo)] pl-3 text-sm leading-6 text-[var(--ink-soft)]">{info.message}</div>}</section>
    <section className="py-6"><label className="block text-sm font-semibold">推荐信文件<input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="mt-2 block w-full rounded-md border border-[var(--border)] p-3 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[var(--surface)] file:px-3 file:py-2" /></label><p className="mt-2 text-xs text-[var(--ink-faint)]">仅支持 PDF、DOC、DOCX，最大 10 MB。链接有效期至 {new Date(info.expiresAt).toLocaleDateString("zh-CN")}。</p>{state === "error" && <p className="mt-3 text-sm text-[var(--danger)]">上传失败，请检查文件格式和大小后重试。</p>}<button type="button" disabled={state === "uploading"} onClick={() => void upload()} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--indigo)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"><FileUp className="size-4" />{state === "uploading" ? "正在安全上传…" : "提交推荐信"}</button></section>
    <p className="text-xs leading-5 text-[var(--ink-faint)]">文件仅对该学生本人可见。请勿在文件中加入与申请无关的敏感信息。</p>
  </main>;
}
