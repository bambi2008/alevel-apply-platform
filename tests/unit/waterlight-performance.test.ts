import { describe, expect, it } from "vitest";
import { readFileSync, statSync } from "node:fs";
describe("waterlight resource and lifecycle contract", () => {
  it("uses a versioned WebP below 300 KB with immutable caching", () => {
    expect(statSync("public/waterlight/riverbed-albedo-v4.webp").size).toBeLessThan(300_000);
    const scene = readFileSync("components/waterlight/waterlight-scene.ts", "utf8");
    expect(scene).toContain("riverbed-albedo-v4.webp");
    expect(scene).not.toContain("riverbed-albedo-v3.png");
    expect(readFileSync("next.config.ts", "utf8")).toContain("public, max-age=31536000, immutable");
  });
  it("never supplies audio bytes before a user gesture", () => {
    const html = readFileSync("app/[locale]/waterlight/page.tsx", "utf8");
    expect(html).toContain('preload="none"');
    expect(html).not.toContain("<source");
    expect(html).not.toContain(".ogg");
    const runtime = readFileSync("components/waterlight/waterlight-runtime.tsx", "utf8");
    expect(runtime.indexOf('addEventListener("click"')).toBeLessThan(runtime.indexOf("audio.src ="));
  });
  it("pauses offscreen/hidden/reduced-motion and disposes resources", () => {
    const scene = readFileSync("components/waterlight/waterlight-scene.ts", "utf8");
    for (const token of ["1000 / 30", "visibilitychange", "motionPreference.matches", "cancelAnimationFrame", "event.origin !== window.location.origin", "events.abort()", "renderer.dispose()", "simulationRead.dispose()", "noiseTexture.dispose()"] ) expect(scene).toContain(token);
    const frame = readFileSync("components/waterlight-hero-frame.tsx", "utf8");
    expect(frame).toContain("IntersectionObserver"); expect(frame).toContain("observer.disconnect()");
  });
  it("keeps sound keyboard reachable and resynchronizes after lazy scene readiness", () => {
    const frame = readFileSync("components/waterlight-hero-frame.tsx", "utf8");
    const scene = readFileSync("components/waterlight/waterlight-scene.ts", "utf8");
    expect(frame).not.toContain("tabIndex={-1}");
    expect(frame).toContain('event.source === element.contentWindow');
    expect(frame).toContain('qiaoshen-waterlight-ready');
    expect(scene).toContain('qiaoshen-waterlight-ready');
    expect(scene).toContain('if (!soundtrack.paused) void setupReactiveAudio()?.resume()');
    expect(readFileSync("app/[locale]/waterlight/waterlight.css", "utf8")).toContain("min-height: 44px");
  });
});
