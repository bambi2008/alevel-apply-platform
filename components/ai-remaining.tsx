"use client";

import { useEffect, useState } from "react";

type Allowance = { total: number; photo: number; statement: number };
const eventName = "qiaoshen:ai-usage-changed";

export function refreshAiRemaining() {
  window.dispatchEvent(new Event(eventName));
}

export const fetchAiFeedback: typeof fetch = async (input, init) => {
  try { return await fetch(input, init); }
  finally { refreshAiRemaining(); }
};

export function AiRemaining({ en }: { en: boolean }) {
  const [value, setValue] = useState<Allowance | null>(null);
  useEffect(() => {
    let active: AbortController | undefined;
    async function read() {
      active?.abort();
      const request = new AbortController();
      active = request;
      try {
        const response = await fetch("/api/ai-allowance", { cache: "no-store", signal: request.signal });
        const data = response.ok ? await response.json() : null;
        if (!request.signal.aborted) setValue(data?.enabled ? data.remaining : null);
      } catch { /* Keep the last known figures if this request fails. */ }
    }
    const refresh = () => void read();
    window.addEventListener(eventName, refresh);
    window.addEventListener("focus", refresh);
    refresh();
    return () => {
      active?.abort();
      window.removeEventListener(eventName, refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  if (!value) return null;
  return <p className="mx-auto max-w-6xl px-5 pt-4 text-sm text-neutral-600" role="status">
    {en ? `AI feedback left today: ${value.total} total · ${value.photo} photo · ${value.statement} personal statement`
      : `今日 AI 剩余：合计 ${value.total} 次 · 拍照 ${value.photo} 次 · 文书 ${value.statement} 次`}
  </p>;
}
