import { describe, expect, it } from "vitest";
import { isConfiguredAdmin } from "../../lib/admin/allowlist";

describe("owner-configured administrator boundary", () => {
  it("fails closed without an explicit allowlist, even for an administrator role", () => {
    expect(isConfiguredAdmin({ role: "ADMIN", email: "operator@example.test" }, {})).toBe(false);
    expect(isConfiguredAdmin({ role: "ADMIN", email: "hello@drforest.ai" }, {})).toBe(false);
  });
  it("requires both the existing trusted role and an exact normalized allowlist entry", () => {
    const env = { ADMIN_EMAILS: " first@example.test, Operator@Example.test\nlast@example.test " };
    expect(isConfiguredAdmin({ role: "ADMIN", email: " OPERATOR@example.test " }, env)).toBe(true);
    expect(isConfiguredAdmin({ role: "STUDENT", email: "operator@example.test" }, env)).toBe(false);
    expect(isConfiguredAdmin({ role: "ADMIN", email: "operator@example.test.attacker.test" }, env)).toBe(false);
    expect(isConfiguredAdmin({ role: "ADMIN", email: null }, env)).toBe(false);
  });
});
