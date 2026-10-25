import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { clientMessages, CLIENT_MESSAGE_NAMESPACES } from "../../i18n/client-messages";
import zh from "../../messages/zh-CN.json";
import en from "../../messages/en.json";
import { getMockPapersForTest } from "../../lib/tests/mock-papers";
import { paperPresentation, trainingPresentationViolations } from "../../lib/tests/syllabus-release";

describe("public content review", () => {
  for (const [locale, messages] of Object.entries({ zh, en })) {
    it(`${locale}: sends only active client namespaces, without retired prices or claims`, () => {
      const picked = clientMessages(messages);
      expect(Object.keys(picked)).toEqual([...CLIENT_MESSAGE_NAMESPACES]);
      expect(JSON.stringify(picked)).not.toMatch(/SCIE|深国交|八万到十二万|¥49|¥399|¥33|全真|首批 20 人|first 20 beta|coming soon|即将上线/);
      expect(picked.auth).toEqual(messages.auth);
      expect(picked.statements).toEqual(messages.statements);
    });
    it(`${locale}: removes student identifiers and agency-price comparisons at source`, () => {
      expect(JSON.stringify(messages.story)).not.toMatch(/SCIE|深国交|升 A2|八万到十二万|80,000|120,000|a few hundred RMB/);
    });
  }
  it("pins locale for server interview links and both account login redirects", () => {
    const interview = readFileSync("app/[locale]/interview/page.tsx", "utf8");
    expect(interview).toContain("setRequestLocale(locale)");
    const account = readFileSync("app/[locale]/account/page.tsx", "utf8");
    expect(account.match(/redirect\(`\/\$\{locale\}\/login`\)/g)).toHaveLength(2);
    expect(account).not.toContain('redirect("/login")');
  });
  it("keeps about noindex and removes the retired matching CTA", () => {
    const about = readFileSync("app/[locale]/about/page.tsx", "utf8");
    expect(about).toContain("index: false");
    expect(about).not.toContain('href="/match"');
  });
  it("applies training-only presentation to UCAT without changing its four-module content", () => {
    const papers = getMockPapersForTest("ucat");
    expect(papers).toHaveLength(5);
    for (const paper of papers) {
      const shown = paperPresentation(paper);
      expect(shown.title).not.toMatch(/全真|Full Mock/);
      expect(shown.modules).toBe(paper.modules);
      expect(trainingPresentationViolations(paper, shown)).toEqual([]);
    }
  });
  it("uses visible auth labels and resolves historical status through the catalogue helper", () => {
    const register = readFileSync("app/[locale]/register/page.tsx", "utf8");
    for (const field of ["email", "password"]) {
      expect(register).toContain(`<span>{t("${field}")}</span>`);
    }
    expect(register).not.toContain('name="inviteCode"');
    const detail = readFileSync("app/[locale]/tests/[testId]/page.tsx", "utf8");
    expect(detail).toContain('getTestPurpose(test) === "legacy"');
    expect(detail).toContain('getTestPurpose(test) !== "legacy"');
    expect(zh.meta.description).not.toContain("模考");
  });
});
