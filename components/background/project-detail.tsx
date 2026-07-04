"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { OnlineProject } from "@/lib/background/projects";
import { projectFieldLabel } from "@/lib/background/projects";
import {
  enrollProject,
  getProjectProgress,
  getStageProgress,
  saveStageProgress,
  computeProjectPercent,
  getReflectionNotes,
  saveReflectionNotes,
  type StageProgress,
  type ProjectAttachment,
} from "@/lib/background/project-store";

const DIFF = ["", "入门", "进阶", "挑战"];

export function ProjectDetail({ project }: { project: OnlineProject }) {
  const total = project.stages.length;
  const [enrolled, setEnrolled] = useState(false);
  const [openStage, setOpenStage] = useState<number | null>(null);
  const [prog, setProg] = useState<Record<number, StageProgress>>({});
  const [percent, setPercent] = useState(0);
  const [copied, setCopied] = useState(false);
  const [reflectionNotes, setReflectionNotes] = useState("");

  type Feedback = { strengths: string[]; suggestions: string[]; questions: string[]; summary: string };
  const [fb, setFb] = useState<Record<number, { loading?: boolean; data?: Feedback; error?: string }>>({});

  const [uploading, setUploading] = useState<Record<number, boolean>>({});
  const [uploadErr, setUploadErr] = useState<Record<number, string>>({});

  const [refFb, setRefFb] = useState<{ loading?: boolean; data?: Feedback; error?: string }>({});

  const getReflectionFeedback = async () => {
    if (!reflectionNotes.trim()) {
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
          baseline: project.baseline,
          challenge: project.challenge,
          submission: reflectionNotes,
          reflectionQuestions: project.reflection,
          psUse: project.psUse,
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

  const UPLOAD_ERR: Record<string, string> = {
    too_large: "文件超过 10MB 上限。",
    unsupported_type: "不支持的文件类型（请用 PDF / 图片 / Word）。",
    unauthenticated: "请先登录再上传。",
    empty_file: "文件是空的。",
  };

  const handleUpload = async (stageNum: number, files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!enrolled) {
      enrollProject(project.id);
      setEnrolled(true);
    }
    setUploadErr((e) => ({ ...e, [stageNum]: "" }));
    setUploading((u) => ({ ...u, [stageNum]: true }));
    try {
      const added: ProjectAttachment[] = [];
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
      const existing = getStageProgress(project.id, stageNum).attachments ?? [];
      updateStage(stageNum, { attachments: [...existing, ...added] });
    } catch (err) {
      setUploadErr((e) => ({ ...e, [stageNum]: err instanceof Error ? err.message : "上传失败" }));
    } finally {
      setUploading((u) => ({ ...u, [stageNum]: false }));
    }
  };

  const removeAttachment = (stageNum: number, key: string) => {
    const existing = getStageProgress(project.id, stageNum).attachments ?? [];
    updateStage(stageNum, { attachments: existing.filter((a) => a.key !== key) });
  };

  const getFeedback = async (stageNum: number) => {
    const stage = project.stages.find((s) => s.num === stageNum);
    if (!stage) return;
    const submission = prog[stageNum]?.submission ?? "";
    if (!submission.trim()) {
      setFb((f) => ({ ...f, [stageNum]: { error: "请先在上面填写你的产出/说明，AI 才能给出针对性反馈。" } }));
      return;
    }
    setFb((f) => ({ ...f, [stageNum]: { loading: true } }));
    try {
      const res = await fetch("/api/project-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectTitle: project.title,
          stageTitle: stage.title,
          stageTask: stage.task,
          stageDeliverable: stage.deliverable,
          rubric: stage.rubric,
          metrics: stage.metrics,
          baseline: project.baseline,
          challenge: project.challenge,
          submission,
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "反馈生成失败");
      }
      const data = (await res.json()) as Feedback;
      setFb((f) => ({ ...f, [stageNum]: { data } }));
    } catch (e) {
      setFb((f) => ({ ...f, [stageNum]: { error: e instanceof Error ? e.message : "反馈生成失败" } }));
    }
  };

  // 客户端挂载后读取本地进度
  useEffect(() => {
    const p = getProjectProgress(project.id);
    setEnrolled(!!p);
    const map: Record<number, StageProgress> = {};
    for (const s of project.stages) map[s.num] = getStageProgress(project.id, s.num);
    setProg(map);
    setPercent(computeProjectPercent(project.id, total));
    setReflectionNotes(getReflectionNotes(project.id));
    setOpenStage(project.stages[0]?.num ?? null);
  }, [project.id, total, project.stages]);

  const refresh = () => {
    const map: Record<number, StageProgress> = {};
    for (const s of project.stages) map[s.num] = getStageProgress(project.id, s.num);
    setProg(map);
    setPercent(computeProjectPercent(project.id, total));
  };

  const doEnroll = () => {
    enrollProject(project.id);
    setEnrolled(true);
    refresh();
  };

  const updateStage = (num: number, patch: Partial<Omit<StageProgress, "stageNum">>) => {
    if (!enrolled) {
      enrollProject(project.id);
      setEnrolled(true);
    }
    saveStageProgress(project.id, num, patch);
    refresh();
  };

  const toggleRubric = (num: number, idx: number) => {
    const cur = prog[num]?.checkedRubric ?? [];
    const next = cur.includes(idx) ? cur.filter((i) => i !== idx) : [...cur, idx];
    updateStage(num, { checkedRubric: next });
  };

  const exportRecord = async () => {
    const lines: string[] = [];
    lines.push(`在线课题完成记录 · ${project.title}`);
    lines.push(`方向：${projectFieldLabel(project.field)} | 难度：${DIFF[project.difficulty]} | 完成度：${percent}%`);
    lines.push("");
    for (const s of project.stages) {
      const sp = prog[s.num];
      const statusText = sp?.status === "reviewed" ? "已点评" : sp?.status === "submitted" ? "已提交" : "未提交";
      lines.push(`【阶段${s.num}】${s.title}　状态：${statusText}`);
      if (sp?.submission) lines.push(`产出/说明：${sp.submission}`);
      if (sp?.attachments && sp.attachments.length > 0) {
        lines.push(`上传文件：${sp.attachments.map((a) => a.name).join("、")}`);
      }
      lines.push("");
    }
    if (reflectionNotes.trim()) {
      lines.push("【反思与延伸】");
      lines.push(reflectionNotes.trim());
      lines.push("");
    }
    lines.push("— 由桥申平台记录，产出为学生本人完成。");
    const text = lines.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 退化：用下载方式
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.title}-完成记录.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="text-xs text-neutral-400 mb-2">
        <Link href="/background/projects" className="hover:underline">← 在线课题</Link>
      </div>

      {/* 头部 */}
      <div className="rounded-2xl bg-brand-soft border border-[var(--border)] p-6 mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
          <span className="rounded-full px-2 py-0.5 bg-white text-[var(--indigo)] font-medium">
            {projectFieldLabel(project.field)}
          </span>
          <span className="rounded-full px-2 py-0.5 bg-white text-[var(--ink-soft)]">{DIFF[project.difficulty]}</span>
          <span className="rounded-full px-2 py-0.5 bg-white text-[var(--ink-soft)]">{project.estimatedHours}</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--ink)] mb-1">{project.title}</h1>
        <p className="text-sm text-[var(--ink-soft)]">{project.titleEn}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.techStack.map((tech) => (
            <span key={tech} className="text-[11px] rounded-full px-2.5 py-1 bg-white text-[var(--indigo)] font-medium border border-indigo-100">
              {tech}
            </span>
          ))}
        </div>

        {enrolled ? (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-[var(--ink-soft)] mb-1">
              <span>完成度</span>
              <span className="font-medium text-[var(--indigo)]">{percent}%</span>
            </div>
            <div className="h-2 rounded-full bg-white overflow-hidden">
              <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${percent}%` }} />
            </div>
          </div>
        ) : (
          <button
            onClick={doEnroll}
            className="mt-4 px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-sm shadow-indigo-500/20"
          >
            开始这个课题
          </button>
        )}
      </div>

      {/* 情境 + 含金量 */}
      <div className="space-y-4 mb-8">
        <Section title="课题情境">{project.scenario}</Section>
        <Section title="为什么有含金量">{project.whyValuable}</Section>
        <div className="rounded-xl border border-violet-200 bg-violet-50/40 p-4">
          <p className="text-xs font-semibold text-[var(--violet)] mb-1">🎓 这个课题如何帮你申请（英国 / 港校）</p>
          <p className="text-sm text-[var(--ink)] leading-relaxed">{project.psUse}</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-[var(--border)] p-4">
            <p className="text-xs font-semibold text-[var(--ink-soft)] mb-2">贴近专业</p>
            <div className="flex flex-wrap gap-1.5">
              {project.targetMajors.map((m) => (
                <span key={m} className="text-xs rounded px-2 py-0.5 bg-[var(--surface)] text-[var(--ink)]">{m}</span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border)] p-4">
            <p className="text-xs font-semibold text-[var(--ink-soft)] mb-2">锻炼能力</p>
            <div className="flex flex-wrap gap-1.5">
              {project.skills.map((s) => (
                <span key={s} className="text-xs rounded px-2 py-0.5 bg-[var(--surface)] text-[var(--ink)]">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 所需软件 */}
      <div className="rounded-2xl border border-[var(--border)] p-5 mb-4">
        <p className="text-xs font-semibold text-[var(--ink-soft)] mb-3">🛠️ 所需专业软件</p>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-[var(--ink)]">主力：{project.primaryTool.name}</p>
            <p className="text-xs text-[var(--ink-soft)] mt-0.5">{project.primaryTool.note}</p>
          </div>
          {project.altTool && (
            <div className="pt-3 border-t border-[var(--border)]">
              <p className="text-sm font-medium text-[var(--ink)]">{project.altTool.name}</p>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">{project.altTool.note}</p>
            </div>
          )}
        </div>
      </div>

      {/* 量化目标：基础线 / 挑战 */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-2xl border border-green-200 bg-green-50/50 p-4">
          <p className="text-xs font-semibold text-green-800 mb-1">✓ 基础线（达到即合格）</p>
          <p className="text-sm text-[var(--ink)]">{project.baseline}</p>
        </div>
        <div className="rounded-2xl border border-violet-200 bg-violet-50/50 p-4">
          <p className="text-xs font-semibold text-[var(--violet)] mb-1">★ 挑战目标（拔高）</p>
          <p className="text-sm text-[var(--ink)]">{project.challenge}</p>
        </div>
      </div>

      {/* 阶段 */}
      <h2 className="font-semibold text-[var(--ink)] mb-3">课题阶段（{total}）</h2>
      <div className="space-y-3">
        {project.stages.map((stage) => {
          const sp = prog[stage.num];
          const isOpen = openStage === stage.num;
          const done = sp?.status === "submitted" || sp?.status === "reviewed";
          return (
            <div key={stage.num} className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden">
              <button
                onClick={() => setOpenStage(isOpen ? null : stage.num)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[var(--surface)] transition-colors"
              >
                <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold shrink-0 ${done ? "bg-brand text-white" : "bg-[var(--surface)] text-[var(--ink-soft)]"}`}>
                  {done ? "✓" : stage.num}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-medium text-[var(--ink)]">{stage.title}</span>
                  <span className="block text-xs text-[var(--ink-soft)] truncate">{stage.goal}</span>
                </span>
                {stage.humanReview && (
                  <span className="text-[10px] rounded px-1.5 py-0.5 bg-violet-50 text-[var(--violet)] shrink-0">关键 · 可点评</span>
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 space-y-4 border-t border-[var(--border)]">
                  {stage.software && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="rounded px-2 py-1 bg-indigo-50 text-[var(--indigo)] font-medium">🛠️ {stage.software}</span>
                    </div>
                  )}
                  <Block label="学习引导">
                    <ul className="list-disc pl-5 space-y-1 text-sm text-[var(--ink-soft)]">
                      {stage.learn.map((l, i) => <li key={i}>{l}</li>)}
                    </ul>
                  </Block>
                  <Block label="任务">
                    <p className="text-sm text-[var(--ink)]">{stage.task}</p>
                  </Block>
                  <Block label="产出物">
                    <p className="text-sm text-[var(--ink)]">{stage.deliverable}</p>
                  </Block>
                  <Block label="量化验收指标">
                    <ul className="space-y-1">
                      {stage.metrics.map((m, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[var(--ink)]">
                          <span className="text-[var(--indigo)] shrink-0">📊</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </Block>
                  <Block label="评价标准（完成后自评勾选）">
                    <div className="space-y-1.5">
                      {stage.rubric.map((r, i) => {
                        const checked = sp?.checkedRubric?.includes(i) ?? false;
                        return (
                          <label key={i} className="flex items-start gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleRubric(stage.num, i)}
                              className="mt-0.5 accent-[var(--indigo)]"
                            />
                            <span className={checked ? "text-[var(--ink)]" : "text-[var(--ink-soft)]"}>{r}</span>
                          </label>
                        );
                      })}
                    </div>
                  </Block>
                  <Block label="① 文字说明（写清方法与关键数值，供 AI 反馈与完成记录）">
                    <textarea
                      value={sp?.submission ?? ""}
                      onChange={(e) => updateStage(stage.num, { submission: e.target.value })}
                      rows={4}
                      placeholder="例：我用 ANSYS Mechanical 建模，材料 Q235。网格加密后最大 von Mises 应力 98 MPa，最大变形 3.2 mm，安全系数 = 235/98 ≈ 2.4（达基础线）。做了网格无关性检查…"
                      className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                    />
                  </Block>

                  <Block label="② 上传产出文件（截图 / 云图 / 报告 PDF / 数据）">
                    <div className="space-y-2">
                      {(sp?.attachments ?? []).length > 0 && (
                        <ul className="space-y-1">
                          {(sp?.attachments ?? []).map((att) => (
                            <li key={att.key} className="flex items-center gap-2 text-sm">
                              <span className="text-[var(--ink-soft)]">📎</span>
                              <a
                                href={`/api/files/${att.key}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--indigo)] hover:underline truncate flex-1"
                              >
                                {att.name}
                              </a>
                              <button
                                onClick={() => removeAttachment(stage.num, att.key)}
                                className="text-xs text-neutral-400 hover:text-red-500 shrink-0"
                              >
                                删除
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      <label className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border border-[var(--border)] bg-white text-sm text-[var(--ink)] hover:bg-[var(--surface)] transition-colors cursor-pointer">
                        {uploading[stage.num] ? "上传中…" : "＋ 上传文件"}
                        <input
                          type="file"
                          className="hidden"
                          disabled={uploading[stage.num]}
                          onChange={(e) => handleUpload(stage.num, e.target.files)}
                          accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.doc,.docx"
                        />
                      </label>
                      {uploadErr[stage.num] && (
                        <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">{uploadErr[stage.num]}</p>
                      )}
                      <p className="text-[11px] text-[var(--ink-soft)]">
                        支持 PDF / 图片 / Word，单个 ≤ 10MB。文件安全存放，仅你本人可见。
                      </p>
                    </div>
                  </Block>

                  <Block label="③ 提交状态">
                    <div className="flex items-center gap-2">
                      {sp?.status === "submitted" || sp?.status === "reviewed" ? (
                        <>
                          <span className="text-xs text-green-700 bg-green-50 rounded px-2 py-1">已提交</span>
                          <button
                            onClick={() => updateStage(stage.num, { status: "todo" })}
                            className="text-xs text-neutral-400 hover:text-neutral-600"
                          >
                            撤回
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => updateStage(stage.num, { status: "submitted" })}
                          className="px-4 py-1.5 rounded-lg bg-brand text-white text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                          标记为已提交
                        </button>
                      )}
                      {stage.humanReview && (
                        <span className="text-xs text-[var(--ink-soft)]">此阶段可申请人工点评（即将上线）</span>
                      )}
                    </div>
                  </Block>

                  {/* AI 教练反馈 */}
                  <Block label="AI 教练反馈">
                    <button
                      onClick={() => getFeedback(stage.num)}
                      disabled={fb[stage.num]?.loading}
                      className="px-4 py-1.5 rounded-lg bg-white border border-indigo-200 text-[var(--indigo)] text-sm font-medium hover:bg-indigo-50 transition-colors disabled:opacity-60"
                    >
                      {fb[stage.num]?.loading ? "生成中…" : "🎓 获取 AI 教练反馈"}
                    </button>
                    <p className="text-[11px] text-[var(--ink-soft)] mt-1.5">
                      基于你填写的文字说明给出改进建议与追问（不打分、不替你做）。AI 看不到图片，请把关键数值写进说明里。
                    </p>

                    {fb[stage.num]?.error && (
                      <p className="mt-3 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">{fb[stage.num]?.error}</p>
                    )}

                    {fb[stage.num]?.data && (
                      <div className="mt-3 space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                        {fb[stage.num]!.data!.summary && (
                          <p className="text-sm font-medium text-[var(--ink)]">{fb[stage.num]!.data!.summary}</p>
                        )}
                        {fb[stage.num]!.data!.strengths.length > 0 && (
                          <FbList title="✅ 做得好" items={fb[stage.num]!.data!.strengths} color="text-green-700" />
                        )}
                        {fb[stage.num]!.data!.suggestions.length > 0 && (
                          <FbList title="💡 可以更好" items={fb[stage.num]!.data!.suggestions} color="text-[var(--indigo)]" />
                        )}
                        {fb[stage.num]!.data!.questions.length > 0 && (
                          <FbList title="🤔 想一想" items={fb[stage.num]!.data!.questions} color="text-[var(--violet)]" />
                        )}
                        <p className="text-[11px] text-[var(--ink-soft)] pt-1 border-t border-[var(--border)]">
                          AI 建议仅供参考，最终判断以你的工程分析与（如有）人工点评为准。
                        </p>
                      </div>
                    )}
                  </Block>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 反思与延伸（英国招生官最看重的部分） */}
      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-white p-5">
        <p className="text-sm font-semibold text-[var(--ink)] mb-1">🤔 反思与延伸</p>
        <p className="text-xs text-[var(--ink-soft)] mb-4">
          英国招生官最看重的不是"你做了什么"，而是"你从中思考了什么"。认真作答下面的问题——这些反思正是你个人陈述（PS）里最有分量的素材。
        </p>
        <ul className="space-y-2 mb-4">
          {project.reflection.map((q, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--ink)]">
              <span className="text-[var(--violet)] shrink-0 font-semibold">{i + 1}.</span>
              <span>{q}</span>
            </li>
          ))}
        </ul>
        <textarea
          value={reflectionNotes}
          onChange={(e) => {
            setReflectionNotes(e.target.value);
            if (!enrolled) {
              enrollProject(project.id);
              setEnrolled(true);
            }
            saveReflectionNotes(project.id, e.target.value);
          }}
          rows={5}
          placeholder="在这里写下你的反思（可逐条回应上面的问题）。这些文字将进入你的完成记录，未来可直接用于个人陈述。"
          className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
        />
        <div className="mt-3">
          <button
            onClick={getReflectionFeedback}
            disabled={refFb.loading}
            className="px-4 py-1.5 rounded-lg bg-white border border-violet-200 text-[var(--violet)] text-sm font-medium hover:bg-violet-50 transition-colors disabled:opacity-60"
          >
            {refFb.loading ? "生成中…" : "🎓 让 AI 文书教练点评我的反思"}
          </button>
          <p className="text-[11px] text-[var(--ink-soft)] mt-1.5">
            AI 会像文书教练一样帮你把反思想得更深、更适合写进个人陈述（不代写、不给可照抄的文字）。
          </p>

          {refFb.error && (
            <p className="mt-3 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">{refFb.error}</p>
          )}

          {refFb.data && (
            <div className="mt-3 space-y-3 rounded-xl border border-violet-200 bg-violet-50/40 p-4">
              {refFb.data.summary && (
                <p className="text-sm font-medium text-[var(--ink)]">{refFb.data.summary}</p>
              )}
              {refFb.data.strengths.length > 0 && (
                <FbList title="✅ 值得写进 PS" items={refFb.data.strengths} color="text-green-700" />
              )}
              {refFb.data.suggestions.length > 0 && (
                <FbList title="💡 可以更深入" items={refFb.data.suggestions} color="text-[var(--indigo)]" />
              )}
              {refFb.data.questions.length > 0 && (
                <FbList title="🤔 再想一想" items={refFb.data.questions} color="text-[var(--violet)]" />
              )}
              <p className="text-[11px] text-[var(--ink-soft)] pt-1 border-t border-violet-200">
                这些是教练建议。个人陈述必须是你本人的真实想法与文字（UCAS 有相似度检测）。
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 完成产出 + 导出 */}
      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <p className="text-sm font-semibold text-[var(--ink)] mb-1">完成后你将获得</p>
        <p className="text-sm text-[var(--ink-soft)] mb-4">{project.outcome}</p>
        <button
          onClick={exportRecord}
          className="px-4 py-2 rounded-lg border border-[var(--border)] bg-white text-sm font-medium text-[var(--ink)] hover:bg-[var(--surface)] transition-colors"
        >
          {copied ? "已复制到剪贴板 ✓" : "导出完成记录"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-[var(--ink-soft)] mb-1">{title}</p>
      <p className="text-sm text-[var(--ink)] leading-relaxed">{children}</p>
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-[var(--ink-soft)] mb-1.5">{label}</p>
      {children}
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
