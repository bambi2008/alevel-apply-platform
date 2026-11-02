import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
const locale = vi.hoisted(() => ({ value: "en" }));
vi.mock("next-intl", () => ({ useLocale: () => locale.value }));
import { IeltsSpeakingSimulator } from "@/components/interview/ielts-speaking-simulator";
import { IELTS_SPEAKING_PAPERS } from "@/lib/english/speaking-papers";
import dictionary from "@/data/ui-copy-en.json";

describe("IELTS typed speaking English presentation", () => {
  it("renders English controls and explicit limits without changing papers", () => {
    locale.value = "en";
    const frozen = JSON.stringify(IELTS_SPEAKING_PAPERS);
    const html = renderToStaticMarkup(createElement(IeltsSpeakingSimulator));
    expect(html).not.toMatch(/[\u3400-\u9fff]/u);
    expect(html).toContain("Pronunciation needs a teacher or a separate recording review");
    expect(html).toContain("Start Practice sequence 1");
    for (const i of [1, 2, 3]) expect(html).toContain(`Practice sequence ${i}`);
    expect(JSON.stringify(IELTS_SPEAKING_PAPERS)).toBe(frozen);
  });
  it("keeps Chinese guidance and all three sets", () => {
    locale.value = "zh-CN";
    const html = renderToStaticMarkup(createElement(IeltsSpeakingSimulator));
    expect(html).toContain("IELTS Speaking 固定练习流程");
    expect(html).toContain("发音必须通过真人教师或录音复盘另行检查");
    for (const paper of IELTS_SPEAKING_PAPERS) expect(html).toContain(paper.focus);
  });
  it("covers preparation/result copy while preserving personal responses", () => {
    const source = readFileSync("components/interview/ielts-speaking-simulator.tsx", "utf8");
    for (const match of source.matchAll(/\bt\("([^"]+)"/g)) expect(Object.hasOwn(dictionary, match[1]), match[1]).toBe(true);
    expect(source).toContain('aria-label={t("作答内容")}');
    expect(source).not.toMatch(/\bt\((?:input|answers|feedback|attempt\.paperTitle)/);
    expect(dictionary["AI 只根据打字内容提供连贯、词汇和语法反馈，不生成官方 Band，也不评价发音。"]).toContain("does not generate an official Band or assess pronunciation");
  });
});
