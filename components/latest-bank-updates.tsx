"use client";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { getPracticeReleaseHistory } from "@/lib/tests/practice-updates";
type Update = ReturnType<typeof getPracticeReleaseHistory>[number];
export function LatestBankUpdates({ testId }: { testId: string }) {
  const english = useLocale() === "en";
  const [state, setState] = useState<{ testId: string; updates: Update[]; error?: boolean } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/question-bank/updates?testId=${encodeURIComponent(testId)}`, { signal: controller.signal })
      .then(response => { if (!response.ok) throw Error("unavailable"); return response.json() as Promise<{ updates: Update[] }>; })
      .then(value => { if (!controller.signal.aborted) setState({ testId, updates: value.updates }); })
      .catch(() => { if (!controller.signal.aborted) setState({ testId, updates: [], error: true }); });
    return () => controller.abort();
  }, [testId]);
  const current = state?.testId === testId ? state : null;
  return <section className="mt-8 border-t border-black/15 pt-4" aria-label={english ? "Latest question-bank updates" : "最近题库更新"}>
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-sm font-semibold">{english ? "Latest bank updates" : "最近题库更新"}</h2><Link href={`/updates?testId=${encodeURIComponent(testId)}`} className="inline-flex min-h-11 items-center text-sm underline">{english ? "All updates" : "全部更新记录"}</Link></div>
    {!current ? <p role="status" className="text-sm text-black/65">{english ? "Loading…" : "读取中…"}</p> : current.error ? <p className="text-sm text-black/65">{english ? "Updates unavailable. Open the full history to retry." : "更新摘要暂时不可用，可打开完整记录查看。"}</p> : <ul className="divide-y divide-black/10">{current.updates.map(update => <li key={update.id} className="flex flex-wrap gap-x-4 gap-y-1 py-2 text-sm text-black/70"><time dateTime={update.publishedAt}>{new Date(update.publishedAt).toLocaleDateString(english ? "en-GB" : "zh-CN", { timeZone: "Asia/Shanghai" })}</time><span>{english ? update.titleEn : update.title}{update.addedQuestions > 0 ? ` +${update.addedQuestions}` : ""}</span></li>)}</ul>}
  </section>;
}
