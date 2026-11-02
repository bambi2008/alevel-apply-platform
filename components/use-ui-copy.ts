"use client";
import { useLocale } from "next-intl";
import { useCallback } from "react";
import { uiCopy } from "@/lib/ui-copy";
export function useUiCopy() {
  const locale = useLocale();
  return useCallback((source: string, ...values: Array<string | number>) => uiCopy(locale, source, ...values), [locale]);
}
