import { PrismaClient } from "@prisma/client";
import { createRequire } from "node:module";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { grantRegistrationTrial, purgeEndedTrialClaims, trialEmailDigest } from "../../lib/membership/trial";
import { canonicalGradeRequest, readStudyAttempt, recordCanonicalGrade, startStudyAttempt, submitStudyAttempt } from "../../lib/tests/study-attempts";
import { buildEmptyGradeResponse } from "../../lib/tests/grading";
import { getReleasedPracticeQuestions } from "../../lib/tests/practice-banks";
import { getMockPapersForTest } from "../../lib/tests/mock-papers";
import { isReleasedPaper } from "../../lib/tests/syllabus-release";
import { createOrder, reconcileNotification, recoverOrder } from "../../lib/payments/orders";
import { addBeijingCalendarMonths } from "../../lib/membership/policy";
import type { PaymentProvider, ProviderOrder } from "../../lib/payments/provider";
import { feedbackAllowance, finishFeedback, releaseFeedback, reserveFeedback } from "../../lib/ai/feedback-quota";
import { runMembershipReminders } from "../../lib/membership/reminders";
import { extendMembership } from "../../lib/payments/admin";

// Never infer a database from .env. This test is opt-in and accepts only our
// disposable, loopback fixture database created by the companion runner.
const fixtureUrl = process.env.MEMBERSHIP_TEST_DATABASE_URL;
if (fixtureUrl) {
  const url = new URL(fixtureUrl);
  if (!["127.0.0.1", "localhost"].includes(url.hostname) || !/^\/qiaoshen_membership_\d+_test$/.test(url.pathname)) throw Error("Unsafe membership fixture database");
}
const client = fixtureUrl ? new PrismaClient({ datasources: { db: { url: fixtureUrl } }, log: [] }) : null;
afterAll(async () => { vi.unstubAllEnvs(); await client?.$disconnect(); });

