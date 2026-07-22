"use client";

import { useEffect, useState, useRef } from "react";
import { Link } from "@/i18n/navigation";

interface DocItem {
  id: string;
  type: string;
  fileKey: string;
  fileName: string;
  mime: string | null;
  size: number | null;
  version: number;
  validUntil: string | null;
  supersedesId: string | null;
  createdAt: string;
}

const DOC_TYPES: { value: string; label: string }[] = [
  { value: "TRANSCRIPT", label: "成绩单" },
  { value: "PREDICTED_GRADES", label: "预估成绩" },
  { value: "IELTS", label: "雅思成绩单" },
  { value: "TOEFL", label: "托福成绩单" },
  { value: "PASSPORT", label: "护照 / 身份证件" },
  { value: "CERTIFICATE", label: "证书 / 获奖" },
  { value: "PHOTO", label: "证件照" },
  { value: "OTHER", label: "其他" },
];

function typeLabel(v: string): string {
  return DOC_TYPES.find((t) => t.value === v)?.label ?? "其他";
}

function fmtSize(n: number | null): string {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [authed, setAuthed] = useState(true);
  const [type, setType] = useState("TRANSCRIPT");
  const [validUntil, setValidUntil] = useState("");
  const [supersedesId, setSupersedesId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const res = await fetch("/api/documents");
    if (res.status === 401) {
      setAuthed(false);
      setLoaded(true);
      return;
    }
    const data = await res.json();
    setDocs(data.documents ?? []);
    setAuthed(true);
    setLoaded(true);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const onUpload = async () => {
    setError(null);
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("请先选择一个文件");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("文件过大，请控制在 10 MB 以内");
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("type", type);
      if (validUntil) form.append("validUntil", validUntil);
      if (supersedesId) form.append("supersedesId", supersedesId);
      const res = await fetch("/api/documents", { method: "POST", body: form });
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(
          d.error === "too_large"
            ? "文件过大（上限 10 MB）"
            : "上传失败，请重试"
        );
        return;
      }
      if (fileRef.current) fileRef.current.value = "";
      setSupersedesId("");
      await load();
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("确定删除这份资料吗？此操作不可撤销。")) return;
    const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
    if (res.ok) setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  if (!loaded) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-neutral-400">
        加载中…
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-xl font-bold mb-2">资料中心</h1>
        <p className="text-neutral-500 mb-6">
          上传和管理申请材料需要先登录。
        </p>
        <Link
          href="/login"
          className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          去登录
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">资料中心</h1>
      <p className="text-sm text-neutral-500 mb-6">
        集中上传和管理申请材料：成绩单、护照、雅思托福、证书等。仅你本人可见、可下载。
      </p>

      {/* 上传区 */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 mb-8">
        <h2 className="text-sm font-semibold text-neutral-800 mb-3">上传资料</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setSupersedesId(""); }}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-white"
          >
            {DOC_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <select value={supersedesId} onChange={(e) => setSupersedesId(e.target.value)} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-white">
            <option value="">新文件</option>
            {docs.filter((doc) => doc.type === type).map((doc) => <option key={doc.id} value={doc.id}>替换 {doc.fileName} · v{doc.version}</option>)}
          </select>
          <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} title="文件有效期（可选）" className="rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
          <input
            ref={fileRef}
            type="file"
            className="text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-2 file:text-sm file:text-neutral-700 hover:file:bg-neutral-200 sm:col-span-2"
          />
          <button
            onClick={onUpload}
            disabled={uploading}
            className="rounded-lg bg-blue-600 text-white text-sm px-4 py-2 hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
          >
            {uploading ? "上传中…" : "上传"}
          </button>
        </div>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        <p className="text-xs text-neutral-400 mt-2">
          支持常见文档与图片格式，单个文件上限 10 MB。
        </p>
      </div>

      {/* 列表 */}
      <h2 className="text-sm font-semibold text-neutral-700 mb-3">
        已上传（{docs.length}）
      </h2>
      {docs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center text-neutral-400 text-sm">
          还没有上传任何资料
        </div>
      ) : (
        <div className="space-y-2">
          {docs.map((d) => (
            <div
              key={d.id}
              className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3"
            >
              <span className="text-xs font-medium text-blue-700 bg-blue-50 rounded px-2 py-1 shrink-0">
                {typeLabel(d.type)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-neutral-800 truncate">{d.fileName}</p>
                <p className="text-xs text-neutral-400">
                  v{d.version} · {fmtSize(d.size)} · {new Date(d.createdAt).toLocaleDateString()}
                  {d.validUntil ? ` · 有效期至 ${new Date(d.validUntil).toLocaleDateString()}` : ""}
                </p>
              </div>
              <a
                href={`/api/files/${d.fileKey}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline shrink-0"
              >
                下载
              </a>
              <button
                onClick={() => onDelete(d.id)}
                className="text-sm text-neutral-400 hover:text-red-600 shrink-0"
              >
                删除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
