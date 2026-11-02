import dictionary from "@/data/ui-copy-en.json";
const english = dictionary as Record<string, string>;
/** Explicit, reviewed UI copy; never rewrites questions, user work or API data. */
export function uiCopy(locale: string, source: string, ...values: Array<string | number>): string {
  const template = locale === "en" && Object.hasOwn(english, source) ? english[source] : source;
  return template.replace(/\{(\d+)\}/g, (token, index) => values[Number(index)] === undefined ? token : String(values[Number(index)]));
}
