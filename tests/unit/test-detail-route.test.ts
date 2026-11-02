import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
vi.mock("next-intl/server", () => ({ setRequestLocale: vi.fn() }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NOT_FOUND"); } }));
vi.mock("../../components/test-detail", () => ({ TestDetailContent: () => null }));
import Page from "../../app/[locale]/tests/[testId]/page";
import { getTestById } from "../../lib/tests";
import { getKnowledgeByTopicId } from "../../lib/tests/knowledge";
import { REGISTRATION_INFO } from "../../lib/tests/registration";

describe("current exam metadata selection", () => {
  it.each(["esat", "caie9709", "tmua", "mat"])("keeps links and scope while selecting only %s", async testId => {
    const test = getTestById(testId)!;
    const zh = await Page({ params: Promise.resolve({ testId, locale: "zh-CN" }) });
    expect(zh.props.test).toBe(test);
    expect(zh.props.registration).toBe(REGISTRATION_INFO[testId]);
    expect(zh.props.learnableTopicIds).toEqual(test.topics.filter(topic => getKnowledgeByTopicId(topic.id)).map(topic => topic.id));
    const en = await Page({ params: Promise.resolve({ testId, locale: "en" }) });
    expect(en.props.test.id).toBe(testId);
    expect(en.props.learnableTopicIds).toEqual(zh.props.learnableTopicIds);
    expect(en.props.test.topics.map((topic: { id: string }) => topic.id)).toEqual(test.topics.map(topic => topic.id));
    expect(JSON.stringify(en.props)).not.toMatch(/[\u3400-\u9fff]/u);
    expect(Object.keys(en.props).sort()).toEqual(["test", "registration", "learnableTopicIds", "trainingLabel"].sort());
  });
  it("keeps full question, knowledge and translation data outside the interactive view", () => {
    const source = readFileSync("components/test-detail.tsx", "utf8");
    expect(source).not.toMatch(/from ["']@\/lib\/(?:content-language|tests\/(?:knowledge|mock-papers|syllabus-release))["']/);
    expect(source).toContain('import type { RegInfo }');
    expect(source).not.toContain("function PracticeTab");
  });
});
