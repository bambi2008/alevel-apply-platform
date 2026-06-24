// 选校匹配引擎（纯函数，可单测，不依赖 DB/UI）
// 根据学生 A-Level 成绩 + 英语成绩，对照专业入学要求，给出 reach/match/safety 分类与解释。

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
  return GRADE_POINTS[grade.trim().toUpperCase().replace("*", "*")] ?? 0;
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
  aLevelOffer?: string | null; // 例 "A*AA"
  requiredSubjects?: SubjectRequirement[] | null;
  ielts?: number | null;
}

export interface StudentForMatch {
  grades: StudentGrade[]; // 预估或实考
  ielts?: number | null;
}

export type MatchCategory = "safety" | "match" | "reach" | "out_of_reach";

export interface MatchResult {
  category: MatchCategory;
  meetsGrades: boolean;
  meetsSubjects: boolean;
  meetsEnglish: boolean;
  studentPoints: number;
  requiredPoints: number;
  gap: number; // requiredPoints - studentPoints（正数=差多少分）
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

/** 取学生最好的 n 门成绩点数之和。 */
function topPoints(grades: StudentGrade[], n: number): number {
  return grades
    .map((g) => gradePoints(g.grade))
    .sort((a, b) => b - a)
    .slice(0, n)
    .reduce((sum, p) => sum + p, 0);
}

/**
 * 对单个专业做匹配评估。
 * 分类规则：
 *  - 全部满足（成绩+科目+英语）：超出 ≥1 个等级 -> safety；否则 -> match
 *  - 未全部满足：总分差距 gap ≤ 1 个等级 -> reach；否则 -> out_of_reach
 */
export function evaluateMatch(
  student: StudentForMatch,
  req: ProgramRequirement,
): MatchResult {
  const reasons: string[] = [];

  // 1) 成绩点数
  const offerGrades = req.aLevelOffer ? parseOffer(req.aLevelOffer) : [];
  const requiredPoints = offerGrades.reduce((s, g) => s + gradePoints(g), 0);
  const n = offerGrades.length || 3;
  const studentPoints = topPoints(student.grades, n);
  const gap = requiredPoints - studentPoints;
  const meetsGrades = offerGrades.length === 0 ? true : studentPoints >= requiredPoints;

  if (offerGrades.length === 0) {
    reasons.push("该专业未提供结构化成绩要求，仅供参考");
  } else if (meetsGrades) {
    reasons.push(`成绩达标：你最好 ${n} 门 ${studentPoints} 分 ≥ 要求 ${requiredPoints} 分（${req.aLevelOffer}）`);
  } else {
    reasons.push(`成绩偏低：你 ${studentPoints} 分 < 要求 ${requiredPoints} 分（差 ${gap} 分，约 ${gap} 个等级）`);
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
  const allMet = meetsGrades && meetsSubjects && meetsEnglish;
  let category: MatchCategory;
  if (allMet) {
    category = studentPoints >= requiredPoints + 1 ? "safety" : "match";
  } else if (meetsSubjects && meetsEnglish && gap <= 1) {
    // 仅成绩略差、其余满足
    category = "reach";
  } else if (!meetsSubjects || !meetsEnglish) {
    // 硬性条件缺失：成绩接近算 reach，否则 out_of_reach
    category = gap <= 1 ? "reach" : "out_of_reach";
  } else {
    category = "out_of_reach";
  }

  return {
    category,
    meetsGrades,
    meetsSubjects,
    meetsEnglish,
    studentPoints,
    requiredPoints,
    gap,
    reasons,
  };
}

export const CATEGORY_LABEL: Record<MatchCategory, { zh: string; en: string }> = {
  safety: { zh: "稳妥", en: "Safety" },
  match: { zh: "匹配", en: "Match" },
  reach: { zh: "冲刺", en: "Reach" },
  out_of_reach: { zh: "暂不建议", en: "Out of reach" },
};
