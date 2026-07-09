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
  { value: "ACTIVITY", label: "活动", emoji: "🤝" },
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
export type BgGroup = "COMPETITION" | "PRACTICE";

export const BG_GROUPS: { value: BgGroup; label: string; emoji: string; desc: string }[] = [
  { value: "COMPETITION", label: "竞赛", emoji: "🏆", desc: "各类学术竞赛与奥林匹克，用可量化的名次与奖项证明学术实力。" },
  { value: "PRACTICE", label: "实践", emoji: "🛠", desc: "科研、活动/志愿/实习、夏校等亲身经历，积累文书素材与面试谈资。" },
];

export function groupOfCategory(c: BgCategory): BgGroup {
  return c === "COMPETITION" ? "COMPETITION" : "PRACTICE";
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
}

export const BACKGROUND_CATALOG: CatalogItem[] = [
  // ───────── 计算机 / 工程 ─────────
  {
    id: "bg-cse-bio", field: "CS_ENG", category: "COMPETITION",
    title: "英国信息学奥林匹克 (BIO)", titleEn: "British Informatics Olympiad",
    description: "英国面向中学生的算法编程竞赛，考查算法设计与实现能力，是信息学方向含金量较高的学术竞赛，适合有编程基础、目标计算机专业的学生。",
    difficulty: 3, timing: "高一至高二", officialUrl: "",
  },
  {
    id: "bg-cse-usaco", field: "CS_ENG", category: "COMPETITION",
    title: "美国计算机奥赛 (USACO)", titleEn: "USA Computing Olympiad",
    description: "全球广泛参与的线上算法竞赛，分多个等级（铜/银/金/白金），可循序渐进提升算法能力，成绩国际认可度高。",
    difficulty: 3, timing: "全年多场，建议尽早开始", officialUrl: "",
  },
  {
    id: "bg-cse-opensource", field: "CS_ENG", category: "RESEARCH",
    title: "开源项目 / Kaggle 数据竞赛", titleEn: "Open Source & Kaggle",
    description: "参与开源项目贡献代码，或在 Kaggle 上完成数据科学/机器学习竞赛，能体现真实工程与数据能力，是文书里有说服力的实践素材。",
    difficulty: 2, timing: "全年，适合长期投入", officialUrl: "",
  },
  {
    id: "bg-cse-hackathon", field: "CS_ENG", category: "ACTIVITY",
    title: "编程马拉松 (Hackathon)", titleEn: "Hackathons",
    description: "在有限时间内组队完成一个软件/硬件项目，锻炼快速开发、协作与展示能力，也是拓展兴趣、积累作品的好途径。",
    difficulty: 1, timing: "全年不定期", officialUrl: "",
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
    description: "面向全球中学生的学术论文竞赛，设经济、哲学、政治等多个赛道，重视独立思辨与论证能力，在文商社科方向认可度高。",
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
    description: "英国数学信托的系列竞赛，从 Senior Maths Challenge 晋级至英国数学奥林匹克 (BMO)，是数学方向权威度很高的学术竞赛。",
    difficulty: 3, timing: "秋季起逐轮晋级", officialUrl: "",
  },
  {
    id: "bg-math-yau", field: "MATH", category: "RESEARCH",
    title: "丘成桐中学科学奖（数学）", titleEn: "Yau Science Award (Mathematics)",
    description: "以研究报告形式参赛的高水平学术奖项，要求完成一项数学研究课题，非常考验研究与写作能力，含金量高。",
    difficulty: 3, timing: "每年一届，需长期准备", officialUrl: "",
  },
  {
    id: "bg-math-modeling", field: "MATH", category: "RESEARCH",
    title: "数学建模竞赛 (HiMCM)", titleEn: "Mathematical Modeling (HiMCM)",
    description: "团队在数天内针对真实问题建立数学模型并撰写论文，锻炼应用数学、编程与协作，是数学/工程方向的实践亮点。",
    difficulty: 2, timing: "每年秋季", officialUrl: "",
  },
  {
    id: "bg-math-club", field: "MATH", category: "ACTIVITY",
    title: "数学社团 / 学术讲座", titleEn: "Maths Club / Seminars",
    description: "组织或参与数学社团、专题讲座与问题研讨，持续展现学科热情，也可作为组织领导力的体现。",
    difficulty: 1, timing: "学年内持续", officialUrl: "",
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
    description: "英国权威的物理竞赛系列，题目富有挑战性，是物理及工程方向展示学术能力的重要竞赛。",
    difficulty: 3, timing: "秋冬季", officialUrl: "",
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
    description: "英国生物学竞赛，覆盖广泛的生物学知识，是生物、生医、医学方向有价值的学术背景。",
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
    description: "生物学竞赛对医学申请有直接帮助，能体现扎实的生命科学基础，是医学方向常见的学术背景之一。",
    difficulty: 2, timing: "每年一届", officialUrl: "",
  },
  {
    id: "bg-med-ucat", field: "MED", category: "ACTIVITY",
    title: "UCAT 入学考试备考", titleEn: "UCAT Preparation",
    description: "英国多数医学院要求的入学考试。系统备考 UCAT 是医学申请的必要环节，建议尽早规划练习。",
    difficulty: 2, timing: "申请当年暑期考试，提前数月备考", officialUrl: "",
  },
  {
    id: "bg-med-volunteer", field: "MED", category: "ACTIVITY",
    title: "医院志愿 / 临床见习", titleEn: "Clinical Volunteering / Work Experience",
    description: "在医院、诊所或社区从事志愿服务或见习，了解真实医疗环境与职业，是医学个人陈述中极为重要的经历。",
    difficulty: 1, timing: "假期或长期", officialUrl: "",
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
