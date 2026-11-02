import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
vi.mock("next-intl/server", () => ({ setRequestLocale: vi.fn() }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NOT_FOUND"); } }));
vi.mock("../../components/knowledge-topic", () => ({ KnowledgeTopic: () => null }));
import LearnPage from "../../app/[locale]/tests/[testId]/learn/[topicId]/page";

describe("server-selected knowledge page", () => {
  it("sends only the chosen topic, not catalogues or other question banks", async () => {
    const page = await LearnPage({params:Promise.resolve({locale:"zh-CN",testId:"caie9709",topicId:"caie9709-algebra"})});
    expect(Object.keys(page.props).sort()).toEqual(["knowledge","testAbbr","testId","topicTitle","topicTitleEn"]);
    expect(page.props.knowledge.topicId).toBe("caie9709-algebra");
    expect(page.props.knowledge.workedExamples).toHaveLength(1);
    expect(page.props.knowledge.concepts[0].body).toContain("\\frac");
    const payload = JSON.stringify(page.props);
    expect(payload).not.toMatch(/step-\d{3}|bmo-sp-|caie9709-p3-.*mock/);
  });
  it("uses the English topic title without altering its identifier", async () => {
    const page = await LearnPage({params:Promise.resolve({locale:"en",testId:"caie9709",topicId:"caie9709-algebra"})});
    expect(page.props.topicTitle).toBe("Algebra");
    expect(page.props.knowledge.topicId).toBe("caie9709-algebra");
  });
  it("rejects unknown topics and topics belonging to a different exam", async () => {
    for (const topicId of ["missing", "tmua-algebra"]) await expect(LearnPage({params:Promise.resolve({locale:"en",testId:"caie9709",topicId})})).rejects.toThrow("NOT_FOUND");
  });
  it("keeps runtime catalogue, practice and translation imports out of the client view", () => {
    const source = readFileSync("components/knowledge-topic.tsx","utf8");
    expect(source).not.toMatch(/getKnowledgeByTopicId|getReleasedPracticeQuestions|getTestById|localizeStaticContent|content-language\/en/);
    expect(source).toContain('import type { TopicKnowledge }');
  });
});
