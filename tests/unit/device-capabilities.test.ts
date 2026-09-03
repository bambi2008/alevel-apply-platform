import { describe, expect, it } from "vitest";
import { supportsDirectCameraCapture } from "@/lib/device-capabilities";

describe("supportsDirectCameraCapture", () => {
  it.each([
    ["iPhone", "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X)", "iPhone", 5],
    ["iPad", "Mozilla/5.0 (iPad; CPU OS 18_6 like Mac OS X)", "iPad", 5],
    ["Android phone", "Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 Mobile", "Linux armv8l", 5],
    ["Android tablet", "Mozilla/5.0 (Linux; Android 16; SM-X900) AppleWebKit/537.36", "Linux armv8l", 10],
  ])("shows direct camera capture on %s", (_label, userAgent, platform, maxTouchPoints) => {
    expect(supportsDirectCameraCapture({ userAgent, platform, maxTouchPoints })).toBe(true);
  });

  it("recognizes iPadOS when Safari requests a desktop-class page", () => {
    expect(supportsDirectCameraCapture({
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/18.6 Safari/605.1.15",
      platform: "MacIntel",
      maxTouchPoints: 5,
    })).toBe(true);
  });

  it.each([
    ["Windows desktop", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", "Win32", 0],
    ["Windows touch laptop", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", "Win32", 10],
    ["Mac desktop", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15", "MacIntel", 0],
  ])("hides direct camera capture on %s", (_label, userAgent, platform, maxTouchPoints) => {
    expect(supportsDirectCameraCapture({ userAgent, platform, maxTouchPoints })).toBe(false);
  });
});
