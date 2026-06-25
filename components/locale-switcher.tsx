"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const other = locale === "en" ? "zh-CN" : "en";
  const label = locale === "en" ? "中文" : "EN";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: other })}
      className="px-2.5 py-1.5 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 text-sm"
      aria-label="切换语言 / Switch language"
    >
      {label}
    </button>
  );
}
