import { readFileSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PracticeCatalogItem } from "@/lib/tests/delivery-types";
const mocks = vi.hoisted(() => ({ auth: vi.fn(), access: vi.fn() }));
vi.mock("@/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/membership/access", () => ({ membershipAccess: mocks.access }));
vi.mock("next-intl/server", () => ({ setRequestLocale: vi.fn() }));
vi.mock("next/navigation", () => ({
  notFound: () => { throw new Error("NOT_FOUND"); },
  redirect: (href: string) => { throw new Error(`REDIRECT ${href}`); },
}));
vi.mock("@/components/secure-study-session", () => ({ SecureStudySession: () => null }));
vi.mock("@/components/membership-required", () => ({ MembershipRequired: () => null }));
import Page from "../../app/[locale]/tests/[testId]/practice/page";
import { getReleasedPracticeQuestions, mergeReleasedPracticeQuestions } from "../../lib/tests/practice-banks";
import { assessSyllabusCandidate, matchesExamModule } from "../../lib/tests/syllabus-policy";

beforeEach(() => {
  vi.resetAllMocks();
  mocks.auth.mockResolvedValue({ user: { id: "fixture-user" } });
  mocks.access.mockResolvedValue({ active: true });
});

describe("exam-selected practice payload", () => {
  it.each(["caie9709", "esat", "step", "tmua"])("keeps released identities and modules but provides metadata only for %s", async testId => {
    const source = getReleasedPracticeQuestions(testId);
    const shown = await Page({ params: Promise.resolve({ testId, locale: "en" }) });
    const props = shown.props.children[0].props;
    const catalog: PracticeCatalogItem[] = props.catalog;
    expect(catalog).toEqual(source.map(q => ({ id: q.id, topicId: q.topicId, difficulty: q.difficulty, type: q.type, module: assessSyllabusCandidate(q).module })));
    expect(JSON.stringify(props)).not.toMatch(/"(question|questions|answer|fullSolution|solutionOutline|solution|hint)":/);
    const modules = testId === "esat" ? ["math1", "math2", "physics", "chemistry", "biology"] : testId === "step" ? ["step2", "step3"] : [];
    for (const moduleId of modules) {
      const ids = catalog.filter(q => q.module === moduleId || (testId === "step" && moduleId === "step3")).map(q => q.id);
      expect(ids).toEqual(source.filter(q => matchesExamModule(q, moduleId)).map(q => q.id));
    }
    expect(mergeReleasedPracticeQuestions(testId, source)).toEqual(source);
    expect(mergeReleasedPracticeQuestions(testId, source.map(q => ({ ...q, difficulty: q.difficulty === 1 ? 2 : 1 })))).toEqual(source);
  });
  it("rejects unknown exams and redirects anonymous visitors", async () => {
    await expect(Page({ params: Promise.resolve({ testId: "missing", locale: "en" }) })).rejects.toThrow("NOT_FOUND");
    mocks.auth.mockResolvedValue(null);
    await expect(Page({ params: Promise.resolve({ testId: "esat", locale: "zh-CN" }) })).rejects.toThrow("REDIRECT /zh-CN/login");
    expect(mocks.access).not.toHaveBeenCalled();
  });
  it("shows a gate without catalog or answer data to an expired trial", async () => {
    mocks.access.mockResolvedValue({ active: false, membership: { plan: "trial" } });
    const page = await Page({ params: Promise.resolve({ testId: "esat", locale: "zh-CN" }) });
    expect(page.props).toMatchObject({ expiredTrial: true });
    expect(page.props).not.toHaveProperty("catalog");
  });
  it("keeps the full bank and translation corpus outside the interactive view", () => {
    const source = readFileSync("components/secure-study-session.tsx", "utf8");
    expect(source).not.toMatch(/getReleasedPracticeQuestions|mergeReleasedPracticeQuestions|localizeStaticContent|from ["']@\/lib\/content-language["']|from ["']@\/lib\/tests\/syllabus-policy["']/);
  });
});
