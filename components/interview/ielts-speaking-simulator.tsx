"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, RotateCcw } from "lucide-react";
import {
  IELTS_SPEAKING_PAPERS,
  type SpeakingPart,
  type SpeakingPrompt,
} from "@/lib/english/speaking-papers";

type Phase = "intro" | "answer" | "prep" | "result";

interface SpeakingAnswer extends SpeakingPrompt {
  answer: string;
}

interface SpeakingAttempt {
  id: string;
  completedAt: string;
  paperId?: string;
  paperTitle?: string;
  answers: SpeakingAnswer[];
}

const STORAGE_KEY = "alevel:ielts-speaking-attempts:v1";

const PART_META = {
  1: { title: "Part 1 · Introduction and interview", note: "4–5 分钟。自然、直接地回答并补充一个具体细节。" },
  2: { title: "Part 2 · Long turn", note: "准备 1 分钟，连续陈述最多 2 分钟。" },
  3: { title: "Part 3 · Discussion", note: "4–5 分钟。比较观点、解释原因并发展例子。" },
} as const;

function loadAttempts(): SpeakingAttempt[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as SpeakingAttempt[];
  } catch {
    return [];
  }
}

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function IeltsSpeakingSimulator() {
  const [paperId, setPaperId] = useState(IELTS_SPEAKING_PAPERS[0].id);
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState<SpeakingAnswer[]>([]);
  const [attempts, setAttempts] = useState<SpeakingAttempt[]>([]);
  const [feedback, setFeedback] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const paper = IELTS_SPEAKING_PAPERS.find((item) => item.id === paperId) ?? IELTS_SPEAKING_PAPERS[0];
  const prompts = paper.prompts;
  const current = prompts[index];
  const part = current?.part ?? 1;
  const partQuestionNumber = current
    ? prompts.filter((prompt, promptIndex) => prompt.part === part && promptIndex <= index).length
    : 0;
  const partQuestionCount = prompts.filter((prompt) => prompt.part === part).length;
  const totalWords = useMemo(
    () => answers.reduce((sum, answer) => sum + wordCount(answer.answer), 0),
    [answers],
  );

  useEffect(() => setAttempts(loadAttempts()), []);

  useEffect(() => {
    if ((phase !== "answer" && phase !== "prep") || secondsLeft <= 0) return;
    const timer = window.setInterval(() => setSecondsLeft((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [phase, secondsLeft]);

  useEffect(() => {
    if (phase === "prep" && secondsLeft === 0) {
      setPhase("answer");
      setSecondsLeft(prompts[index].seconds);
    }
  }, [index, phase, prompts, secondsLeft]);

  function begin() {
    setAnswers([]);
    setInput("");
    setIndex(0);
    setFeedback("");
    setPhase("answer");
    setSecondsLeft(prompts[0].seconds);
  }

  function moveNext() {
    const answer: SpeakingAnswer = { ...current, answer: input.trim() };
    const nextAnswers = [...answers, answer];
    setAnswers(nextAnswers);
    setInput("");

    if (index === prompts.length - 1) {
      const attempt: SpeakingAttempt = {
        id: `ielts-speaking-${Date.now()}`,
        completedAt: new Date().toISOString(),
        paperId: paper.id,
        paperTitle: paper.title,
        answers: nextAnswers,
      };
      const nextAttempts = [attempt, ...attempts].slice(0, 5);
      setAttempts(nextAttempts);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAttempts));
      setPhase("result");
      setSecondsLeft(0);
      return;
    }

    const nextIndex = index + 1;
    setIndex(nextIndex);
    if (prompts[nextIndex].part === 2) {
      setPhase("prep");
      setSecondsLeft(60);
    } else {
      setPhase("answer");
      setSecondsLeft(prompts[nextIndex].seconds);
    }
  }

  async function requestFeedback() {
    if (feedbackLoading) return;
    setFeedbackLoading(true);
    try {
      const history = answers.flatMap((answer) => [
        { role: "interviewer" as const, content: `[Part ${answer.part}] ${answer.prompt}` },
        { role: "student" as const, content: answer.answer || "(no response)" },
      ]);
      const response = await fetch("/api/interview-mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "feedback", subject: "IELTS Speaking", history }),
      });
      const data = await response.json();
      setFeedback(response.ok ? data.feedback : data.error || "暂时无法生成反馈。");
    } catch {
      setFeedback("网络连接失败，作答记录已保存在本机。");
    } finally {
      setFeedbackLoading(false);
    }
  }

  if (phase === "intro") {
    return (
      <div className="border border-[var(--border)] bg-white p-5 sm:p-6">
        <h3 className="text-lg font-bold text-[var(--ink)]">IELTS Speaking 固定全真流程</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
          按真实 Part 1–3 顺序完成。当前平台要求打字作答，因此只能评价内容展开、连贯、词汇和语法；
          发音必须通过真人教师或录音复盘另行检查。
        </p>
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase text-[var(--ink-faint)]">选择题组</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {IELTS_SPEAKING_PAPERS.map((item) => {
              const selected = item.id === paperId;
              const completed = attempts.filter((attempt) => attempt.paperId === item.id).length;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPaperId(item.id)}
                  aria-pressed={selected}
                  className={`min-h-20 border p-3 text-left ${
                    selected
                      ? "border-[var(--indigo)] bg-[var(--info-bg)]"
                      : "border-[var(--border)] bg-white hover:bg-[var(--surface)]"
                  }`}
                >
                  <strong className="block text-sm text-[var(--ink)]">{item.title}</strong>
                  <span className="mt-1 block text-xs text-[var(--ink-soft)]">{item.focus}</span>
                  <span className="mt-1 block text-[11px] text-[var(--ink-faint)]">已完成 {completed} 次</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-5 grid gap-px bg-[var(--border)] sm:grid-cols-3">
          {[1, 2, 3].map((value) => (
            <div key={value} className="bg-white p-4">
              <strong className="text-sm text-[var(--ink)]">{PART_META[value as SpeakingPart].title}</strong>
              <p className="mt-1 text-xs leading-relaxed text-[var(--ink-soft)]">{PART_META[value as SpeakingPart].note}</p>
            </div>
          ))}
        </div>
        <button type="button" onClick={begin} className="btn btn-primary mt-5">
          开始{paper.title}
          <ArrowRight className="size-4" />
        </button>
        {attempts.length > 0 && (
          <div className="mt-5 border-t border-[var(--border)] pt-4">
            <p className="text-xs font-semibold uppercase text-[var(--ink-faint)]">最近完成</p>
            <div className="mt-2 divide-y divide-[var(--border)]">
              {attempts.slice(0, 3).map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between gap-3 py-2 text-xs">
                  <span className="font-medium text-[var(--ink)]">{attempt.paperTitle ?? "早期训练流程"}</span>
                  <span className="text-[var(--ink-faint)]">
                    {new Date(attempt.completedAt).toLocaleDateString("zh-CN")} · {attempt.answers.filter((answer) => answer.answer).length}/9
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (phase === "result") {
    const answered = answers.filter((answer) => answer.answer.length > 0).length;
    return (
      <div className="space-y-5">
        <section className="border-l-4 border-[var(--success)] bg-[var(--success-bg)] p-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-[var(--success)]" />
            <h3 className="font-bold text-[var(--ink)]">全真流程已完成</h3>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div><strong className="block text-xl">{answered}/9</strong><span className="text-xs text-[var(--ink-soft)]">已作答</span></div>
            <div><strong className="block text-xl">{totalWords}</strong><span className="text-xs text-[var(--ink-soft)]">总词数</span></div>
            <div><strong className="block text-xl">3/3</strong><span className="text-xs text-[var(--ink-soft)]">完成 Parts</span></div>
          </div>
        </section>

        <section className="border-y border-[var(--border)] py-5">
          <h3 className="font-bold text-[var(--ink)]">形成性反馈</h3>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            AI 只根据打字内容评估四项官方标准中的前三项，不生成官方 Band，也不评价发音。
          </p>
          {!feedback ? (
            <button type="button" onClick={requestFeedback} disabled={feedbackLoading} className="btn btn-primary mt-4">
              {feedbackLoading ? "正在分析…" : "生成整场复盘"}
            </button>
          ) : (
            <div className="mt-4 whitespace-pre-wrap bg-[var(--surface)] p-4 text-sm leading-relaxed text-[var(--ink)]">{feedback}</div>
          )}
        </section>

        <button type="button" onClick={() => setPhase("intro")} className="btn btn-secondary">
          <RotateCcw className="size-4" />
          选择下一套
        </button>
      </div>
    );
  }

  return (
    <div className="border border-[var(--border)] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] p-4">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--indigo)]">IELTS Speaking · Part {part}</p>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            {phase === "prep" ? "准备时间" : `本部分第 ${partQuestionNumber} / ${partQuestionCount} 题`}
          </p>
        </div>
        <div className={`flex items-center gap-2 text-lg font-bold ${secondsLeft === 0 ? "text-[var(--danger)]" : "text-[var(--ink)]"}`}>
          <Clock3 className="size-4" />
          {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <p className="text-lg font-semibold leading-relaxed text-[var(--ink)]">{current.prompt}</p>
        {phase === "prep" ? (
          <div className="mt-5">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="input min-h-32 w-full resize-y"
              placeholder="写下关键词，不要写完整答案。准备结束后这些笔记会保留。"
            />
            <button type="button" onClick={() => { setPhase("answer"); setSecondsLeft(current.seconds); }} className="btn btn-primary mt-3">
              提前结束准备
            </button>
          </div>
        ) : (
          <div className="mt-5">
            <textarea
              autoFocus
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="input min-h-40 w-full resize-y"
              placeholder="按口语方式自然打字作答，不要写成正式作文。"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[var(--ink-faint)]">当前 {wordCount(input)} 词</span>
              <button type="button" onClick={moveNext} className="btn btn-primary">
                {index === prompts.length - 1 ? "完成整场" : "提交并继续"}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
