// 选校匹配引擎（纯函数，可单测，不依赖 DB/UI）
// 根据学生 A-Level 成绩 + 英语成绩，对照专业入学要求（最低/典型 offer、必修与不接受科目、英语），
// 给出 reach/match/safety 分类与解释。

export type ALevelGrade = "A*" | "A" | "B" | "C" | "D" | "E" | "U";

export const GRADE_POINTS: Record<string, number> = {
  "A*": 6,
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
  U: 0,
};

export function gradePoints(grade: string): number {
  return GRADE_POINTS[grade.trim().toUpperCase()] ?? 0;
}

export interface StudentGrade {
  subject: string;
  grade: string;
}

export interface SubjectRequirement {
  subject: string;
  minGrade: string;
}

export interface ProgramRequirement {
  typicalOffer?: string | null; // 典型 offer，如 "AAA"
  minimumOffer?: string | null; // 最低 offer，如 "AAB"
  requiredSubjects?: SubjectRequirement[] | null; // 必修科目
  excludedSubjects?: string[] | null; // 不接受计入的科目，如 General Studies
  ielts?: number | null; // 雅思总分要求
}

export interface StudentForMatch {
  grades: StudentGrade[]; // 预估或实考
  ielts?: number | null;
}

export type MatchCategory = "safety" | "match" | "reach" | "out_of_reach";

export interface MatchResult {
  category: MatchCategory;
  eligible: boolean; // 达到最低门槛（成绩+科目+英语均满足最低）
  meetsTypical: boolean; // 达到典型 offer
  meetsMinimumGrades: boolean;
  meetsSubjects: boolean;
  meetsEnglish: boolean;
  studentPoints: number;
  typicalPoints: number;
  minimumPoints: number;
  reasons: string[];
}

/** 解析 offer 字符串如 "A*AA" -> ["A*","A","A"]。 */
export function parseOffer(offer: string): string[] {
  const grades: string[] = [];
  const s = offer.trim().toUpperCase();
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === " ") continue;
    if (ch === "A" && s[i + 1] === "*") {
      grades.push("A*");
      i++;
    } else if ("ABCDEU".includes(ch)) {
      grades.push(ch);
    }
  }
  return grades;
}

const norm = (s: string) => s.trim().toLowerCase();

function offerPoints(offer: string): { points: number; count: number } {
  const grades = parseOffer(offer);
  return {
    points: grades.reduce((sum, g) => sum + gradePoints(g), 0),
    count: grades.length,
  };
}

/** 取学生最好的 n 门成绩点数之和（已剔除不接受科目）。 */
function topPoints(grades: StudentGrade[], n: number, excluded: Set<string>): number {
  return grades
    .filter((g) => !excluded.has(norm(g.subject)))
    .map((g) => gradePoints(g.grade))
    .sort((a, b) => b - a)
    .slice(0, n)
    .reduce((sum, p) => sum + p, 0);
}

/**
 * 对单个专业做匹配评估。
 * 分类规则：
 *  - 达到典型 offer + 满足科目/英语：超出 ≥1 个等级 -> safety；否则 -> match
 *  - 仅达到最低 offer（< 典型）+ 满足科目/英语：reach
 *  - 接近最低（差 ≤1 个等级）：reach
 *  - 其余（含必修缺失/英语不达且差距大）：out_of_reach
 */
export function evaluateMatch(
  student: StudentForMatch,
  req: ProgramRequirement,
): MatchResult {
  const reasons: string[] = [];
  const excluded = new Set((req.excludedSubjects ?? []).map(norm));

  // 不接受科目提示
  const usedExcluded = student.grades.filter((g) => excluded.has(norm(g.subject)));
  if (usedExcluded.length > 0) {
    reasons.push(
      `注意：${usedExcluded.map((g) => g.subject).join("、")} 不计入该校成绩要求`,
    );
  }

  // 1) 成绩点数（典型 / 最低）
  const typicalStr = req.typicalOffer || req.minimumOffer || "";
  const minimumStr = req.minimumOffer || req.typicalOffer || "";
  const typical = typicalStr ? offerPoints(typicalStr) : { points: 0, count: 0 };
  const minimum = minimumStr ? offerPoints(minimumStr) : { points: 0, count: 0 };
  const n = typical.count || minimum.count || 3;
  const studentPoints = topPoints(student.grades, n, excluded);

  const meetsTypical = typical.count === 0 ? true : studentPoints >= typical.points;
  const meetsMinimumGrades = minimum.count === 0 ? true : studentPoints >= minimum.points;

  if (typical.count === 0 && minimum.count === 0) {
    reasons.push("该专业未提供结构化成绩要求，仅供参考");
  } else if (meetsTypical) {
    reasons.push(`成绩达到典型要求：你最好 ${n} 门 ${studentPoints} 分 ≥ ${typicalStr}（${typical.points} 分）`);
  } else if (meetsMinimumGrades) {
    reasons.push(`成绩达到最低要求 ${minimumStr}（${minimum.points} 分），但低于典型 ${typicalStr}`);
  } else {
    reasons.push(`成绩 ${studentPoints} 分 < 最低要求 ${minimumStr}（${minimum.points} 分），差 ${minimum.points - studentPoints} 分`);
  }

  // 2) 先修科目
  let meetsSubjects = true;
  const reqSubjects = req.requiredSubjects ?? [];
  for (const rs of reqSubjects) {
    const sg = student.grades.find((g) => norm(g.subject) === norm(rs.subject));
    if (!sg) {
      meetsSubjects = false;
      reasons.push(`缺少必修科目：${rs.subject}（要求 ${rs.minGrade}）`);
    } else if (gradePoints(sg.grade) < gradePoints(rs.minGrade)) {
      meetsSubjects = false;
      reasons.push(`${rs.subject} 成绩 ${sg.grade} 低于要求 ${rs.minGrade}`);
    }
  }
  if (reqSubjects.length > 0 && meetsSubjects) {
    reasons.push("必修科目要求已满足");
  }

  // 3) 英语
  let meetsEnglish = true;
  if (req.ielts != null) {
    if (student.ielts == null) {
      meetsEnglish = false;
      reasons.push(`需要雅思 ${req.ielts}，你尚未填写英语成绩`);
    } else if (student.ielts < req.ielts) {
      meetsEnglish = false;
      reasons.push(`雅思 ${student.ielts} 低于要求 ${req.ielts}`);
    } else {
      reasons.push(`雅思 ${student.ielts} 满足要求 ${req.ielts}`);
    }
  }

  // 4) 综合分类
  const eligible = meetsMinimumGrades && meetsSubjects && meetsEnglish;
  const minGap = minimum.points - studentPoints;
  let category: MatchCategory;
  if (meetsTypical && meetsSubjects && meetsEnglish) {
    category = studentPoints >= typical.points + 1 ? "safety" : "match";
  } else if (eligible) {
    category = "reach"; // 达到最低但未达典型
  } else if (meetsSubjects && meetsEnglish && minGap <= 1) {
    category = "reach"; // 接近最低
  } else {
    category = "out_of_reach";
  }

  return {
    category,
    eligible,
    meetsTypical,
    meetsMinimumGrades,
    meetsSubjects,
    meetsEnglish,
    studentPoints,
    typicalPoints: typical.points,
    minimumPoints: minimum.points,
    reasons,
  };
}

export const CATEGORY_LABEL: Record<MatchCategory, { zh: string; en: string }> = {
  safety: { zh: "稳妥", en: "Safety" },
  match: { zh: "匹配", en: "Match" },
  reach: { zh: "冲刺", en: "Reach" },
  out_of_reach: { zh: "暂不建议", en: "Out of reach" },
};
