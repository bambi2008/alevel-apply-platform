"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Download,
  FileDiff,
  FilePlus2,
  FlaskConical,
  Import,
  Save,
  Trash2,
} from "lucide-react";
import { MathRenderer } from "@/components/math-renderer";
import {
  advanceDraft,
  createBlankDraft,
  createReleasePackage,
  diffQuestionDraft,
  validateDraft,
  type AuthoredQuestion,
  type PaperBlueprint,
  type PaperPlan,
  type QuestionDraft,
} from "@/lib/tests/authoring";
import type { MCQOptionKey } from "@/lib/tests/questions/types";

interface TestMeta {
  id: string;
  abbr: string;
  nameZh: string;
  topics: Array<{ id: string; title: string }>;
}

interface Props {
  tests: TestMeta[];
}

type Tab = "edit" | "release" | "paper";

const STORAGE_KEY = "qiaoshen-question-studio-v1";
const fieldClass = "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const labelClass = "space-y-1 text-xs font-medium text-neutral-600";
const stageLabels = {
  DRAFT: "草稿",
  SUBJECT_REVIEW: "待学科审核",
  TEACHING_REVIEW: "待教学审核",
  APPROVED: "已批准",
};

function downloadJson(name: string, value: unknown) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

function nextOptionKey(index: number): MCQOptionKey {
  return "ABCDEFGH"[index] as MCQOptionKey;
}

function freshQuestion(type: "mcq" | "long", testId: string, topicId: string, id: string): AuthoredQuestion {
  if (type === "long") {
    return {
      id,
      type: "long",
      testId,
      topicId,
      difficulty: 2,
      totalMarks: 10,
      context: "",
      parts: [{ label: "(i)", marks: 10, question: "", solutionOutline: "" }],
      fullSolution: "",
    };
  }
  return {
    id,
    type: "mcq",
    testId,
    topicId,
    difficulty: 2,
    marks: 1,
    question: "",
    options: ["A", "B", "C", "D"].map((key) => ({ key: key as MCQOptionKey, text: "" })),
    answer: "A",
    solution: "",
  };
}

