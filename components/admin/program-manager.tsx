"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  upsertProgramAction,
  deleteProgramAction,
  type AdminProgramRow,
} from "@/lib/admin/content-actions";

const FIELDS = [
  ["cs", "计算机"], ["ds", "数据科学"], ["economics", "经济学"], ["business", "商科管理"],
  ["math", "数学"], ["engineering", "工程"], ["aerospace", "航空航天"], ["mechanical", "机械"],
  ["eee", "电子电气"], ["physics", "物理"], ["law", "法律"], ["medicine", "医学"], ["psychology", "心理学"],
];
const DEGREES = ["BA", "BSc", "BEng", "LLB", "MBChB", "OTHER"];

type FormState = {
  id?: string;
  name: string; nameZh: string; field: string; degreeType: string; applyRoute: string;
  annualTuitionGbp: string; annualTuitionHkd: string;
  alevelOfferTypical: string; alevelOfferMinimum: string;
  ieltsOverall: string; admissionsTest: string; interviewRequired: boolean;
  coursePageUrl: string; markVerified: boolean;
};

function emptyForm(route: string): FormState {
  return {
    name: "", nameZh: "", field: "", degreeType: "", applyRoute: route,
    annualTuitionGbp: "", annualTuitionHkd: "", alevelOfferTypical: "", alevelOfferMinimum: "",
    ieltsOverall: "", admissionsTest: "", interviewRequired: false, coursePageUrl: "", markVerified: false,
  };
}

