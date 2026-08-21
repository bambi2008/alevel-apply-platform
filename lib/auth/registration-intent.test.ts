import { describe, expect, it } from "vitest";
import { parseRegistrationIntent, registrationIntentSchema } from "./registration-intent";

describe("registration intent", () => {
  it("normalizes separators, whitespace, and duplicates", () => {
    expect(
      parseRegistrationIntent(" University of Cambridge，Imperial   College London; university of cambridge\nHKU "),
    ).toEqual(["University of Cambridge", "Imperial College London", "HKU"]);
  });

  it("requires between one and ten entries", () => {
    expect(registrationIntentSchema.safeParse([]).success).toBe(false);
    expect(registrationIntentSchema.safeParse(["Aerospace Engineering"]).success).toBe(true);
    expect(registrationIntentSchema.safeParse(Array.from({ length: 11 }, (_, index) => `Major ${index}`)).success).toBe(false);
  });

  it("rejects entries longer than 120 characters", () => {
    expect(registrationIntentSchema.safeParse(["x".repeat(121)]).success).toBe(false);
  });
});
