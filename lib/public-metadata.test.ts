import { describe, expect, it } from "vitest";
import { PUBLIC_PATHS, routeMetadata } from "./public-metadata";
import sitemap from "../app/sitemap";
import robots from "../app/robots";
describe("route-specific metadata and crawl boundaries", () => {
  it("provides independent bilingual titles, canonical, language alternatives and cards", () => {
    for (const locale of ["zh-CN", "en"]) {
      const titles = PUBLIC_PATHS.map(path => routeMetadata(locale, `/${locale}/${path}`).title);
      expect(new Set(titles).size).toBe(titles.length);
      for (const path of PUBLIC_PATHS) {
        const meta = routeMetadata(locale, `/${locale}/${path}`);
        expect(meta.alternates?.canonical).toBe(`https://qiaoshenedu.com/${locale}${path ? `/${path}` : ""}`);
        expect(Object.keys(meta.alternates?.languages ?? {})).toEqual(["zh-CN", "en", "x-default"]);
        expect(meta.openGraph).toBeDefined(); expect(meta.twitter).toBeDefined();
        expect(meta.robots).toMatchObject({ index: true });
        if (locale === "en") expect(JSON.stringify([meta.title, meta.description])).not.toMatch(/[\u4e00-\u9fff]/);
      }
    }
  });
  it("indexes no account, unpublished, answer or private route", () => {
    const urls = sitemap().map(entry => entry.url);
    expect(urls).toHaveLength(PUBLIC_PATHS.length * 2);
    expect(urls.some(url => /login|register|about|account|history|\/paper\//.test(url))).toBe(false);
    for (const route of ["account", "profile", "admin", "about", "login", "tests/esat/history/secret-session"]) expect(routeMetadata("en", `/en/${route}`).robots).toMatchObject({ index: false });
    expect(JSON.stringify(robots())).toContain("/en/register");
  });
  it("never publishes session IDs, account paths or query tokens in share metadata", () => {
    for (const path of ["tests/esat/history/private-session-7", "admin/users/student-9", "account/reset/private-token", "unrecognised/private-token"]) {
      const meta = routeMetadata("en", `/en/${path}`);
      expect(meta.robots).toMatchObject({ index: false, follow: false });
      const encoded = JSON.stringify(meta);
      expect(encoded).not.toMatch(/private-session-7|student-9|private-token|\/admin\/|\/account\//);
      expect(meta.alternates?.canonical).toBe(`https://qiaoshenedu.com/en${path.startsWith("tests/esat/") ? "/tests/esat" : ""}`);
    }
  });
});
