import { describe, expect, it } from "vitest";
import { z } from "zod";
import { registrationIntentSchema } from "@/lib/auth/registration-intent";
import { profileSchema } from "@/lib/validators/profile";

describe("patched collection validation", () => {
  it.each([false, true])("rejects oversized arrays before validating elements (async=%s)", async (async) => {
    let visits = 0;
    const schema = z.array(z.preprocess(value => { visits++; return value; }, z.string())).max(3);
    const input = Array(2000).fill(0);
    const result = async ? await schema.safeParseAsync(input) : schema.safeParse(input);
    expect(result.success).toBe(false);
    if (result.success) throw new Error("Oversized input accepted");
    expect(result.error.issues).toHaveLength(1);
    expect(result.error.issues[0].code).toBe("too_big");
    expect(visits).toBe(0);
    expect(schema.parse(["a", "b", "c"])).toEqual(["a", "b", "c"]);
    expect(schema.safeParse(["a", 0]).success).toBe(false);
  });

  it("also short-circuits oversized sets without truncating or accepting them", () => {
    let visits = 0;
    const schema = z.set(z.preprocess(value => { visits++; return value; }, z.string())).max(3);
    const result = schema.safeParse(new Set(Array.from({ length: 2000 }, (_, index) => index)));
    expect(result.success).toBe(false);
    expect(visits).toBe(0);
    expect(schema.parse(new Set(["a", "b"]))).toEqual(new Set(["a", "b"]));
  });

  it("keeps registration limits and profile defaults", () => {
    const result = registrationIntentSchema.safeParse(Array(2000).fill(null));
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues).toHaveLength(1);
    expect(registrationIntentSchema.parse(["Mathematics"])).toEqual(["Mathematics"]);
    expect(profileSchema.parse({ targetRegions: ["UK"] })).toEqual({
      targetRegions: ["UK"], isMinor: false, intendedMajors: [], subjects: [], testScores: [],
    });
  });
});
