import { uiCopy } from "@/lib/ui-copy";
import type { AdaptiveProfile, AdaptiveTopicDefinition } from "./adaptive";
import type { ExamReadiness } from "./readiness";

/** Only platform-generated learning titles/details; never answers, quotes or transcripts. */
function studyText(source: string, locale: string, topics: AdaptiveTopicDefinition[]): string {
  if (locale !== "en") return source;
  const exact = uiCopy(locale, source);
  if (exact !== source) return exact;
  const topicTitle = (title: string) => topics.find(topic => topic.title === title)?.titleEn ?? title;
  const templates: Array<[RegExp, (...groups: string[]) => string]> = [
    [/^复习 (\d+) 道到期题$/, n => `Review ${n} questions due`],
    [/^强化：(.+)$/, title => `Focus: ${topicTitle(title)}`],
    [/^(\d+)% 掌握度 · (\d+)% 数据置信度，安排匹配当前水平的练习。$/, (a, b) => `${a}% mastery · ${b}% evidence confidence. Practise at a suitable level.`],
    [/^目前只有 (\d+) 次整卷记录；至少需要 2 次计时整卷才能判断考场稳定性。$/, n => `Only ${n} paper attempts are recorded. At least 2 timed papers are needed to assess consistency.`],
    [/^已有数据覆盖 (\d+)% 的知识模块，未覆盖部分仍可能隐藏失分风险。$/, n => `Evidence covers ${n}% of topics. Uncovered topics may still contain gaps.`],
    [/^(.+) 尚未稳定$/, title => `${topicTitle(title)} needs consolidation`],
    [/^掌握度 (\d+)%，数据置信度 (\d+)%。$/, (a, b) => `Mastery ${a}%; evidence confidence ${b}%.`],
    [/^最近 (\d+) 次整卷稳定性为 (\d+)%，需要用复测确认真实水平。$/, (a, b) => `Consistency across the last ${a} papers is ${b}%. Retest to confirm your current level.`],
    [/^近期整卷平均完成度 (\d+)%，仍有可避免的空题失分。$/, n => `Recent papers average ${n}% completion. Unanswered questions may be costing avoidable marks.`],
    [/^距上次有效训练已 (\d+) 天，需要一次近期复测。$/, n => `It has been ${n} days since the last valid attempt. Complete a fresh retest.`],
    [/^(\d+) 道问题尚未稳定，(\d+) 道在恢复后再次失分；当前修复率 (\d+)%。$/, (a, b, c) => `${a} questions remain unresolved; ${b} lost marks again after recovery. Current recovery rate: ${c}%.`],
  ];
  for (const [pattern, render] of templates) {
    const match = pattern.exec(source);
    if (match) return render(...match.slice(1));
  }
  return source;
}

export function adaptivePresentation(profile: AdaptiveProfile, locale: string): AdaptiveProfile {
  if (locale !== "en") return profile;
  return { ...profile,
    topics: profile.topics.map(topic => ({ ...topic, title: topic.titleEn })),
    tasks: profile.tasks.map(task => ({ ...task, title: studyText(task.title, locale, profile.topics), detail: studyText(task.detail, locale, profile.topics) })),
  };
}

export function readinessPresentation<T extends ExamReadiness>(value: T | null, locale: string, topics: AdaptiveTopicDefinition[]): T | null {
  if (!value || locale !== "en") return value;
  return { ...value, headline: studyText(value.headline, locale, topics),
    risks: value.risks.map(risk => ({ ...risk, title: studyText(risk.title, locale, topics), detail: studyText(risk.detail, locale, topics) })),
    sprint: value.sprint.map(task => ({ ...task, title: studyText(task.title, locale, topics), detail: studyText(task.detail, locale, topics) })),
  };
}
