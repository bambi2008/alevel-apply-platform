// 背景提升项目目录（软背景规划）。
// 覆盖申英港五大主流方向：计算机/工程、经济/商科、数学、自然科学、医学。
// 说明为「方向性描述」——不写死会变动的报名时间/费用；官方链接为占位，后续在管理后台补充。
// 数据为原创整理，涉及的均为真实、知名的项目。

export type BgField = "CS_ENG" | "ECON" | "MATH" | "SCIENCE" | "MED";
export type BgCategory = "COMPETITION" | "RESEARCH" | "ACTIVITY" | "SUMMER_SCHOOL";

export const BG_FIELDS: { value: BgField; label: string; labelEn: string }[] = [
  { value: "CS_ENG", label: "计算机 / 工程", labelEn: "Computer Science / Engineering" },
  { value: "ECON", label: "经济 / 商科", labelEn: "Economics / Business" },
  { value: "MATH", label: "数学", labelEn: "Mathematics" },
  { value: "SCIENCE", label: "自然科学（物理/化学/生物）", labelEn: "Natural Sciences" },
  { value: "MED", label: "医学", labelEn: "Medicine" },
];

export const BG_CATEGORIES: { value: BgCategory; label: string; emoji: string }[] = [
  { value: "COMPETITION", label: "竞赛", emoji: "🏆" },
  { value: "RESEARCH", label: "科研", emoji: "🔬" },
  { value: "SUMMER_SCHOOL", label: "夏校", emoji: "🎓" },
];

export function fieldLabel(f: BgField): string {
  return BG_FIELDS.find((x) => x.value === f)?.label ?? f;
}
export function categoryLabel(c: BgCategory): string {
  return BG_CATEGORIES.find((x) => x.value === c)?.label ?? c;
}
export function categoryEmoji(c: BgCategory): string {
  return BG_CATEGORIES.find((x) => x.value === c)?.emoji ?? "•";
}

// ───────── 顶层两大类：竞赛 / 实践 ─────────
// 竞赛 = COMPETITION；实践 = 科研 + 活动 + 夏校（亲身经历型）。
export type BgGroup = "COMPETITION" | "PROFESSIONAL";

export const BG_GROUPS: { value: BgGroup; label: string; emoji: string; desc: string }[] = [
  { value: "COMPETITION", label: "竞赛", emoji: "🏆", desc: "各类学术竞赛与奥林匹克，用可量化的名次与奖项证明学术实力。" },
  { value: "PROFESSIONAL", label: "专业实践", emoji: "🔬", desc: "科研课题、独立论文与学科夏校等专业性经历，积累文书素材与面试谈资。" },
];

export function groupOfCategory(c: BgCategory): BgGroup {
  return c === "COMPETITION" ? "COMPETITION" : "PROFESSIONAL";
}
export function groupLabel(g: BgGroup): string {
  return BG_GROUPS.find((x) => x.value === g)?.label ?? g;
}
export function groupEmoji(g: BgGroup): string {
  return BG_GROUPS.find((x) => x.value === g)?.emoji ?? "•";
}

export interface CatalogItem {
  id: string;
  field: BgField;
  category: BgCategory;
  title: string;
  titleEn: string;
  description: string; // 方向性描述
  difficulty: 1 | 2 | 3; // 1 入门 / 2 进阶 / 3 挑战
  timing: string; // 方向性时间建议
  officialUrl?: string; // 占位，后续补充
  testId?: string; // 若该竞赛在平台已有题库，指向 /tests/{testId}
}

