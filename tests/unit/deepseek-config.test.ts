import { describe, expect, it } from "vitest";
import { deepSeekParameters } from "../../lib/ai/deepseek-config";
describe("explicit non-thinking official DeepSeek configuration", () => {
  it("defaults to Flash and disables thinking even though the provider default is enabled", () => {
    expect(deepSeekParameters({})).toEqual({ model: "deepseek-flash", thinking: { type: "disabled" } });
  });
  it("accepts an owner-selected model name but rejects invalid configuration", () => {
    expect(deepSeekParameters({ DEEPSEEK_MODEL: "deepseek-v4-pro" }).model).toBe("deepseek-v4-pro");
    expect(() => deepSeekParameters({ DEEPSEEK_MODEL: "" })).toThrow();
    expect(() => deepSeekParameters({ DEEPSEEK_MODEL: "https://other-provider.test" })).toThrow();
  });
});
