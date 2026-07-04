"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { PROJECT_FIELDS } from "@/lib/background/projects";
import { saveStudentStructure, deleteStudentProject } from "@/lib/background/student-project-actions";
import { StudentProjectRun } from "@/components/background/student-project-run";
import type {
  StudentProjectDTO,
  StudentStructure,
  StudentStage,
} from "@/lib/background/student-project-types";

function fieldLabel(v: string): string {
  return PROJECT_FIELDS.find((f) => f.value === v)?.label ?? "其它";
}

const EMPTY_STRUCTURE: StudentStructure = {
  summary: "",
  primaryTool: "",
  baseline: "",
  challenge: "",
  stages: [],
  reflection: [],
  psUse: "",
};

export function StudentProjectDetail({ project }: { project: StudentProjectDTO }) {
  const router = useRouter();
  const idea = project.ideaInputs;

  const [structure, setStructure] = useState<StudentStructure | null>(project.structure);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [mode, setMode] = useState<"edit" | "run">(project.structure ? "run" : "edit");

  const removeProject = async () => {
    const res = await deleteStudentProject(project.id);
    if (res.ok) {
      router.push("/background/my-projects");
    } else {
      setError(res.error || "删除失败");
    }
  };

  const generate = async () => {
    setError("");
    setGenerating(true);
    try {
      const res = await fetch("/api/structure-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: project.title,
          field: fieldLabel(project.field),
          question: idea.question,
          motivation: idea.motivation,
          method: idea.method,
          variables: idea.variables,
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "生成失败");
      }
      const data = (await res.json()) as { structure: StudentStructure };
      setStructure({ ...EMPTY_STRUCTURE, ...data.structure });
    } catch (e) {
      setError(e instanceof Error ? e.message : "生成失败");
    } finally {
      setGenerating(false);
    }
  };

  const save = async () => {
    if (!structure) return;
    setSaving(true);
    setError("");
    const res = await saveStudentStructure({
      id: project.id,
      summary: structure.summary,
      structure,
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setMode("run");
      router.refresh();
      setTimeout(() => setSaved(false), 2500);
    } else {
      setError(res.error || "保存失败");
    }
  };

  // 编辑辅助
  const upd = (patch: Partial<StudentStructure>) =>
    setStructure((s) => (s ? { ...s, ...patch } : s));
  const updStage = (i: number, patch: Partial<StudentStage>) =>
    setStructure((s) =>
      s ? { ...s, stages: s.stages.map((st, idx) => (idx === i ? { ...st, ...patch } : st)) } : s
    );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <button
        onClick={() => router.push("/background/my-projects")}
        className="text-sm text-[var(--indigo)] hover:underline"
      >
        ← 返回我的课题
      </button>

      <div className="flex items-center gap-2 mt-3 mb-1">
        <span className="text-xs rounded-full px-2 py-0.5 bg-[var(--surface)] text-[var(--ink-soft)]">
          {fieldLabel(project.field)}
        </span>
        <span className="text-xs rounded-full px-2 py-0.5 bg-neutral-100 text-neutral-600">
          {project.status === "DRAFT" ? "草稿" : project.status === "ACTIVE" ? "进行中" : "已完成"}
        </span>
      </div>
      <h1 className="text-2xl font-bold text-[var(--ink)] mb-5">{project.title}</h1>

      {/* 想法（可折叠回顾） */}
      <details className="rounded-2xl border border-[var(--border)] p-4 mb-5">
        <summary className="text-sm font-semibold text-[var(--ink-soft)] cursor-pointer">
          你填写的原始想法
        </summary>
        <div className="mt-3 space-y-2 text-sm">
          <p><span className="text-[var(--ink-soft)]">问题：</span>{idea.question || "（未填）"}</p>
          <p><span className="text-[var(--ink-soft)]">动机：</span>{idea.motivation || "（未填）"}</p>
          <p><span className="text-[var(--ink-soft)]">方法：</span>{idea.method || "（未填）"}</p>
          <p><span className="text-[var(--ink-soft)]">测量：</span>{idea.variables || "（未填）"}</p>
        </div>
      </details>

      {/* 未生成：显示生成按钮 */}
      {!structure && (
        <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/30 p-6 text-center">
          <p className="text-sm text-[var(--ink)] font-medium mb-1">让 AI 帮你梳理成规范课题</p>
          <p className="text-xs text-[var(--ink-soft)] mb-4">
            AI 会把你的想法拆成分阶段、量化指标、反思问题与 PS 用途，你之后可以自由修改。
          </p>
          <button
            onClick={generate}
            disabled={generating}
            className="px-5 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {generating ? "AI 梳理中…（约 10–20 秒）" : "🎓 让 AI 帮我梳理"}
          </button>
          {error && <p className="mt-3 text-sm text-amber-700">{error}</p>}
        </div>
      )}

      {/* 结构存在：切换 编辑 / 开始做 */}
      {structure && (
        <div className="flex items-center gap-2 mb-5">
          <button
            onClick={() => setMode("run")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${mode === "run" ? "bg-brand text-white" : "bg-white border border-[var(--border)] text-[var(--ink-soft)]"}`}
          >
            开始做
          </button>
          <button
            onClick={() => setMode("edit")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${mode === "edit" ? "bg-brand text-white" : "bg-white border border-[var(--border)] text-[var(--ink-soft)]"}`}
          >
            编辑结构
          </button>
        </div>
      )}

      {/* 执行模式 */}
      {structure && mode === "run" && (
        <StudentProjectRun project={project} structure={structure} />
      )}

      {/* 已生成：可编辑结构 */}
      {structure && mode === "edit" && (
        <div className="space-y-5">
          <p className="text-xs text-[var(--ink-soft)]">
            下面是 AI 梳理的课题结构，你可以自由修改每一项，然后保存。
          </p>

          <EditText label="一句话概括" value={structure.summary} onChange={(v) => upd({ summary: v })} />
          <EditText label="主要工具 / 方法" value={structure.primaryTool} onChange={(v) => upd({ primaryTool: v })} />
          <EditText label="基础线（达到即合格）" value={structure.baseline} onChange={(v) => upd({ baseline: v })} textarea />
          <EditText label="挑战目标（拔高）" value={structure.challenge} onChange={(v) => upd({ challenge: v })} textarea />

          {/* 阶段 */}
          <div>
            <p className="text-sm font-semibold text-[var(--ink)] mb-2">阶段</p>
            <div className="space-y-4">
              {structure.stages.map((st, i) => (
                <div key={i} className="rounded-xl border border-[var(--border)] p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--indigo)] shrink-0">阶段 {st.num}</span>
                    <input
                      value={st.title}
                      onChange={(e) => updStage(i, { title: e.target.value })}
                      className="flex-1 rounded border border-[var(--border)] px-2 py-1 text-sm font-medium"
                    />
                  </div>
                  <MiniField label="目标" value={st.goal} onChange={(v) => updStage(i, { goal: v })} />
                  <MiniField label="任务" value={st.tasks} onChange={(v) => updStage(i, { tasks: v })} textarea />
                  <MiniField label="产出物" value={st.deliverable} onChange={(v) => updStage(i, { deliverable: v })} />
                  <MiniField
                    label="量化指标（每行一条）"
                    value={st.metrics.join("\n")}
                    onChange={(v) => updStage(i, { metrics: v.split("\n").filter((x) => x.trim()) })}
                    textarea
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 反思 */}
          <EditText
            label="反思与延伸问题（每行一条）"
            value={structure.reflection.join("\n")}
            onChange={(v) => upd({ reflection: v.split("\n").filter((x) => x.trim()) })}
            textarea
          />

          {/* PS 用途 */}
          <EditText label="如何用于申请（PS 用途）" value={structure.psUse} onChange={(v) => upd({ psUse: v })} textarea />

          {error && <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex items-center gap-3 pt-2 pb-8">
            <button
              onClick={save}
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {saving ? "保存中…" : saved ? "已保存 ✓" : "保存课题"}
            </button>
            <button
              onClick={generate}
              disabled={generating}
              className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]"
            >
              {generating ? "重新生成中…" : "🔄 让 AI 重新梳理"}
            </button>
          </div>
        </div>
      )}
      {/* 删除课题 */}
      <div className="mt-8 pt-5 border-t border-[var(--border)] pb-8">
        {confirmingDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--ink)]">确定删除这个课题？此操作无法撤销。</span>
            <button
              onClick={removeProject}
              className="text-xs px-3 py-1.5 rounded bg-red-500 text-white hover:bg-red-600"
            >
              确认删除
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="text-xs px-3 py-1.5 rounded border border-[var(--border)] text-[var(--ink-soft)]"
            >
              取消
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="text-sm text-neutral-400 hover:text-red-500"
          >
            删除这个课题
          </button>
        )}
      </div>
    </div>
  );
}

function EditText({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--ink)] mb-1">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
        />
      )}
    </div>
  );
}

function MiniField({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-[var(--ink-soft)] mb-0.5">{label}</p>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="w-full rounded border border-[var(--border)] px-2 py-1 text-sm"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded border border-[var(--border)] px-2 py-1 text-sm"
        />
      )}
    </div>
  );
}
