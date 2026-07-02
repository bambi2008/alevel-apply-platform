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

export interface IeltsSubscores {
  listening?: number | null;
  reading?: number | null;
  writing?: number | null;
  speaking?: number | null;
}

export interface ProgramRequirement {
  typicalOffer?: string | null; // 典型 offer，如 "AAA"
  minimumOffer?: string | null; // 最低 offer，如 "AAB"
  requiredSubjects?: SubjectRequirement[] | null; // 必修科目
  excludedSubjects?: string[] | null; // 不接受计入的科目，如 General Studies
  ielts?: number | null; // 雅思总分要求
  ieltsSubscores?: IeltsSubscores | null; // 雅思单科小分要求
}

export interface StudentForMatch {
  grades: StudentGrade[]; // 预估或实考
  ielts?: number | null;
  ieltsSubscores?: IeltsSubscores | null;
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
 * 逐科（排序后按位）比较学生成绩与 offer。
 * 真实 A-Level offer 是「每一科都要达到对应等级」，而非总分达标——
 * 因此把学生与 offer 各自降序排列后逐位比较，避免高分科目补偿过低科目
 * （例如 A*A*C 的总分等于 AAA，但第三科 C 达不到 A，不应判为达标）。
 * @returns met 是否逐位达标；shortfall 各位缺口之和（等级点数）；surplus 各位盈余之和
 */
function comparePositionwise(
  studentGrades: StudentGrade[],
  offerGrades: string[],
  excluded: Set<string>,
): { met: boolean; shortfall: number; surplus: number } {
  const studentPts = studentGrades
    .filter((g) => !excluded.has(norm(g.subject)))
    .map((g) => gradePoints(g.grade))
    .sort((a, b) => b - a);
  const offerPts = offerGrades.map(gradePoints).sort((a, b) => b - a);

  let met = true;
  let shortfall = 0;
  let surplus = 0;
  for (let i = 0; i < offerPts.length; i++) {
    const s = studentPts[i] ?? 0; // 学生缺这门 → 记 0 分
    const o = offerPts[i];
    if (s < o) {
      met = false;
      shortfall += o - s;
    } else {
      surplus += s - o;
    }
  }
  return { met, shortfall, surplus };
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

  // 1) 成绩：逐科（排序后按位）比较，避免高分科目补偿过低科目
  const typicalStr = req.typicalOffer || req.minimumOffer || "";
  const minimumStr = req.minimumOffer || req.typicalOffer || "";
  const typicalGrades = typicalStr ? parseOffer(typicalStr) : [];
  const minimumGrades = minimumStr ? parseOffer(minimumStr) : [];
  const typical = {
    points: typicalGrades.reduce((s, g) => s + gradePoints(g), 0),
    count: typicalGrades.length,
  };
  const minimum = {
    points: minimumGrades.reduce((s, g) => s + gradePoints(g), 0),
    count: minimumGrades.length,
  };
  const n = typical.count || minimum.count || 3;
  const studentPoints = topPoints(student.grades, n, excluded);

  const typicalCmp = comparePositionwise(student.grades, typicalGrades, excluded);
  const minimumCmp = comparePositionwise(student.grades, minimumGrades, excluded);
  const meetsTypical = typical.count === 0 ? true : typicalCmp.met;
  const meetsMinimumGrades = minimum.count === 0 ? true : minimumCmp.met;

  if (typical.count === 0 && minimum.count === 0) {
    reasons.push("该专业未提供结构化成绩要求，仅供参考");
  } else if (meetsTypical) {
    reasons.push(`成绩逐科达到典型要求 ${typicalStr}`);
  } else if (meetsMinimumGrades) {
    reasons.push(`成绩达到最低要求 ${minimumStr}，但未达典型 ${typicalStr}`);
  } else {
    reasons.push(`成绩未达最低要求 ${minimumStr}（约差 ${minimumCmp.shortfall} 个等级）`);
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

  // 3b) 雅思单科小分
  if (req.ieltsSubscores) {
    const bands: { key: keyof IeltsSubscores; zh: string }[] = [
      { key: "listening", zh: "听力" },
      { key: "reading", zh: "阅读" },
      { key: "writing", zh: "写作" },
      { key: "speaking", zh: "口语" },
    ];
    for (const b of bands) {
      const need = req.ieltsSubscores[b.key];
      if (need == null) continue;
      const got = student.ieltsSubscores?.[b.key];
      if (got == null) {
        meetsEnglish = false;
        reasons.push(`需要雅思${b.zh}小分 ${need}，你未填写`);
      } else if (got < need) {
        meetsEnglish = false;
        reasons.push(`雅思${b.zh} ${got} 低于要求 ${need}`);
      }
    }
  }

  // 4) 综合分类（基于逐科比较的余量 / 差距）
  const eligible = meetsMinimumGrades && meetsSubjects && meetsEnglish;
  let category: MatchCategory;
  if (meetsTypical && meetsSubjects && meetsEnglish) {
    // 逐科均达典型；若整体还有 ≥1 个等级的富余则更稳妥
    category = typicalCmp.surplus >= 1 ? "safety" : "match";
  } else if (eligible) {
    category = "reach"; // 达到最低但未达典型
  } else if (meetsSubjects && meetsEnglish && minimumCmp.shortfall <= 1) {
    category = "reach"; // 接近最低（约差 1 个等级）
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
