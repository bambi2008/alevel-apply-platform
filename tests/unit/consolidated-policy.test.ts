import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PLAN_QUOTAS, PLAN_RELEASE, STUDY_PLANS } from "../../lib/plans";
import { PUBLIC_CONTACT_EMAIL } from "../../lib/site-config";
import questionFixes from "../../docs/review-inputs/2026-10-25/question-fixes.json";
import difficultyFixes from "../../docs/review-inputs/2026-10-25/difficulty-fixes.json";
import codeTargets from "../../docs/review-inputs/2026-10-25/code-level-targets.json";

describe("October 25 consolidated policy intake", () => {
  it("strictly parses the supplied inputs without claiming they have been released", () => {
    expect(Object.keys(questionFixes)).toHaveLength(42);
    expect(Object.keys(difficultyFixes)).toHaveLength(1837);
    expect(Object.values(difficultyFixes).every((value) => [1, 2, 3].includes(value))).toBe(true);
    expect(Object.keys(codeTargets)).toHaveLength(10);
    expect(questionFixes).not.toHaveProperty("step-045");
  });
  it("uses the single owner-approved public contact, not an environment fallback", () => {
    expect(PUBLIC_CONTACT_EMAIL).toBe("hello@drforest.ai");
    for (const file of ["app/[locale]/layout.tsx", "app/[locale]/privacy/page.tsx", "app/[locale]/terms/page.tsx", "app/[locale]/pricing/page.tsx"]) {
      const source = readFileSync(file, "utf8");
      expect(source).toContain("PUBLIC_CONTACT_EMAIL");
      expect(source).not.toContain("mao8teen@");
      expect(source).not.toContain("maoqin1979@");
      expect(source).not.toContain("process.env.PRIVACY_CONTACT_EMAIL");
    }
  });
  it("displays only approved prices and durations with no auto-renewal", () => {
    expect(STUDY_PLANS.map((plan) => [plan.id, plan.priceCny, plan.durationMonths, plan.durationDays])).toEqual([
      ["basic", 0, null, null], ["trial", 0, null, 7], ["season", 399, 3, null], ["annual", 799, 12, null],
    ]);
    expect(STUDY_PLANS.every((plan) => !plan.autoRenew)).toBe(true);
    expect(STUDY_PLANS[2].name).toBe("考季卡");
  });
  it("does not activate payment, trial or unapproved quotas", () => {
    expect(PLAN_RELEASE).toEqual({ purchasesEnabled: false, trialEnabled: false, quotaLimitsEnabled: false });
    expect(Object.values(PLAN_QUOTAS).every((quota) => Object.values(quota).every((value) => value === null))).toBe(true);
    const source = readFileSync("app/[locale]/pricing/page.tsx", "utf8");
    expect(source).toContain('type="button" disabled');
    expect(source).not.toMatch(/onClick|action=|fetch\(|\/checkout|stripe|paypal|二维码/);
    expect(source).not.toContain("待负责人确认");
  });
});
