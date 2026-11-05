import { Prisma, type PrismaClient, type StudyAttempt } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { isMembershipActive } from "@/lib/membership/policy";
import { getReleasedPracticeQuestions } from "./practice-banks";
import { getMockPaper } from "./mock-papers";
import { getQuestionById } from "./lookup";
import { isReleasedPaper } from "./syllabus-release";
import { questionForDelivery } from "./delivery-projection";
import { localizeStaticContent } from "../content-language";
import { englishPaperPresentation } from "./english-presentation";
import { scoreObjectiveAnswer } from "./objective-scoring";
import type { Question } from "./questions/types";
import type { SubmittedAnswer } from "./delivery-types";
import type { GradeRequest, GradeResponse } from "./grading";
import { getCountedResults } from "./mock-papers/scoring";

type StoredSubmission = SubmittedAnswer & { grading?: GradeResponse };

export const startAttemptSchema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("practice"), testId: z.string().min(1).max(40), questionIds: z.array(z.string().min(1).max(120)).min(1).max(30), locale: z.enum(["zh-CN", "en"]).default("zh-CN") }).strict(),
  z.object({ mode: z.literal("paper"), testId: z.string().min(1).max(40), paperId: z.string().min(1).max(120), locale: z.enum(["zh-CN", "en"]).default("zh-CN") }).strict(),
]);
export const submitAttemptSchema = z.object({
  complete: z.boolean().default(false),
  answers: z.array(z.object({
    questionId: z.string().min(1).max(120), selected: z.string().max(40).optional(),
    work: z.record(z.string().max(30), z.string().max(30_000)).optional(),
    answerImageIds: z.record(z.string().max(30), z.array(z.string().min(1).max(64)).max(4)).optional(),
    selectedPromptId: z.string().max(120).optional(),
    telemetry: z.object({ timeSpentSec: z.number().int().min(0).max(86400).optional(), answerChanges: z.number().int().min(0).max(10000), visits: z.number().int().min(1).max(10000), flagged: z.boolean(), firstSelected: z.string().max(40).optional() }).strict().optional(),
  }).strict()).max(300),
}).strict();

export class StudyAccessError extends Error {
  constructor(public readonly code: "membership_required" | "trial_expired" | "not_found" | "invalid_selection" | "submit_whole_paper" | "already_submitted", public readonly status: number) { super(code); }
}

async function assertActive(client: Pick<Prisma.TransactionClient, "membership">, userId: string, now: Date) {
  const membership = await client.membership.findUnique({ where: { userId } });
  if (!isMembershipActive(membership, now)) throw new StudyAccessError(membership?.plan === "trial" ? "trial_expired" : "membership_required", 402);
}

function canonicalQuestions(attempt: Pick<StudyAttempt, "paperId" | "testId" | "questionIds">): Question[] {
  const paper = attempt.paperId ? getMockPaper(attempt.paperId) : null;
  const paperQuestions = new Map(paper?.modules.flatMap(module => module.questions.map(question => [question.id, question] as const)));
  const practice = attempt.paperId ? null : new Map(getReleasedPracticeQuestions(attempt.testId).map(question => [question.id, question]));
  const questions = attempt.questionIds.map(id => attempt.paperId ? paperQuestions.get(id) : practice?.get(id) ?? getQuestionById(id));
  if (questions.some(question => !question || question.testId !== attempt.testId)) throw new StudyAccessError("not_found", 404);
  return questions as Question[];
}

