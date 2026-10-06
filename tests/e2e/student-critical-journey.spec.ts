import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { BETA_COHORT, createInviteCode, hashInviteCode } from "../../lib/beta/invites";

const db = new PrismaClient();

function uniqueEmail(label: string) {
  return `e2e-${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.test`;
}

async function removeTestUser(email: string) {
  await db.user.deleteMany({ where: { email } });
  await db.betaInvite.deleteMany({ where: { email, cohort: BETA_COHORT } });
}

test.beforeAll(() => {
  // This journey creates/deletes its own fixtures, never production accounts.
  const database = new URL(process.env.DATABASE_URL ?? "");
  if (!database.pathname.endsWith("_e2e")) {
    throw new Error("Student journey requires an isolated *_e2e database");
  }
});

test.afterAll(async () => {
  await db.$disconnect();
});

test("student can register, finish a TMUA mock, open history, export data, and delete the account", async ({
  page,
}) => {
  const email = uniqueEmail("journey");
  const password = "E2eStart!2026";
  const changedPassword = "E2eChanged!2026";
  const inviteCode = createInviteCode();

  try {
    await db.betaInvite.create({
      data: { email, cohort: BETA_COHORT, codeHash: hashInviteCode(inviteCode) },
    });
    await page.goto("/zh-CN/register");
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="intendedUniversities"]').fill("University of Cambridge");
    await page.locator('input[name="intendedMajors"]').fill("Mathematics");
    await page.locator('input[name="inviteCode"]').fill(inviteCode);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="privacyConsent"]').check();
    await page.locator('input[name="termsConsent"]').check();
    await page.locator('input[name="crossBorderConsent"]').check();
    await page.locator('form button[type="submit"]').click();
    await expect(page).toHaveURL(/\/(?:zh-CN\/?)?$/);
    const registered = await db.user.findUnique({ where: { email }, include: { profile: true } });
    expect(registered?.profile?.intendedUniversities).toEqual(["University of Cambridge"]);
    expect(registered?.profile?.intendedMajors).toEqual(["Mathematics"]);
    const consumedInvite = await db.betaInvite.findUnique({ where: { codeHash: hashInviteCode(inviteCode) } });
    expect(consumedInvite).toMatchObject({ status: "USED", usedByUserId: registered?.id });

    await page.goto("/zh-CN/tests/tmua/mock");
    await page.locator('a[href*="/tests/tmua/paper/"]').first().click();
    await expect(page).toHaveURL(/\/tests\/tmua\/paper\//);
    await page.getByRole("button", { name: "开始考试", exact: true }).click();

    // Complete both real 20-question modules through the student's review UI.
    for (let moduleIndex = 0; moduleIndex < 2; moduleIndex += 1) {
      await expect(page.getByRole("button", { name: /^第 \d+ 题/ })).toHaveCount(20);
      const firstOption = page.locator('button[type="button"]')
        .filter({ has: page.locator("span.font-bold") }).first();
      await expect(firstOption).toBeVisible();
      await firstOption.click();
      await page.getByRole("button", { name: "交卷总览", exact: true }).last().click();
      await expect(page.getByRole("heading", { name: "交卷总览", exact: true })).toBeVisible();
      await page.getByRole("button", {
        name: moduleIndex === 0 ? "提交并进入下一模块" : "确认交卷", exact: true,
      }).click();
    }
    await expect(page.getByRole("heading", { name: "逐题回看", exact: true })).toBeVisible({
      timeout: 60_000,
    });

    const reportLink = page.locator('a[href*="/tests/tmua/history/"]');
    await expect(reportLink).toBeVisible();
    const reportHref = await reportLink.getAttribute("href");
    await reportLink.click();
    await expect(page).toHaveURL(/\/tests\/tmua\/history\//);
    expect(reportHref).toMatch(/\/tests\/tmua\/history\//);

    await page.goto("/zh-CN/account");
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.locator('a[href="/api/account/export"]').click(),
    ]);
    const downloadPath = await download.path();
    expect(downloadPath).not.toBeNull();
    const exported = JSON.parse(await readFile(downloadPath!, "utf8")) as {
      user: {
        email: string;
        passwordHash?: string;
        profile: { examSessions: Array<{
          testId: string; mode: string; totalMax: number; answers: unknown[];
        }> } | null;
      };
    };
    expect(exported.user.email).toBe(email);
    expect(exported.user).not.toHaveProperty("passwordHash");
    expect(exported.user.profile?.examSessions.length).toBeGreaterThan(0);
    expect(exported.user.profile?.examSessions[0]).toMatchObject({
      testId: "tmua", mode: "paper", totalMax: 40,
    });
    expect(exported.user.profile?.examSessions[0].answers).toHaveLength(40);

    await expect(page).toHaveURL(/\/zh-CN\/account$/);
    const passwordForm = page.locator('input[name="password"]').locator("..");
    await page.locator('input[name="currentPassword"]').first().fill(password);
    await page.locator('input[name="password"]').fill(changedPassword);
    await page.locator('input[name="confirmPassword"]').fill(changedPassword);
    await passwordForm.locator('button[type="submit"]').click();
    await expect
      .poll(async () => {
        const user = await db.user.findUnique({
          where: { email },
          select: { passwordHash: true },
        });
        return Boolean(user?.passwordHash && (await bcrypt.compare(changedPassword, user.passwordHash)));
      })
      .toBe(true);

    const deleteForm = page.locator('input[name="confirmation"]').locator("..").locator("..");
    await deleteForm.locator('input[name="currentPassword"]').fill(changedPassword);
    await deleteForm.locator('input[name="confirmation"]').fill("DELETE");
    await deleteForm.locator('button[type="submit"]').click();
    await expect.poll(() => db.user.count({ where: { email } })).toBe(0);
  } finally {
    await removeTestUser(email);
  }
});
