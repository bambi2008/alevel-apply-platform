"use client";

import { useState } from "react";
import { saveStudentProgress } from "@/lib/background/student-project-actions";
import type {
  StudentProjectDTO,
  StudentStructure,
  StudentProgress,
  StudentStageProgress,
} from "@/lib/background/student-project-types";

type Feedback = { strengths: string[]; suggestions: string[]; questions: string[]; summary: string };

const UPLOAD_ERR: Record<string, string> = {
  too_large: "文件超过 10MB 上限。",
  unsupported_type: "不支持的文件类型（请用 PDF / 图片 / Word）。",
  unauthenticated: "请先登录再上传。",
  empty_file: "文件是空的。",
};

export function StudentProjectRun({
  project,
  structure,
}: {
  project: StudentProjectDTO;
  structure: StudentStructure;
}) {
  const initial: StudentProgress = project.progress ?? { stages: [], reflectionNotes: "" };
  const [progress, setProgress] = useState<StudentProgress>(initial);
  const [openStage, setOpenStage] = useState<number | null>(structure.stages[0]?.num ?? null);
  const [fb, setFb] = useState<Record<number, { loading?: boolean; data?: Feedback; error?: string }>>({});
  const [refFb, setRefFb] = useState<{ loading?: boolean; data?: Feedback; error?: string }>({});
  const [uploading, setUploading] = useState<Record<number, boolean>>({});
  const [uploadErr, setUploadErr] = useState<Record<number, string>>({});
  const [copied, setCopied] = useState(false);

  const persist = (next: StudentProgress) => {
    setProgress(next);
    saveStudentProgress({ id: project.id, progress: next }).catch(() => {});
  };

  const getStage = (num: number): StudentStageProgress =>
    progress.stages.find((s) => s.stageNum === num) ?? {
      stageNum: num,
      status: "todo",
      submission: "",
      attachments: [],
    };

  const updateStage = (num: number, patch: Partial<StudentStageProgress>) => {
    const existing = getStage(num);
    const merged = { ...existing, ...patch };
    const others = progress.stages.filter((s) => s.stageNum !== num);
    persist({ ...progress, stages: [...others, merged] });
  };

  const total = structure.stages.length;
  const done = structure.stages.filter((s) => {
    const st = progress.stages.find((p) => p.stageNum === s.num);
    return st && st.status === "submitted";
  }).length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  const handleUpload = async (num: number, files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadErr((e) => ({ ...e, [num]: "" }));
    setUploading((u) => ({ ...u, [num]: true }));
    try {
      const added = [];
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        form.append("type", "OTHER");
        const res = await fetch("/api/documents", { method: "POST", body: form });
        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          throw new Error(UPLOAD_ERR[e.error as string] || "上传失败，请重试。");
        }
        const { document } = (await res.json()) as {
          document: { id: string; fileKey: string; fileName: string };
        };
        added.push({ key: document.fileKey, name: document.fileName, docId: document.id });
      }
      const existing = getStage(num).attachments ?? [];
      updateStage(num, { attachments: [...existing, ...added] });
    } catch (err) {
      setUploadErr((e) => ({ ...e, [num]: err instanceof Error ? err.message : "上传失败" }));
    } finally {
      setUploading((u) => ({ ...u, [num]: false }));
    }
  };

  const removeAttachment = (num: number, key: string) => {
    const existing = getStage(num).attachments ?? [];
    updateStage(num, { attachments: existing.filter((a) => a.key !== key) });
  };

  const getStageFeedback = async (num: number) => {
    const stage = structure.stages.find((s) => s.num === num);
    if (!stage) return;
    const submission = getStage(num).submission;
    if (!submission.trim()) {
      setFb((f) => ({ ...f, [num]: { error: "请先填写你的产出/说明，AI 才能给出针对性反馈。" } }));
      return;
    }
    setFb((f) => ({ ...f, [num]: { loading: true } }));
    try {
      const res = await fetch("/api/project-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectTitle: project.title,
          stageTitle: stage.title,
          stageTask: stage.tasks,
          stageDeliverable: stage.deliverable,
          rubric: [],
          metrics: stage.metrics,
          baseline: structure.baseline,
          challenge: structure.challenge,
          submission,
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "反馈生成失败");
      }
      const data = (await res.json()) as Feedback;
      setFb((f) => ({ ...f, [num]: { data } }));
    } catch (e) {
      setFb((f) => ({ ...f, [num]: { error: e instanceof Error ? e.message : "反馈生成失败" } }));
    }
  };

  const getReflectionFeedback = async () => {
    const notes = progress.reflectionNotes ?? "";
    if (!notes.trim()) {
      setRefFb({ error: "请先写下你的反思，AI 才能帮你打磨成 PS 素材。" });
      return;
    }
    setRefFb({ loading: true });
    try {
      const res = await fetch("/api/project-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "reflection",
          projectTitle: project.title,
          stageTitle: "reflection",
          stageTask: "",
          stageDeliverable: "",
          rubric: [],
          metrics: [],
          baseline: structure.baseline,
          challenge: structure.challenge,
          submission: notes,
          reflectionQuestions: structure.reflection,
          psUse: structure.psUse,
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "反馈生成失败");
      }
      const data = (await res.json()) as Feedback;
      setRefFb({ data });
    } catch (e) {
      setRefFb({ error: e instanceof Error ? e.message : "反馈生成失败" });
    }
  };

  const exportRecord = () => {
    const lines: string[] = [];
    lines.push(`课题：${project.title}`);
    if (structure.summary) lines.push(structure.summary);
    lines.push(`完成度：${percent}%`);
    lines.push(`主要工具：${structure.primaryTool}`);
    lines.push("");
    for (const s of structure.stages) {
      const sp = progress.stages.find((p) => p.stageNum === s.num);
      const status = sp?.status === "submitted" ? "已提交" : "未提交";
      lines.push(`【阶段${s.num}】${s.title}　${status}`);
      if (sp?.submission) lines.push(`产出/说明：${sp.submission}`);
      if (sp?.attachments && sp.attachments.length > 0)
        lines.push(`上传文件：${sp.attachments.map((a) => a.name).join("、")}`);
      lines.push("");
    }
    if (progress.reflectionNotes?.trim()) {
      lines.push("【反思与延伸】");
      lines.push(progress.reflectionNotes.trim());
      lines.push("");
    }
    lines.push("— 由桥申平台记录，产出为学生本人完成。");
    const text = lines.join("\n");
    navigator.clipboard?.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      },
      () => {
        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${project.title}-完成记录.txt`;
        a.click();
        URL.revokeObjectURL(url);
      }
    );
  };

  return (
    <div className="space-y-5">
      {/* 进度 */}
      <div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-[var(--ink-soft)]">完成进度</span>
          <span className="font-medium text-[var(--ink)]">{percent}%</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--surface)] overflow-hidden">
          <div className="h-full bg-brand" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {/* 概览 */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-green-200 bg-green-50/50 p-3">
          <p className="text-xs font-semibold text-green-800 mb-1">✓ 基础线</p>
          <p className="text-sm text-[var(--ink)]">{structure.baseline}</p>
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-3">
          <p className="text-xs font-semibold text-[var(--violet)] mb-1">★ 挑战目标</p>
          <p className="text-sm text-[var(--ink)]">{structure.challenge}</p>
        </div>
      </div>

      {/* 阶段 */}
      <div className="space-y-3">
        {structure.stages.map((stage) => {
          const sp = getStage(stage.num);
          const open = openStage === stage.num;
          return (
            <div key={stage.num} className="rounded-2xl border border-[var(--border)] overflow-hidden">
              <button
                onClick={() => setOpenStage(open ? null : stage.num)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <span
                  className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 ${
                    sp.status === "submitted" ? "bg-green-500 text-white" : "bg-[var(--surface)] text-[var(--ink-soft)]"
                  }`}
                >
                  {sp.status === "submitted" ? "✓" : stage.num}
                </span>
                <span className="flex-1 font-medium text-[var(--ink)]">{stage.title}</span>
                <span className="text-[var(--ink-soft)] text-sm">{open ? "▲" : "▼"}</span>
              </button>

              {open && (
                <div className="px-4 pb-4 pt-1 space-y-4 border-t border-[var(--border)]">
                  <Block label="目标">{stage.goal}</Block>
                  <Block label="任务">{stage.tasks}</Block>
                  <Block label="产出物">{stage.deliverable}</Block>
                  {stage.metrics.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-[var(--ink-soft)] mb-1.5">量化指标</p>
                      <ul className="space-y-1">
                        {stage.metrics.map((m, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-[var(--ink)]">
                            <span className="text-[var(--indigo)] shrink-0">📊</span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* ① 文字说明 */}
                  <div>
                    <p className="text-xs font-semibold text-[var(--ink-soft)] mb-1.5">① 文字说明（写清方法与关键数值）</p>
                    <textarea
                      value={sp.submission}
                      onChange={(e) => updateStage(stage.num, { submission: e.target.value })}
                      rows={4}
                      placeholder="写下你在这个阶段做了什么、关键结果与数值…"
                      className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                    />
                  </div>

                  {/* ② 文件 */}
                  <div>
                    <p className="text-xs font-semibold text-[var(--ink-soft)] mb-1.5">② 上传产出文件（截图 / 报告 / 数据）</p>
                    {(sp.attachments ?? []).length > 0 && (
                      <ul className="space-y-1 mb-2">
                        {(sp.attachments ?? []).map((att) => (
                          <li key={att.key} className="flex items-center gap-2 text-sm">
                            <span className="text-[var(--ink-soft)]">📎</span>
                            <a href={`/api/files/${att.key}`} target="_blank" rel="noopener noreferrer" className="text-[var(--indigo)] hover:underline truncate flex-1">
                              {att.name}
                            </a>
                            <button onClick={() => removeAttachment(stage.num, att.key)} className="text-xs text-neutral-400 hover:text-red-500 shrink-0">
                              删除
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <label className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border border-[var(--border)] bg-white text-sm text-[var(--ink)] hover:bg-[var(--surface)] cursor-pointer">
                      {uploading[stage.num] ? "上传中…" : "＋ 上传文件"}
                      <input type="file" className="hidden" disabled={uploading[stage.num]} onChange={(e) => handleUpload(stage.num, e.target.files)} accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.doc,.docx" />
                    </label>
                    {uploadErr[stage.num] && <p className="text-xs text-amber-700 mt-1">{uploadErr[stage.num]}</p>}
                  </div>

                  {/* ③ 提交状态 */}
                  <div className="flex items-center gap-2">
                    {sp.status === "submitted" ? (
                      <>
                        <span className="text-xs text-green-700 bg-green-50 rounded px-2 py-1">已提交</span>
                        <button onClick={() => updateStage(stage.num, { status: "todo" })} className="text-xs text-neutral-400 hover:text-neutral-600">
                          撤回
                        </button>
                      </>
                    ) : (
                      <button onClick={() => updateStage(stage.num, { status: "submitted" })} className="px-4 py-1.5 rounded-lg bg-brand text-white text-sm font-medium hover:opacity-90">
                        标记为已提交
                      </button>
                    )}
                  </div>

                  {/* AI 教练 */}
                  <div>
                    <p className="text-xs font-semibold text-[var(--ink-soft)] mb-1.5">AI 教练反馈</p>
                    <button onClick={() => getStageFeedback(stage.num)} disabled={fb[stage.num]?.loading} className="px-4 py-1.5 rounded-lg bg-white border border-indigo-200 text-[var(--indigo)] text-sm font-medium hover:bg-indigo-50 disabled:opacity-60">
                      {fb[stage.num]?.loading ? "生成中…" : "🎓 获取 AI 教练反馈"}
                    </button>
                    {fb[stage.num]?.error && <p className="mt-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">{fb[stage.num]?.error}</p>}
                    {fb[stage.num]?.data && <FeedbackBox data={fb[stage.num]!.data!} />}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 反思 */}
      <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
        <p className="text-sm font-semibold text-[var(--ink)] mb-1">🤔 反思与延伸</p>
        <p className="text-xs text-[var(--ink-soft)] mb-4">
          英国招生官最看重的不是"你做了什么"，而是"你从中思考了什么"。认真作答——这些反思是你 PS 里最有分量的素材。
        </p>
        <ul className="space-y-2 mb-4">
          {structure.reflection.map((q, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--ink)]">
              <span className="text-[var(--violet)] shrink-0 font-semibold">{i + 1}.</span>
              <span>{q}</span>
            </li>
          ))}
        </ul>
        <textarea
          value={progress.reflectionNotes ?? ""}
          onChange={(e) => persist({ ...progress, reflectionNotes: e.target.value })}
          rows={5}
          placeholder="在这里写下你的反思（可逐条回应上面的问题）。这些文字将进入完成记录，未来可直接用于个人陈述。"
          className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
        />
        <div className="mt-3">
          <button onClick={getReflectionFeedback} disabled={refFb.loading} className="px-4 py-1.5 rounded-lg bg-white border border-violet-200 text-[var(--violet)] text-sm font-medium hover:bg-violet-50 disabled:opacity-60">
            {refFb.loading ? "生成中…" : "🎓 让 AI 文书教练点评我的反思"}
          </button>
          {refFb.error && <p className="mt-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">{refFb.error}</p>}
          {refFb.data && <FeedbackBox data={refFb.data} reflection />}
        </div>
      </div>

      {/* 导出 */}
      <div className="rounded-2xl bg-brand-soft border border-[var(--border)] p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--ink)]">完成记录</p>
          <p className="text-xs text-[var(--ink-soft)]">导出你的课题记录（含各阶段与反思），可用于文书与作品集。</p>
        </div>
        <button onClick={exportRecord} className="shrink-0 px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:opacity-90">
          {copied ? "已复制 ✓" : "导出完成记录"}
        </button>
      </div>
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-[var(--ink-soft)] mb-1">{label}</p>
      <p className="text-sm text-[var(--ink)]">{children}</p>
    </div>
  );
}

function FeedbackBox({ data, reflection }: { data: Feedback; reflection?: boolean }) {
  const border = reflection ? "border-violet-200 bg-violet-50/40" : "border-[var(--border)] bg-[var(--surface)]";
  return (
    <div className={`mt-3 space-y-3 rounded-xl border ${border} p-4`}>
      {data.summary && <p className="text-sm font-medium text-[var(--ink)]">{data.summary}</p>}
      {data.strengths.length > 0 && <FbList title={reflection ? "✅ 值得写进 PS" : "✅ 做得好"} items={data.strengths} color="text-green-700" />}
      {data.suggestions.length > 0 && <FbList title={reflection ? "💡 可以更深入" : "💡 可以更好"} items={data.suggestions} color="text-[var(--indigo)]" />}
      {data.questions.length > 0 && <FbList title={reflection ? "🤔 再想一想" : "🤔 想一想"} items={data.questions} color="text-[var(--violet)]" />}
    </div>
  );
}

function FbList({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div>
      <p className={`text-xs font-semibold mb-1 ${color}`}>{title}</p>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="text-sm text-[var(--ink)] flex gap-2">
            <span className="text-[var(--ink-soft)]">·</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