export function QuestionStudio({ tests }: Props) {
  const firstTest = tests[0];
  const [tab, setTab] = useState<Tab>("edit");
  const [drafts, setDrafts] = useState<QuestionDraft[]>([]);
  const [activeId, setActiveId] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [notice, setNotice] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let restored: QuestionDraft[];
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved) && saved.length) {
        restored = saved;
      } else if (firstTest) {
        restored = [createBlankDraft(firstTest.id, firstTest.topics[0]?.id || "general")];
      } else {
        restored = [];
      }
    } catch {
      restored = firstTest ? [createBlankDraft(firstTest.id, firstTest.topics[0]?.id || "general")] : [];
    }
    queueMicrotask(() => {
      setDrafts(restored);
      setActiveId(restored[0]?.draftId ?? "");
      setHydrated(true);
    });
  }, [firstTest]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  }, [drafts, hydrated]);

  const active = drafts.find((draft) => draft.draftId === activeId) ?? drafts[0];
  const validation = useMemo(() => validateDraft(active), [active]);
  const selectedTest = tests.find((test) => test.id === active?.question.testId) ?? firstTest;

  function replaceActive(next: QuestionDraft) {
    setDrafts((current) => current.map((draft) => draft.draftId === next.draftId ? next : draft));
  }

  function touchQuestion(question: AuthoredQuestion) {
    if (!active) return;
    replaceActive({
      ...active,
      question,
      review: { stage: "DRAFT", updatedAt: new Date().toISOString() },
    });
  }

  function addDraft() {
    if (!firstTest) return;
    const draft = createBlankDraft(firstTest.id, firstTest.topics[0]?.id || "general");
    setDrafts((current) => [...current, draft]);
    setActiveId(draft.draftId);
    setTab("edit");
  }

  function removeDraft() {
    if (!active || !window.confirm(`删除草稿 ${active.question.id}？`)) return;
    setDrafts((current) => {
      const next = current.filter((draft) => draft.draftId !== active.draftId);
      setActiveId(next[0]?.draftId ?? "");
      return next;
    });
  }

  function startRevision() {
    if (!active) return;
    replaceActive({
      ...active,
      version: active.version + 1,
      previousQuestion: structuredClone(active.question),
      review: { stage: "DRAFT", updatedAt: new Date().toISOString() },
    });
    setNotice("已创建修订基线，后续改动会显示字段差异。");
  }

  async function importWorkspace(file: File) {
    try {
      const payload = JSON.parse(await file.text());
      const incoming = Array.isArray(payload) ? payload : payload.drafts;
      if (!Array.isArray(incoming) || incoming.some((item) => (
        !item
        || typeof item !== "object"
        || typeof item.draftId !== "string"
        || !item.question
        || !item.source
        || !item.review
      ))) {
        throw new Error("文件不是有效的题目工作区。");
      }
      setDrafts(incoming as QuestionDraft[]);
      setActiveId(incoming[0]?.draftId ?? "");
      setNotice(`已导入 ${incoming.length} 道草稿。`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "导入失败。");
    }
  }

  function handleAdvance() {
    if (!active) return;
    if (active.review.stage !== "DRAFT" && !reviewer.trim()) {
      setNotice("进入审核结论前请填写当前审核人。");
      return;
    }
    const result = advanceDraft(active, reviewer || "题目作者");
    replaceActive(result.draft);
    setNotice(result.issues.some((issue) => issue.severity === "critical")
      ? "存在阻断问题，状态未推进。"
      : `状态已更新为“${stageLabels[result.draft.review.stage]}”。`);
  }

  if (!hydrated || !active) {
    return <p className="py-12 text-center text-sm text-neutral-500">正在恢复本地题目工作区…</p>;
  }

  const criticalCount = validation.issues.filter((issue) => issue.severity === "critical").length;
  const warningCount = validation.issues.filter((issue) => issue.severity === "warning").length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-950">题库生产与发布中心</h1>
          <p className="mt-1 text-sm text-neutral-500">本地草稿、双重审核、版权门禁与可复现组卷</p>
        </div>
        <div className="flex items-center gap-2">
          <input ref={importRef} type="file" accept=".json,application/json" className="hidden" onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void importWorkspace(file);
            event.target.value = "";
          }} />
          <button type="button" onClick={() => importRef.current?.click()} className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-neutral-50"><Import className="size-4" />导入</button>
          <button type="button" onClick={() => downloadJson("question-workspace.json", { schemaVersion: 1, drafts })} className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-neutral-50"><Download className="size-4" />备份</button>
          <button type="button" onClick={addDraft} className="inline-flex items-center gap-2 rounded-md bg-neutral-950 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"><FilePlus2 className="size-4" />新建题目</button>
        </div>
      </header>

      <div className="flex border-b border-neutral-200" role="tablist">
        {([
          ["edit", "题目编辑", FilePlus2],
          ["release", "审核发布", ClipboardCheck],
          ["paper", "智能组卷", FlaskConical],
        ] as const).map(([id, label, Icon]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`inline-flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium sm:gap-2 sm:px-4 ${tab === id ? "border-blue-600 text-blue-700" : "border-transparent text-neutral-500 hover:text-neutral-900"}`}>
            <Icon className="size-4" />{label}
          </button>
        ))}
      </div>

      {notice && <div className="flex items-center justify-between rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-800"><span>{notice}</span><button type="button" onClick={() => setNotice("")} aria-label="关闭通知">×</button></div>}

      {tab === "edit" && (
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_minmax(300px,0.75fr)]">
          <aside className="border-b border-neutral-200 pb-4 lg:border-r lg:border-b-0 lg:pr-4 lg:pb-0">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase text-neutral-500">本地草稿 {drafts.length}</h2>
              <button type="button" onClick={removeDraft} className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600" title="删除当前草稿"><Trash2 className="size-4" /></button>
            </div>
            <div className="space-y-1">
              {drafts.map((draft) => (
                <button key={draft.draftId} type="button" onClick={() => setActiveId(draft.draftId)} className={`w-full rounded-md px-3 py-2 text-left ${draft.draftId === active.draftId ? "bg-blue-50 text-blue-900" : "hover:bg-neutral-50"}`}>
                  <span className="block truncate text-sm font-medium">{draft.question.id}</span>
                  <span className="mt-0.5 block text-xs text-neutral-500">{stageLabels[draft.review.stage]} · v{draft.version}</span>
                </button>
              ))}
            </div>
          </aside>

          <main className="min-w-0 space-y-5">
            <section className="grid gap-3 sm:grid-cols-2">
              <label className={labelClass}>考试
                <select value={active.question.testId} onChange={(event) => {
                  const test = tests.find((item) => item.id === event.target.value) ?? firstTest;
                  touchQuestion({ ...active.question, testId: test.id, topicId: test.topics[0]?.id || "general" });
                }} className={fieldClass}>{tests.map((test) => <option key={test.id} value={test.id}>{test.abbr} · {test.nameZh}</option>)}</select>
              </label>
              <label className={labelClass}>知识点
                <select value={active.question.topicId} onChange={(event) => touchQuestion({ ...active.question, topicId: event.target.value })} className={fieldClass}>{selectedTest?.topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.title}</option>)}</select>
              </label>
              <label className={labelClass}>题目 ID
                <input value={active.question.id} onChange={(event) => touchQuestion({ ...active.question, id: event.target.value })} className={fieldClass} />
              </label>
              <label className={labelClass}>难度
                <select value={active.question.difficulty} onChange={(event) => touchQuestion({ ...active.question, difficulty: Number(event.target.value) as 1 | 2 | 3 })} className={fieldClass}><option value="1">1 · 基础</option><option value="2">2 · 中等</option><option value="3">3 · 挑战</option></select>
              </label>
            </section>

            <section>
              <p className="mb-2 text-xs font-medium text-neutral-600">题型</p>
              <div className="inline-flex rounded-md border border-neutral-300 p-0.5">
                {(["mcq", "long"] as const).map((type) => <button key={type} type="button" onClick={() => touchQuestion(freshQuestion(type, active.question.testId, active.question.topicId, active.question.id))} className={`rounded px-4 py-1.5 text-sm ${active.question.type === type ? "bg-neutral-900 text-white" : "text-neutral-600"}`}>{type === "mcq" ? "选择题" : "书面大题"}</button>)}
              </div>
            </section>

            {active.question.type === "mcq" ? (
              <McqEditor question={active.question} onChange={touchQuestion} />
            ) : (
              <LongEditor question={active.question} onChange={touchQuestion} />
            )}

            <section className="border-t border-neutral-200 pt-5">
              <h2 className="mb-3 text-sm font-semibold text-neutral-900">来源与权利</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className={labelClass}>来源类型
                  <select value={active.source.type} onChange={(event) => replaceActive({ ...active, source: { ...active.source, type: event.target.value as QuestionDraft["source"]["type"] }, review: { stage: "DRAFT", updatedAt: new Date().toISOString() } })} className={fieldClass}><option value="ORIGINAL">原创</option><option value="OFFICIAL">官方真题</option><option value="ADAPTED">改编</option></select>
                </label>
                <label className={labelClass}>权利状态
                  <select value={active.source.rights} onChange={(event) => replaceActive({ ...active, source: { ...active.source, rights: event.target.value as QuestionDraft["source"]["rights"] }, review: { stage: "DRAFT", updatedAt: new Date().toISOString() } })} className={fieldClass}><option value="OWNED">自有</option><option value="LICENSED">已获许可</option><option value="LINK_ONLY">仅可链接</option><option value="RESTRICTED">受限制</option><option value="UNKNOWN">待确认</option></select>
                </label>
                <label className={labelClass}>来源标题
                  <input value={active.source.title} onChange={(event) => replaceActive({ ...active, source: { ...active.source, title: event.target.value }, review: { stage: "DRAFT", updatedAt: new Date().toISOString() } })} className={fieldClass} />
                </label>
                <label className={labelClass}>来源链接
                  <input type="url" value={active.source.url || ""} onChange={(event) => replaceActive({ ...active, source: { ...active.source, url: event.target.value }, review: { stage: "DRAFT", updatedAt: new Date().toISOString() } })} className={fieldClass} placeholder="https://…" />
                </label>
              </div>
            </section>
          </main>

          <aside className="min-w-0 space-y-5">
            <section className="rounded-md border border-neutral-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-neutral-900">实时质量检查</h2>
                <span className={`text-xs font-semibold ${criticalCount ? "text-red-600" : warningCount ? "text-amber-600" : "text-emerald-700"}`}>{criticalCount} 阻断 / {warningCount} 告警</span>
              </div>
              {validation.issues.length ? <div className="mt-3 space-y-2">{validation.issues.map((issue, index) => (
                <div key={`${issue.code}-${index}`} className="flex gap-2 text-xs leading-5">
                  <AlertCircle className={`mt-0.5 size-3.5 shrink-0 ${issue.severity === "critical" ? "text-red-600" : "text-amber-600"}`} />
                  <span><strong>{issue.code}</strong> · {issue.message}{issue.field && <span className="block text-neutral-400">{issue.field}</span>}</span>
                </div>
              ))}</div> : <p className="mt-3 flex items-center gap-2 text-sm text-emerald-700"><CheckCircle2 className="size-4" />内容检查通过</p>}
            </section>
            <QuestionPreview question={active.question} />
          </aside>
        </div>
      )}

      {tab === "release" && (
        <ReleaseWorkbench
          drafts={drafts}
          active={active}
          reviewer={reviewer}
          setReviewer={setReviewer}
          onSelect={setActiveId}
          onAdvance={handleAdvance}
          onRevision={startRevision}
        />
      )}

      {tab === "paper" && <PaperBuilder tests={tests} />}
    </div>
  );
}

