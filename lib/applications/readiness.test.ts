import { describe, expect, it } from "vitest";
import { buildMaterialTemplate, calculateReadiness, canConfirmSubmission, effectiveMaterialStatus } from "./readiness";

describe("application readiness", () => {
  it("builds route-specific material templates", () => {
    const ucas = buildMaterialTemplate("UCAS_CHOICE");
    const hk = buildMaterialTemplate("HK_DIRECT");
    expect(ucas.find((item) => item.key === "reference")?.required).toBe(true);
    expect(hk.find((item) => item.key === "id-photo")?.required).toBe(true);
    expect(hk.some((item) => item.key === "reference")).toBe(false);
  });

  it("marks expired documents as needing an update", () => {
    expect(effectiveMaterialStatus({ status: "READY", documentId: "doc", validUntil: "2026-06-01" }, new Date("2026-07-01"))).toBe("NEEDS_UPDATE");
    expect(effectiveMaterialStatus({ status: "READY", documentId: "doc", validUntil: "2026-08-01" }, new Date("2026-07-01"))).toBe("READY");
    expect(effectiveMaterialStatus({ status: "WAIVED", documentId: null }, new Date("2026-07-01"))).toBe("WAIVED");
  });

  it("calculates blockers from required materials only", () => {
    const result = calculateReadiness([
      { label: "护照", required: true, status: "READY" },
      { label: "成绩单", required: true, status: "MISSING" },
      { label: "证书", required: false, status: "MISSING" },
    ]);
    expect(result).toMatchObject({ score: 50, ready: 1, required: 2, canSubmit: false });
    expect(result.blockers).toEqual([{ label: "成绩单", status: "MISSING" }]);
    expect(canConfirmSubmission(result, true)).toBe(false);
    expect(canConfirmSubmission({ canSubmit: true }, false)).toBe(false);
    expect(canConfirmSubmission({ canSubmit: true }, true)).toBe(true);
  });
});
