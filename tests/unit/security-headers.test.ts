import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("site permission policy", () => {
  it("allows same-origin camera capture while keeping unrelated sensors disabled", () => {
    const source = readFileSync(resolve(process.cwd(), "next.config.ts"), "utf8");

    expect(source).toContain(
      'value: "camera=(self), microphone=(), geolocation=(), payment=()"',
    );
    expect(source).not.toContain('value: "camera=(), microphone=()');
  });
});
