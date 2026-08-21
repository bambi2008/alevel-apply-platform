import type { UserProfile } from "@/lib/profile/store";
import type { AdmissionsTest } from "./index";

type IntentGroup = {
  terms: string[];
  testIds: string[];
};

const GROUPS: IntentGroup[] = [
  {
    terms: ["engineering", "engineer", "工程", "aerospace", "aeronautical", "航空航天", "航空工程", "mechanical", "机械", "electrical", "电子", "civil engineering", "土木", "chemical engineering", "化学工程"],
    testIds: ["esat", "tmua", "pat", "caie9709"],
  },
  {
    terms: ["mathematics", "maths", "数学", "statistics", "统计", "actuarial", "精算", "data science", "数据科学"],
    testIds: ["tmua", "step", "mat", "caie9709"],
  },
  {
    terms: ["computer science", "computing", "计算机", "software", "软件", "artificial intelligence", "人工智能"],
    testIds: ["tmua", "tara", "mat", "caie9709"],
  },
  {
    terms: ["physics", "物理", "chemistry", "化学", "natural sciences", "自然科学", "materials science", "材料科学", "earth sciences", "地球科学"],
    testIds: ["esat", "pat", "caie9709"],
  },
  {
    terms: ["economics", "经济", "finance", "金融", "land economy", "土地经济"],
    testIds: ["tmua", "tara", "caie9709"],
  },
  {
    terms: ["law", "llb", "法律", "法学"],
    testIds: ["lnat"],
  },
  {
    terms: ["medicine", "medical", "医学", "dentistry", "dental", "牙医", "牙医学"],
    testIds: ["ucat"],
  },
  {
    terms: ["veterinary", "兽医"],
    testIds: ["esat"],
  },
  {
    terms: ["ppe", "politics", "政治", "psychology", "心理", "human sciences", "人类科学", "history and economics", "历史与经济"],
    testIds: ["tara"],
  },
];

function normalize(value: string): string {
  return value.toLocaleLowerCase().replace(/[&/_,，、()（）-]+/g, " ").replace(/\s+/g, " ").trim();
}

function containsTerm(haystack: string, terms: string[]): boolean {
  return terms.some((term) => haystack.includes(normalize(term)));
}

export function hasTestIntent(profile: UserProfile | null): boolean {
  return Boolean(
    profile
    && (profile.intendedMajors.length > 0
      || (profile.intendedUniversities?.length ?? 0) > 0
      || profile.subjects.some((subject) => subject.subject.trim())),
  );
}

export function filterTestsForIntent(
  tests: AdmissionsTest[],
  profile: UserProfile | null,
): AdmissionsTest[] {
  if (!hasTestIntent(profile) || !profile) return tests;

  const majorAndSubjectIntent = normalize([
    ...profile.intendedMajors,
    ...profile.subjects.map((subject) => subject.subject),
  ].join(" "));
  const universityIntent = normalize(profile.intendedUniversities?.join(" ") ?? "");
  const allowedIds = new Set<string>(["ielts"]);

  for (const group of GROUPS) {
    if (containsTerm(majorAndSubjectIntent, group.terms)) {
      group.testIds.forEach((testId) => allowedIds.add(testId));
    }
  }

  const computerScienceIntent = containsTerm(majorAndSubjectIntent, GROUPS[2].terms);
  const cambridgeIntent = containsTerm(universityIntent, ["university of cambridge", "cambridge", "peterhouse", "trinity college", "剑桥"]);
  if (computerScienceIntent && cambridgeIntent) allowedIds.add("csat");

  for (const test of tests) {
    if (test.id === "csat") continue;
    const programText = normalize([...test.programs, ...test.programsEn].join(" "));
    if (majorAndSubjectIntent && containsTerm(programText, profile.intendedMajors)) {
      allowedIds.add(test.id);
    }
  }

  return tests.filter((test) => allowedIds.has(test.id));
}
