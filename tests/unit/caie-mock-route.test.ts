import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, ...props }: Record<string, unknown>) => createElement("a", props, children as string),
}));
vi.mock("@/app/[locale]/tests/[testId]/mock/mixed-mock-runner", () => ({
  default: ({ testId }: { testId: string }) => createElement("div", null, `mixed:${testId}`),
}));
import MockExamPage from "@/app/[locale]/tests/[testId]/mock/page";
import { getMockPaper } from "@/lib/tests/mock-papers";
import { getCurrentP3PaperId } from "@/lib/tests/mock-papers/caie9709-p3-written-papers";
import { isReleasedPaper } from "@/lib/tests/syllabus-release";

describe("actual /tests/[testId]/mock route", () => {
  it("renders all 16 fixed written links for direct and CTA CAIE entry", async () => {
    const markup = renderToStaticMarkup(await MockExamPage({ params: Promise.resolve({ testId: "caie9709", locale: "zh-CN" }) }));
    expect(markup).toContain("11 道大题 · 75 分 · 110 分钟");
    expect(markup).not.toMatch(/mixed:|选择题|20 题|2 道大题/);
    const links = [...markup.matchAll(/href="(\/tests\/caie9709\/paper\/[^"]+)"/g)].map((match) => match[1]);
    expect(links).toHaveLength(16);
    expect(new Set(links).size).toBe(16);
    expect(links[0]).toBe(`/tests/caie9709/paper/${getCurrentP3PaperId("caie9709-p3-written-9")}`);
    for (const link of links) expect(isReleasedPaper(getMockPaper(link.split("/").at(-1)!)!)).toBe(true);
  });
  it("routes ESAT to six scoped three-module papers, never the mixed 20+2 runner", async () => {
    const markup=renderToStaticMarkup(await MockExamPage({ params: Promise.resolve({ testId: "esat", locale: "zh-CN" }) }));
    expect(markup).not.toContain("mixed:esat");
    expect([...markup.matchAll(/href="(\/tests\/esat\/paper\/[^"]+)"/g)]).toHaveLength(6);
    expect(markup).toContain("Mathematics 1 · 27题 · 40分钟");
  });
  it("renders current calibrated P3 links and English briefing copy", async () => {
    const markup = renderToStaticMarkup(await MockExamPage({ params: Promise.resolve({ testId: "caie9709", locale: "en" }) }));
    expect(markup).not.toMatch(/[\u3400-\u9fff]/u);
    expect(markup).toContain("11 structured questions");
    expect([...markup.matchAll(/href="(\/tests\/caie9709\/paper\/[^"]+)"/g)]).toHaveLength(16);
  });
});