export async function startStudyAttempt(userId: string, input: z.infer<typeof startAttemptSchema>, client: PrismaClient = db, now = new Date()) {
  let questions: Question[];
  if (input.mode === "paper") {
    const paper = getMockPaper(input.paperId);
    if (!paper || paper.testId !== input.testId || !isReleasedPaper(paper)) throw new StudyAccessError("invalid_selection", 400);
    questions = paper.modules.flatMap(module => module.questions);
  } else {
    const bank = new Map(getReleasedPracticeQuestions(input.testId).map(question => [question.id, question]));
    if (new Set(input.questionIds).size !== input.questionIds.length || input.questionIds.some(id => !bank.has(id))) throw new StudyAccessError("invalid_selection", 400);
    questions = input.questionIds.map(id => bank.get(id)!);
  }
  if (!questions.length || questions.length > 300) throw new StudyAccessError("invalid_selection", 400);
  const attempt = await client.$transaction(async tx => {
    await assertActive(tx, userId, now);
    return tx.studyAttempt.create({ data: {
      userId, testId: input.testId, mode: input.mode, paperId: input.mode === "paper" ? input.paperId : null,
      locale: input.locale, questionIds: questions.map(question => question.id), startedAt: now,
    } });
  });
  return deliveryResponse(attempt, questions);
}

function deliveryResponse(attempt: StudyAttempt, questions: Question[]) {
  const shown = localizeStaticContent(questions.map(questionForDelivery), attempt.locale);
  const paper = attempt.paperId ? getMockPaper(attempt.paperId) : null;
  const presentation = paper ? englishPaperPresentation(paper, attempt.locale) : null;
  // Explicit metadata projection. Spreading a complete paper here would bypass
  // the question allowlist through paper.modules[*].questions.
  return {
    id: attempt.id, testId: attempt.testId, mode: attempt.mode, startedAt: attempt.startedAt,
    completedAt: attempt.completedAt, reportId: attempt.reportId, questions: shown,
    paper: presentation ? {
      id: presentation.id, title: presentation.title, titleEn: presentation.titleEn,
      description: presentation.description, instructions: presentation.instructions,
      bestQuestionCount: presentation.bestQuestionCount, formatType: presentation.formatType,
      modules: presentation.modules.map(module => ({ id: module.id, title: module.title, titleEn: module.titleEn,
        durationSec: module.durationSec, questionIds: module.questions.map(question => question.id) })),
    } : null,
  };
}

export async function readStudyAttempt(userId: string, id: string, client: PrismaClient = db, now = new Date()) {
  const attempt = await client.studyAttempt.findFirst({ where: { id, userId }, include: { answers: true } });
  if (!attempt) throw new StudyAccessError("not_found", 404);
  // Completed reports remain readable after expiry. An unfinished attempt does
  // not provide an alternative route around current membership checks.
  if (!attempt.completedAt) await assertActive(client, userId, now);
  const questions = canonicalQuestions(attempt);
  return { ...deliveryResponse(attempt, questions), reviewed: attempt.answers.map(answer => {
    const question = questions.find(question => question.id === answer.questionId)!;
    return { question: localizeStaticContent(question, attempt.locale), submission: answer.submission };
  }) };
}

