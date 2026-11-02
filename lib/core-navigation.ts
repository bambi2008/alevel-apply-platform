/** Stable public routes: navigation membership must not move saved attempts. */
export const CORE_AREAS = [
  { key: "alevel", href: "/tests/caie9709", index: "01", zh: "A Level", en: "A Level" },
  { key: "competitions", href: "/background", index: "02", zh: "竞赛", en: "Competitions" },
  { key: "admissions", href: "/tests", index: "03", zh: "大学入学考试", en: "University Admissions Tests" },
  { key: "interviews", href: "/interview", index: "04", zh: "面试", en: "Interviews" },
  { key: "statements", href: "/statements", index: "05", zh: "文书", en: "Personal Statements" },
] as const;

export type CoreArea = (typeof CORE_AREAS)[number];

export function coreAreaForPath(pathname: string): CoreArea | undefined {
  const path = pathname.replace(/^\/(?:zh-CN|en)(?=\/|$)/, "").split(/[?#]/)[0];
  const within = (base: string) => path === base || path.startsWith(base + "/");
  if (within("/tests/caie9709")) return CORE_AREAS[0];
  if (within("/background") || within("/tests/bmo") || within("/tests/bpho")) return CORE_AREAS[1];
  if (within("/tests")) return CORE_AREAS[2];
  if (within("/interview")) return CORE_AREAS[3];
  if (within("/statements")) return CORE_AREAS[4];
}

export function coreAreaTitle(area: CoreArea, locale: string) {
  return locale === "en" ? area.en : area.zh;
}