export const BACKGROUND_CATALOG: CatalogItem[] = [
  // ───────── 计算机 / 工程 ─────────
  {
    id: "bg-cse-bio", field: "CS_ENG", category: "COMPETITION",
    title: "英国信息学奥林匹克 (BIO)", titleEn: "British Informatics Olympiad",
    description: "算法编程竞赛，练习算法设计、问题分析与程序实现。",
    difficulty: 3, timing: "高一至高二", officialUrl: "",
  },
  {
    id: "bg-cse-usaco", field: "CS_ENG", category: "COMPETITION",
    title: "美国计算机奥赛 (USACO)", titleEn: "USA Computing Olympiad",
    description: "分级算法竞赛，练习数据结构、算法设计与程序实现。",
    difficulty: 3, timing: "全年多场，建议尽早开始", officialUrl: "",
  },
  {
    id: "bg-cse-opensource", field: "CS_ENG", category: "RESEARCH",
    title: "开源项目实践", titleEn: "Open-source Projects",
    description: "参与开源项目，记录代码贡献、问题分析与协作过程。已有规划中的原始名称保持不变。",
    difficulty: 2, timing: "全年，适合长期投入", officialUrl: "",
  },
  {
    id: "bg-cse-kaggle", field: "CS_ENG", category: "COMPETITION",
    title: "Kaggle 数据竞赛", titleEn: "Kaggle Data Competitions",
    description: "围绕数据集完成建模、验证和结果分析；参赛要求以各赛题规则为准。",
    difficulty: 2, timing: "按各赛题安排", officialUrl: "",
  },
  {
    id: "bg-cse-summer", field: "CS_ENG", category: "SUMMER_SCHOOL",
    title: "大学计算机夏校", titleEn: "University CS Summer Programs",
    description: "参加大学或机构举办的计算机主题夏校，接触大学层次的课程与项目，了解专业方向并提前体验学术氛围。",
    difficulty: 2, timing: "暑期", officialUrl: "",
  },

  // ───────── 经济 / 商科 ─────────
  {
    id: "bg-econ-johnlocke", field: "ECON", category: "COMPETITION",
    title: "John Locke 论文竞赛", titleEn: "John Locke Institute Essay Competition",
    description: "学术论文竞赛，练习独立思辨、资料分析与论证写作。",
    difficulty: 3, timing: "通常暑期截稿，建议提前数月准备", officialUrl: "",
  },
  {
    id: "bg-econ-marshall", field: "ECON", category: "COMPETITION",
    title: "剑桥 Marshall 经济论文竞赛", titleEn: "Marshall Society Economics Essay",
    description: "由剑桥大学经济学生组织举办的论文竞赛，考查经济学理解与分析写作，适合目标经济专业、想展示学术潜力的学生。",
    difficulty: 3, timing: "每年一届", officialUrl: "",
  },
  {
    id: "bg-econ-nec", field: "ECON", category: "COMPETITION",
    title: "全美经济学挑战 (NEC)", titleEn: "National Economics Challenge",
    description: "团队形式的经济学知识竞赛，涵盖微观、宏观与时事，适合系统巩固经济学基础、锻炼团队协作。",
    difficulty: 2, timing: "赛季制", officialUrl: "",
  },
  {
    id: "bg-econ-research", field: "ECON", category: "RESEARCH",
    title: "经济课题研究 / 独立论文", titleEn: "Economics Research / Independent Paper",
    description: "围绕一个感兴趣的经济现象做独立研究并撰写论文，可在导师指导下完成，体现研究方法与学术深度。",
    difficulty: 2, timing: "全年，适合长期投入", officialUrl: "",
  },
  {
    id: "bg-econ-summer", field: "ECON", category: "SUMMER_SCHOOL",
    title: "经济 / 商科夏校（如 LSE）", titleEn: "Economics Summer Schools",
    description: "参加知名高校的经济或商科夏校，修读大学水平课程，提升学术背景并了解专业方向。",
    difficulty: 2, timing: "暑期", officialUrl: "",
  },

  // ───────── 数学 ─────────
  {
    id: "bg-math-ukmt", field: "MATH", category: "COMPETITION",
    title: "UKMT 数学挑战 → BMO", titleEn: "UKMT Senior Challenge → BMO",
    description: "数学挑战与奥林匹克训练，练习解题、推理和证明。参赛资格以当届规则为准。",
    difficulty: 3, timing: "秋季起逐轮晋级", officialUrl: "", testId: "bmo",
  },
  {
    id: "bg-math-yau", field: "MATH", category: "COMPETITION",
    title: "丘成桐中学科学奖（数学）", titleEn: "Yau Science Award (Mathematics)",
    description: "以研究报告形式参评，练习数学研究、论证与学术写作。",
    difficulty: 3, timing: "每年一届，需长期准备", officialUrl: "",
  },
  {
    id: "bg-math-modeling", field: "MATH", category: "COMPETITION",
    title: "数学建模竞赛 (HiMCM)", titleEn: "Mathematical Modeling (HiMCM)",
    description: "团队在数天内针对真实问题建立数学模型并撰写论文，锻炼应用数学、编程与协作，是数学/工程方向的实践亮点。",
    difficulty: 2, timing: "每年秋季", officialUrl: "",
  },
  {
    id: "bg-math-summer", field: "MATH", category: "SUMMER_SCHOOL",
    title: "数学夏校（如 PROMYS / Ross）", titleEn: "Maths Summer Schools",
    description: "高强度的数学研究型夏校，深入数论、代数等主题，适合数学热情强烈、希望冲击顶尖院校的学生。",
    difficulty: 3, timing: "暑期，选拔竞争激烈", officialUrl: "",
  },

  // ───────── 自然科学（物理/化学/生物）─────────
  {
    id: "bg-sci-bpho", field: "SCIENCE", category: "COMPETITION",
    title: "英国物理奥赛 (BPhO)", titleEn: "British Physics Olympiad",
    description: "物理竞赛训练，练习物理建模、数量估算与多步骤推理。",
    difficulty: 3, timing: "秋冬季", officialUrl: "", testId: "bpho",
  },
  {
    id: "bg-sci-chem", field: "SCIENCE", category: "COMPETITION",
    title: "英国化学奥赛", titleEn: "UK Chemistry Olympiad",
    description: "面向中学生的化学竞赛，考查化学原理的深度理解与应用，适合目标化学、材料、医学等方向的学生。",
    difficulty: 2, timing: "每年一届", officialUrl: "",
  },
  {
    id: "bg-sci-bbo", field: "SCIENCE", category: "COMPETITION",
    title: "英国生物奥赛 (BBO)", titleEn: "British Biology Olympiad",
    description: "生物学竞赛训练，练习生命科学知识、数据分析与科学推理。",
    difficulty: 2, timing: "每年一届", officialUrl: "",
  },
  {
    id: "bg-sci-lab", field: "SCIENCE", category: "RESEARCH",
    title: "实验室科研 / 课题体验", titleEn: "Lab Research Experience",
    description: "在高校或研究机构参与科研项目、实验或课题，积累真实的科学研究经历，是理工方向文书的有力素材。",
    difficulty: 2, timing: "假期或长期", officialUrl: "",
  },
  {
    id: "bg-sci-summer", field: "SCIENCE", category: "SUMMER_SCHOOL",
    title: "自然科学夏校", titleEn: "Science Summer Schools",
    description: "参加物理/化学/生物主题的大学夏校，修读进阶课程或参与实验项目，加深对专业方向的理解。",
    difficulty: 2, timing: "暑期", officialUrl: "",
  },

  // ───────── 医学 ─────────
  {
    id: "bg-med-bbo", field: "MED", category: "COMPETITION",
    title: "英国生物奥赛 (BBO)", titleEn: "British Biology Olympiad",
    description: "生物学竞赛训练，练习生命科学知识、数据分析与科学推理。",
    difficulty: 2, timing: "每年一届", officialUrl: "",
  },
  {
    id: "bg-med-research", field: "MED", category: "RESEARCH",
    title: "生物医学科研", titleEn: "Biomedical Research",
    description: "参与生物医学相关的研究或课题，展现对医学科学的兴趣与研究能力，为申请增添学术深度。",
    difficulty: 2, timing: "假期或长期", officialUrl: "",
  },
  {
    id: "bg-med-summer", field: "MED", category: "SUMMER_SCHOOL",
    title: "医学主题夏校", titleEn: "Medicine Summer Schools",
    description: "参加医学或医疗健康主题的夏校，了解医学学习内容与职业路径，帮助确认申请方向并积累背景。",
    difficulty: 2, timing: "暑期", officialUrl: "",
  },
];

export function getCatalogItem(id: string): CatalogItem | undefined {
  return BACKGROUND_CATALOG.find((x) => x.id === id);
}

/** Preserve both historical IDs and field eligibility; deduplicate presentation only. */
export function catalogEventKey(id: string): string {
  return id === "bg-med-bbo" ? "bg-sci-bbo" : id;
}

export function uniqueCatalogEvents(items: CatalogItem[]): CatalogItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = catalogEventKey(item.id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
