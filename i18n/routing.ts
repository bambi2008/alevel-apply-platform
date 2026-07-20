import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["zh-CN", "en"],
  defaultLocale: "zh-CN",
  // Keep generated links aligned with proxy.ts, which serves every locale under a prefix.
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];
