import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import proxy from "../../proxy";

describe("public locale proxy", () => {
  it.each(["en", "zh-CN"])("derives %s from the URL, never a supplied locale header", (locale) => {
    const response = proxy(new NextRequest(`https://example.test/${locale}/missing.page`, {
      headers: { "x-qiaoshen-locale": locale === "en" ? "zh-CN" : "en" },
    }));
    expect(response.headers.get("x-middleware-request-x-qiaoshen-locale")).toBe(locale);
  });
  it("keeps language negotiation private and preserves the query string", () => {
    const response = proxy(new NextRequest("https://example.test/tests?q=one", { headers: { "accept-language": "en" } }));
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("https://example.test/en/tests?q=one");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("vary")).toBe("Accept-Language, Cookie");
  });
  it.each(["en", "zh-CN"])("returns unpublished about as a genuine %s 404", async (locale) => {
    const response = proxy(new NextRequest(`https://example.test/${locale}/about`));
    expect(response.status).toBe(404);
    expect(response.headers.get("x-robots-tag")).toContain("noindex");
    expect(await response.text()).toContain(`<html lang="${locale}">`);
  });
});