export async function submitStudyAttempt(userId: string, id: string, input: z.infer<typeof submitAttemptSchema>, client: PrismaClient = db, now = new Date()) {
  return client.$transaction(async tx => {
    // Locks are scoped by owner. Concurrent retries cannot replace the first
    // answer after its solution has already been revealed.
    const rows = await tx.$queryRaw<Array<{ id: string }>>(Prisma.sql`SELECT "id" FROM "StudyAttempt" WHERE "id" = ${id} AND "userId" = ${userId} FOR UPDATE`);
    if (!rows.length) throw new StudyAccessError("not_found", 404);
    const attempt = await tx.studyAttempt.findUniqueOrThrow({ where: { id }, include: { answers: true } });
    const questions = canonicalQuestions(attempt);
    if (input.answers.some(answer => !attempt.questionIds.includes(answer.questionId)) || new Set(input.answers.map(answer => answer.questionId)).size !== input.answers.length) throw new StudyAccessError("invalid_selection", 400);
    if (attempt.completedAt) {
      // A read-only retry of a completed attempt cannot alter prior work.
      return { id, completedAt: attempt.completedAt, reportId: attempt.reportId, reviewed: attempt.answers.map(answer => ({ question: localizeStaticContent(questions.find(q => q.id === answer.questionId)!, attempt.locale), submission: answer.submission })) };
    }
    await assertActive(tx, userId, now);
    if (attempt.mode === "paper" && !input.complete) throw new StudyAccessError("submit_whole_paper", 409);
    const byId = new Map(input.answers.map(answer => [answer.questionId, answer]));
    const toCommit = input.complete ? questions.map(question => byId.get(question.id) ?? { questionId: question.id }) : input.answers;
    const imageIds = [...new Set(toCommit.flatMap(answer => Object.values(answer.answerImageIds ?? {}).flat()))];
    if (imageIds.length && await tx.answerImage.count({ where: { id: { in: imageIds }, ownerId: userId } }) !== imageIds.length) throw new StudyAccessError("invalid_selection", 400);
    for (const answer of toCommit) {
      const question = questions.find(question => question.id === answer.questionId)!;
      if (question.type === "mcq" && answer.selected && (question.responseMode === "matrix"
        ? !/^[YN-]+$/.test(answer.selected) || answer.selected.length !== question.statements?.length
        : !question.options.some(option => option.key === answer.selected))) throw new StudyAccessError("invalid_selection", 400);
      if (question.type === "long" && [...Object.keys(answer.work ?? {}), ...Object.keys(answer.answerImageIds ?? {})].some(label => !question.parts.some(part => part.label === label))) throw new StudyAccessError("invalid_selection", 400);
      if (answer.selectedPromptId && (question.type !== "long" || !question.essayPrompts?.some(prompt => prompt.id === answer.selectedPromptId))) throw new StudyAccessError("invalid_selection", 400);
      if (question.type === "long") {
        const words = Object.values(answer.work ?? {}).join(" ").trim().split(/\s+/).filter(Boolean).length;
        const imageCount = Object.values(answer.answerImageIds ?? {}).reduce((sum, ids) => sum + ids.length, 0);
        if (imageCount > 8 || (question.responseKind === "essay" && (imageCount > 0 || (words > 0 && question.essayPrompts?.length && !answer.selectedPromptId) || words > (question.maxWords ?? Infinity)))) throw new StudyAccessError("invalid_selection", 400);
      }
      const score = question.type === "mcq" ? scoreObjectiveAnswer(question, answer.selected) : null;
      await tx.studyAttemptAnswer.createMany({ data: [{ attemptId: id, questionId: question.id, submission: { ...answer, score } as Prisma.InputJsonValue }], skipDuplicates: true });
    }
    const completedAt = input.complete ? now : null;
    let reportId: string | null = null;
    if (completedAt) {
      reportId = await createCanonicalReport(tx, attempt, questions, now);
      await tx.studyAttempt.update({ where: { id }, data: { completedAt, reportId } });
    }
    const committed = await tx.studyAttemptAnswer.findMany({ where: { attemptId: id, ...(input.complete ? {} : { questionId: { in: input.answers.map(answer => answer.questionId) } }) } });
    return { id, completedAt, reportId, reviewed: committed.map(answer => ({ question: localizeStaticContent(questions.find(question => question.id === answer.questionId)!, attempt.locale), submission: answer.submission })) };
  }, { timeout: 30_000 });
}

/** The grader receives the stored first submission and canonical mark scheme,
 * never question text, marking criteria or student work supplied to this API. */
export async function canonicalGradeRequest(input: { userId: string; attemptId: string; questionId: string; locale: string; reviewMode?: "standard" | "adjudicate" }, client: PrismaClient = db, now = new Date()): Promise<GradeRequest> {
  const attempt = await client.studyAttempt.findFirst({ where: { id: input.attemptId, userId: input.userId }, include: { answers: { where: { questionId: input.questionId } } } });
  if (!attempt || !attempt.questionIds.includes(input.questionId) || attempt.answers.length !== 1 || (attempt.mode === "paper" && !attempt.completedAt)) throw new StudyAccessError("not_found", 404);
  await assertActive(client, input.userId, now);
  const original = canonicalQuestions(attempt).find(question => question.id === input.questionId);
  if (!original || original.type !== "long") throw new StudyAccessError("invalid_selection", 400);
  const question = localizeStaticContent(original, input.locale);
  const answer = attempt.answers[0].submission as unknown as SubmittedAnswer;
  const prompt = question.essayPrompts?.find(prompt => prompt.id === answer.selectedPromptId);
  return {
    questionId: question.id, testId: question.testId,
    questionContext: [question.context, prompt ? `Selected prompt: ${prompt.title}` : ""].filter(Boolean).join("\n\n"),
    parts: question.parts.map(part => ({ label: part.label, question: prompt ? `${part.question}\nSelected prompt: ${prompt.title}` : part.question,
      marks: part.marks, solutionOutline: part.solutionOutline, studentWork: answer.work?.[part.label] ?? "", answerImageIds: answer.answerImageIds?.[part.label] })),
    fullSolution: question.fullSolution, responseKind: question.responseKind,
    rubricDimensions: question.rubricDimensions, reviewMode: input.reviewMode,
  };
}

