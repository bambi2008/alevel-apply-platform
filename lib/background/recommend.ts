// 背景提升 —— 方向分类器 + 个性化推荐算法。
// 依据学生的「目标专业」与「A-Level 科目」把项目排序，并给出推荐理由（可解释）。

import { BACKGROUND_CATALOG, type CatalogItem, type BgField } from "./catalog";

// 每个方向的关键词（中英），用于把自由文本的目标专业归类。
const FIELD_KEYWORDS: Record<BgField, string[]> = {
  CS_ENG: ["comput", "software", "engineer", "artificial intelligence", " ai", "data", "information", "计算机", "软件", "工程", "人工智能", "数据", "信息"],
  ECON: ["econ", "business", "financ", "management", "accounting", "commerce", "经济", "商", "金融", "管理", "会计"],
  MATH: ["math", "statistic", "数学", "统计"],
  SCIENCE: ["physics", "chemist", "biolog", "natural science", "material", "物理", "化学", "生物", "材料", "自然科学"],
  MED: ["medic", "medicine", "dentist", "dental", "pharmac", "医学", "临床", "牙", "药学"],
};

// A-Level 科目 → 相关方向（用于科目加权）。
const SUBJECT_FIELDS: { match: string[]; fields: BgField[] }[] = [
  { match: ["math"], fields: ["MATH", "CS_ENG", "ECON"] },
  { match: ["physic"], fields: ["SCIENCE", "CS_ENG"] },
  { match: ["chemist"], fields: ["SCIENCE", "MED"] },
  { match: ["biolog"], fields: ["SCIENCE", "MED"] },
  { match: ["econ"], fields: ["ECON"] },
  { match: ["comput"], fields: ["CS_ENG"] },
];

/** 把自由文本的目标专业归类为方向。无法识别时返回空数组。 */
export function classifyMajors(majors: string[]): BgField[] {
  const found = new Set<BgField>();
  for (const raw of majors) {
    const m = " " + (raw || "").toLowerCase();
    for (const field of Object.keys(FIELD_KEYWORDS) as BgField[]) {
      if (FIELD_KEYWORDS[field].some((kw) => m.includes(kw))) found.add(field);
    }
  }
  return [...found];
}

/** 由 A-Level 科目推出的相关方向。 */
export function fieldsFromSubjects(subjects: string[]): Set<BgField> {
  const out = new Set<BgField>();
  for (const s of subjects) {
    const low = (s || "").toLowerCase();
    for (const rule of SUBJECT_FIELDS) {
      if (rule.match.some((k) => low.includes(k))) rule.fields.forEach((f) => out.add(f));
    }
  }
  return out;
}

export interface RecommendInput {
  intendedMajors: string[];
  subjects: string[]; // 科目名，如 ["Mathematics","Physics"]
}

export interface ScoredItem {
  item: CatalogItem;
  score: number;
  reasons: string[];
  primary: boolean; // 是否属于学生的主攻方向
}

/**
 * 个性化推荐：为目录中每个项目打分并排序。
 * 打分维度：目标专业方向匹配（主）、科目相关性（次）、类别多样性微调。
 */
export function recommend(input: RecommendInput): ScoredItem[] {
  const majorFields = classifyMajors(input.intendedMajors);
  // 若无法识别目标专业，则以科目推断的方向作为主方向；再兜底为全部方向。
  const subjFields = fieldsFromSubjects(input.subjects);
  const primaryFields =
    majorFields.length > 0
      ? new Set(majorFields)
      : subjFields.size > 0
      ? subjFields
      : new Set<BgField>(["CS_ENG", "ECON", "MATH", "SCIENCE", "MED"]);

  const scored: ScoredItem[] = BACKGROUND_CATALOG.map((item) => {
    let score = 0;
    const reasons: string[] = [];
    const isPrimary = primaryFields.has(item.field);

    if (isPrimary) {
      score += 10;
      if (majorFields.includes(item.field)) reasons.push("与你的目标专业方向匹配");
    }
    if (subjFields.has(item.field)) {
      score += 3;
      reasons.push("与你的 A-Level 选科相关");
    }
    // 入门项目略微加权，便于起步；挑战项目对主方向学生更有价值
    if (item.difficulty === 1) score += 1;
    if (item.difficulty === 3 && isPrimary) score += 1;

    return { item, score, reasons, primary: isPrimary };
  });

  // 排序：分数降序；同分时主方向优先、难度低优先（更易起步）
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.primary !== b.primary) return a.primary ? -1 : 1;
    return a.item.difficulty - b.item.difficulty;
  });

  return scored;
}

/** 仅返回主方向的推荐（用于「为你推荐」板块）。 */
export function topRecommendations(input: RecommendInput, limit = 8): ScoredItem[] {
  return recommend(input)
    .filter((s) => s.primary)
    .slice(0, limit);
}
