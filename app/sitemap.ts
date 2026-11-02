import type { MetadataRoute } from "next";
import { PUBLIC_PATHS, PUBLIC_SITE_ORIGIN } from "@/lib/public-metadata";
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.flatMap(path => ["zh-CN", "en"].map(locale => {
    const suffix = path ? `/${path}` : "";
    return { url: `${PUBLIC_SITE_ORIGIN}/${locale}${suffix}`, alternates: { languages: { "zh-CN": `${PUBLIC_SITE_ORIGIN}/zh-CN${suffix}`, en: `${PUBLIC_SITE_ORIGIN}/en${suffix}`, "x-default": `${PUBLIC_SITE_ORIGIN}/zh-CN${suffix}` } } };
  }));
}