function McqEditor({ question, onChange }: {
  question: Extract<AuthoredQuestion, { type: "mcq" }>;
  onChange: (question: AuthoredQuestion) => void;
}) {
  function updateOption(index: number, text: string) {
    onChange({ ...question, options: question.options.map((option, itemIndex) => itemIndex === index ? { ...option, text } : option) });
  }
  return (
    <section className="space-y-3">
      <label className={labelClass}>题干（支持 $LaTeX$）
        <textarea value={question.question} onChange={(event) => onChange({ ...question, question: event.target.value })} className={`${fieldClass} min-h-28 resize-y`} />
      </label>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-neutral-600">选项</p>
          <button type="button" disabled={question.options.length >= 8} onClick={() => onChange({ ...question, options: [...question.options, { key: nextOptionKey(question.options.length), text: "" }] })} className="text-xs font-medium text-blue-700 disabled:text-neutral-300">添加选项</button>
        </div>
        {question.options.map((option, index) => (
          <div key={option.key} className="flex gap-2">
            <button type="button" onClick={() => onChange({ ...question, answer: option.key })} className={`size-9 shrink-0 rounded-md border text-xs font-bold ${question.answer === option.key ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-neutral-300 text-neutral-500"}`} title="设为正确答案">{option.key}</button>
            <input value={option.text} onChange={(event) => updateOption(index, event.target.value)} className={fieldClass} />
            {question.options.length > 2 && <button type="button" onClick={() => {
              const options = question.options.filter((_, itemIndex) => itemIndex !== index).map((item, itemIndex) => ({ ...item, key: nextOptionKey(itemIndex) }));
              onChange({ ...question, options, answer: options.some((item) => item.key === question.answer) ? question.answer : "A" });
            }} className="rounded p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600" title="删除选项"><Trash2 className="size-4" /></button>}
          </div>
        ))}
      </div>
      <label className={labelClass}>完整解析
        <textarea value={question.solution} onChange={(event) => onChange({ ...question, solution: event.target.value })} className={`${fieldClass} min-h-32 resize-y`} />
      </label>
      <label className={labelClass}>提示（可选）
        <textarea value={question.hint || ""} onChange={(event) => onChange({ ...question, hint: event.target.value })} className={`${fieldClass} min-h-16 resize-y`} />
      </label>
    </section>
  );
}

