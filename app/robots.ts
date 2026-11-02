import type { MetadataRoute } from "next";
import { PUBLIC_SITE_ORIGIN } from "@/lib/public-metadata";
export default function robots(): MetadataRoute.Robots {
  const privatePaths = ["login", "register", "forgot-password", "reset-password", "account", "profile", "admin", "about", "waterlight", "background/my-projects", "tests/*/practice", "tests/*/paper", "tests/*/history", "tests/*/review"];
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", ...["zh-CN", "en"].flatMap(locale => privatePaths.map(path => `/${locale}/${path}`))] }, sitemap: `${PUBLIC_SITE_ORIGIN}/sitemap.xml` };
}
