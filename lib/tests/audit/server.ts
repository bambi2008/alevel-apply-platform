import "server-only";

import { db } from "@/lib/db";
import { getAllQuestionIds } from "@/lib/tests/lookup";
import { buildQuestionBankAudit } from "./index";
import { buildDetailedQuestionCalibrations } from "./calibration";
import type { AttemptObservation, DetailedQuestionCalibration } from "./calibration";

export interface CalibrationDecisionView {
  id: string;
  questionId: string;
  testId: string;
  fromDifficulty: number;
  toDifficulty: number;
  status: "APPROVED" | "DISMISSED" | "ROLLED_BACK";
  note: string | null;
  createdAt: string;
}

export interface QuestionAuditDashboardData {
  report: ReturnType<typeof buildQuestionBankAudit>;
  calibration: DetailedQuestionCalibration[];
  decisions: CalibrationDecisionView[];
  calibrationAvailable: boolean;
  calibrationMessage?: string;
  dataHealth: {
    sessions: number;
    answers: number;
    telemetryAnswers: number;
    uniqueStudents: number;
    coveredTests: number;
    lastAttemptAt: string | null;
  };
  governance: {
    staticQuestions: number;
    certified: number;
    sourceRecorded: number;
    rightsCleared: number;
    dualReviewed: number;
  };
}

export async function getQuestionAuditDashboardData(): Promise<QuestionAuditDashboardData> {
  const report = buildQuestionBankAudit();
  const emptyHealth = { sessions: 0, answers: 0, telemetryAnswers: 0, uniqueStudents: 0, coveredTests: 0, lastAttemptAt: null };
  const staticQuestionIds = new Set(getAllQuestionIds());
  const emptyGovernance = {
    staticQuestions: staticQuestionIds.size,
    certified: 0,
    sourceRecorded: 0,
    rightsCleared: 0,
    dualReviewed: 0,
  };

  try {
    const [rows, decisions, certificates] = await Promise.all([
      db.examAnswer.findMany({
        take: 100_000,
        orderBy: { session: { createdAt: "desc" } },
        select: {
          questionId: true,
          selected: true,
          earned: true,
          max: true,
          timeSpentSec: true,
          answerChanges: true,
          visits: true,
          flagged: true,
          session: {
            select: {
              id: true,
              studentId: true,
              testId: true,
              totalEarned: true,
              totalMax: true,
              createdAt: true,
            },
          },
        },
      }),
      db.calibrationDecision.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
      db.questionDraftRecord.findMany({
        where: { stage: "APPROVED" },
        select: {
          questionId: true,
          sourceTitle: true,
          rightsStatus: true,
          subjectReviewerId: true,
          teachingReviewerId: true,
        },
      }),
    ]);

    // A student's latest response to an item is the calibration sample. This prevents
    // repeated drilling by one learner from overwhelming the population signal.
    const latest = new Map<string, (typeof rows)[number]>();
    for (const row of rows) {
      const key = `${row.session.studentId}:${row.questionId}`;
      if (!latest.has(key)) latest.set(key, row);
    }
    const observations: AttemptObservation[] = [...latest.values()].map((row) => ({
      questionId: row.questionId,
      sessionId: row.session.id,
      studentId: row.session.studentId,
      selected: row.selected,
      earned: row.earned,
      max: row.max,
      timeSpentSec: row.timeSpentSec,
      answerChanges: row.answerChanges,
      visits: row.visits,
      flagged: row.flagged,
      sessionScoreRate: row.session.totalMax > 0 ? row.session.totalEarned / row.session.totalMax : 0,
    }));
    const calibration = buildDetailedQuestionCalibrations(observations);
    const sessions = new Set(rows.map((row) => row.session.id));
    const students = new Set(rows.map((row) => row.session.studentId));
    const tests = new Set(rows.map((row) => row.session.testId));
    const lastAttemptAt = rows[0]?.session.createdAt.toISOString() ?? null;
    const calibrationAvailable = calibration.some((item) => item.status !== "insufficient");
    const currentCertificates = [...certificates
      .filter((record) => staticQuestionIds.has(record.questionId))
      .reduce((latest, record) => {
        if (!latest.has(record.questionId)) latest.set(record.questionId, record);
        return latest;
      }, new Map<string, (typeof certificates)[number]>())
      .values()];

    return {
      report,
      calibration,
      decisions: decisions.map((decision) => ({
        id: decision.id,
        questionId: decision.questionId,
        testId: decision.testId,
        fromDifficulty: decision.fromDifficulty,
        toDifficulty: decision.toDifficulty,
        status: decision.status,
        note: decision.note,
        createdAt: decision.createdAt.toISOString(),
      })),
      calibrationAvailable,
      calibrationMessage: calibrationAvailable
        ? undefined
        : "Difficulty changes remain locked until an item has 30 latest responses from at least 20 students.",
      dataHealth: {
        sessions: sessions.size,
        answers: rows.length,
        telemetryAnswers: rows.filter((row) => row.timeSpentSec !== null).length,
        uniqueStudents: students.size,
        coveredTests: tests.size,
        lastAttemptAt,
      },
      governance: {
        staticQuestions: staticQuestionIds.size,
        certified: new Set(currentCertificates.map((record) => record.questionId)).size,
        sourceRecorded: currentCertificates.filter((record) => record.sourceTitle.trim().length > 0).length,
        rightsCleared: currentCertificates.filter((record) => ["OWNED", "LICENSED"].includes(record.rightsStatus)).length,
        dualReviewed: currentCertificates.filter((record) => Boolean(
          record.subjectReviewerId
          && record.teachingReviewerId
          && record.subjectReviewerId !== record.teachingReviewerId
        )).length,
      },
    };
  } catch {
    return {
      report,
      calibration: [],
      decisions: [],
      calibrationAvailable: false,
      calibrationMessage: "The analytics database is unavailable or still needs the telemetry migration. Static question-bank audit remains active.",
      dataHealth: emptyHealth,
      governance: emptyGovernance,
    };
  }
}
