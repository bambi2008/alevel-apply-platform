"use client";

import { useState, useEffect, useRef, useCallback, use } from "react";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getMockPaper, type MockPaper } from "@/lib/tests/mock-papers";
import type { MCQQuestion } from "@/lib/tests/questions/types";
import { MathRenderer } from "@/components/math-renderer";

type Phase = "briefing" | "running" | "results";

export default function MockPaperPage({
  params,
}: {
  params: Promise<{ testId: string; paperId: string }>;
}) {
  const { testId, paperId } = use(params);
  const paper = getMockPaper(paperId);
  if (!paper || paper.testId !== testId) notFound();

  return <PaperRunner paper={paper!} />;
}

function PaperRunner({ paper }: { paper: MockPaper }) {
  const [phase, setPhase] = useState<Phase>("briefing");
  const [moduleIndex, setModuleIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentModule = paper.modules[moduleIndex];

  // 进入某模块时重置倒计时
  const startModule = useCallback(
    (idx: number) => {
      setModuleIndex(idx);
      setTimeLeft(paper.modules[idx].durationSec);
    },
    [paper.modules]
  );

  const finish = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("results");
  }, []);

  const nextModule = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (moduleIndex + 1 < paper.modules.length) {
      startModule(moduleIndex + 1);
    } else {
      finish();
    }
  }, [moduleIndex, paper.modules.length, startModule, finish]);

  // 倒计时
  useEffect(() => {
    if (phase !== "running") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          // 到点自动交卷进入下一模块
          setTimeout(() => nextModule(), 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, moduleIndex, nextModule]);

  const begin = () => {
    setAnswers({});
    setPhase("running");
    startModule(0);
  };

  const choose = (qid: string, key: string) =>
    setAnswers((a) => ({ ...a, [qid]: key }));

  if (phase === "briefing") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link href={`/tests/${paper.testId}`} className="text-sm text-blue-600 hover:underline">
          ← 返回 {paper.testId.toUpperCase()}
        </Link>
        <h1 className="text-2xl font-bold mt-4 mb-2">{paper.title}</h1>
        <p className="text-sm text-neutral-500 mb-6">{paper.titleEn}</p>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
          <p className="text-sm text-neutral-700 leading-relaxed">{paper.description}</p>
          <div className="space-y-2">
            {paper.modules.map((m, i) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
                <div>
                  <span className="text-sm font-medium text-neutral-800">模块 {i + 1} · {m.title}</span>
                  <p className="text-xs text-neutral-500">{m.questions.length} 题</p>
                </div>
                <span className="text-sm font-semibold text-blue-600">{Math.round(m.durationSec / 60)} 分钟</span>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-3 text-xs text-amber-800">
            ⚠️ 每个模块独立计时，时间到会<strong>自动交卷</strong>并进入下一模块，期间不能返回上一模块。无负分，建议每题都作答。请预留完整的不被打断的时间。
          </div>
          <button
            onClick={begin}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            开始考试
          </button>
        </div>
      </div>
    );
  }

  if (phase === "running") {
    const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const ss = String(timeLeft % 60).padStart(2, "0");
    const urgent = timeLeft <= 60;
    const answeredInModule = currentModule.questions.filter((q) => answers[q.id]).length;

    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* 顶部模块计时条 */}
        <div className="sticky top-0 z-10 -mx-4 px-4 py-3 bg-white/95 backdrop-blur border-b border-neutral-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-500">模块 {moduleIndex + 1}/{paper.modules.length}</p>
            <p className="text-sm font-semibold text-neutral-800">{currentModule.title}</p>
          </div>
          <div className="text-right">
            <p className={`font-mono font-bold text-xl tabular-nums ${urgent ? "text-red-600" : "text-neutral-900"}`}>{mm}:{ss}</p>
            <p className="text-xs text-neutral-400">{answeredInModule}/{currentModule.questions.length} 已答</p>
          </div>
        </div>

        <div className="space-y-5 mt-5">
          {currentModule.questions.map((q, i) => (
            <McqCard key={q.id} q={q} index={i} selected={answers[q.id]} onChoose={(k) => choose(q.id, k)} />
          ))}
        </div>

        <button
          onClick={nextModule}
          className="w-full mt-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
        >
          {moduleIndex + 1 < paper.modules.length ? "交卷并进入下一模块 →" : "交卷并查看成绩"}
        </button>
        <p className="text-center text-xs text-neutral-400 mt-2">交卷后无法返回本模块</p>
      </div>
    );
  }

  // results
  return <PaperResults paper={paper} answers={answers} />;
}