function LongEditor({ question, onChange }: {
  question: Extract<AuthoredQuestion, { type: "long" }>;
  onChange: (question: AuthoredQuestion) => void;
}) {
  return (
    <section className="space-y-3">
      <label className={labelClass}>公共题干（支持 $LaTeX$）
        <textarea value={question.context || ""} onChange={(event) => onChange({ ...question, context: event.target.value })} className={`${fieldClass} min-h-24 resize-y`} />
      </label>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-neutral-600">分步小问</p>
        <button type="button" onClick={() => onChange({ ...question, parts: [...question.parts, { label: `(${question.parts.length + 1})`, marks: 1, question: "", solutionOutline: "" }] })} className="text-xs font-medium text-blue-700">添加小问</button>
      </div>
      {question.parts.map((part, index) => (
        <div key={`${part.label}-${index}`} className="space-y-2 border-l-2 border-neutral-200 pl-3">
          <div className="grid grid-cols-[90px_90px_1fr] gap-2">
            <input aria-label="小问标签" value={part.label} onChange={(event) => onChange({ ...question, parts: question.parts.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item) })} className={fieldClass} />
            <input aria-label="小问分值" type="number" min="1" value={part.marks} onChange={(event) => onChange({ ...question, parts: question.parts.map((item, itemIndex) => itemIndex === index ? { ...item, marks: Number(event.target.value) } : item) })} className={fieldClass} />
            <button type="button" disabled={question.parts.length === 1} onClick={() => onChange({ ...question, parts: question.parts.filter((_, itemIndex) => itemIndex !== index) })} className="justify-self-end rounded p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600 disabled:text-neutral-200"><Trash2 className="size-4" /></button>
          </div>
          <textarea aria-label="小问题干" value={part.question} onChange={(event) => onChange({ ...question, parts: question.parts.map((item, itemIndex) => itemIndex === index ? { ...item, question: event.target.value } : item) })} className={`${fieldClass} min-h-20`} placeholder="小问题干" />
          <textarea aria-label="评分要点" value={part.solutionOutline} onChange={(event) => onChange({ ...question, parts: question.parts.map((item, itemIndex) => itemIndex === index ? { ...item, solutionOutline: event.target.value } : item) })} className={`${fieldClass} min-h-20`} placeholder="评分要点 / 解题步骤" />
        </div>
      ))}
      <label className={labelClass}>总分
        <input type="number" min="1" value={question.totalMarks} onChange={(event) => onChange({ ...question, totalMarks: Number(event.target.value) })} className={fieldClass} />
      </label>
      <label className={labelClass}>完整参考解答
        <textarea value={question.fullSolution} onChange={(event) => onChange({ ...question, fullSolution: event.target.value })} className={`${fieldClass} min-h-36 resize-y`} />
      </label>
    </section>
  );
}

