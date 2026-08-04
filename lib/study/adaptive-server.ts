import { db } from "@/lib/db";
import { buildAdaptiveProfile, type AdaptiveAnswerObservation } from "@/lib/tests/adaptive";
import { getTestById } from "@/lib/tests";
import { getPracticeQuestionsForTest, getQuestionById } from "@/lib/tests/lookup";
import { getPublishedQuestionsForTest } from "@/lib/tests/published-server";

export async function loadStudentAdaptiveData(studentId: string, testId: string) {
  const test = getTestById(testId);
  if (!test?.hasQuestionBank) return null;

  const [sessions, publishedQuestions] = await Promise.all([db.examSession.findMany({
    where: { studentId, testId },
    orderBy: { completedAt: "asc" },
    select: {
      completedAt: true,
      answers: { select: { questionId: true, earned: true, max: true, timeSpentSec: true } },
    },
  }), getPublishedQuestionsForTest(testId)]);
  const allQuestions = new Map(
    [...getPracticeQuestionsForTest(testId), ...publishedQuestions].map((question) => [question.id, question]),
  );
  const observations: AdaptiveAnswerObservation[] = [];
  for (const session of sessions) {
    for (const answer of session.answers) {
      const question = allQuestions.get(answer.questionId) ?? getQuestionById(answer.questionId);
      if (!question || question.testId !== testId) continue;
      observations.push({
        questionId: answer.questionId,
        topicId: question.topicId,
        difficulty: question.difficulty,
        earned: answer.earned,
        max: answer.max,
        completedAt: session.completedAt,
        timeSpentSec: answer.timeSpentSec,
      });
    }
  }

  const practiceQuestions = [...allQuestions.values()];
  const practiceQuestionIds = new Set(practiceQuestions.map((question) => question.id));
  const profile = buildAdaptiveProfile({ testId, topics: test.topics, answers: observations });
  profile.reviewSchedule = profile.reviewSchedule.filter((review) => practiceQuestionIds.has(review.questionId));
  profile.dueReviews = profile.dueReviews.filter((review) => practiceQuestionIds.has(review.questionId));
  profile.dueReviewCount = profile.dueReviews.length;
  profile.tasks = profile.tasks
    .filter((task) => task.kind !== "review" || profile.dueReviewCount > 0)
    .map((task) => task.kind === "review" ? {
      ...task,
      title: `复习 ${Math.min(10, profile.dueReviewCount)} 道到期题`,
      questionCount: Math.min(10, profile.dueReviewCount),
      href: `/tests/${testId}/practice?adaptive=1&review=1&count=${Math.min(10, profile.dueReviewCount)}`,
    } : task);
  return { test, profile, observations, practiceQuestions };
}
