import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

function uniqueEmail(label: string) {
  return `e2e-${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.test`;
}

async function removeTestUser(email: string) {
  await db.user.deleteMany({ where: { email } });
}

test.afterAll(async () => {
  await db.$disconnect();
});

test("student can register, finish a TMUA mock, open history, export data, and delete the account", async ({
  page,
}) => {
  const email = uniqueEmail("journey");
  const password = "E2eStart!2026";
  const changedPassword = "E2eChanged!2026";

  try {
    await page.goto("/zh-CN/register");
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="privacyConsent"]').check();
    await page.locator('input[name="termsConsent"]').check();
    await page.locator('input[name="crossBorderConsent"]').check();
    await page.locator('form button[type="submit"]').click();
    await expect(page).toHaveURL(/\/(?:zh-CN\/)?profile/);

    await page.goto("/zh-CN/tests/tmua/mock");
    await page.locator('button[type="button"]').filter({ hasText: /开始计时考试/ }).click();

    const firstOption = page
      .locator('button[type="button"]')
      .filter({ has: page.locator("span.font-bold") })
      .first();
    await expect(firstOption).toBeVisible();
    await firstOption.click();

    await page.locator("div.sticky button[type=button]").click();
    await expect(page.getByRole("heading", { name: /考试完成/ })).toBeVisible({
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
        profile: { examSessions: unknown[] } | null;
      };
    };
    expect(exported.user.email).toBe(email);
    expect(exported.user).not.toHaveProperty("passwordHash");
    expect(exported.user.profile?.examSessions.length).toBeGreaterThan(0);

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
