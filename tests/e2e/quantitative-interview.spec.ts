import path from "node:path";
import { expect, test } from "@playwright/test";

test("student can complete a timed quantitative interview drill", async ({ browser }) => {
  for (const viewport of [{ name: "desktop", width: 1440, height: 1000 }, { name: "mobile", width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto("/zh-CN/interview/maths");
    await page.getByRole("button", { name: "高压计算面试" }).click();
    await expect(page.getByRole("heading", { name: "高压定量面试训练" })).toBeVisible();
    await page.getByRole("button", { name: /一页纸与 30 秒估算/ }).click();
    await page.locator("textarea").fill("我先设纸张尺寸和撕裂方向，假设撕裂分布近似均匀，再用长度尺度估计结果，并检查量级和误差来源。");
    await page.getByRole("button", { name: "提交主问题，进入追问" }).click();
    await expect(page.getByText("改变一个条件，修正你的模型")).toBeVisible();
    await page.locator("textarea").fill("如果沿短边附近撕开，我会修正模型并比较两种边界条件，结果取决于撕裂方向。");
    await page.getByRole("button", { name: "完成本轮并查看过程评分" }).click();
    await expect(page.getByText("训练评分，不代表院校评分")).toBeVisible();
    await expect(page.getByText("过程检查")).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    if (process.env.OPS_SCREENSHOT_DIR) {
      await page.screenshot({ path: path.join(process.env.OPS_SCREENSHOT_DIR, `quantitative-${viewport.name}.png`), fullPage: true });
    }
    await context.close();
  }
});
