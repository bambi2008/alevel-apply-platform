"use client";

import { useState, useRef, useEffect } from "react";
import type { InterviewQuestion } from "@/lib/interview/questions";

type Msg = { role: "interviewer" | "student"; content: string };

export function SubjectInterview({
  subjectName,
  questions,
}: {
  subjectName: string;
  questions: InterviewQuestion[];
}) {
  const [tab, setTab] = useState<"bank" | "mock">("bank");
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      {/* 切换：题库 / AI 模拟面试 */}
      <div className="inline-flex rounded-lg border border-[var(--border)] p-1 bg-[var(--surface)] mb-6">
        <button
          type="button"
          onClick={() => setTab("bank")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === "bank" ? "bg-white shadow-[var(--shadow-sm)] text-[var(--ink)]" : "text-[var(--ink-soft)]"}`}
        >
          练习题库
        </button>
        <button
          type="button"
          onClick={() => setTab("mock")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === "mock" ? "bg-white shadow-[var(--shadow-sm)] text-[var(--ink)]" : "text-[var(--ink-soft)]"}`}
        >
          🎙️ AI 模拟面试
        </button>
      </div>

      {tab === "bank" ? (
        <div className="space-y-4">
          {questions.map((q, i) => {
            const open = openId === q.id;
            return (
              <div key={q.id} className="card p-5">
                <div className="flex gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-[var(--info-bg)] text-[var(--indigo)] font-semibold flex items-center justify-center text-sm">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[var(--ink)] leading-relaxed">{q.prompt}</p>
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : q.id)}
                      className="mt-3 text-sm font-medium text-[var(--indigo)] hover:underline"
                    >
                      {open ? "收起思路" : "看思路提示"}
                    </button>
                    {open && (
                      <div className="mt-3 space-y-3">
                        <div className="rounded-lg bg-[var(--surface)] p-3.5">
                          <p className="text-xs font-semibold text-[var(--indigo)] mb-1">思路（不是标准答案）</p>
                          <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{q.approach}</p>
                        </div>
                        {q.followUps && q.followUps.length > 0 && (
                          <div className="rounded-lg border border-[var(--border)] p-3.5">
                            <p className="text-xs font-semibold text-[var(--ink-soft)] mb-1.5">面试官可能这样追问</p>
                            <ul className="space-y-1">
                              {q.followUps.map((f, k) => (
                                <li key={k} className="text-sm text-[var(--ink-soft)] flex gap-2">
                                  <span className="text-[var(--ink-faint)]">→</span>
                                  {f}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <MockInterview subjectName={subjectName} seedQuestions={questions} />
      )}
    </div>
  );
}

function MockInterview({
  subjectName,
  seedQuestions,
}: {
  subjectName: string;
  seedQuestions: InterviewQuestion[];
}) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  async function callApi(payload: object): Promise<string | null> {
    setLoading(true);
    try {
      const res = await fetch("/api/interview-mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        return data?.error || "生成失败，请稍后再试";
      }
      return data.interviewer as string;
    } catch {
      return "网络错误，请稍后再试";
    } finally {
      setLoading(false);
    }
  }

  async function start(useSeed: boolean) {
    setStarted(true);
    const seed = useSeed && seedQuestions.length > 0
      ? seedQuestions[Math.floor(Math.random() * seedQuestions.length)].prompt
      : undefined;
    const opening = await callApi({ subject: subjectName, question: seed, history: [] });
    if (opening) setMsgs([{ role: "interviewer", content: opening }]);
  }

  async function send() {
    const reply = input.trim();
    if (!reply || loading) return;
    const newHistory: Msg[] = [...msgs, { role: "student", content: reply }];
    setMsgs(newHistory);
    setInput("");
    const next = await callApi({ subject: subjectName, history: msgs, studentReply: reply });
    if (next) setMsgs([...newHistory, { role: "interviewer", content: next }]);
  }

  if (!started) {
    return (
      <div className="card p-6 text-center">
        <p className="text-4xl mb-3">🎙️</p>
        <h3 className="font-semibold text-[var(--ink)] mb-1.5">AI 模拟面试 · {subjectName}</h3>
        <p className="text-sm text-[var(--ink-soft)] max-w-md mx-auto leading-relaxed mb-5">
          AI 会像牛剑面试官一样，抛给你一个陌生问题，并顺着你的回答不断追问。
          目标是练习「把思路说出来 + 被追问时如何推进」。想不出来也没关系，试着出声地想。
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button type="button" onClick={() => start(true)} className="btn btn-primary">
            从题库出题开始
          </button>
          <button type="button" onClick={() => start(false)} className="btn btn-secondary">
            让 AI 随机出题
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "student" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "student"
                  ? "bg-[var(--indigo)] text-white"
                  : "bg-[var(--surface)] text-[var(--ink)]"
              }`}
            >
              {m.role === "interviewer" && <span className="block text-xs font-semibold text-[var(--indigo)] mb-1">面试官</span>}
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[var(--surface)] rounded-2xl px-4 py-2.5 text-sm text-[var(--ink-faint)]">思考中…</div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="mt-4 flex gap-2 items-end">
        <textarea
          className="input min-h-11 resize-none flex-1"
          rows={2}
          placeholder="把你的思路打出来…（哪怕还没有答案）"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
          }}
        />
        <button type="button" onClick={send} disabled={loading || !input.trim()} className="btn btn-primary">
          回答
        </button>
      </div>
      <p className="mt-2 text-xs text-[var(--ink-faint)]">Ctrl/⌘ + Enter 发送。AI 模拟仅供练习，真实面试风格因学院与导师而异。</p>
    </div>
  );
}
