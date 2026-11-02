import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PrivacyPage from "../../app/[locale]/privacy/page";
import TermsPage from "../../app/[locale]/terms/page";
import { PUBLIC_CONTACT_EMAIL, PUBLIC_OPERATOR_NAME } from "../../lib/site-config";
import { LEGAL_VERSION } from "../../lib/auth/security";

describe("owner-confirmed operator disclosure", () => {
  for (const locale of ["zh-CN", "en"]) {
    it(`${locale}: renders the individual operator and verified storage boundary`, async () => {
      const params = Promise.resolve({ locale });
      const privacy = renderToStaticMarkup(await PrivacyPage({ params }));
      const terms = renderToStaticMarkup(await TermsPage({ params }));
      for (const html of [privacy, terms]) {
        expect(html).toContain(PUBLIC_OPERATOR_NAME);
        expect(html).toContain(PUBLIC_CONTACT_EMAIL);
        expect(html).toContain(LEGAL_VERSION);
        expect(html).not.toMatch(/project team operates|项目团队运营/);
      }
      expect(privacy).toContain(locale === "en" ? "Hong Kong Zone 2" : "中国香港二区");
      expect(privacy).toContain(locale === "en" ? "United States" : "美国");
      expect(privacy).toContain(locale === "en" ? "14 successful backup sets" : "14份成功备份");
      expect(privacy).toContain(locale === "en" ? "no configured time-based automatic expiry" : "未配置按固定天数自动到期");
      expect(privacy).toContain(locale === "en" ? "currently disabled" : "当前未启用 AI");
      expect(privacy).toContain(locale === "en" ? "365 days" : "365天");
    });
  }
  it("uses the owner's exact confirmed name without inventing a company", () => {
    expect(PUBLIC_OPERATOR_NAME).toBe("茅勤");
    expect(LEGAL_VERSION).toBe("2026-11-02");
  });
});
