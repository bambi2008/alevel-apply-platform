"use client";

import { useLocale } from "next-intl";

/** One shared disclosure per workspace, including results reached by a deep link. */
export function AiPracticeNotice() {
  const en = useLocale() === "en";
  return (
    <p className="mx-auto max-w-6xl px-5 py-3 text-xs leading-relaxed text-neutral-600 sm:px-8">
      {en
        ? "AI feedback is for practice only and is not human or official marking."
        : "AI 反馈仅供练习参考，不是人工或官方评分。"}
    </p>
  );
}
