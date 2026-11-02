import "server-only";
import { hasWrittenResponse } from "./answer-images";
import { db } from "@/lib/db";
import { ADMISSIONS_TESTS } from "@/lib/tests";
import { getReleasedPracticeQuestions } from "./practice-banks";
import { getQuestionById } from "./lookup";
import { feedbackQuestionKey, type QuestionFeedbackKind } from "./question-feedback";
import { buildContentPriorities, PRIORITY_WINDOW_DAYS, type PriorityAttempt, type PriorityFeedback, type PriorityTopic } from "./content-priority";
import { scoreObjectiveAnswer } from "./objective-scoring";

export async function getContentPriorities(now = new Date()) {
  const window = { gte: new Date(now.getTime() - PRIORITY_WINDOW_DAYS * 86_400_000), lt: now };
  const topics: PriorityTopic[] = ADMISSIONS_TESTS.filter(test => test.hasQuestionBank).flatMap(test => {
    const bank = getReleasedPracticeQuestions(test.id);
    return test.topics.map(topic => ({ testId: test.id, topicId: topic.id, title: topic.title, titleEn: topic.titleEn,
      questionCount: new Set(bank.filter(q => q.topicId === topic.id).map(feedbackQuestionKey)).size }));
  });
  // Read only the minimum columns. Snapshot isolation prevents pages from mixing
  // two versions of the same record. No account name/email or IP is queried.
  const { attempts, feedback } = await db.$transaction(async tx => {
    const attempts: PriorityAttempt[] = [], feedback: PriorityFeedback[] = [];
    let cursor: string | undefined;
    do {
      const page = await tx.examAnswer.findMany({
        where: { session: { createdAt: window, student: { user: { role: "STUDENT" } } } },
        orderBy: { id: "asc" }, take: 500, ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        select: { id: true, questionId: true, selected: true, work: true, earned: true, max: true, feedback: true,
          session: { select: { studentId: true, testId: true, createdAt: true } } },
      });
      for (const answer of page) {
        const q = getQuestionById(answer.questionId);
        if (!q || q.testId !== answer.session.testId) continue;
        let wrong: boolean | null = null;
        if (q.type === "mcq") {
          if (!answer.selected || (q.responseMode !== "matrix" && !q.options.some(option => option.key === answer.selected))) continue;
          if (q.responseMode === "matrix" && (!/^[YN-]+$/.test(answer.selected) || !/[YN]/.test(answer.selected))) continue;
          wrong = !scoreObjectiveAnswer(q, answer.selected).correct;
        } else {
          const work = answer.work;
            if (!hasWrittenResponse(work)) continue;
          const uncertain = JSON.stringify(answer.feedback ?? null).includes('"review-recommended"');
          if (!uncertain && answer.max === q.totalMarks && answer.earned >= 0 && answer.earned <= answer.max && answer.feedback !== null) wrong = answer.earned < answer.max;
        }
        attempts.push({ studentKey: answer.session.studentId, testId: q.testId, topicId: q.topicId, questionKey: feedbackQuestionKey(q), createdAt: answer.session.createdAt, wrong });
      }
      cursor = page.length === 500 ? page[page.length - 1].id : undefined;
    } while (cursor);
    cursor = undefined;
    do {
      const page: Array<{ id: string; userId: string; testId: string; topicId: string; questionKey: string; kind: QuestionFeedbackKind; createdAt: Date }> = await tx.questionFeedback.findMany({ where: { createdAt: window, user: { role: "STUDENT" } },
        orderBy: { id: "asc" }, take: 500, ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        select: { id: true, userId: true, testId: true, topicId: true, questionKey: true, kind: true, createdAt: true } });
      feedback.push(...page.map(row => ({ studentKey: row.userId, testId: row.testId, topicId: row.topicId, questionKey: row.questionKey, kind: row.kind, createdAt: row.createdAt })));
      cursor = page.length === 500 ? page[page.length - 1].id : undefined;
    } while (cursor);
    return { attempts, feedback };
  }, { isolationLevel: "RepeatableRead", timeout: 30_000 });
  return buildContentPriorities(topics, attempts, feedback, now);
}
