import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["zh-CN", "en"],
  defaultLocale: "zh-CN",
  // 默认中文不带前缀（/、/match）；英文走 /en、/en/match
  localePrefix: "as-needed",
});

export type AppLocale = (typeof routing.locales)[number];