function QuestionPreview({ question }: { question: AuthoredQuestion }) {
  return (
    <section className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
      <p className="mb-3 text-xs font-semibold uppercase text-neutral-500">学生端预览</p>
      {question.type === "mcq" ? <>
        <MathRenderer text={question.question || "题干预览"} className="text-sm leading-6 text-neutral-900" block />
        <div className="mt-3 space-y-2">{question.options.map((option) => <div key={option.key} className="flex gap-2 rounded border border-neutral-200 bg-white px-3 py-2 text-sm"><span className="font-semibold text-neutral-500">{option.key}</span><MathRenderer text={option.text || "选项"} /></div>)}</div>
      </> : <>
        {question.context && <MathRenderer text={question.context} className="text-sm leading-6" block />}
        <div className="mt-3 space-y-3">{question.parts.map((part) => <div key={part.label} className="text-sm"><strong>{part.label}</strong> <MathRenderer text={part.question || "小问题干"} /></div>)}</div>
      </>}
    </section>
  );
}

function ReleaseWorkbench({ drafts, active, reviewer, setReviewer, onSelect, onAdvance, onRevision }: {
  drafts: QuestionDraft[];
  active: QuestionDraft;
  reviewer: string;
  setReviewer: (value: string) => void;
  onSelect: (id: string) => void;
  onAdvance: () => void;
  onRevision: () => void;
}) {
  const release = createReleasePackage(drafts.filter((draft) => draft.review.stage === "APPROVED"));
  const diff = diffQuestionDraft(active);
  const activeIssues = validateDraft(active).issues;
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        <div className="mb-3 flex items-center justify-between"><h2 className="text-base font-semibold">审核队列</h2><span className="text-xs text-neutral-500">{drafts.filter((item) => item.review.stage === "APPROVED").length}/{drafts.length} 已批准</span></div>
        <div className="overflow-x-auto border-y border-neutral-200">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-neutral-50 text-xs text-neutral-500"><tr><th className="px-3 py-2">题目</th><th className="px-3 py-2">版本</th><th className="px-3 py-2">状态</th><th className="px-3 py-2">权利</th><th className="px-3 py-2">问题</th><th className="px-3 py-2"></th></tr></thead>
            <tbody className="divide-y divide-neutral-100">{drafts.map((draft) => {
              const issues = validateDraft(draft).issues;
              return <tr key={draft.draftId} className={draft.draftId === active.draftId ? "bg-blue-50/60" : ""}><td className="px-3 py-3 font-medium">{draft.question.id}</td><td className="px-3 py-3">v{draft.version}</td><td className="px-3 py-3">{stageLabels[draft.review.stage]}</td><td className="px-3 py-3">{draft.source.rights}</td><td className="px-3 py-3">{issues.filter((issue) => issue.severity === "critical").length} / {issues.filter((issue) => issue.severity === "warning").length}</td><td className="px-3 py-3"><button type="button" onClick={() => onSelect(draft.draftId)} className="rounded p-1 text-blue-700" title="查看审核"><ChevronRight className="size-4" /></button></td></tr>;
            })}</tbody>
          </table>
        </div>

        <section className="mt-6">
          <div className="flex items-center justify-between"><h2 className="text-base font-semibold">版本差异</h2><button type="button" onClick={onRevision} className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-neutral-50"><FileDiff className="size-4" />开始新修订</button></div>
          {diff.length ? <div className="mt-3 divide-y divide-neutral-100 border-y border-neutral-200">{diff.map((item) => <div key={item.field} className="grid gap-2 py-3 text-xs sm:grid-cols-[150px_1fr_1fr]"><strong>{item.field}</strong><span className="break-words text-red-700">{item.before}</span><span className="break-words text-emerald-700">{item.after}</span></div>)}</div> : <p className="mt-3 text-sm text-neutral-500">当前版本没有修订基线或尚无字段变化。</p>}
        </section>
      </div>

      <aside className="space-y-5">
        <section className="rounded-md border border-neutral-200 p-4">
          <p className="text-xs text-neutral-500">当前题目</p>
          <h2 className="mt-1 truncate font-semibold">{active.question.id}</h2>
          <p className="mt-2 text-sm">{stageLabels[active.review.stage]}</p>
          <label className={`${labelClass} mt-4 block`}>当前审核人
            <input value={reviewer} onChange={(event) => setReviewer(event.target.value)} className={fieldClass} placeholder="姓名或团队角色" />
          </label>
          <button type="button" disabled={active.review.stage === "APPROVED"} onClick={onAdvance} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:bg-neutral-300"><ClipboardCheck className="size-4" />推进到下一阶段</button>
          <p className="mt-3 text-xs leading-5 text-neutral-500">草稿提交后，由学科审核人确认答案与推理，再由教学审核人确认表述、解析和学生体验。</p>
          {activeIssues.length > 0 && <p className="mt-3 text-xs font-medium text-red-700">{activeIssues.filter((issue) => issue.severity === "critical").length} 个阻断问题需先解决。</p>}
        </section>
        <section className="rounded-md border border-neutral-200 p-4">
          <div className="flex items-center justify-between"><h2 className="text-sm font-semibold">正式发布包</h2><span className={release.releasable && release.questions.length ? "text-emerald-700" : "text-neutral-500"}>{release.questions.length} 题</span></div>
          <p className="mt-2 text-xs leading-5 text-neutral-500">仅包含已批准题目，并附来源和审核记录。任何告警都会阻止导出。</p>
          <button type="button" disabled={!release.releasable || release.questions.length === 0} onClick={() => downloadJson(`question-release-${new Date().toISOString().slice(0, 10)}.json`, release)} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-neutral-50 disabled:text-neutral-300"><Download className="size-4" />导出发布包</button>
          <button type="button" onClick={() => downloadJson("question-workspace.json", { schemaVersion: 1, drafts })} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-neutral-50"><Save className="size-4" />导出可审计工作区</button>
        </section>
      </aside>
    </div>
  );
}

