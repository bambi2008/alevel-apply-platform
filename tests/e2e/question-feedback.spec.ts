import { test, expect, type Page } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFile } from "node:fs/promises";
import { getReleasedPracticeQuestions } from "../../lib/tests/practice-banks";
import { feedbackQuestionKey } from "../../lib/tests/question-feedback";
import { runStudyRetention } from "../../lib/data-retention";
import { getStorage } from "../../lib/storage";

const db = new PrismaClient({ log: [] });
// Cold development-route compilation is not a production latency measurement.
test.setTimeout(240_000);
const password = "FixtureFeedback!2026";
const first = getReleasedPracticeQuestions("tmua").find(q => q.type === "mcq")!;
const emails: string[] = [];
let adminEmail: string, historyId: string, studentId: string, adminId: string;
async function login(page: Page, email: string) {
  await page.goto("/zh-CN/login", { waitUntil: "domcontentloaded" });
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole("button", { name: "登录", exact: true }).click();
  // The first login also cold-compiles the waterlight home route in dev. The
  // failure screenshot confirmed successful sign-in and a still-compiling home;
  // allow compilation, without weakening credential or feedback assertions.
  await expect(page).toHaveURL(/\/zh-CN\/?$/, { timeout: 90_000 });
}
// Use the browser's real cookie/Origin handling. On loopback HTTP, the API
// request client does not share Chromium's Secure-cookie localhost exception.
async function browserApi(page: Page, pathname: string, body?: Record<string, string>) {
  return page.evaluate(async ({ pathname, body }) => {
    const response = await fetch(pathname, { credentials: "same-origin", ...(body ? {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    } : {}) });
    return { status: response.status, body: await response.json() };
  }, { pathname, body });
}
test.beforeAll(async () => {
  const url = new URL(process.env.DATABASE_URL ?? "");
  if (!["localhost", "127.0.0.1"].includes(url.hostname) || !/^\/qiaoshen_feedback_\d+_e2e$/.test(url.pathname)) throw Error("Feedback checks require their own isolated loopback database");
  // A failed Playwright test restarts its worker and reruns this fixture hook.
  // Only this uniquely owned database's synthetic fixture accounts are reset.
  await db.user.deleteMany({ where: { email: { startsWith: "fixture-feedback-" } } });
  const hash = await bcrypt.hash(password, 10);
  for (let i = 0; i < 5; i++) {
    const email = `fixture-feedback-${i}@example.test`; emails.push(email);
    const user = await db.user.create({ data: { email, passwordHash: hash, role: "STUDENT", profile: { create: { intendedMajors: ["Mathematics"], targetRegions: [] } } }, include: { profile: true } });
    const record = await db.examSession.create({ data: { studentId: user.profile!.id, testId: "tmua", mode: "practice", totalEarned: 0, totalMax: 1, answers: { create: { questionId: first.id, type: "mcq", selected: first.type === "mcq" ? first.options.find(o => o.key !== first.answer)!.key : "A", earned: 0, max: 1 } } } });
    if (i === 0) { historyId = record.id; studentId = user.id; }
  }
  adminEmail = "fixture-feedback-admin@example.test";
  adminId = (await db.user.create({ data: { email: adminEmail, passwordHash: hash, role: "ADMIN" } })).id;
});
test.afterAll(async () => { await db.$disconnect(); });

test("feedback is authenticated, idempotent, user-isolated and shown in answer review", async ({ page, request, browser }) => {
  expect((await request.post("/api/question-feedback", { data: { testId: "tmua", questionId: first.id, kind: "ERROR" } })).status()).toBe(401);
  expect((await request.get("/api/admin/content-priorities?format=csv")).status()).toBe(401);
  await login(page, emails[0]);
  await page.goto(`/zh-CN/tests/tmua/history/${historyId}`);
  const feedbackButton = page.getByRole("button", { name: "题目有误", exact: true });
  await expect(feedbackButton).toBeEnabled({ timeout: 60_000 });
  await feedbackButton.click();
  await expect(page.getByRole("button", { name: "✓ 题目有误", exact: true })).toBeDisabled();
  const body = { testId: "tmua", questionId: first.id, kind: "ERROR" };
  const results = await Promise.all(Array.from({ length: 4 }, () => browserApi(page, "/api/question-feedback", body)));
  expect(results.map(response => response.status)).toEqual([200, 200, 200, 200]);
  expect(await db.questionFeedback.count({ where: { userId: studentId, questionKey: feedbackQuestionKey(first), kind: "ERROR" } })).toBe(1);
  expect((await browserApi(page, "/api/admin/content-priorities?format=csv")).status).toBe(403);
  const other = await browser.newContext();
  try {
    const otherPage = await other.newPage(); await login(otherPage, emails[1]);
    const state = await browserApi(otherPage, `/api/question-feedback?testId=tmua&questionId=${encodeURIComponent(first.id)}&userId=${studentId}`);
    expect(state.status).toBe(200);
    expect(state.body).toEqual({ kinds: [] });
  } finally { await other.close(); }
});

