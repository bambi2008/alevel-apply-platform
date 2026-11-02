import { afterEach, expect, it, vi } from "vitest";
import { getRegistrationMode } from "./registration-mode";
afterEach(() => vi.unstubAllEnvs());
it.each([undefined, "", "OPEN", "invte", "invite"])("defaults safely to invite for %s", (value) => {
  vi.stubEnv("REGISTRATION_MODE", value);
  expect(getRegistrationMode()).toBe("invite");
});
it("permits explicitly configured open registration", () => {
  vi.stubEnv("REGISTRATION_MODE", "open");
  expect(getRegistrationMode()).toBe("open");
});
