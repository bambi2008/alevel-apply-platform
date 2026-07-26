import { expect, test } from "@playwright/test";

const publicPages = [
  { path: "/zh-CN/login", heading: "登录" },
  { path: "/zh-CN/register", heading: "注册" },
  { path: "/zh-CN/privacy", heading: "隐私政策" },
  { path: "/zh-CN/terms", heading: "服务条款" },
];

for (const pageCase of publicPages) {
  test(`${pageCase.path} renders without horizontal overflow`, async ({ page }) => {
    await page.goto(pageCase.path);

    await expect(page.getByRole("heading", { name: pageCase.heading }).first()).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
        ),
      )
      .toBe(true);
  });
}

test("registration exposes legal consent links and hides disabled phone auth", async ({ page }) => {
  await page.goto("/zh-CN/register");

  await expect(page.locator('input[name="privacyConsent"]')).toBeVisible();
  await expect(page.locator('input[name="termsConsent"]')).toBeVisible();
  await expect(page.locator('a[href="/zh-CN/privacy"]').first()).toBeVisible();
  await expect(page.locator('a[href="/zh-CN/terms"]').first()).toBeVisible();

  await page.goto("/zh-CN/login");
  await expect(page.locator('input[name="phone"]')).toHaveCount(0);
});

test("protected account page redirects anonymous visitors to login", async ({ page }) => {
  await page.goto("/zh-CN/account");

  await expect(page).toHaveURL(/\/zh-CN\/login/);
  await expect(page.locator('input[name="email"]')).toBeVisible();
});
