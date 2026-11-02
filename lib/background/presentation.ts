import english from "@/data/background-copy-en.json";
/** Only owned catalogue descriptions/timing. Never apply to saved project titles or notes. */
export function backgroundStaticCopy(source: string, locale: string): string {
  return locale === "en" && Object.hasOwn(english, source) ? (english as Record<string, string>)[source] : source;
}
