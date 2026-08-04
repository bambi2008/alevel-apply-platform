"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ChevronRight, Clock3, RotateCcw } from "lucide-react";
import { scoreQuantitativeResponse } from "@/lib/interview/quantitative-interview";
import { INTERVIEW_PROCESS_SKILLS } from "@/lib/interview/quantitative-interview-review";
import type { QuantitativeInterviewPaper } from "@/lib/interview/quantitative-interview-papers";
import { InterviewThinkingChecklist } from "./interview-thinking-checklist";

type Phase = "intro" | "main" | "follow-up" | "result";
type Answer = { response: string; followUpResponse: string };
type Attempt = { id: string; paperId: string; completedAt: string; total: number; max: number; weakestSkillId?: (typeof INTERVIEW_PROCESS_SKILLS)[number]["id"] };

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function readAttempts(key: string): Attempt[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "[]") as Attempt[];
  } catch {
    return [];
  }
}

export function QuantitativeInterviewPaperSimulator({
  subjectName,
  papers,
}: {
  subjectName: string;
  papers: QuantitativeInterviewPaper[];
}) {
  const storageKey = `alevel:quantitative-interview-papers:${subjectName}:v1`;
  const [phase, setPhase] = useState<Phase>("intro");
  const [paperIndex, setPaperIndex] = useState(0);
  const [taskIndex, setTaskIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [response, setResponse] = useState("");
  const [followUpResponse, setFollowUpResponse] = useState("");
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const paper = papers[paperIndex];
  const task = paper?.tasks[taskIndex];
  const result = useMemo(() => {
    if (!paper) return null;
    const taskResults = paper.tasks.map((item, index) => {
      const answer = answers[index] ?? { response: "", followUpResponse: "" };
      return scoreQuantitativeResponse(item, answer.response, answer.followUpResponse);
    });
    const skillTotals = INTERVIEW_PROCESS_SKILLS.map((skill) => ({
      ...skill,
      passed: taskResults.reduce((sum, item) => sum + Number(item.review.skills.find((candidate) => candidate.id === skill.id)?.passed), 0),
      total: taskResults.length,
    }));
    const total = taskResults.reduce((sum, item) => sum + item.total, 0);
    const max = taskResults.reduce((sum, item) => sum + item.max, 0);
    const weakest = [...skillTotals].sort((a, b) => a.passed / a.total - b.passed / b.total)[0];
    const weakestTaskIndex = taskResults.findIndex((item) => item.review.weakest.id === weakest.id);
    return { taskResults, skillTotals, total, max, weakest, weakestTaskIndex: weakestTaskIndex < 0 ? 0 : weakestTaskIndex };
  }, [answers, paper]);

  useEffect(() => setAttempts(readAttempts(storageKey)), [storageKey]);

  useEffect(() => {
    if ((phase !== "main" && phase !== "follow-up") || secondsLeft <= 0) return;
    const timer = window.setInterval(() => setSecondsLeft((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [phase, secondsLeft]);

  useEffect(() => {
    if (phase === "main" && secondsLeft === 0 && task) {
      setPhase("follow-up");
      setSecondsLeft(task.followUpSec);
    }
  }, [phase, secondsLeft, task]);

  useEffect(() => {
    if (phase === "result") window.scrollTo({ top: 0, behavior: "auto" });
  }, [phase]);

  if (!paper || !task || !result) return null;

  function start(index: number, initialTaskIndex = 0) {
    setPaperIndex(index);
    setTaskIndex(initialTaskIndex);
    setAnswers([]);
    setResponse("");
    setFollowUpResponse("");
    setPhase("main");
    setSecondsLeft(papers[index].tasks[initialTaskIndex].timeLimitSec);
  }

  function submitMain() {
    setPhase("follow-up");
    setSecondsLeft(task.followUpSec);
  }

  function submitFollowUp() {
    const nextAnswers = [...answers];
    nextAnswers[taskIndex] = { response: response.trim(), followUpResponse: followUpResponse.trim() };
    setAnswers(nextAnswers);
    setResponse("");
    setFollowUpResponse("");
    if (taskIndex < paper.tasks.length - 1) {
      const nextIndex = taskIndex + 1;
      setTaskIndex(nextIndex);
      setPhase("main");
      setSecondsLeft(paper.tasks[nextIndex].timeLimitSec);
      return;
    }

    const completedResults = paper.tasks.map((item, index) => {
      const answer = nextAnswers[index] ?? { response: "", followUpResponse: "" };
      return scoreQuantitativeResponse(item, answer.response, answer.followUpResponse);
    });
    const total = completedResults.reduce((sum, item) => sum + item.total, 0);
    const max = completedResults.reduce((sum, item) => sum + item.max, 0);
    const completedReview = completedResults.reduce((weakest, current, index) => current.review.weakest.passed ? weakest : weakest ?? { skillId: current.review.weakest.id, taskIndex: index }, null as { skillId: (typeof INTERVIEW_PROCESS_SKILLS)[number]["id"]; taskIndex: number } | null);
    const nextAttempts = [{ id: `${paper.id}-${Date.now()}`, paperId: paper.id, completedAt: new Date().toISOString(), total, max, weakestSkillId: completedReview?.skillId }, ...attempts].slice(0, 9);
    setAttempts(nextAttempts);
    window.localStorage.setItem(storageKey, JSON.stringify(nextAttempts));
    setPhase("result");
    setSecondsLeft(0);
  }

  if (phase === "intro") {
    return (
      <div className="space-y-5">
        <section className="border border-[var(--border)] bg-white p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--indigo)]">Full fixed interview papers</p>
          <h3 className="mt-1 text-xl font-bold text-[var(--ink)]">高压定量固定套卷</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)]">每套包含 3 道不同类型的问题。你需要先完成主问题，再处理面试官改变条件后的追问；最后报告会统计整场最薄弱的过程环节。</p>
        </section>
        <section className="border-y border-[var(--border)] py-4">
          <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {papers.map((item, index) => (
              <button key={item.id} type="button" onClick={() => start(index)} className="flex w-full items-center justify-between gap-4 py-4 text-left hover:bg-[var(--surface)]">
                <span className="min-w-0"><span className="block text-sm font-semibold text-[var(--ink)]">{item.title}</span><span className="mt-1 block text-xs leading-relaxed text-[var(--ink-soft)]">{item.note}</span><span className="mt-1 block text-xs text-[var(--ink-faint)]">3 道题 · 约 {Math.round(item.tasks.reduce((sum, current) => sum + current.timeLimitSec + current.followUpSec, 0) / 60)} 分钟 · {item.pressure}</span></span>
                <ChevronRight className="size-4 shrink-0 text-[var(--ink-faint)]" />
              </button>
            ))}
          </div>
          {attempts.length > 0 && <div className="mt-3 space-y-1 text-xs text-[var(--ink-faint)]"><p>本机已记录 {attempts.length} 次套卷训练</p><p>最近一次优先复盘：{attempts[0].weakestSkillId ? INTERVIEW_PROCESS_SKILLS.find((skill) => skill.id === attempts[0].weakestSkillId)?.label : "旧记录未保存过程弱项"}</p></div>}
        </section>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="space-y-5">
        <section className="border-l-4 border-[var(--success)] bg-[var(--success-bg)] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase text-[var(--success)]">训练报告，不代表院校评分</p><h3 className="mt-1 text-lg font-bold text-[var(--ink)]">{paper.title} 已完成</h3></div><strong className="text-3xl text-[var(--ink)]">{result.total}<span className="text-base font-normal text-[var(--ink-soft)]">/{result.max}</span></strong></div>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">整场最需要优先修补：<strong className="text-[var(--ink)]">{result.weakest.label}</strong>。这是过程反馈，不是录取概率或学院打分。</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--indigo)]">下一轮先执行：{result.weakest.id === "model" ? "重新定义变量、假设和目标量。" : result.weakest.id === "method" ? "说出为什么选择这个公式或方法。" : result.weakest.id === "calculation" ? "把关系式、代入和中间结论逐步说出。" : result.weakest.id === "check" ? "检查单位、数量级、范围和误差来源。" : "指出改变的条件，并重做受影响的模型环节。"}</p>
        </section>
        <section className="border-y border-[var(--border)] py-4">
          <h4 className="font-semibold text-[var(--ink)]">整场过程报告</h4>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {result.skillTotals.map((skill) => <div key={skill.id} className={`border p-3 ${skill.id === result.weakest.id ? "border-[var(--indigo)]/50 bg-[var(--info-bg)]" : "border-[var(--border)]"}`}><div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-[var(--ink)]">{skill.label}</span><strong className="text-sm text-[var(--ink)]">{skill.passed}/{skill.total}</strong></div><div className="mt-2 h-1.5 bg-[var(--surface)]"><div className="h-full bg-[var(--indigo)]" style={{ width: `${(skill.passed / skill.total) * 100}%` }} /></div></div>)}
          </div>
        </section>
        <section className="space-y-2">
          {paper.tasks.map((item, index) => <details key={item.id} className="border border-[var(--border)] bg-white p-4"><summary className="cursor-pointer text-sm font-semibold text-[var(--ink)]">第 {index + 1} 题 · {item.title}</summary><div className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--ink-soft)]"><p><strong className="text-[var(--ink)]">目标：</strong>{item.target}</p><p><strong className="text-[var(--ink)]">追问目标：</strong>{item.followUpTarget}</p><p className="flex gap-2 text-[var(--danger)]"><AlertTriangle className="mt-0.5 size-4 shrink-0" />常见失分点：{item.commonTrap}</p></div></details>)}
        </section>
        <div className="flex flex-wrap gap-2"><button type="button" onClick={() => start(paperIndex, result.weakestTaskIndex)} className="btn btn-primary">重练最弱题 <RotateCcw className="size-4" /></button><button type="button" onClick={() => start((paperIndex + 1) % papers.length)} className="btn btn-secondary">下一套固定套卷 <ChevronRight className="size-4" /></button><button type="button" onClick={() => setPhase("intro")} className="btn btn-secondary">返回套卷列表</button></div>
      </div>
    );
  }

  const isMain = phase === "main";
  return (
    <div className="border border-[var(--border)] bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] p-4"><div><p className="text-xs font-semibold uppercase text-[var(--indigo)]">{paper.title} · 第 {taskIndex + 1}/{paper.tasks.length} 题</p><p className="mt-1 text-sm text-[var(--ink-soft)]">{isMain ? "主问题：先把模型、计算和量级说完整" : "追问：改变一个条件，修正你的模型"}</p></div><div className={`flex items-center gap-2 font-mono text-lg font-bold ${secondsLeft <= 30 ? "text-[var(--danger)]" : "text-[var(--ink)]"}`}><Clock3 className="size-4" />{formatTime(secondsLeft)}</div></header>
      <div className="h-1 bg-[var(--surface)]"><div className="h-full bg-[var(--indigo)] transition-all" style={{ width: `${Math.max(0, (secondsLeft / (isMain ? task.timeLimitSec : task.followUpSec)) * 100)}%` }} /></div>
      <div className="space-y-5 p-4 sm:p-6"><InterviewThinkingChecklist emphasis={isMain ? ["model", "method", "calculation", "check"] : ["adapt"]} /><div><p className="text-xs font-semibold text-[var(--ink-faint)]">{task.title}</p><p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{task.setup}</p><p className="mt-3 text-lg font-semibold leading-relaxed text-[var(--ink)]">{isMain ? task.prompt : task.followUp}</p></div><div className="grid gap-2 sm:grid-cols-4">{["先建模", "计算链", "单位与量纲", "量级复核"].map((label, index) => <div key={label} className={`border-l-2 pl-2 text-xs ${index === 0 && isMain ? "border-[var(--indigo)] text-[var(--ink)]" : "border-[var(--border)] text-[var(--ink-faint)]"}`}>{label}</div>)}</div><label className="block"><span className="mb-2 block text-sm font-medium text-[var(--ink)]">{isMain ? "写出你的完整思路" : "回应追问，并说明哪一个假设发生了变化"}</span><textarea autoFocus value={isMain ? response : followUpResponse} onChange={(event) => isMain ? setResponse(event.target.value) : setFollowUpResponse(event.target.value)} className="input min-h-56 w-full resize-y" placeholder="把假设、关系式、单位、估算和检查写出来。套卷会按整场过程统计。" /></label><div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-[var(--ink-faint)]">主问题结束后自动进入追问；追问阶段请在倒计时内提交。</span><button type="button" onClick={isMain ? submitMain : submitFollowUp} className="btn btn-primary">{isMain ? "提交主问题，进入追问" : taskIndex === paper.tasks.length - 1 ? "完成套卷并查看报告" : "提交追问，进入下一题"}<ChevronRight className="size-4" /></button></div></div>
    </div>
  );
}
