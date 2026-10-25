"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === "en" ? "zh-CN" : "en";
  const label = locale === "en" ? "中文" : "EN";

  return (
    <Link
      href={pathname}
      locale={other}
      hrefLang={other}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-2.5 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
      aria-label="切换语言 / Switch language"
    >
      {label}
    </Link>
  );
}
