import { describe, expect, it } from "vitest";
import { preferredPublicLocale, unpublishedPageHtml } from "./public-routing";

describe("public locale and unpublished copy", () => {
  it.each([
    ["en-US,en;q=0.9,zh-CN;q=0.8", "en"],
    ["zh-CN,en;q=0.9", "zh-CN"],
    ["fr-FR, en;q=0.7", "en"],
    ["en;q=0,zh;q=0.5", "zh-CN"],
    ["en;q=garbage", "zh-CN"],
    ["", "zh-CN"],
  ])("negotiates %s as %s", (header, locale) => {
    expect(preferredPublicLocale(header)).toBe(locale);
  });
  it("honours only supported stored preferences", () => {
    expect(preferredPublicLocale("zh", "en")).toBe("en");
    expect(preferredPublicLocale("en", "unknown")).toBe("en");
  });
  it.each(["en", "zh-CN"] as const)("provides a %s noindex page without unapproved copy", (locale) => {
    const html = unpublishedPageHtml(locale);
    expect(html).toContain(`<html lang="${locale}">`);
    expect(html).toContain('content="noindex,nofollow"');
    expect(html).toContain(`href="/${locale}"`);
    expect(html).not.toMatch(/SCIE|深国交|A2|待负责人确认|\{\{/);
    if (locale === "en") expect(html).not.toMatch(/[\u4e00-\u9fff]/);
  });
});
