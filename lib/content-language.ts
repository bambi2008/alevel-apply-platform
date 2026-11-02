import data from "@/data/content-language/en.json";
import supplement from "@/data/content-language/en-supplement.json";
import { CONTENT_STRUCTURAL_FIELDS, contentLanguageKey, HAS_HAN } from "./content-language-key";

const english = data.translations as Record<string, string>;
const extra = supplement.translations as Record<string, string>;
/** Offline static presentation only. Never call this with user work or API responses. */
export function contentText(source: string, locale: string): string {
  if (locale !== "en" || !HAS_HAN.test(source)) return source;
  const key = contentLanguageKey(source);
  return english[key] ?? extra[key] ?? source;
}

const caches = new WeakMap<object, unknown>();
/** Immutable, cached translation of owned static learning data; scoring fields stay exact. */
export function localizeStaticContent<T>(value: T, locale: string, field = ""): T {
  if (locale !== "en" || CONTENT_STRUCTURAL_FIELDS.has(field)) return value;
  if (typeof value === "string") return contentText(value, locale) as T;
  if (!value || typeof value !== "object") return value;
  if (caches.has(value)) return caches.get(value) as T;
  const localized = Array.isArray(value)
    ? value.map(item => localizeStaticContent(item, locale, field))
    : Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localizeStaticContent(item, locale, key)]));
  caches.set(value, localized);
  return localized as T;
}
