import { uiCopy } from "@/lib/ui-copy";

/** Translate owned templates, not arbitrary stored feedback or learner quotations. */
export function diagnosisEvidence(source: string, locale: string): string {
  if (locale !== "en") return source;
  const exact = uiCopy(locale, source);
  if (exact !== source) return exact;
  let match = /^已获得 (\d+)% 的过程分，但论证尚未闭合。$/.exec(source);
  if (match) return `You earned ${match[1]}% of the process marks, but the argument is incomplete.`;
  match = /^书面得分率为 (\d+)%，当前方法未覆盖主要评分点。$/.exec(source);
  if (match) return `Your written score is ${match[1]}%; the method does not yet cover the main marking points.`;
  match = /^本题获得 ([\d.]+)\/([\d.]+) 分，部分判断正确。$/.exec(source);
  if (match) return `You earned ${match[1]}/${match[2]} marks; some judgments were correct.`;
  match = /^用时 ([\d.]+) 秒，明显短于该题建议核对时间。$/.exec(source);
  if (match) return `Time spent: ${match[1]} seconds, substantially below the suggested checking time.`;
  match = /^评分反馈指出缺少：([\s\S]*?)(等步骤)?。$/.exec(source);
  // The interior is model feedback and remains verbatim, even if originally Chinese.
  if (match) return `The feedback identifies missing steps: ${match[1]}${match[2] ? " (and other steps)" : ""}.`;
  return source;
}
