"use client";

import { useEffect, useState } from "react";
import {
  ONLINE_PROJECTS,
  PROJECT_FIELDS,
  projectFieldLabel,
} from "@/lib/background/projects";
import { getAllProjectProgress, getReflectionNotes } from "@/lib/background/project-store";
import { listMyStudentProjects } from "@/lib/background/student-project-actions";
import type { UcasPsContent } from "@/lib/statements/store";

type Material = {
  uid: string;
  source: "platform" | "self";
  title: string;
  field: string;
  summary: string;
  reflection: string;
  submissions: string[];
};

type Result = {
  summary: string;
  strengths: string[];
  suggestions: string[];
  questions: string[];
};

function fieldLabel(v: string): string {
  return PROJECT_FIELDS.find((f) => f.value === v)?.label ?? "其它";
}

export function ImportFromProjects({ content }: { content: UcasPsContent }) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [picked, setPicked] = useState<string>("");
  const [question, setQuestion] = useState<"q2" | "q3">("q2");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const list: Material[] = [];
    // 平台课题（localStorage）
    try {
      for (const pr of getAllProjectProgress()) {
        const proj = ONLINE_PROJECTS.find((p) => p.id === pr.projectId);
        if (!proj) continue;
        const submissions = pr.stages.map((s) => s.submission).filter((x) => x && x.trim());
        const reflection = getReflectionNotes(pr.projectId);
        if (!reflection.trim() && submissions.length === 0) continue; // 没材料就跳过
        list.push({
          uid: `platform:${proj.id}`,
          source: "platform",
          title: proj.title,
          field: projectFieldLabel(proj.field),
          summary: proj.summary,
          reflection,
          submissions,
        });
      }
    } catch {
      /* localStorage 不可用 */
    }
    // 自提课题（数据库）
    listMyStudentProjects()
      .then((selfs) => {
        for (const sp of selfs) {
          const submissions = (sp.progress?.stages ?? []).map((s) => s.submission).filter((x) => x && x.trim());
          const reflection = sp.progress?.reflectionNotes ?? "";
          if (!reflection.trim() && submissions.length === 0 && !sp.summary) continue;
          list.push({
            uid: `self:${sp.id}`,
            source: "self",
            title: sp.title,
            field: fieldLabel(sp.field),
            summary: sp.summary ?? "",
            reflection,
            submissions,
          });
        }
        setMaterials([...list]);
      })
      .catch(() => setMaterials([...list]));
  }, []);

  const run = async () => {
    const m = materials.find((x) => x.uid === picked);
    if (!m) {
      setError("请先选择一个课题。");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ps-from-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          projectTitle: m.title,
          field: m.field,
          summary: m.summary,
          reflection: m.reflection,
          submissions: m.submissions,
          currentAnswer: content[question],
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "生成失败");
      }
      setResult((await res.json()) as Result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "生成失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-8 rounded-xl border border-violet-200 bg-violet-50/30 p-5">
      <h2 className="font-semibold text-neutral-800">🔗 从我的课题导入素材</h2>
      <p className="text-sm text-neutral-500 mt-0.5">
        参考你在平台做过的课题（平台课题 + 自提课题），让 AI 帮你想清楚这段真实经历怎么写进 Q2 / Q3（不代写）。
      </p>

      {materials.length === 0 ? (
        <p className="mt-3 text-sm text-neutral-500">
          还没有可用的课题素材。去「背景提升」做一个课题、写下反思后，这里就能一键参考。
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm text-neutral-600">选择一个课题</label>
            <select
              value={picked}
              onChange={(e) => setPicked(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-white"
            >
              <option value="">— 请选择 —</option>
              {materials.map((m) => (
                <option key={m.uid} value={m.uid}>
                  {m.source === "self" ? "【自提】" : "【平台】"} {m.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600">写入哪一题：</span>
            <label className="flex items-center gap-1 text-sm">
              <input type="radio" checked={question === "q2"} onChange={() => setQuestion("q2")} /> Q2（学术准备）
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input type="radio" checked={question === "q3"} onChange={() => setQuestion("q3")} /> Q3（教育之外）
            </label>
          </div>

          <button
            onClick={run}
            disabled={loading}
            className="text-sm px-4 py-2 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-700 disabled:opacity-60"
          >
            {loading ? "思考中…" : "让 AI 帮我用这段经历"}
          </button>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">{error}</p>}

      {result && (
        <div className="mt-4 space-y-3 rounded-xl border border-violet-100 bg-white p-4">
          {result.summary && <p className="text-sm font-medium text-neutral-800">{result.summary}</p>}
          <FbList title="✨ 这段经历里可写进文书的点" items={result.strengths} color="text-green-700" />
          <FbList title="💡 如何组织进这一题" items={result.suggestions} color="text-violet-700" />
          <FbList title="🤔 帮你写深的追问" items={result.questions} color="text-indigo-700" />
          <p className="text-[11px] text-neutral-400 pt-1 border-t border-violet-100">
            这些只是思路提示。请用你自己的话动笔——文书必须是本人真实文字（UCAS 有相似度检测）。
          </p>
        </div>
      )}
    </section>
  );
}

function FbList({ title, items, color }: { title: string; items: string[]; color: string }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className={`text-xs font-semibold mb-1 ${color}`}>{title}</p>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="text-sm text-neutral-700 flex gap-2">
            <span className="text-neutral-300">·</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
