"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  upsertUniversityAction,
  deleteUniversityAction,
  type AdminUniversityRow,
} from "@/lib/admin/content-actions";

type FormState = {
  id?: string;
  name: string;
  nameZh: string;
  region: string;
  city: string;
  league: string;
  qsRankWorld: string;
  website: string;
};

const EMPTY: FormState = {
  name: "", nameZh: "", region: "UK", city: "", league: "", qsRankWorld: "", website: "",
};

export function UniversityManager({ initial }: { initial: AdminUniversityRow[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openNew = () => { setError(null); setForm({ ...EMPTY }); };
  const openEdit = (u: AdminUniversityRow) => {
    setError(null);
    setForm({
      id: u.id, name: u.name, nameZh: u.nameZh ?? "", region: u.region,
      city: u.city ?? "", league: u.league ?? "", qsRankWorld: u.qsRankWorld?.toString() ?? "",
      website: u.website ?? "",
    });
  };

  const save = async () => {
    if (!form) return;
    setBusy(true); setError(null);
    const res = await upsertUniversityAction({
      id: form.id,
      name: form.name,
      nameZh: form.nameZh || null,
      region: form.region,
      city: form.city || null,
      league: form.league || null,
      qsRankWorld: form.qsRankWorld ? Number(form.qsRankWorld) : null,
      website: form.website || null,
    });
    setBusy(false);
    if (!res.ok) { setError(res.error ?? "保存失败"); return; }
    setForm(null);
    router.refresh();
  };

  const remove = async (u: AdminUniversityRow) => {
    if (!confirm(`删除「${u.name}」及其 ${u.programCount} 个专业？此操作不可撤销。`)) return;
    const res = await deleteUniversityAction(u.id);
    if (!res.ok) {
      alert(res.error === "has_applications" ? "该校有专业已被学生加入申请，无法删除。" : "删除失败");
      return;
    }
    router.refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">院校管理（{initial.length}）</h1>
        <button onClick={openNew} className="rounded-lg bg-blue-600 text-white text-sm px-4 py-2 hover:bg-blue-700">
          + 新增院校
        </button>
      </div>

      {form && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 mb-5">
          <h2 className="text-sm font-semibold mb-3">{form.id ? "编辑院校" : "新增院校"}</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            <Field label="英文名 *"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inp} /></Field>
            <Field label="中文名"><input value={form.nameZh} onChange={(e) => setForm({ ...form, nameZh: e.target.value })} className={inp} /></Field>
            <Field label="地区 *">
              <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className={inp}>
                <option value="UK">英国 (UK)</option>
                <option value="HK">香港 (HK)</option>
              </select>
            </Field>
            <Field label="城市"><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inp} /></Field>
            <Field label="联盟/分类"><input value={form.league} onChange={(e) => setForm({ ...form, league: e.target.value })} placeholder="Russell Group / HK UGC 8" className={inp} /></Field>
            <Field label="QS 世界排名"><input value={form.qsRankWorld} onChange={(e) => setForm({ ...form, qsRankWorld: e.target.value.replace(/\D/g, "") })} className={inp} /></Field>
            <Field label="官网"><input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://..." className={inp} /></Field>
          </div>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          <div className="flex gap-2 mt-3">
            <button onClick={save} disabled={busy} className="rounded-lg bg-blue-600 text-white text-sm px-4 py-2 hover:bg-blue-700 disabled:opacity-50">{busy ? "保存中…" : "保存"}</button>
            <button onClick={() => setForm(null)} className="rounded-lg border border-neutral-300 text-sm px-4 py-2 hover:bg-neutral-50">取消</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-neutral-200">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">院校</th>
              <th className="px-4 py-2 font-medium">地区</th>
              <th className="px-4 py-2 font-medium">QS</th>
              <th className="px-4 py-2 font-medium">专业数</th>
              <th className="px-4 py-2 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {initial.map((u) => (
              <tr key={u.id} className="border-t border-neutral-100">
                <td className="px-4 py-2">
                  <span className="text-neutral-800">{u.nameZh || u.name}</span>
                  <span className="text-neutral-400 text-xs block">{u.name}</span>
                </td>
                <td className="px-4 py-2 text-neutral-500">{u.region === "UK" ? "英国" : "香港"}</td>
                <td className="px-4 py-2 text-neutral-500">{u.qsRankWorld ?? "—"}</td>
                <td className="px-4 py-2 text-neutral-500">{u.programCount}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-3 text-xs">
                    <Link href={`/admin/content/${u.id}`} className="text-blue-600 hover:underline">管理专业</Link>
                    <button onClick={() => openEdit(u)} className="text-neutral-600 hover:underline">编辑</button>
                    <button onClick={() => remove(u)} className="text-neutral-400 hover:text-red-600">删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inp = "w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm bg-white";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-neutral-500">{label}</span>
      {children}
    </label>
  );
}
