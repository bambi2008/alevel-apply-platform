import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { buildAdaptiveProfile, selectAdaptiveQuestions, type AdaptiveAnswerObservation } from "@/lib/tests/adaptive";
import { getTestById } from "@/lib/tests";
import { getPracticeQuestionsForTest, getQuestionById } from "@/lib/tests/lookup";

export async function GET(req: NextRequest) {
  const testId = req.nextUrl.searchParams.get("testId") ?? "";
  const test = getTestById(testId);
  if (!test?.hasQuestionBank) return NextResponse.json({ error: "Unknown test" }, { status: 404 });

  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ authenticated: false });

  const profile = await db.studentProfile.findUnique({
    where: { userId },
    select: {
      examSessions: {
        where: { testId },
        orderBy: { completedAt: "asc" },
        select: {
          completedAt: true,
          answers: { select: { questionId: true, earned: true, max: true, timeSpentSec: true } },
        },
      },
    },
  });

  const observations: AdaptiveAnswerObservation[] = [];
  for (const examSession of profile?.examSessions ?? []) {
    for (const answer of examSession.answers) {
      const question = getQuestionById(answer.questionId);
      if (!question || question.testId !== testId) continue;
      observations.push({
        questionId: answer.questionId,
        topicId: question.topicId,
        difficulty: question.difficulty,
        earned: answer.earned,
        max: answer.max,
        completedAt: examSession.completedAt,
        timeSpentSec: answer.timeSpentSec,
      });
    }
  }

  const practiceQuestions = getPracticeQuestionsForTest(testId);
  const practiceQuestionIds = new Set(practiceQuestions.map((question) => question.id));
  const adaptiveProfile = buildAdaptiveProfile({ testId, topics: test.topics, answers: observations });
  adaptiveProfile.reviewSchedule = adaptiveProfile.reviewSchedule.filter((review) => practiceQuestionIds.has(review.questionId));
  adaptiveProfile.dueReviews = adaptiveProfile.dueReviews.filter((review) => practiceQuestionIds.has(review.questionId));
  adaptiveProfile.dueReviewCount = adaptiveProfile.dueReviews.length;
  adaptiveProfile.tasks = adaptiveProfile.tasks
    .filter((task) => task.kind !== "review" || adaptiveProfile.dueReviewCount > 0)
    .map((task) => task.kind === "review" ? {
      ...task,
      title: `复习 ${Math.min(10, adaptiveProfile.dueReviewCount)} 道到期题`,
      questionCount: Math.min(10, adaptiveProfile.dueReviewCount),
      href: `/tests/${testId}/practice?adaptive=1&review=1&count=${Math.min(10, adaptiveProfile.dueReviewCount)}`,
    } : task);
  const requestedCount = Number(req.nextUrl.searchParams.get("count") ?? 15);
  const count = Number.isFinite(requestedCount) ? Math.max(1, Math.min(30, Math.round(requestedCount))) : 15;
  const topicId = req.nextUrl.searchParams.get("topicId") ?? undefined;
  const reviewOnly = req.nextUrl.searchParams.get("review") === "1";
  const format = req.nextUrl.searchParams.get("format") ?? "all";
  const questions = practiceQuestions.filter((question) => {
    if (format === "all") return true;
    if (format === "mcq") return question.type === "mcq";
    const shortProof = question.type === "long" && question.id.startsWith("bmo-sp-");
    return format === "short-proof" ? shortProof : format === "long" && question.type === "long" && !shortProof;
  }).map((question) => ({
    id: question.id,
    topicId: question.topicId,
    difficulty: question.difficulty,
    type: question.type,
  }));
  const recommendedQuestionIds = selectAdaptiveQuestions({
    questions,
    answers: observations,
    profile: adaptiveProfile,
    count,
    topicId,
    reviewOnly,
  });

  return NextResponse.json({ authenticated: true, ...adaptiveProfile, recommendedQuestionIds });
}
