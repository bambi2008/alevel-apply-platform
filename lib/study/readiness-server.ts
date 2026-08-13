import { db } from "@/lib/db";
import { getMockPaper } from "@/lib/tests/mock-papers";
import { buildExamReadiness, type ReadinessAttempt } from "@/lib/tests/readiness";
import { buildRemediationProfile } from "@/lib/tests/remediation";
import { loadStudentAdaptiveData } from "@/lib/study/adaptive-server";

function hasLongResponse(work: unknown) {
  if (!work || typeof work !== "object" || Array.isArray(work)) return false;
  return Object.values(work).some((value) => typeof value === "string" && value.trim().length > 0);
}

export async function loadStudentReadiness(studentId: string, testId: string) {
  const adaptive = await loadStudentAdaptiveData(studentId, testId);
  if (!adaptive) return null;

  const [sessions, goal] = await Promise.all([
    db.examSession.findMany({
      where: { studentId, testId },
      orderBy: { completedAt: "asc" },
      select: {
        id: true,
        mode: true,
        paperId: true,
        totalEarned: true,
        totalMax: true,
        timeUsedSec: true,
        completedAt: true,
        answers: { select: { type: true, selected: true, work: true } },
      },
    }),
    db.studyGoal.findUnique({
      where: { studentId_testId: { studentId, testId } },
      select: { targetDate: true, targetLevel: true, weeklyMinutes: true, active: true },
    }),
  ]);

  const attempts: ReadinessAttempt[] = sessions.map((session) => {
    const paper = session.paperId ? getMockPaper(session.paperId) : undefined;
    const plannedSec = paper?.modules.reduce((sum, module) => sum + module.durationSec, 0) ?? null;
    const completed = session.answers.filter((answer) => (
      answer.type === "long" ? hasLongResponse(answer.work) : Boolean(answer.selected)
    )).length;
    return {
      id: session.id,
      mode: session.mode,
      paperId: session.paperId,
      scorePercent: session.totalMax > 0 ? Math.round((session.totalEarned / session.totalMax) * 100) : 0,
      completionPercent: session.answers.length ? Math.round((completed / session.answers.length) * 100) : 0,
      timeRatio: plannedSec && session.timeUsedSec ? session.timeUsedSec / plannedSec : null,
      completedAt: session.completedAt,
    };
  });

  const remediation = buildRemediationProfile({ answers: adaptive.observations });
  const readiness = buildExamReadiness({
    testId,
    adaptive: adaptive.profile,
    attempts,
    remediation,
  });
  return {
    ...readiness,
    remediation: {
      activeCount: remediation.activeCount,
      dueCount: remediation.dueCount,
      recoveredCount: remediation.recoveredCount,
      verifiedCount: remediation.verifiedCount,
      relapsedCount: remediation.relapsedCount,
      recoveryRate: remediation.recoveryRate,
    },
    goal: goal?.active ? {
      targetDate: goal.targetDate.toISOString().slice(0, 10),
      targetLevel: goal.targetLevel,
      weeklyMinutes: goal.weeklyMinutes,
      daysRemaining: Math.max(0, Math.ceil((goal.targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))),
    } : null,
  };
}
