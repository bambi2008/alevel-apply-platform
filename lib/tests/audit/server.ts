import "server-only";

import { db } from "@/lib/db";
import { buildQuestionBankAudit } from "./index";
import { calibrateQuestionDifficulty } from "./calibration";
import type { AttemptAggregate, QuestionCalibration } from "./calibration";

export interface QuestionAuditDashboardData {
  report: ReturnType<typeof buildQuestionBankAudit>;
  calibration: QuestionCalibration[];
  calibrationAvailable: boolean;
  calibrationMessage?: string;
}

export async function getQuestionAuditDashboardData(): Promise<QuestionAuditDashboardData> {
  const report = buildQuestionBankAudit();

  try {
    const rows = await db.examAnswer.groupBy({
      by: ["questionId"],
      where: { session: { testId: "tmua" } },
      _count: { _all: true },
      _sum: { earned: true, max: true },
    });
    const aggregates: AttemptAggregate[] = rows.map((row) => ({
      questionId: row.questionId,
      attempts: row._count._all,
      earned: row._sum.earned ?? 0,
      max: row._sum.max ?? 0,
    }));

    return {
      report,
      calibration: calibrateQuestionDifficulty(aggregates),
      calibrationAvailable: aggregates.some((aggregate) => aggregate.attempts >= 10),
      calibrationMessage: aggregates.some((aggregate) => aggregate.attempts >= 10)
        ? undefined
        : "TMUA difficulty labels remain expert-calibrated until at least one question has 10 valid attempts.",
    };
  } catch {
    return {
      report,
      calibration: [],
      calibrationAvailable: false,
      calibrationMessage: "答题数据库当前不可用，静态题库审计仍然有效。",
    };
  }
}
