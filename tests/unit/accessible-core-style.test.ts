import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("app/globals.css", "utf8");
function rgb(hex: string): number[] { return hex.replace("#", "").match(/../g)!.map(v => Number.parseInt(v, 16)); }
function contrast(a: number[], b: number[]): number {
  const l = (c: number[]) => c.map(v => { const n=v/255; return n<=.04045?n/12.92:((n+.055)/1.055)**2.4; }).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
  return (Math.max(l(a),l(b))+.05)/(Math.min(l(a),l(b))+.05);
}
describe("core interface contrast and usable targets", () => {
  it("keeps secondary and warning text above AA contrast on their actual flat surfaces", () => {
    const faint=[...css.matchAll(/--ink-faint:\s*(#[a-f0-9]{6})/gi)].map(m=>m[1]);
    expect(faint).toHaveLength(2);
    for(const bg of ["#f4f4f0","#ecece7","#e4e4de","#ffffff"]) expect(contrast(rgb(faint[1]),rgb(bg))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(rgb(faint[0]),rgb("#ffffff"))).toBeGreaterThanOrEqual(4.5);
    const warning=css.match(/--warning:\s*(#[a-f0-9]{6})/i)![1];
    for(const bg of ["#f4f4f0","#faebdd","#ffffff"]) expect(contrast(rgb(warning),rgb(bg))).toBeGreaterThanOrEqual(4.5);
    for(const bg of ["#f4f4f0","#ffffff"]) expect(contrast(rgb(bg).map(v=>v*.4),rgb(bg))).toBeGreaterThanOrEqual(4.5);
  });
  it("retains explicit keyboard focus and 44px base controls", () => {
    expect(css).toMatch(/\.btn\s*\{[^}]*min-height:\s*44px/s);
    expect(css).toMatch(/\.input\s*\{[^}]*min-height:\s*44px/s);
    expect(css).toMatch(/\.input:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--indigo\)/s);
    const page=readFileSync("app/[locale]/background/page.tsx","utf8");
    expect(page).toContain('aria-label={english ? "Target date" : "目标日期"}');
    expect(page).toContain('min-h-11 min-w-11 items-center text-sm font-medium');
  });
});
