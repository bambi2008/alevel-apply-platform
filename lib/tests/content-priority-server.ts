import "server-only";
import { hasWrittenResponse } from "./answer-images";
import { db } from "@/lib/db";
import { ADMISSIONS_TESTS } from "@/lib/tests";
import { getReleasedPracticeQuestions } from "./practice-banks";
import { getQuestionById } from "./lookup";
import { getMockPaper } from "./mock-papers";
import { feedbackQuestionKey, type QuestionFeedbackKind } from "./question-feedback";
import { buildContentPriorities, PRIORITY_WINDOW_DAYS, type PriorityAttempt, type PriorityFeedback, type PriorityTopic } from "./content-priority";
import { scoreObjectiveAnswer } from "./objective-scoring";

const paperQuestions = new Map<string, Map<string, NonNullable<ReturnType<typeof getQuestionById>>>>();
function reportQuestion(questionId: string, paperId: string | null) {
  if (!paperId) return getQuestionById(questionId);
  let bank = paperQuestions.get(paperId);
  if (!bank) {
    bank = new Map(getMockPaper(paperId)?.modules.flatMap(module => module.questions.map(question => [question.id, question] as const)));
    if (bank.size) paperQuestions.set(paperId, bank);
  }
  return bank.get(questionId) ?? getQuestionById(questionId);
}

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
        select: { id: true, questionId: true, selected: true, work: true, earned: true, earnedExact: true, max: true, feedback: true,
          session: { select: { studentId: true, testId: true, paperId: true, createdAt: true } } },
      });
      for (const answer of page) {
        const q = reportQuestion(answer.questionId, answer.session.paperId);
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
          const earned = answer.earnedExact ?? answer.earned;
          if (!uncertain && answer.max === q.totalMarks && earned >= 0 && earned <= answer.max && answer.feedback !== null) wrong = earned < answer.max;
        }
        attempts.push({ studentKey: answer.session.studentId, testId: q.testId, topicId: q.topicId, questionKey: feedbackQuestionKey(q), createdAt: answer.session.createdAt, wrong });
      }
      cursor = page.length === 500 ? page[page.length - 1].id : undefined;
    } while (cursor);
    let offset = 0;
    while (true) {
      const page = await tx.studySessionFeedback.findMany({
        where: { createdAt: window, session: { student: { user: { role: "STUDENT" } } } },
        orderBy: [{ sessionId: "asc" }, { kind: "asc" }], take: 500, skip: offset,
        select: { sessionId: true, questionId: true, kind: true, createdAt: true,
          session: { select: { testId: true, paperId: true, studentId: true, answers: { select: { questionId: true } } } } },
      });
      for (const row of page) {
        const ids = row.questionId ? [row.questionId] : row.session.answers.map(answer => answer.questionId);
        const represented = new Set(ids.map(id => reportQuestion(id, row.session.paperId))
          .filter(question => question?.testId === row.session.testId).map(question => question!.topicId));
        for (const topicId of represented) {
          feedback.push({ studentKey: row.session.studentId, testId: row.session.testId, topicId,
            questionKey: `session:${row.sessionId}`, createdAt: row.createdAt, kind: row.kind });
        }
      }
      if (page.length < 500) break;
      offset += page.length;
    }
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
