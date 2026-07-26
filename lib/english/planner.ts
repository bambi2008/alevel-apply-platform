export type IeltsSkill = "listening" | "reading" | "writing" | "speaking";

export type IeltsScores = Record<IeltsSkill, number>;

export interface IeltsTarget {
  overall: number;
  component: number;
}

export interface IeltsReadiness {
  overall: number;
  ready: boolean;
  componentGaps: Record<IeltsSkill, number>;
  belowTarget: IeltsSkill[];
  weakest: IeltsSkill;
  overallGap: number;
  recommendation: "ready" | "verify-one-skill-retake" | "full-retake";
}

export interface IeltsTimeline {
  daysToTest: number | null;
  daysFromTestToDeadline: number | null;
  warning: "none" | "test-date-passed" | "result-window-tight";
}

const SKILLS: IeltsSkill[] = ["listening", "reading", "writing", "speaking"];

export function roundIeltsOverall(scores: IeltsScores): number {
  const average = SKILLS.reduce((sum, skill) => sum + scores[skill], 0) / SKILLS.length;
  return Math.round(average * 2) / 2;
}

export function analyseIeltsReadiness(
  scores: IeltsScores,
  target: IeltsTarget,
): IeltsReadiness {
  const overall = roundIeltsOverall(scores);
  const componentGaps = Object.fromEntries(
    SKILLS.map((skill) => [
      skill,
      target.component ? Math.max(0, target.component - scores[skill]) : 0,
    ]),
  ) as Record<IeltsSkill, number>;
  const belowTarget = SKILLS.filter((skill) => componentGaps[skill] > 0);
  const weakest = [...SKILLS].sort((a, b) => scores[a] - scores[b])[0];
  const overallGap = Math.max(0, target.overall - overall);
  const ready = overallGap === 0 && belowTarget.length === 0;

  return {
    overall,
    ready,
    componentGaps,
    belowTarget,
    weakest,
    overallGap,
    recommendation: ready
      ? "ready"
      : overallGap === 0 && belowTarget.length === 1
        ? "verify-one-skill-retake"
        : "full-retake",
  };
}

function dayDifference(from: string, to: string): number | null {
  if (!from || !to) return null;
  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  return Math.ceil((end.getTime() - start.getTime()) / 86_400_000);
}

export function buildIeltsTimeline(
  today: string,
  testDate: string,
  deadline: string,
): IeltsTimeline {
  const daysToTest = dayDifference(today, testDate);
  const daysFromTestToDeadline = dayDifference(testDate, deadline);
  return {
    daysToTest,
    daysFromTestToDeadline,
    warning:
      daysToTest !== null && daysToTest < 0
        ? "test-date-passed"
        : daysFromTestToDeadline !== null && daysFromTestToDeadline < 21
          ? "result-window-tight"
          : "none",
  };
}
