"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { QuestionFeedbackKind } from "@/lib/tests/question-feedback";

const FeedbackAuth = createContext(false);
export function QuestionFeedbackProvider({ loggedIn, children }: { loggedIn: boolean; children: ReactNode }) {
  return <FeedbackAuth.Provider value={loggedIn}>{children}</FeedbackAuth.Provider>;
}
const choices: { kind: QuestionFeedbackKind; zh: string; en: string }[] = [
  { kind: "ERROR", zh: "题目有误", en: "Question error" },
  { kind: "TOO_HARD", zh: "太难了", en: "Too hard" },
  { kind: "MORE_LIKE_THIS", zh: "想要更多这类题", en: "More like this" },
];

export function QuestionFeedback({ questionId, testId }: { questionId: string; testId: string }) {
  const english = useLocale() === "en";
  const loggedIn = useContext(FeedbackAuth);
  const key = `${testId}:${questionId}`;
  const [state, setState] = useState<{ key: string; kinds: QuestionFeedbackKind[]; denied?: boolean }>({ key: "", kinds: [] });
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!loggedIn) return;
    const controller = new AbortController();
    fetch(`/api/question-feedback?testId=${encodeURIComponent(testId)}&questionId=${encodeURIComponent(questionId)}`, { cache: "no-store", signal: controller.signal })
      .then(async response => {
        if (response.status === 401) return { kinds: [], denied: true };
        if (!response.ok) throw new Error("load_failed");
        return response.json() as Promise<{ kinds: QuestionFeedbackKind[] }>;
      })
      .then(value => { if (!controller.signal.aborted) setState({ key, ...value }); })
      .catch(() => { if (!controller.signal.aborted) { setState({ key, kinds: [] }); setMessage(english ? "Could not load previous feedback. Retrying a click is safe." : "暂未读到已提交反馈，重试不会重复计数。"); } });
    return () => controller.abort();
  }, [loggedIn, questionId, testId, key, english]);

  const needsLogin = !loggedIn || state.denied;
  async function submit(kind: QuestionFeedbackKind) {
    if (needsLogin || pending || state.key !== key || state.kinds.includes(kind)) return;
    setPending(true);
    setMessage("");
    try {
      const response = await fetch("/api/question-feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ testId, questionId, kind }) });
      if (response.status === 401) { setState(current => ({ ...current, denied: true })); return; }
      if (!response.ok) throw new Error("save_failed");
      setState(current => ({ key, kinds: [...new Set([...current.kinds, kind])] }));
      setMessage(english ? "Feedback recorded. Thank you." : "反馈已记录，谢谢。" );
    } catch { setMessage(english ? "Could not save. Please try again." : "暂时未能保存，请重试。" ); }
    finally { setPending(false); }
  }
  return <div className="mt-5 border-t border-black/15 pt-3" aria-label={english ? "Question feedback" : "题目反馈"}>
    <div className="flex flex-wrap gap-2">
      {choices.map(choice => {
        const saved = state.key === key && state.kinds.includes(choice.kind);
        return <button key={choice.kind} type="button" aria-pressed={saved} disabled={needsLogin || pending || (loggedIn && state.key !== key) || saved} onClick={() => void submit(choice.kind)}
          className="min-h-11 rounded-lg border border-black/25 px-3 py-2 text-sm text-black/75 transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-60">
          {saved ? "✓ " : ""}{english ? choice.en : choice.zh}
        </button>;
      })}
    </div>
    {needsLogin && <p className="mt-1 text-xs text-black/65"><Link href="/login" className="inline-flex min-h-11 items-center underline">{english ? "Sign in to give feedback" : "登录后可反馈"}</Link></p>}
    <p role="status" aria-live="polite" className="mt-1 text-xs text-black/65">{message}</p>
  </div>;
}