export function ProgramManager({
  universityId, uniName, region, initial,
}: {
  universityId: string; uniName: string; region: string; initial: AdminProgramRow[];
}) {
  const router = useRouter();
  const defaultRoute = region === "HK" ? "HK_DIRECT" : "UCAS";
  const [form, setForm] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openNew = () => { setError(null); setForm(emptyForm(defaultRoute)); };
  const openEdit = (p: AdminProgramRow) => {
    setError(null);
    setForm({
      id: p.id, name: p.name, nameZh: p.nameZh ?? "", field: p.field ?? "",
      degreeType: p.degreeType ?? "", applyRoute: p.applyRoute,
      annualTuitionGbp: p.annualTuitionGbp?.toString() ?? "", annualTuitionHkd: p.annualTuitionHkd?.toString() ?? "",
      alevelOfferTypical: p.alevelOfferTypical ?? "", alevelOfferMinimum: "",
      ieltsOverall: p.ieltsOverall?.toString() ?? "", admissionsTest: p.admissionsTest ?? "",
      interviewRequired: p.interviewRequired ?? false, coursePageUrl: p.coursePageUrl ?? "", markVerified: false,
    });
  };

  const save = async () => {
    if (!form) return;
    setBusy(true); setError(null);
    const res = await upsertProgramAction({
      id: form.id,
      universityId,
      name: form.name,
      nameZh: form.nameZh || null,
      field: form.field || null,
      degreeType: form.degreeType || null,
      applyRoute: form.applyRoute,
      annualTuitionGbp: form.annualTuitionGbp ? Number(form.annualTuitionGbp) : null,
      annualTuitionHkd: form.annualTuitionHkd ? Number(form.annualTuitionHkd) : null,
      alevelOfferTypical: form.alevelOfferTypical || null,
      alevelOfferMinimum: form.alevelOfferMinimum || null,
      ieltsOverall: form.ieltsOverall ? Number(form.ieltsOverall) : null,
      admissionsTest: form.admissionsTest || null,
      interviewRequired: form.interviewRequired,
      coursePageUrl: form.coursePageUrl || null,
      markVerified: form.markVerified,
    });
    setBusy(false);
    if (!res.ok) { setError(res.error ?? "保存失败"); return; }
    setForm(null);
    router.refresh();
  };

  const remove = async (p: AdminProgramRow) => {
    if (!confirm(`删除专业「${p.name}」？`)) return;
    const res = await deleteProgramAction(p.id);
    if (!res.ok) {
      alert(res.error === "has_applications" ? "该专业已被学生加入申请，无法删除。" : "删除失败");
      return;
    }
    router.refresh();
  };

  return (
    <div>
      <div className="text-xs text-neutral-400 mb-1">
        <Link href="/admin/content" className="hover:underline">← 院校管理</Link>
      </div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold">{uniName} · 专业管理（{initial.length}）</h1>
        <button onClick={openNew} className="rounded-lg bg-blue-600 text-white text-sm px-4 py-2 hover:bg-blue-700">+ 新增专业</button>
      </div>
      <p className="text-xs text-amber-700 bg-amber-50 rounded px-3 py-2 mb-4">
        入学要求（offer/学费/雅思/考试）请对照官网核对后填写。填好后可勾选「标记为已核对」记录核对日期。
      </p>

      {form && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 mb-5">
          <h2 className="text-sm font-semibold mb-3">{form.id ? "编辑专业" : "新增专业"}</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            <F label="英文名 *"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inp} /></F>
            <F label="中文名"><input value={form.nameZh} onChange={(e) => setForm({ ...form, nameZh: e.target.value })} className={inp} /></F>
            <F label="学科方向">
              <select value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} className={inp}>
                <option value="">（未分类）</option>
                {FIELDS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </F>
            <F label="学位类型">
              <select value={form.degreeType} onChange={(e) => setForm({ ...form, degreeType: e.target.value })} className={inp}>
                <option value="">（未填）</option>
                {DEGREES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </F>
            <F label="申请路线">
              <select value={form.applyRoute} onChange={(e) => setForm({ ...form, applyRoute: e.target.value })} className={inp}>
                <option value="UCAS">UCAS（英国）</option>
                <option value="HK_DIRECT">HK Direct（香港）</option>
              </select>
            </F>
            <F label="典型 offer"><input value={form.alevelOfferTypical} onChange={(e) => setForm({ ...form, alevelOfferTypical: e.target.value })} placeholder="A*AA" className={inp} /></F>
            <F label="学费/年 (£)"><input value={form.annualTuitionGbp} onChange={(e) => setForm({ ...form, annualTuitionGbp: e.target.value.replace(/\D/g, "") })} className={inp} /></F>
            <F label="学费/年 (HK$)"><input value={form.annualTuitionHkd} onChange={(e) => setForm({ ...form, annualTuitionHkd: e.target.value.replace(/\D/g, "") })} className={inp} /></F>
            <F label="雅思总分"><input value={form.ieltsOverall} onChange={(e) => setForm({ ...form, ieltsOverall: e.target.value.replace(/[^0-9.]/g, "") })} placeholder="6.5" className={inp} /></F>
            <F label="入学考试"><input value={form.admissionsTest} onChange={(e) => setForm({ ...form, admissionsTest: e.target.value })} placeholder="MAT / STEP / LNAT / UCAT…" className={inp} /></F>
            <F label="官方课程页链接"><input value={form.coursePageUrl} onChange={(e) => setForm({ ...form, coursePageUrl: e.target.value })} placeholder="https://..." className={inp} /></F>
          </div>
          <div className="flex items-center gap-4 mt-3 text-sm">
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={form.interviewRequired} onChange={(e) => setForm({ ...form, interviewRequired: e.target.checked })} className="accent-blue-600" />
              需要面试
            </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={form.markVerified} onChange={(e) => setForm({ ...form, markVerified: e.target.checked })} className="accent-green-600" />
              标记为已核对（记录今天的日期）
            </label>
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
              <th className="px-3 py-2 font-medium">专业</th>
              <th className="px-3 py-2 font-medium">方向</th>
              <th className="px-3 py-2 font-medium">Offer</th>
              <th className="px-3 py-2 font-medium">学费</th>
              <th className="px-3 py-2 font-medium">雅思</th>
              <th className="px-3 py-2 font-medium">核对</th>
              <th className="px-3 py-2 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {initial.map((p) => (
              <tr key={p.id} className="border-t border-neutral-100">
                <td className="px-3 py-2">
                  <span className="text-neutral-800">{p.nameZh || p.name}</span>
                  <span className="text-neutral-400 text-xs block">{p.name}</span>
                </td>
                <td className="px-3 py-2 text-neutral-500">{FIELDS.find(([v]) => v === p.field)?.[1] ?? "—"}</td>
                <td className="px-3 py-2 text-neutral-500">{p.alevelOfferTypical ?? "—"}</td>
                <td className="px-3 py-2 text-neutral-500">{p.annualTuitionGbp ? `£${p.annualTuitionGbp}` : p.annualTuitionHkd ? `HK$${p.annualTuitionHkd}` : "—"}</td>
                <td className="px-3 py-2 text-neutral-500">{p.ieltsOverall ?? "—"}</td>
                <td className="px-3 py-2">
                  {p.verifiedAt
                    ? <span className="text-xs text-green-700 bg-green-50 rounded px-1.5 py-0.5">{p.verifiedAt}</span>
                    : <span className="text-xs text-neutral-300">未核对</span>}
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-2 text-xs">
                    {p.coursePageUrl && <a href={p.coursePageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">官网</a>}
                    <button onClick={() => openEdit(p)} className="text-neutral-600 hover:underline">编辑</button>
                    <button onClick={() => remove(p)} className="text-neutral-400 hover:text-red-600">删除</button>
                  </div>
                </td>
              </tr>
            ))}
            {initial.length === 0 && (
              <tr><td colSpan={7} className="px-3 py-10 text-center text-neutral-400">还没有专业，点「新增专业」添加</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inp = "w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm bg-white";
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-xs text-neutral-500">{label}</span>{children}</label>;
}
