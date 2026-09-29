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

  it("allows only the isolated Waterlight route to be framed by the same origin", () => {
    const source = readFileSync(resolve(process.cwd(), "next.config.ts"), "utf8");

    expect(source).toContain('"frame-ancestors \'none\'"');
    expect(source).toContain('value: "DENY"');
    expect(source).toContain('source: "/:locale(zh-CN|en)/waterlight"');
    expect(source).toContain('replace("frame-ancestors \'none\'", "frame-ancestors \'self\'")');
    expect(source).toContain('value: "SAMEORIGIN"');
  });
});
