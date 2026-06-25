// 全站共享常量

export const SUBJECTS = [
  "Mathematics", "Further Mathematics", "Physics", "Chemistry", "Biology",
  "Economics", "Computer Science", "Business", "Accounting", "History",
  "Geography", "English Literature", "Psychology", "Sociology", "Art",
  "Politics", "Law", "Media Studies", "Music", "Chinese",
];

export const GRADES = ["A*", "A", "B", "C", "D", "E"];

export const GRADE_KINDS = [
  { value: "PREDICTED", label: "预估" },
  { value: "ACTUAL", label: "实考" },
  { value: "AS", label: "AS" },
] as const;

export const REGIONS = [
  { value: "UK", label: "英国" },
  { value: "HK", label: "香港" },
] as const;

// 专业方向/学科领域（选校匹配按此过滤）。value 为 slug，与 Program.field 对应。
export const FIELDS: { value: string; zh: string; en: string }[] = [
  { value: "cs", zh: "计算机科学", en: "Computer Science" },
  { value: "ds", zh: "数据科学", en: "Data Science" },
  { value: "economics", zh: "经济学", en: "Economics" },
  { value: "business", zh: "商科管理", en: "Business & Management" },
  { value: "math", zh: "数学", en: "Mathematics" },
  { value: "engineering", zh: "工程（综合）", en: "Engineering" },
  { value: "aerospace", zh: "航空航天工程", en: "Aerospace Engineering" },
  { value: "mechanical", zh: "机械工程", en: "Mechanical Engineering" },
  { value: "eee", zh: "电子电气工程", en: "Electrical & Electronic Eng." },
  { value: "physics", zh: "物理", en: "Physics" },
  { value: "law", zh: "法律", en: "Law" },
  { value: "medicine", zh: "医学", en: "Medicine" },
  { value: "psychology", zh: "心理学", en: "Psychology" },
];

export function fieldLabel(value: string | undefined, locale: string): string {
  const f = FIELDS.find((x) => x.value === value);
  if (!f) return value ?? "";
  return locale === "en" ? f.en : f.zh;
}
