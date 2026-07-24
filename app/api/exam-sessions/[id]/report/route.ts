import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getQuestionById, getTopicMeta } from "@/lib/tests/lookup";
import { getMockPaper } from "@/lib/tests/mock-papers";
import {
  buildExamPerformanceReport,
  type ReportAnswer,
  type ReportModuleDefinition,
  type ReportSession,
} from "@/lib/tests/report";
import type { GradeAssessment, GradeEvidence } from "@/lib/tests/grading";

function stringRecord(value: unknown): Record<string, string> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
}

function feedbackRows(value: unknown): ReportAnswer["feedback"] {
  if (!Array.isArray(value)) return null;
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    const assessment = row.assessment && typeof row.assessment === "object"
      ? row.assessment as GradeAssessment
      : undefined;
    const evidence = Array.isArray(row.evidence)
      ? row.evidence.flatMap((entry): GradeEvidence[] => {
          if (!entry || typeof entry !== "object") return [];
          const item = entry as Record<string, unknown>;
          if (
            typeof item.criterion !== "string"
            || !["met", "partial", "missing"].includes(String(item.status))
            || typeof item.marksAwarded !== "number"
          ) return [];
          return [{
            criterion: item.criterion,
            status: item.status as GradeEvidence["status"],
            quote: typeof item.quote === "string" ? item.quote : undefined,
            marksAwarded: item.marksAwarded,
          }];
        })
      : undefined;
    return [{
      label: typeof row.label === "string" ? row.label : undefined,
      earned: typeof row.earned === "number" ? row.earned : undefined,
      max: typeof row.max === "number" ? row.max : undefined,
      feedback: typeof row.feedback === "string" ? row.feedback : undefined,
      keyStepsFound: Array.isArray(row.keyStepsFound)
        ? row.keyStepsFound.filter((step): step is string => typeof step === "string")
        : undefined,
      keyStepsMissing: Array.isArray(row.keyStepsMissing)
        ? row.keyStepsMissing.filter((step): step is string => typeof step === "string")
        : undefined,
      evidence,
      assessment,
    }];
  });
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await db.studentProfile.findUnique({ where: { userId }, select: { id: true } });
  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const current = await db.examSession.findFirst({
    where: { id, studentId: profile.id },
    include: { answers: true },
  });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const history = await db.examSession.findMany({
    where: { studentId: profile.id, testId: current.testId },
    orderBy: { completedAt: "desc" },
    take: 30,
    select: {
      id: true,
      mode: true,
      paperId: true,
      totalEarned: true,
      totalMax: true,
      completedAt: true,
    },
  });
  const answers: ReportAnswer[] = current.answers.map((answer) => ({
    questionId: answer.questionId,
    type: answer.type,
    selected: answer.selected,
    work: stringRecord(answer.work),
    earned: answer.earned,
    max: answer.max,
    feedback: feedbackRows(answer.feedback),
    timeSpentSec: answer.timeSpentSec,
    answerChanges: answer.answerChanges,
    visits: answer.visits,
    flagged: answer.flagged,
    firstSelected: answer.firstSelected,
  }));
  const reportSession: ReportSession = {
    id: current.id,
    testId: current.testId,
    mode: current.mode,
    paperId: current.paperId,
    presetId: current.presetId,
    totalEarned: current.totalEarned,
    totalMax: current.totalMax,
    timeUsedSec: current.timeUsedSec,
    completedAt: current.completedAt,
    answers,
  };
  const questions = answers.flatMap((answer) => {
    const question = getQuestionById(answer.questionId);
    return question ? [question] : [];
  });
  const paper = current.paperId ? getMockPaper(current.paperId) : undefined;
  const modules: ReportModuleDefinition[] | undefined = paper?.modules.map((module) => ({
    id: module.id,
    title: module.title,
    questionIds: module.questions.map((question) => question.id),
    durationSec: module.durationSec,
  }));
  const report = buildExamPerformanceReport({
    session: reportSession,
    history,
    questions,
    topicMeta: (topicId) => getTopicMeta(current.testId, topicId),
    modules,
  });

  return NextResponse.json({
    session: {
      id: current.id,
      testId: current.testId,
      mode: current.mode,
      totalEarned: current.totalEarned,
      totalMax: current.totalMax,
      timeUsedSec: current.timeUsedSec,
      paperId: current.paperId,
      presetId: current.presetId,
      startedAt: current.startedAt,
      completedAt: current.completedAt,
      createdAt: current.createdAt,
      answers,
    },
    report,
  });
}
