"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import type { QuestionFeedbackKind } from "@/lib/tests/question-feedback";

const reasons = [
  ["PROMPT", "题干", "Question wording"], ["ANSWER", "参考答案", "Answer key"],
  ["SOLUTION", "解析", "Explanation"], ["DISPLAY", "显示问题", "Display issue"], ["OTHER", "其他", "Other"],
] as const;

export function SessionFeedback({ sessionId, questionIds }: { sessionId: string; questionIds: string[] }) {
  const en = useLocale() === "en";
  const [saved, setSaved] = useState<QuestionFeedbackKind[]>([]);
  const [showErrorForm, setShowErrorForm] = useState(false);
  const [questionId, setQuestionId] = useState("");
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const url = `/api/study-feedback/${encodeURIComponent(sessionId)}`;

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { cache: "no-store", signal: controller.signal })
      .then(response => response.ok ? response.json() : null)
      .then(data => { if (!controller.signal.aborted && data) setSaved(current => [...new Set([...current, ...data.kinds as QuestionFeedbackKind[]])]); })
      .catch(() => { /* A retry is safe because the server deduplicates. */ });
    return () => controller.abort();
  }, [url]);

  async function submit(kind: QuestionFeedbackKind) {
    if (pending || saved.includes(kind) || (kind === "ERROR" && !reason)) return;
    setPending(true);
    setMessage("");
    try {
      const response = await fetch(url, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kind === "ERROR" ? { kind, reason, questionId: questionId || undefined } : { kind }),
      });
      if (response.status === 401) { setMessage(en ? "Sign in again to leave feedback." : "请重新登录后提交反馈。"); return; }
      if (!response.ok) throw Error("feedback_failed");
      setSaved(current => [...new Set([...current, kind])]);
      if (kind === "ERROR") setShowErrorForm(false);
      setMessage(en ? "Feedback recorded. Thank you." : "反馈已记录，谢谢。");
    } catch { setMessage(en ? "Could not save feedback. Please retry." : "暂时未能保存，请重试。"); }
    finally { setPending(false); }
  }

  return <section className="mt-8 border-t border-black/15 pt-5" aria-label={en ? "Feedback on this session" : "本套题反馈"}>
    <h2 className="mb-3 font-semibold">{en ? "How was this set?" : "这套题怎么样？"}</h2>
    <div className="flex flex-wrap gap-2">
      {([
        ["ERROR", "有题目有误", "Report a question issue"],
        ["TOO_HARD", "整体太难了", "Overall too hard"],
        ["MORE_LIKE_THIS", "想要更多这类题", "More like these"],
      ] as const).map(([kind, zh, english]) => <button key={kind} type="button" className="btn btn-secondary"
        disabled={pending || saved.includes(kind)} aria-expanded={kind === "ERROR" ? showErrorForm : undefined}
        onClick={() => kind === "ERROR" ? setShowErrorForm(open => !open) : void submit(kind)}>
        {en ? english : zh}{saved.includes(kind) && " ✓"}
      </button>)}
    </div>
    {showErrorForm && <form className="mt-4 flex flex-wrap items-end gap-3" onSubmit={event => { event.preventDefault(); void submit("ERROR"); }}>
      <label className="text-sm">{en ? "Question (optional)" : "题号（可选）"}
        <select className="input mt-1" value={questionId} onChange={event => setQuestionId(event.target.value)}>
          <option value="">{en ? "No question selected" : "不指定题号"}</option>
          {questionIds.map((id, index) => <option key={id} value={id}>{index + 1}</option>)}
        </select>
      </label>
      <label className="text-sm">{en ? "Reason" : "原因"}
        <select className="input mt-1" required value={reason} onChange={event => setReason(event.target.value)}>
          <option value="">{en ? "Choose a reason" : "选择原因"}</option>
          {reasons.map(([value, zh, english]) => <option key={value} value={value}>{en ? english : zh}</option>)}
        </select>
      </label>
      <button className="btn btn-primary" disabled={pending || !reason}>{en ? "Send feedback" : "提交反馈"}</button>
    </form>}
    <p className="mt-2 text-sm" role="status">{message}</p>
  </section>;
}