function McqCard({
  q,
  index,
  selected,
  onChoose,
}: {
  q: MCQQuestion;
  index: number;
  selected: string | undefined;
  onChoose: (key: string) => void;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex gap-2 mb-3">
        <span className="text-xs font-semibold text-neutral-400 shrink-0 mt-1">Q{index + 1}</span>
        <MathRenderer text={q.question} className="text-neutral-900 leading-relaxed" block />
      </div>
      <div className="space-y-2">
        {q.options.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChoose(opt.key)}
            className={`w-full flex items-start gap-2 text-left px-3 py-2 rounded-lg border transition ${
              selected === opt.key
                ? "border-blue-500 bg-blue-50"
                : "border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            <span className={`text-xs font-bold w-5 shrink-0 mt-0.5 ${selected === opt.key ? "text-blue-600" : "text-neutral-400"}`}>{opt.key}</span>
            <MathRenderer text={opt.text} className="flex-1 text-sm" />
          </button>
        ))}
      </div>
    </div>
  );
}

function PaperResults({ paper, answers }: { paper: MockPaper; answers: Record<string, string> }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  // 分模块计分
  const moduleScores = paper.modules.map((m) => {
    let earned = 0;
    const max = m.questions.length;
    for (const q of m.questions) if (answers[q.id] === q.answer) earned++;
    return { module: m, earned, max };
  });
  const totalEarned = moduleScores.reduce((s, x) => s + x.earned, 0);
  const totalMax = moduleScores.reduce((s, x) => s + x.max, 0);

  // 存档（best-effort，mode: paper）
  useEffect(() => {
    const allQ = paper.modules.flatMap((m) => m.questions);
    const payload = {
      testId: paper.testId,
      mode: "paper",
      totalEarned,
      totalMax,
      answers: allQ.map((q) => ({
        questionId: q.id,
        type: "mcq" as const,
        selected: answers[q.id] ?? undefined,
        earned: answers[q.id] === q.answer ? 1 : 0,
        max: 1,
      })),
    };
    fetch("/api/exam-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="text-center mb-8">
        <p className="text-sm text-neutral-500">{paper.title} · 成绩</p>
        <div className="text-5xl font-bold text-blue-600 mt-3">
          {totalEarned}<span className="text-2xl text-neutral-400">/{totalMax}</span>
        </div>
        <p className="text-sm text-neutral-500 mt-1">正确率 {Math.round((totalEarned / totalMax) * 100)}%</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {moduleScores.map(({ module, earned, max }) => (
          <div key={module.id} className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
            <p className="text-xs text-neutral-500">{module.title}</p>
            <p className="text-2xl font-bold text-neutral-800 mt-1">{earned}<span className="text-base text-neutral-400">/{max}</span></p>
            <p className="text-xs text-neutral-400">{Math.round((earned / max) * 100)}%</p>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-neutral-700 mb-3">逐题回看</h2>
      <div className="space-y-4">
        {paper.modules.map((m) => (
          <div key={m.id}>
            <p className="text-xs font-medium text-neutral-500 mb-2">{m.title}</p>
            <div className="space-y-2">
              {m.questions.map((q, i) => {
                const sel = answers[q.id];
                const correct = sel === q.answer;
                const isOpen = open[q.id];
                return (
                  <div key={q.id} className="rounded-lg border border-neutral-200 bg-white">
                    <button
                      onClick={() => setOpen((o) => ({ ...o, [q.id]: !o[q.id] }))}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left"
                    >
                      <span className={`text-xs w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {correct ? "✓" : "✗"}
                      </span>
                      <span className="text-xs text-neutral-400 shrink-0">Q{i + 1}</span>
                      <MathRenderer text={q.question} className="text-sm text-neutral-800 flex-1" />
                      <span className="text-neutral-400 text-xs">{isOpen ? "▲" : "▼"}</span>
                    </button>
                    {isOpen && (
                      <div className="px-3 pb-3 border-t border-neutral-100 pt-2 space-y-1.5">
                        {q.options.map((opt) => {
                          let cls = "text-neutral-600";
                          if (opt.key === q.answer) cls = "text-green-700 font-medium";
                          else if (opt.key === sel) cls = "text-red-600 line-through";
                          return (
                            <div key={opt.key} className={`flex items-start gap-2 text-sm ${cls}`}>
                              <span className="text-xs font-bold w-4 shrink-0">{opt.key}</span>
                              <MathRenderer text={opt.text} className="flex-1" />
                            </div>
                          );
                        })}
                        <div className="mt-2 text-sm text-neutral-600 bg-neutral-50 rounded-lg px-3 py-2">
                          <MathRenderer text={q.solution} block />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-8">
        <Link href={`/tests/${paper.testId}`} className="flex-1 text-center py-3 rounded-xl border border-neutral-300 text-sm text-neutral-600 hover:bg-neutral-50">
          返回考试主页
        </Link>
        <Link href={`/tests/${paper.testId}/paper/${paper.id}`} className="flex-1 text-center py-3 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700">
          重做本卷
        </Link>
      </div>
    </div>
  );
}
