"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, RotateCcw } from "lucide-react";

type SpeakingPart = 1 | 2 | 3;
type Phase = "intro" | "answer" | "prep" | "result";

interface SpeakingPrompt {
  id: string;
  part: SpeakingPart;
  prompt: string;
  seconds: number;
}

interface SpeakingAnswer extends SpeakingPrompt {
  answer: string;
}

interface SpeakingAttempt {
  id: string;
  completedAt: string;
  answers: SpeakingAnswer[];
}

const STORAGE_KEY = "alevel:ielts-speaking-attempts:v1";

const PROMPTS: SpeakingPrompt[] = [
  { id: "p1-1", part: 1, seconds: 45, prompt: "Do you work or are you a student?" },
  { id: "p1-2", part: 1, seconds: 45, prompt: "What part of your studies do you find most interesting?" },
  { id: "p1-3", part: 1, seconds: 45, prompt: "Do you prefer studying alone or with other people?" },
  { id: "p1-4", part: 1, seconds: 45, prompt: "Has the way you study changed in recent years?" },
  {
    id: "p2-1",
    part: 2,
    seconds: 120,
    prompt: "Describe a useful skill you learned outside school. You should say what the skill is, how you learned it, why you wanted to learn it, and explain how it has been useful to you.",
  },
  { id: "p3-1", part: 3, seconds: 75, prompt: "Why do some practical skills receive less attention in schools?" },
  { id: "p3-2", part: 3, seconds: 75, prompt: "Who should decide which skills young people need for the future?" },
  { id: "p3-3", part: 3, seconds: 75, prompt: "How has technology changed the way adults learn new skills?" },
  { id: "p3-4", part: 3, seconds: 75, prompt: "Do qualifications always show that someone can use a skill well?" },
];

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
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState<SpeakingAnswer[]>([]);
  const [attempts, setAttempts] = useState<SpeakingAttempt[]>([]);
  const [feedback, setFeedback] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const current = PROMPTS[index];
  const part = current?.part ?? 1;
  const partQuestionNumber = current
    ? PROMPTS.filter((prompt, promptIndex) => prompt.part === part && promptIndex <= index).length
    : 0;
  const partQuestionCount = PROMPTS.filter((prompt) => prompt.part === part).length;
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
      setSecondsLeft(PROMPTS[index].seconds);
    }
  }, [index, phase, secondsLeft]);

  function begin() {
    setAnswers([]);
    setInput("");
    setIndex(0);
    setFeedback("");
    setPhase("answer");
    setSecondsLeft(PROMPTS[0].seconds);
  }

  function moveNext() {
    const answer: SpeakingAnswer = { ...current, answer: input.trim() };
    const nextAnswers = [...answers, answer];
    setAnswers(nextAnswers);
    setInput("");

    if (index === PROMPTS.length - 1) {
      const attempt: SpeakingAttempt = {
        id: `ielts-speaking-${Date.now()}`,
        completedAt: new Date().toISOString(),
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
    if (PROMPTS[nextIndex].part === 2) {
      setPhase("prep");
      setSecondsLeft(60);
    } else {
      setPhase("answer");
      setSecondsLeft(PROMPTS[nextIndex].seconds);
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
        <h3 className="text-lg font-bold text-[var(--ink)]">IELTS Speaking 全真流程 1</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
          按真实 Part 1–3 顺序完成。当前平台要求打字作答，因此只能评价内容展开、连贯、词汇和语法；
          发音必须通过真人教师或录音复盘另行检查。
        </p>
        <div className="mt-5 grid gap-px bg-[var(--border)] sm:grid-cols-3">
          {[1, 2, 3].map((value) => (
            <div key={value} className="bg-white p-4">
              <strong className="text-sm text-[var(--ink)]">{PART_META[value as SpeakingPart].title}</strong>
              <p className="mt-1 text-xs leading-relaxed text-[var(--ink-soft)]">{PART_META[value as SpeakingPart].note}</p>
            </div>
          ))}
        </div>
        <button type="button" onClick={begin} className="btn btn-primary mt-5">
          开始全真流程
          <ArrowRight className="size-4" />
        </button>
        {attempts.length > 0 && (
          <p className="mt-3 text-xs text-[var(--ink-faint)]">
            本机已有 {attempts.length} 次完成记录，最近一次为 {new Date(attempts[0].completedAt).toLocaleDateString("zh-CN")}。
          </p>
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

        <button type="button" onClick={begin} className="btn btn-secondary">
          <RotateCcw className="size-4" />
          再练一套
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
                {index === PROMPTS.length - 1 ? "完成整场" : "提交并继续"}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
