import { describe, expect, it } from "vitest";
import { buildAdaptiveProfile, type AdaptiveProfile } from "./adaptive";
import { buildExamReadiness, type ReadinessAttempt } from "./readiness";
import { adaptivePresentation, readinessPresentation } from "./study-presentation";

const now = new Date("2026-11-02T00:00:00Z");
const topics = [{ id: "algebra", title: "代数", titleEn: "Algebra" }];
const base = buildAdaptiveProfile({ testId: "tmua", topics, answers: [], now });
function withoutDisplay(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(withoutDisplay);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).filter(([key]) => !["title", "detail", "headline"].includes(key)).map(([key, v]) => [key, withoutDisplay(v)]));
  return value;
}
function attempt(id: string, score: number, age: number, completion = 100, timeRatio = 1): ReadinessAttempt {
  return { id, mode: "paper", paperId: id, scorePercent: score, completionPercent: completion, timeRatio, completedAt: new Date(now.getTime() - age * 86400000) };
}
describe("owned learning presentation with unchanged numerical evidence", () => {
  it("translates every generated adaptive task kind and keeps the original profile", () => {
    const profile: AdaptiveProfile = { ...base, tasks: [
      ...base.tasks,
      { id: "due", kind: "review", title: "复习 3 道到期题", detail: "先重做曾经失分且已经到复习时间的题，巩固会比刷新题更优先。", href: "/tests/tmua/review" },
      { id: "focus", kind: "focus", topicId: "algebra", title: "强化：代数", detail: "42% 掌握度 · 75% 数据置信度，安排匹配当前水平的练习。", href: "/tests/tmua/practice?topic=algebra" },
      { id: "mock", kind: "mock", title: "完成一次整卷模考", detail: "知识覆盖与稳定性已达到整卷检验门槛，模考后再回到薄弱项。", href: "/tests/tmua/mock" },
    ] };
    const snapshot = JSON.stringify(profile);
    const shown = adaptivePresentation(profile, "en");
    expect(JSON.stringify(shown)).not.toMatch(/[\u3400-\u9fff]/u);
    expect(withoutDisplay(shown)).toEqual(withoutDisplay(profile));
    expect(shown.reviewSchedule).toBe(profile.reviewSchedule);
    expect(shown.tasks.find(task => task.id === "focus")?.title).toBe("Focus: Algebra");
    expect(JSON.stringify(profile)).toBe(snapshot);
    expect(adaptivePresentation(profile, "zh-CN")).toBe(profile);
  });
  it("covers every risk code and stable/empty states without changing evidence or private fields", () => {
    const strong: AdaptiveProfile = { ...base, coverage: 100, uniqueQuestions: 70, topics: [{ ...base.topics[0], mastery: 90, confidence: 90 }] };
    const weak: AdaptiveProfile = { ...strong, coverage: 35, topics: [{ ...strong.topics[0], mastery: 42, confidence: 75 }] };
    const cases = [
      { adaptive: weak, attempts: [] },
      { adaptive: weak, attempts: [attempt("a", 5, 45, 50, 0.1), attempt("b", 99, 40, 60, 0.1), attempt("c", 10, 35, 65, 0.1)] },
      { adaptive: strong, attempts: [attempt("a", 85, 1), attempt("b", 86, 2), attempt("c", 84, 3), attempt("d", 85, 4)] },
    ];
    const codes = new Set<string>();
    for (const args of cases) {
      const result = { ...buildExamReadiness({ ...args, testId: "tmua", now, remediation: { activeCount: 4, dueCount: 6, relapsedCount: args.adaptive === weak ? 3 : 0, recoveryRate: 60 } }), privateFixture: { work: "学生原文 x=2" } };
      result.risks.forEach(risk => codes.add(risk.code));
      const snapshot = JSON.stringify(result);
      const shown = readinessPresentation(result, "en", topics)!;
      expect(JSON.stringify({ headline: shown.headline, risks: shown.risks, sprint: shown.sprint })).not.toMatch(/[\u3400-\u9fff]/u);
      expect(withoutDisplay(shown)).toEqual(withoutDisplay(result));
      expect(shown.privateFixture).toBe(result.privateFixture);
      expect(shown.evidence).toBe(result.evidence);
      expect(JSON.stringify(result)).toBe(snapshot);
      expect(readinessPresentation(result, "zh-CN", topics)).toBe(result);
    }
    expect([...codes]).toEqual(expect.arrayContaining(["mock-evidence", "coverage", "weak-topic", "consistency", "completion", "pacing", "stale", "remediation"]));
    expect(readinessPresentation(null, "en", topics)).toBeNull();
  });
});