test("admin priority table and its weekly CSV contain only masked topic aggregates", async ({ page }) => {
  await login(page, adminEmail);
  await page.goto("/zh-CN/admin/content-priorities");
  await expect(page.getByRole("heading", { name: "补题优先级", exact: true })).toBeVisible();
  await expect(page.getByRole("table")).toBeVisible({ timeout: 90_000 });
  await expect(page.getByText("样本不足", { exact: true }).first()).toBeVisible();
  const response = await browserApi(page, "/api/admin/content-priorities");
  expect(response.status).toBe(200);
  const data = response.body;
  expect(data.rows.find((row: { topicId: string }) => row.topicId === first.topicId)).toMatchObject({ students: 5, status: "ready" });
  const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("link", { name: "一键导出表格（CSV）", exact: true }).click()]);
  const csv = await readFile((await download.path())!, "utf8");
  expect(csv).toContain("补题优先级分"); expect(csv).toContain("样本不足");
  for (const privateValue of [...emails, adminEmail, studentId, adminId]) expect(csv).not.toContain(privateValue);
  await page.getByLabel("考试", { exact: true }).selectOption("tmua");
  await expect(page.getByRole("table")).not.toContainText("ESAT");
  await page.getByLabel("考试", { exact: true }).selectOption("");
  await expect(page.getByRole("table")).toContainText("ESAT");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("real retention dry-run/apply clears 366-day answers, feedback and photo bytes but preserves 364-day records and accounts", async () => {
  const now = new Date(), old = new Date(+now - 366 * 86_400_000), young = new Date(+now - 364 * 86_400_000);
  const profile = await db.studentProfile.findUniqueOrThrow({ where: { userId: studentId } });
  const storage = getStorage();
  const oldImage = await storage.put({ body: Buffer.from("isolated-old-photo-fixture"), fileName: "fixture-old.jpg", mime: "image/jpeg" });
  const youngImage = await storage.put({ body: Buffer.from("isolated-young-photo-fixture"), fileName: "fixture-young.jpg", mime: "image/jpeg" });
  const images = [];
  const sessions = [];
  const feedback = [];
  try {
    for (const [stamp, image, kind] of [[old, oldImage, "TOO_HARD"], [young, youngImage, "MORE_LIKE_THIS"]] as const) {
      images.push(await db.answerImage.create({ data: { ownerId: studentId, fileKey: image.key, fileName: image.fileName, mime: "image/jpeg", size: image.size, width: 1, height: 1, createdAt: stamp } }));
      sessions.push(await db.examSession.create({ data: { studentId: profile.id, testId: "tmua", mode: "practice", totalEarned: 0, totalMax: 1, createdAt: stamp, answers: { create: { questionId: first.id, type: "mcq", earned: 0, max: 1, feedback: { fixture: "AI-feedback" } } } } }));
      feedback.push(await db.questionFeedback.create({ data: { userId: studentId, testId: first.testId, topicId: first.topicId, questionKey: feedbackQuestionKey(first), kind, createdAt: stamp } }));
    }
    const count = await runStudyRetention({ client: db, storage, now });
    expect(count).toMatchObject({ feedback: 1, sessions: 1, answers: 1, images: 1 });
    expect(await storage.get(oldImage.key)).toHaveLength(oldImage.size);
    await runStudyRetention({ client: db, storage, now, dryRun: false });
    expect(await db.examSession.findUnique({ where: { id: sessions[0].id } })).toBeNull();
    expect(await db.examAnswer.count({ where: { sessionId: sessions[0].id } })).toBe(0);
    expect(await db.questionFeedback.findUnique({ where: { id: feedback[0].id } })).toBeNull();
    expect(await db.answerImage.findUnique({ where: { id: images[0].id } })).toBeNull();
    await expect(storage.get(oldImage.key)).rejects.toThrow();
    expect(await storage.get(youngImage.key)).toHaveLength(youngImage.size);
    expect(await db.examSession.findUnique({ where: { id: sessions[1].id } })).not.toBeNull();
    expect(await db.user.count()).toBe(6);
  } finally {
    await Promise.all([storage.delete(oldImage.key), storage.delete(youngImage.key)]);
  }
});