describe.skipIf(!client)("membership PostgreSQL constraints and transaction boundaries", () => {
  const db = client!;
  const now = new Date("2026-11-03T04:00:00Z");
  const email = "local-learner@example.test";
  beforeEach(async () => {
    vi.stubEnv("TRIAL_PROGRAM_ENABLED", "true");
    vi.stubEnv("TRIAL_PROGRAM_ENDED_AT", "");
    vi.stubEnv("TRIAL_DEDUP_SECRET", "disposable-trial-test-key-not-a-live-secret");
    await db.paymentComplaint.deleteMany({});
    await db.paymentOrder.deleteMany({});
    await db.aiFeedbackSettings.deleteMany({});
    await db.user.deleteMany({});
    await db.trialClaim.deleteMany({});
  });
  it("ignores unknown orders, forged amounts, unsettled and refunded payments", async () => {
    const user = await db.user.create({ data: { email } });
    const { order } = await createOrder({ userId: user.id, requestId: "fake-proof", channel: "alipay", months: 3, priceFen: 39900, testPayment: false }, db);
    const result: ProviderOrder = { chargeId: "charge-a", payway: "alipay", amountFen: 39900, refundAmount: 0, refundState: 0, state: 1, paidAt: null };
    const queryOrder = vi.fn<PaymentProvider["queryOrder"]>();
    const provider = { queryOrder } as unknown as PaymentProvider;
    const event = { type: "charge_succeeded", outTradeNo: order.outTradeNo, amountFen: 39900, chargeId: "charge-a", payway: "alipay" } as const;
    await expect(reconcileNotification({ ...event, outTradeNo: "qs" + "a".repeat(28) }, provider, db)).resolves.toBe(false);
    await expect(reconcileNotification({ ...event, amountFen: 1 }, provider, db)).resolves.toBe(false);
    expect(queryOrder).not.toHaveBeenCalled();
    for (const query of [null, { ...result, amountFen: 1 }, { ...result, state: 0 }, { ...result, refundState: 1 }, { ...result, refundAmount: 1 }]) {
      queryOrder.mockResolvedValueOnce(query);
      await expect(reconcileNotification(event, provider, db)).resolves.toBe(false);
    }
    expect(await db.membership.count()).toBe(0);
    expect((await db.paymentOrder.findUniqueOrThrow({ where: { id: order.id } })).status).toBe("pending");
  });

  it("serializes different paid orders and grants each only once despite concurrent and repeated callbacks", async () => {
    const user = await db.user.create({ data: { email } });
    const baseline = new Date(Date.now() + 86_400_000);
    await db.membership.create({ data: { userId: user.id, plan: "trial", startsAt: new Date(+baseline - 7 * 86_400_000), endsAt: baseline } });
    const inputs = { userId: user.id, channel: "alipay", months: 3, priceFen: 39900, testPayment: false } as const;
    const a = await createOrder({ ...inputs, requestId: "receipt-a" }, db);
    const duplicate = await createOrder({ ...inputs, requestId: "receipt-a" }, db);
    expect(duplicate.created).toBe(false);
    expect(duplicate.order.id).toBe(a.order.id);
    const b = await createOrder({ ...inputs, requestId: "receipt-b" }, db);
    const queryOrder = vi.fn(async (key: string): Promise<ProviderOrder> => ({
      amountFen: 39900, state: 1, refundState: 0, refundAmount: 0, payway: "alipay",
      chargeId: key === a.order.outTradeNo ? "one" : "two", paidAt: null,
    }));
    const provider = { queryOrder } as unknown as PaymentProvider;
    const first = { type: "charge_succeeded", outTradeNo: a.order.outTradeNo, amountFen: 39900, chargeId: "one", payway: "alipay" } as const;
    const second = { ...first, outTradeNo: b.order.outTradeNo, chargeId: "two" };
    expect(await Promise.all([first, first, second, second].map(event => reconcileNotification(event, provider, db)))).toEqual([true, true, true, true]);
    await expect(reconcileNotification(first, provider, db)).resolves.toBe(true);
    expect(await db.paymentOrder.count({ where: { status: "paid" } })).toBe(2);
    expect((await db.membership.findUniqueOrThrow({ where: { userId: user.id } })).endsAt).toEqual(addBeijingCalendarMonths(addBeijingCalendarMonths(baseline, 3), 3));
    await db.user.delete({ where: { id: user.id } });
    expect(await db.paymentOrder.count({ where: { status: "paid", userId: null } })).toBe(2);
  });

  it("claims one recovery query after ten minutes and makes none on repeated polling", async () => {
    const user = await db.user.create({ data: { email } });
    const { order } = await createOrder({ userId: user.id, requestId: "fallback", channel: "wechat", months: 3, priceFen: 39900, testPayment: false }, db);
    const queryOrder = vi.fn(async () => null);
    const provider = { queryOrder } as unknown as PaymentProvider;
    await recoverOrder(order, provider, db, new Date(+order.createdAt + 599_999));
    expect(queryOrder).not.toHaveBeenCalled();
    const later = new Date(+order.createdAt + 600_000);
    await Promise.all([recoverOrder(order, provider, db, later), recoverOrder(order, provider, db, later)]);
    await recoverOrder(order, provider, db, later);
    expect(queryOrder).toHaveBeenCalledTimes(1);
  });

  it("preserves the first feedback of each kind and removes it with the study record", async () => {
    const user = await db.user.create({ data: { email, profile: { create: {} } }, include: { profile: true } });
    const session = await db.examSession.create({ data: {
      studentId: user.profile!.id, testId: "tmua", mode: "practice", totalEarned: 1, totalMax: 1,
    } });
    const row = { sessionId: session.id, kind: "ERROR", reason: "ANSWER" } as const;
    const writes = await Promise.all([
      db.studySessionFeedback.createMany({ data: [row], skipDuplicates: true }),
      db.studySessionFeedback.createMany({ data: [row], skipDuplicates: true }),
    ]);
    expect(writes.reduce((sum, write) => sum + write.count, 0)).toBe(1);
    await expect(db.studySessionFeedback.createMany({ data: [{ ...row, reason: "arbitrary" }] })).rejects.toThrow();
    await db.examSession.delete({ where: { id: session.id } });
    expect(await db.studySessionFeedback.count({ where: { sessionId: session.id } })).toBe(0);
  });
  it("enforces 20/10/3 limits, serves private cached feedback and resets at Beijing midnight", async () => {
    const instant = new Date("2026-11-05T15:59:59Z");
    const owner = await db.user.create({ data: { email, membership: { create: {
      plan: "trial", startsAt: new Date(+instant - 1000), endsAt: new Date(+instant + 86_400_000),
    } } } });
    const other = await db.user.create({ data: { email: "other@example.test", membership: { create: {
      plan: "trial", startsAt: new Date(+instant - 1000), endsAt: new Date(+instant + 86_400_000),
    } } } });
    async function success(kind: "photo" | "statement" | "general", count: number) {
      for (let index = 0; index < count; index++) {
        const reserved = await reserveFeedback({ userId: owner.id, kind, cacheKey: `${kind}:${index}` }, db, instant);
        expect(reserved.state).toBe("reserved");
        if (reserved.state === "reserved") await finishFeedback(reserved.id, { owner: owner.id }, db);
      }
    }
    await success("photo", 10);
    await expect(reserveFeedback({ userId: owner.id, kind: "photo", cacheKey: "new-photo" }, db, instant)).resolves.toEqual({ state: "quota" });
    await success("statement", 3);
    await expect(reserveFeedback({ userId: owner.id, kind: "statement", cacheKey: "new-statement" }, db, instant)).resolves.toEqual({ state: "quota" });
    await success("general", 7);
    await expect(reserveFeedback({ userId: owner.id, kind: "general", cacheKey: "new-general" }, db, instant)).resolves.toEqual({ state: "quota" });
    await expect(reserveFeedback({ userId: owner.id, kind: "photo", cacheKey: "photo:0" }, db, instant)).resolves.toEqual({ state: "cached", output: { owner: owner.id } });
    await expect(reserveFeedback({ userId: other.id, kind: "photo", cacheKey: "photo:0" }, db, instant)).resolves.toMatchObject({ state: "reserved" });
    const midnight = new Date("2026-11-05T16:00:00Z");
    expect((await feedbackAllowance(owner.id, db, midnight)).remaining).toEqual({ total: 20, photo: 10, statement: 3 });
    await db.aiFeedbackSettings.create({ data: { id: "daily", total: 15, photo: 8, statement: 2 } });
    expect((await feedbackAllowance(owner.id, db, midnight)).remaining).toEqual({ total: 15, photo: 8, statement: 2 });
  });

  it("serializes overlapping requests and releases a failed attempt for retry", async () => {
    const user = await db.user.create({ data: { email, membership: { create: {
      plan: "trial", startsAt: new Date(+now - 1000), endsAt: new Date(+now + 86_400_000),
    } } } });
    await db.aiFeedbackSettings.create({ data: { id: "daily", total: 1, photo: 1, statement: 1 } });
    const input = { userId: user.id, kind: "photo" as const, cacheKey: "same-upload" };
    const attempts = await Promise.all([reserveFeedback(input, db, now), reserveFeedback(input, db, now),
      reserveFeedback({ ...input, cacheKey: "another-upload" }, db, now)]);
    expect(attempts.filter(row => row.state === "reserved")).toHaveLength(1);
    const reserved = attempts.find(row => row.state === "reserved")!;
    if (reserved.state !== "reserved") throw Error("missing reservation");
    await releaseFeedback(reserved.id, db);
    expect((await feedbackAllowance(user.id, db, now)).remaining.photo).toBe(1);
    await expect(reserveFeedback(input, db, now)).resolves.toMatchObject({ state: "reserved" });
  });

  it("issues each reminder once and respects email opt-out without suppressing site notifications", async () => {
    const day = new Date("2026-11-05T03:00:00+08:00");
    for (const [index, plan, days, optOut] of [
      [1, "season_pass", 7, false], [2, "season_pass", 1, false],
      [3, "trial", 1, false], [4, "trial", 1, true],
    ] as const) {
      await db.user.create({ data: { email: `reminder-${index}@example.test`, locale: index === 1 ? "en" : "zh-CN",
        membership: { create: { plan, startsAt: new Date(+day - 1000), endsAt: new Date(+day + days * 86_400_000) } },
        notificationPreference: { create: { membershipEmailEnabled: !optOut } },
      } });
    }
    const send = vi.fn(async () => undefined);
    const args = { client: db, email: { isDev: true, send }, origin: "https://example.test", now: day };
    await Promise.all([runMembershipReminders(args), runMembershipReminders(args)]);
    expect(await db.notification.count()).toBe(4);
    expect(send).toHaveBeenCalledTimes(3);
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: "reminder-1@example.test", replyTo: "hello@drforest.ai" }));
    await runMembershipReminders(args);
    expect(send).toHaveBeenCalledTimes(3);
    await runMembershipReminders({ ...args, now: new Date(+day + 6 * 86_400_000) });
    expect(await db.notification.count()).toBe(5);
    expect(send).toHaveBeenCalledTimes(4);
  });

  it("logs manual extensions only for a paid order on the same account and deduplicates retries", async () => {
    const user = await db.user.create({ data: { email } });
    const actor = await db.user.create({ data: { email: "finance@example.test", role: "ADMIN" } });
    const { order } = await createOrder({ userId: user.id, requestId: "support-test", channel: "wechat", months: 3, priceFen: 39900, testPayment: false }, db);
    const input = { actorId: actor.id, userId: user.id, tradeNo: order.outTradeNo, reason: "Customer support correction", months: 2, requestId: "once" };
    await expect(extendMembership(input, db, now)).resolves.toBe(false);
    await db.paymentOrder.update({ where: { id: order.id }, data: { status: "paid" } });
    expect(await Promise.all([extendMembership(input, db, now), extendMembership(input, db, now)])).toEqual([true, true]);
    expect((await db.membership.findUniqueOrThrow({ where: { userId: user.id } })).endsAt).toEqual(addBeijingCalendarMonths(now, 2));
    const audit = await db.auditLog.findMany({ where: { action: "MEMBERSHIP_MANUAL_EXTENSION", actorId: actor.id } });
    expect(audit).toHaveLength(1);
    expect(audit[0].meta).toMatchObject({ orderId: order.id, reason: input.reason });
  });
  it("retains the keyed claim after account cascade deletion, preventing a second grant", async () => {
    const first = await db.user.create({ data: { email } });
    await db.$transaction(tx => grantRegistrationTrial(tx, first.id, email, now));
    await db.user.delete({ where: { id: first.id } });
    expect(await db.membership.count()).toBe(0);
    const claim = await db.trialClaim.findUniqueOrThrow({ where: { emailDigest: trialEmailDigest(email) } });
    expect(Object.keys(claim).sort()).toEqual(["claimedAt", "emailDigest"]);
    const second = await db.user.create({ data: { email } });
    expect(await db.$transaction(tx => grantRegistrationTrial(tx, second.id, email, new Date(+now + 999)))).toBe(false);
    expect(await db.membership.count()).toBe(0);
    expect((await db.trialClaim.findFirstOrThrow()).claimedAt).toEqual(now);
  });
  it("rolls back eligibility along with a failed registration", async () => {
    await expect(db.$transaction(async tx => {
      const user = await tx.user.create({ data: { email } });
      await grantRegistrationTrial(tx, user.id, email, now);
      throw Error("fixture failure after claim");
    })).rejects.toThrow("fixture failure");
    expect(await db.user.count()).toBe(0);
    expect(await db.trialClaim.count()).toBe(0);
    expect(await db.membership.count()).toBe(0);
  });
  it("serializes simultaneous claims at the database unique constraint", async () => {
    const users = await Promise.all(["one", "two", "three"].map(id => db.user.create({ data: { email: `${id}@example.test` } })));
    const results = await Promise.all(users.map(user => db.$transaction(tx => grantRegistrationTrial(tx, user.id, email, now))));
    expect(results.filter(Boolean)).toHaveLength(1);
    expect(await db.trialClaim.count()).toBe(1);
    expect(await db.membership.count()).toBe(1);
  });
  it("purges only after the programme ends, with dry-run as the default", async () => {
    const user = await db.user.create({ data: { email } });
    await db.$transaction(tx => grantRegistrationTrial(tx, user.id, email, now));
    expect(await purgeEndedTrialClaims(db, false, now)).toBe(0);
    vi.stubEnv("TRIAL_PROGRAM_ENABLED", "false");
    vi.stubEnv("TRIAL_PROGRAM_ENDED_AT", now.toISOString());
    expect(await purgeEndedTrialClaims(db, undefined, now)).toBe(1);
    expect(await db.trialClaim.count()).toBe(1);
    expect(await purgeEndedTrialClaims(db, false, now)).toBe(1);
    expect(await db.trialClaim.count()).toBe(0);
    expect(await db.membership.count()).toBe(1);
  });
  it("rejects invalid intervals and identifiers in PostgreSQL itself", async () => {
    const user = await db.user.create({ data: { email } });
    await expect(db.membership.create({ data: { userId: user.id, plan: "trial", startsAt: now, endsAt: now } })).rejects.toThrow();
    await expect(db.trialClaim.create({ data: { emailDigest: email } })).rejects.toThrow();
  });
  async function learner() {
    const user = await db.user.create({ data: { email } });
    await db.$transaction(tx => grantRegistrationTrial(tx, user.id, email, now));
    return user;
  }
  const bank = getReleasedPracticeQuestions("tmua");
  it("requires active membership and rejects cross-exam or unknown selections", async () => {
    const user = await db.user.create({ data: { email } });
    const selection = { mode: "practice" as const, testId: "tmua", questionIds: [bank[0].id], locale: "en" as const };
    await expect(startStudyAttempt(user.id, selection, db, now)).rejects.toMatchObject({ status: 402 });
    await db.$transaction(tx => grantRegistrationTrial(tx, user.id, email, now));
    await expect(startStudyAttempt(user.id, { ...selection, questionIds: ["not-a-released-question"] }, db, now)).rejects.toMatchObject({ status: 400 });
    await expect(startStudyAttempt(user.id, { ...selection, testId: "esat" }, db, now)).rejects.toMatchObject({ status: 400 });
  });
  it("returns no key or solution before submission; another account cannot access the attempt", async () => {
    const user = await learner();
    const attempt = await startStudyAttempt(user.id, { mode: "practice", testId: "tmua", questionIds: [bank[0].id], locale: "en" }, db, now);
    expect(JSON.stringify(attempt)).not.toMatch(/"(answer|matrixAnswer|fullSolution|solutionOutline|solution|optionExplanations|hint)":/);
    const read = await readStudyAttempt(user.id, attempt.id, db, now);
    expect(read.reviewed).toEqual([]);
    await expect(readStudyAttempt("other-user", attempt.id, db, now)).rejects.toMatchObject({ status: 404 });
    await expect(submitStudyAttempt("other-user", attempt.id, { answers: [{ questionId: bank[0].id }], complete: true }, db, now)).rejects.toMatchObject({ status: 404 });
  });
  it("commits the first practice answer, scores on the server and does not overwrite it on retry", async () => {
    const user = await learner();
    const question = bank.find(question => question.type === "mcq")!;
    if (question.type !== "mcq") throw Error("Missing objective fixture");
    const attempt = await startStudyAttempt(user.id, { mode: "practice", testId: "tmua", questionIds: [question.id], locale: "zh-CN" }, db, now);
    await submitStudyAttempt(user.id, attempt.id, { answers: [{ questionId: question.id, selected: question.answer }], complete: false }, db, now);
    const otherChoice = question.options.find(option => option.key !== question.answer)!.key;
    const retry = await submitStudyAttempt(user.id, attempt.id, { answers: [{ questionId: question.id, selected: otherChoice }], complete: true }, db, now);
    expect(retry.reviewed[0].submission).toMatchObject({ selected: question.answer, score: { earned: 1, correct: true } });
    expect(retry.reviewed[0].question).toMatchObject({ answer: question.answer });
    expect(await db.studyAttemptAnswer.count({ where: { attemptId: attempt.id } })).toBe(1);
    expect(retry.reportId).toBeTruthy();
    const report = await db.examSession.findUniqueOrThrow({ where: { id: retry.reportId! }, include: { answers: true } });
    expect(report.totalEarned).toBe(1);
    expect(report.answers[0].selected).toBe(question.answer);
    const secondReceipt = await submitStudyAttempt(user.id, attempt.id, { answers: [], complete: true }, db, now);
    expect(secondReceipt.reportId).toBe(retry.reportId);
    expect(await db.examSession.count()).toBe(1);
    await db.membership.update({ where: { userId: user.id }, data: { endsAt: new Date(+now + 1) } });
    expect((await readStudyAttempt(user.id, attempt.id, db, new Date(+now + 2))).reviewed).toHaveLength(1);
  });
  it("does not reveal a paper module early or permit continued unfinished access after expiry", async () => {
    const user = await learner();
    const paper = getMockPapersForTest("tmua").find(isReleasedPaper)!;
    expect(paper).toBeDefined();
    const attempt = await startStudyAttempt(user.id, { mode: "paper", testId: "tmua", paperId: paper.id, locale: "en" }, db, now);
    expect(JSON.stringify(attempt.paper)).not.toContain('"questions"');
    await expect(submitStudyAttempt(user.id, attempt.id, { answers: [{ questionId: paper.modules[0].questions[0].id }], complete: false }, db, now)).rejects.toMatchObject({ status: 409 });
    expect(await db.studyAttemptAnswer.count()).toBe(0);
    await db.membership.update({ where: { userId: user.id }, data: { endsAt: new Date(+now + 1) } });
    await expect(readStudyAttempt(user.id, attempt.id, db, new Date(+now + 2))).rejects.toMatchObject({ status: 402 });
    await expect(submitStudyAttempt(user.id, attempt.id, { answers: [], complete: true }, db, new Date(+now + 2))).rejects.toMatchObject({ status: 402 });
  });
  it("preserves fractional SJT credit in server-generated historical records", async () => {
    const user = await learner();
    const question = getReleasedPracticeQuestions("ucat").find(q => q.type === "mcq" && q.scoringMode === "adjacent");
    if (!question || question.type !== "mcq") throw Error("Missing SJT fixture");
    const correctIndex = question.options.findIndex(option => option.key === question.answer);
    const selected = question.options[correctIndex ? correctIndex - 1 : correctIndex + 1].key;
    const attempt = await startStudyAttempt(user.id, { mode: "practice", testId: "ucat", questionIds: [question.id], locale: "en" }, db, now);
    const receipt = await submitStudyAttempt(user.id, attempt.id, { answers: [{ questionId: question.id, selected }], complete: true }, db, now);
    const report = await db.examSession.findUniqueOrThrow({ where: { id: receipt.reportId! }, include: { answers: true } });
    expect(report.totalEarnedExact).toBe(0.5);
    expect(report.answers[0].earnedExact).toBe(0.5);
  });
  it("preserves written work while excluding an unmarked answer from an incorrect-score calculation", async () => {
    const user = await learner();
    const question = getReleasedPracticeQuestions("caie9709").find(q => q.type === "long");
    if (!question || question.type !== "long") throw Error("Missing written fixture");
    const work = { [question.parts[0].label]: "My own working, not yet reviewed" };
    const attempt = await startStudyAttempt(user.id, { mode: "practice", testId: "caie9709", questionIds: [question.id], locale: "en" }, db, now);
    const receipt = await submitStudyAttempt(user.id, attempt.id, { answers: [{ questionId: question.id, work }], complete: true }, db, now);
    const report = await db.examSession.findUniqueOrThrow({ where: { id: receipt.reportId! }, include: { answers: true } });
    expect(report.answers[0].work).toEqual(work);
    expect(report.answers[0].max).toBe(0);
    expect(report.clientMeta).toMatchObject({ pendingWrittenQuestionIds: [question.id] });
  });
  it("grades only the owned committed written submission and transitions pending history without rewriting work or dates", async () => {
    const user = await learner();
    const question = getReleasedPracticeQuestions("caie9709").find(q => q.type === "long");
    if (!question || question.type !== "long") throw Error("Missing written fixture");
    const attempt = await startStudyAttempt(user.id, { mode: "practice", testId: "caie9709", questionIds: [question.id], locale: "en" }, db, now);
    const input = { userId: user.id, attemptId: attempt.id, questionId: question.id, locale: "en" };
    await expect(canonicalGradeRequest(input, db, now)).rejects.toMatchObject({ status: 404 });
    const work = { [question.parts[0].label]: "My original working" };
    const receipt = await submitStudyAttempt(user.id, attempt.id, { answers: [{ questionId: question.id, work }], complete: true }, db, now);
    await expect(canonicalGradeRequest({ ...input, userId: "another-user" }, db, now)).rejects.toMatchObject({ status: 404 });
    const canonical = await canonicalGradeRequest(input, db, now);
    expect(canonical.parts[0].studentWork).toBe("My original working");
    expect(canonical.parts[0].marks).toBe(question.parts[0].marks);
    expect(canonical.parts[0].solutionOutline).toBeTruthy();
    const before = await db.studyAttemptAnswer.findFirstOrThrow({ where: { attemptId: attempt.id } });
    const response = buildEmptyGradeResponse(canonical, "en"); // Controlled server-result fixture, no model call.
    expect(await recordCanonicalGrade({ ...input, response }, db)).toBe(true);
    const updated = await db.examSession.findUniqueOrThrow({ where: { id: receipt.reportId! }, include: { answers: true } });
    expect(updated.totalMax).toBe(question.totalMarks);
    expect(updated.clientMeta).toMatchObject({ pendingWrittenQuestionIds: [] });
    expect(updated.answers[0].work).toEqual(work);
    expect(updated.createdAt).toEqual(now);
    expect((await db.studyAttemptAnswer.findUniqueOrThrow({ where: { id: before.id } })).submittedAt).toEqual(before.submittedAt);
    await db.membership.update({ where: { userId: user.id }, data: { endsAt: new Date(+now + 1) } });
    await expect(canonicalGradeRequest(input, db, new Date(+now + 2))).rejects.toMatchObject({ status: 402 });
    await db.user.delete({ where: { id: user.id } });
    expect(await recordCanonicalGrade({ ...input, response }, db)).toBe(false);
    expect(await db.user.count()).toBe(0);
  });
  it("counts the best six STEP answers, retaining every submitted answer in the report", async () => {
    const user = await learner();
    const paper = getMockPapersForTest("step").find(paper => isReleasedPaper(paper) && paper.bestQuestionCount === 6);
    if (!paper) throw Error("Missing choose-six STEP fixture");
    const questions = paper.modules.flatMap(module => module.questions).filter(question => question.type === "long");
    expect(questions.length).toBeGreaterThanOrEqual(7);
    const attempt = await startStudyAttempt(user.id, { mode: "paper", testId: "step", paperId: paper.id, locale: "en" }, db, now);
    const receipt = await submitStudyAttempt(user.id, attempt.id, { complete: true, answers: questions.slice(0, 7).map(question => ({ questionId: question.id, work: { [question.parts[0].label]: `Controlled working for ${question.id}` } })) }, db, now);
    for (const question of questions.slice(0, 7)) {
      const input = { userId: user.id, attemptId: attempt.id, questionId: question.id, locale: "en" };
      const canonical = await canonicalGradeRequest(input, db, now);
      const response = buildEmptyGradeResponse(canonical, "en");
      response.perPart = response.perPart.map(part => ({ ...part, earned: part.max, feedback: "Controlled full-credit fixture" }));
      response.totalEarned = response.totalMax;
      response.assessment.passScores = [response.totalEarned];
      response.assessment.method = "single-pass";
      await recordCanonicalGrade({ ...input, response }, db);
    }
    const report = await db.examSession.findUniqueOrThrow({ where: { id: receipt.reportId! }, include: { answers: true } });
    expect(report.answers).toHaveLength(paper.modules.flatMap(module => module.questions).length);
    const expected = questions.slice(0, 6).reduce((sum, question) => sum + question.totalMarks, 0);
    expect(report.totalEarnedExact).toBe(expected);
    expect(report.totalMax).toBe(expected);
  });
  it.skipIf(!process.env.MEMBERSHIP_LEGACY_CLIENT_MODULE)("keeps the legacy integer contract readable and exact scores intact for forward recovery", async () => {
    const legacy = createRequire(import.meta.url)(process.env.MEMBERSHIP_LEGACY_CLIENT_MODULE!) as { PrismaClient: typeof PrismaClient; Prisma: { dmmf: { datamodel: { models: Array<{ name: string; fields: Array<{ name: string; type: string }> }> } } } };
    expect(legacy.Prisma.dmmf.datamodel.models.find(model => model.name === "ExamAnswer")?.fields.find(field => field.name === "earned")?.type).toBe("Int");
    const oldClient = new legacy.PrismaClient({ datasources: { db: { url: fixtureUrl! } }, log: [] });
    try {
      const user = await learner();
      const profile = await db.studentProfile.create({ data: { userId: user.id } });
      const report = await db.examSession.create({ data: { studentId: profile.id, testId: "ucat", mode: "practice", totalEarned: 0, totalEarnedExact: 0.5, totalMax: 1, answers: { create: [{ questionId: "legacy-read-fixture", type: "mcq", earned: 0, earnedExact: 0.5, max: 1 }] } } });
      const loaded = await oldClient.examSession.findUniqueOrThrow({ where: { id: report.id }, include: { answers: true } });
      expect(loaded.totalEarned).toBe(0);
      expect(loaded.answers[0].earned).toBe(0);
      const recovered = await db.examSession.findUniqueOrThrow({ where: { id: report.id }, include: { answers: true } });
      expect(recovered.totalEarnedExact).toBe(0.5);
      expect(recovered.answers[0].earnedExact).toBe(0.5);
    } finally { await oldClient.$disconnect(); }
  });
});
