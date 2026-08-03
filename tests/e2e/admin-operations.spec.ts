import path from "node:path";
import { expect, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();
const email = `e2e-operations-${Date.now()}@example.test`;
const password = "E2eOperations!2026";

test.beforeAll(async () => {
  await db.user.create({
    data: { email, passwordHash: await bcrypt.hash(password, 10), role: "ADMIN" },
  });
});

test.afterAll(async () => {
  await db.user.deleteMany({ where: { email } });
  await db.$disconnect();
});

test("administrator can inspect operations on desktop and mobile", async ({ browser }) => {
  const viewports = [
    { name: "desktop", width: 1440, height: 1000 },
    { name: "mobile", width: 390, height: 844 },
  ];

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto("/zh-CN/login");
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('form button[type="submit"]').click();
    await expect(page).toHaveURL(/\/(?:zh-CN\/)?(?:profile)?$/);
    await page.goto("/zh-CN/admin/operations");

    await expect(page.getByRole("heading", { name: "运行状态" })).toBeVisible();
    await expect(page.getByText("当前发布")).toBeVisible();
    await expect(page.getByText("最近系统事件")).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    const response = await context.request.get("/api/admin/operations");
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({ release: "local", status: "healthy" });

    if (process.env.OPS_SCREENSHOT_DIR) {
      await page.screenshot({
        path: path.join(process.env.OPS_SCREENSHOT_DIR, `operations-${viewport.name}.png`),
        fullPage: true,
      });
    }
    await context.close();
  }
});