async function createCanonicalReport(tx: Prisma.TransactionClient, attempt: StudyAttempt, questions: Question[], now: Date): Promise<string> {
  const committed = await tx.studyAttemptAnswer.findMany({ where: { attemptId: attempt.id } });
  const byId = new Map(committed.map(answer => [answer.questionId, answer.submission as unknown as StoredSubmission]));
  const pendingWritten: string[] = [];
  const answers = questions.map(question => {
    const answer: StoredSubmission = byId.get(question.id) ?? { questionId: question.id };
    const objective = question.type === "mcq" ? scoreObjectiveAnswer(question, answer.selected) : null;
    const grading = question.type === "long" ? answer.grading : undefined;
    const pending = question.type === "long" && !grading && (Object.values(answer.work ?? {}).some(text => text.trim()) || Object.values(answer.answerImageIds ?? {}).some(ids => ids.length));
    if (pending) pendingWritten.push(question.id);
    const work = question.type === "long" ? {
      ...answer.work,
      ...(answer.selectedPromptId ? { __selectedPrompt: answer.selectedPromptId } : {}),
      ...(answer.answerImageIds && Object.values(answer.answerImageIds).some(ids => ids.length)
        ? { __answerImageIds: JSON.stringify(answer.answerImageIds) } : {}),
    } : undefined;
    return {
      questionId: question.id, type: question.type, selected: answer.selected,
      timeSpentSec: answer.telemetry?.timeSpentSec, answerChanges: answer.telemetry?.answerChanges ?? 0,
      visits: answer.telemetry?.visits ?? 1, flagged: answer.telemetry?.flagged ?? false, firstSelected: answer.telemetry?.firstSelected,
      work,
      earned: Math.floor(objective?.earned ?? grading?.totalEarned ?? 0), earnedExact: objective?.earned ?? grading?.totalEarned ?? 0,
      // Pending written answers carry no assigned mark. This avoids counting
      // unavailable AI feedback as an incorrect answer in editorial metrics.
      max: objective?.max ?? grading?.totalMax ?? (pending ? 0 : question.type === "long" ? question.totalMarks : 0),
      feedback: grading ? grading.perPart.map(part => ({ ...part, assessment: grading.assessment })) as unknown as Prisma.InputJsonValue : undefined,
    };
  });
  const profile = await tx.studentProfile.upsert({ where: { userId: attempt.userId }, update: {}, create: { userId: attempt.userId }, select: { id: true } });
  const report = await tx.examSession.create({ data: {
    studentId: profile.id, testId: attempt.testId, mode: attempt.mode, paperId: attempt.paperId,
    startedAt: attempt.startedAt, completedAt: now, createdAt: now,
    timeUsedSec: Math.max(0, Math.min(86400, Math.round((+now - +attempt.startedAt) / 1000))),
    ...canonicalTotals(answers, attempt.paperId ? getMockPaper(attempt.paperId)?.bestQuestionCount : undefined),
    clientMeta: { source: "server-study-attempt-v1", attemptId: attempt.id, pendingWrittenQuestionIds: pendingWritten },
    answers: { create: answers },
  }, select: { id: true } });
  await tx.learningEvent.create({ data: {
    studentId: profile.id, type: attempt.mode === "practice" ? "PRACTICE_COMPLETED" : "MOCK_COMPLETED",
    eventKey: `server-attempt-completed:${attempt.id}`, testId: attempt.testId, sessionId: report.id,
  } });
  return report.id;
}

