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

describe("actual /tests/[testId]/mock route", () => {
  it("renders all 16 fixed written links for direct and CTA CAIE entry", async () => {
    const markup = renderToStaticMarkup(await MockExamPage({ params: Promise.resolve({ testId: "caie9709" }) }));
    expect(markup).toContain("11 道大题 · 75 分 · 110 分钟");
    expect(markup).not.toMatch(/mixed:|选择题|20 题|2 道大题/);
    const links = [...markup.matchAll(/href="(\/tests\/caie9709\/paper\/[^"]+)"/g)].map((match) => match[1]);
    expect(links).toHaveLength(16);
    expect(new Set(links).size).toBe(16);
    expect(links[0]).toBe("/tests/caie9709/paper/caie9709-p3-written-9-r2");
  });
  it("keeps other exam routes on their existing runner", async () => {
    expect(renderToStaticMarkup(await MockExamPage({ params: Promise.resolve({ testId: "esat" }) }))).toContain("mixed:esat");
  });
});