function PaperBuilder({ tests }: { tests: TestMeta[] }) {
  const first = tests[0];
  const [blueprint, setBlueprint] = useState<PaperBlueprint>({
    testId: first?.id || "",
    title: "新建模拟卷",
    questionCount: 20,
    mcqOnly: true,
    difficulty: { 1: 5, 2: 10, 3: 5 },
    topicIds: [],
  });
  const [plan, setPlan] = useState<PaperPlan>();
  const [loading, setLoading] = useState(false);
  const test = tests.find((item) => item.id === blueprint.testId) ?? first;

  async function build() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/question-studio/paper-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blueprint),
      });
      if (!response.ok) throw new Error("组卷请求失败");
      setPlan(await response.json());
    } catch (error) {
      setPlan({ selected: [], topicCounts: {}, difficultyCounts: { 1: 0, 2: 0, 3: 0 }, answerCounts: {}, issues: [{ code: "REQUEST_FAILED", severity: "critical", message: error instanceof Error ? error.message : "组卷失败" }] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      <section className="space-y-4 border-r border-neutral-200 pr-6">
        <h2 className="text-base font-semibold">试卷蓝图</h2>
        <label className={labelClass}>考试
          <select value={blueprint.testId} onChange={(event) => setBlueprint((current) => ({ ...current, testId: event.target.value, topicIds: [] }))} className={fieldClass}>{tests.map((item) => <option key={item.id} value={item.id}>{item.abbr} · {item.nameZh}</option>)}</select>
        </label>
        <label className={labelClass}>套卷名称
          <input value={blueprint.title} onChange={(event) => setBlueprint((current) => ({ ...current, title: event.target.value }))} className={fieldClass} />
        </label>
        <label className={labelClass}>总题量
          <input type="number" min="1" max="100" value={blueprint.questionCount} onChange={(event) => setBlueprint((current) => ({ ...current, questionCount: Number(event.target.value) }))} className={fieldClass} />
        </label>
        <div className="grid grid-cols-3 gap-2">{([1, 2, 3] as const).map((difficulty) => <label key={difficulty} className={labelClass}>难度 {difficulty}<input type="number" min="0" value={blueprint.difficulty[difficulty]} onChange={(event) => setBlueprint((current) => ({ ...current, difficulty: { ...current.difficulty, [difficulty]: Number(event.target.value) } }))} className={fieldClass} /></label>)}</div>
        <label className="flex items-center gap-2 text-sm text-neutral-700"><input type="checkbox" checked={blueprint.mcqOnly} onChange={(event) => setBlueprint((current) => ({ ...current, mcqOnly: event.target.checked }))} />仅选择题</label>
        <fieldset>
          <legend className="mb-2 text-xs font-medium text-neutral-600">知识点（不选代表全部）</legend>
          <div className="max-h-48 space-y-1 overflow-y-auto">{test?.topics.map((topic) => <label key={topic.id} className="flex items-center gap-2 py-1 text-sm text-neutral-700"><input type="checkbox" checked={blueprint.topicIds.includes(topic.id)} onChange={(event) => setBlueprint((current) => ({ ...current, topicIds: event.target.checked ? [...current.topicIds, topic.id] : current.topicIds.filter((id) => id !== topic.id) }))} />{topic.title}</label>)}</div>
        </fieldset>
        <button type="button" onClick={() => void build()} disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-neutral-950 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:bg-neutral-400"><FlaskConical className="size-4" />{loading ? "正在组卷…" : "生成结构方案"}</button>
      </section>

      <section className="min-w-0">
        {!plan ? <div className="py-20 text-center text-sm text-neutral-500">设置题量、难度和知识点后生成方案。</div> : <>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><h2 className="text-base font-semibold">{blueprint.title}</h2><p className="mt-1 text-xs text-neutral-500">确定性选择：相同蓝图每次生成相同题目，方便审核与复现。</p></div>
            <button type="button" onClick={() => downloadJson(`${blueprint.testId}-paper-plan.json`, { blueprint, plan })} className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-neutral-50"><Download className="size-4" />导出方案</button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{[
            ["已选题目", plan.selected.length],
            ["基础", plan.difficultyCounts[1]],
            ["中等", plan.difficultyCounts[2]],
            ["挑战", plan.difficultyCounts[3]],
          ].map(([label, value]) => <div key={label} className="rounded-md border border-neutral-200 p-3"><p className="text-xs text-neutral-500">{label}</p><p className="mt-1 text-xl font-semibold">{value}</p></div>)}</div>
          {plan.issues.length > 0 && <div className="mt-4 space-y-2">{plan.issues.map((issue) => <p key={issue.code} className={`rounded-md px-3 py-2 text-sm ${issue.severity === "critical" ? "bg-red-50 text-red-800" : "bg-amber-50 text-amber-800"}`}>{issue.code} · {issue.message}</p>)}</div>}
          <div className="mt-5 overflow-x-auto border-y border-neutral-200"><table className="w-full min-w-[580px] text-left text-sm"><thead className="bg-neutral-50 text-xs text-neutral-500"><tr><th className="px-3 py-2">序号</th><th className="px-3 py-2">题目 ID</th><th className="px-3 py-2">知识点</th><th className="px-3 py-2">难度</th><th className="px-3 py-2">题型</th><th className="px-3 py-2">答案</th></tr></thead><tbody className="divide-y divide-neutral-100">{plan.selected.map((question, index) => <tr key={question.id}><td className="px-3 py-2.5 text-neutral-500">{index + 1}</td><td className="px-3 py-2.5 font-medium">{question.id}</td><td className="px-3 py-2.5">{question.topicId}</td><td className="px-3 py-2.5">{question.difficulty}</td><td className="px-3 py-2.5">{question.type}</td><td className="px-3 py-2.5">{question.answer || "—"}</td></tr>)}</tbody></table></div>
        </>}
      </section>
    </div>
  );
}