/** Persist a trusted server grade without changing the original submission time
 * or work. Account deletion during a provider call never recreates its records. */
export async function recordCanonicalGrade(input: { userId: string; attemptId: string; questionId: string; response: GradeResponse }, client: PrismaClient = db): Promise<boolean> {
  return client.$transaction(async tx => {
    const rows = await tx.$queryRaw<Array<{ id: string }>>(Prisma.sql`SELECT "id" FROM "StudyAttempt" WHERE "id" = ${input.attemptId} AND "userId" = ${input.userId} FOR UPDATE`);
    if (!rows.length) return false;
    const attempt = await tx.studyAttempt.findUniqueOrThrow({ where: { id: input.attemptId }, include: { answers: { where: { questionId: input.questionId } } } });
    if (attempt.answers.length !== 1 || !attempt.questionIds.includes(input.questionId)) return false;
    const question = canonicalQuestions(attempt).find(question => question.id === input.questionId);
    const response = input.response;
    if (question?.type !== "long" || response.questionId !== question.id || response.totalMax !== question.totalMarks || !Number.isFinite(response.totalEarned) || response.totalEarned < 0 || response.totalEarned > question.totalMarks) throw new StudyAccessError("invalid_selection", 400);
    if (response.perPart.length !== question.parts.length || new Set(response.perPart.map(part => part.label)).size !== question.parts.length
      || response.perPart.some(part => { const canonical = question.parts.find(item => item.label === part.label); return !canonical || part.max !== canonical.marks || !Number.isFinite(part.earned) || part.earned < 0 || part.earned > canonical.marks; })
      || response.perPart.reduce((sum, part) => sum + part.earned, 0) !== response.totalEarned) throw new StudyAccessError("invalid_selection", 400);
    const answer = attempt.answers[0];
    const original = answer.submission as unknown as StoredSubmission;
    await tx.studyAttemptAnswer.update({ where: { id: answer.id }, data: { submission: { ...original, grading: response } as unknown as Prisma.InputJsonValue } });
    if (!attempt.reportId) return true;
    const report = await tx.examSession.findFirst({ where: { id: attempt.reportId, student: { userId: input.userId } } });
    if (!report) return true;
    await tx.examAnswer.updateMany({ where: { sessionId: report.id, questionId: question.id }, data: {
      earned: Math.floor(response.totalEarned), earnedExact: response.totalEarned, max: response.totalMax,
      feedback: response.perPart.map(part => ({ ...part, assessment: response.assessment })) as unknown as Prisma.InputJsonValue,
    } });
    const answers = await tx.examAnswer.findMany({ where: { sessionId: report.id }, select: { earned: true, earnedExact: true, max: true } });
    const metadata = report.clientMeta && typeof report.clientMeta === "object" && !Array.isArray(report.clientMeta) ? report.clientMeta : {};
    const pending = Array.isArray(metadata.pendingWrittenQuestionIds) ? metadata.pendingWrittenQuestionIds.filter(id => id !== question.id) : [];
    await tx.examSession.update({ where: { id: report.id }, data: {
      ...canonicalTotals(answers, attempt.paperId ? getMockPaper(attempt.paperId)?.bestQuestionCount : undefined),
      clientMeta: { ...metadata, pendingWrittenQuestionIds: pending } as Prisma.InputJsonValue,
    } });
    return true;
  });
}

function canonicalTotals(answers: Array<{ earned: number; earnedExact?: number | null; max: number }>, bestQuestionCount?: number) {
  const counted = getCountedResults(answers.filter(answer => answer.max > 0).map(answer => ({ grading: { totalEarned: answer.earnedExact ?? answer.earned, totalMax: answer.max } })), bestQuestionCount);
  const exact = counted.reduce((sum, row) => sum + (row.grading?.totalEarned ?? 0), 0);
  return { totalEarned: Math.floor(exact), totalEarnedExact: exact, totalMax: counted.reduce((sum, row) => sum + (row.grading?.totalMax ?? 0), 0) };
}
