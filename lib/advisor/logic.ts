// 选校决策助手核心逻辑 —— 原创的「A-Level 选科 → 专业方向 → 笔试」映射。
// 基于稳定的英国/香港本科招生事实（选科门槛、笔试对应）做结构化建议，
// 不含任何自建院校清单/假数据；具体院校信息一律导流到官方与权威来源。
// ⚠️ 招生政策会调整，落地前应人工核对各校当年官网。

export interface TestRef {
  id: string;      // 对应 /tests/[id]，可深链到题库；为空表示暂无内置题库
  abbr: string;
  note: string;    // 谁用 / 用途（中文）
}

export interface Direction {
  value: string;           // 对应 lib/constants FIELDS 的 value
  zh: string;
  en: string;
  essential: string[];     // 硬性选科（缺失则多数顶尖院校无法申请）
  recommended: string[];   // 强烈推荐的选科
  tests: TestRef[];        // 建议准备的入学笔试
  interview: boolean;      // 顶尖院校是否常见面试
  ukNote: string;          // 英国申请策略要点
  hkNote: string;          // 香港申请策略要点
}

// 各专业方向的选科门槛与笔试对应（覆盖 constants.FIELDS 全部方向）
export const DIRECTIONS: Direction[] = [
  {
    value: "cs", zh: "计算机科学", en: "Computer Science",
    essential: ["Mathematics"], recommended: ["Further Mathematics", "Physics", "Computer Science"],
    tests: [
      { id: "tmua", abbr: "TMUA", note: "剑桥、帝国理工、部分院校计算机方向" },
      { id: "mat", abbr: "MAT", note: "牛津计算机、帝国理工计算机" },
    ],
    interview: true,
    ukNote: "顶尖院校几乎都要求 A-Level 数学，进阶数学强烈推荐。牛津、剑桥、帝国理工需笔试，牛剑还有面试。",
    hkNote: "港大／科大／中大计算机竞争激烈，重视数学成绩与项目、竞赛背景。",
  },
  {
    value: "ds", zh: "数据科学", en: "Data Science",
    essential: ["Mathematics"], recommended: ["Further Mathematics", "Computer Science", "Economics"],
    tests: [
      { id: "tmua", abbr: "TMUA", note: "多所院校数据／数学统计方向" },
      { id: "mat", abbr: "MAT", note: "偏数学的数据科学项目" },
    ],
    interview: true,
    ukNote: "与计算机类似，A-Level 数学是硬门槛，进阶数学加分。含统计的项目更看重数学深度。",
    hkNote: "港校数据科学多挂在数学或计算机学院下，数学是关键。",
  },
  {
    value: "economics", zh: "经济学", en: "Economics",
    essential: ["Mathematics"], recommended: ["Further Mathematics", "Economics"],
    tests: [
      { id: "tmua", abbr: "TMUA", note: "剑桥经济、LSE 部分、牛津经济与管理(E&M)" },
    ],
    interview: true,
    ukNote: "LSE／UCL／剑桥经济几乎强制 A-Level 数学。剑桥经济要 TMUA，牛津 E&M 也要 TMUA。",
    hkNote: "港三经济／金融看重数学与英语，商赛、实习背景有帮助。",
  },
  {
    value: "business", zh: "商科管理", en: "Business & Management",
    essential: [], recommended: ["Mathematics", "Economics"],
    tests: [
      { id: "tmua", abbr: "TMUA", note: "牛津经济与管理(E&M)方向" },
    ],
    interview: true,
    ukNote: "多数商科不强制数学，但强烈建议修数学。牛津管理类走 E&M，需要 TMUA。",
    hkNote: "港校商学院是热门，数学＋英语＋活动／领导力背景是重点。",
  },
  {
    value: "math", zh: "数学", en: "Mathematics",
    essential: ["Mathematics"], recommended: ["Further Mathematics"],
    tests: [
      { id: "mat", abbr: "MAT", note: "牛津、帝国理工、华威数学" },
      { id: "step", abbr: "STEP", note: "剑桥（通常 STEP 2/3）、华威、巴斯" },
      { id: "tmua", abbr: "TMUA", note: "部分院校数学方向" },
    ],
    interview: true,
    ukNote: "进阶数学几乎是顶尖数学系的隐性门槛。剑桥要 STEP，牛津／帝国要 MAT。",
    hkNote: "港校数学系相对看重成绩与数学竞赛表现。",
  },
  {
    value: "engineering", zh: "工程（综合）", en: "Engineering",
    essential: ["Mathematics", "Physics"], recommended: ["Further Mathematics"],
    tests: [
      { id: "esat", abbr: "ESAT", note: "剑桥、帝国理工工程（取代旧 NSAA/ENGAA）" },
      { id: "pat", abbr: "PAT", note: "牛津工程科学" },
    ],
    interview: true,
    ukNote: "数学＋物理是硬门槛。剑桥／帝国工程用 ESAT，牛津工程科学用 PAT，牛剑另有面试。",
    hkNote: "港科大／港大工程强调数理基础与动手／项目经历。",
  },
  {
    value: "aerospace", zh: "航空航天工程", en: "Aerospace Engineering",
    essential: ["Mathematics", "Physics"], recommended: ["Further Mathematics"],
    tests: [
      { id: "esat", abbr: "ESAT", note: "剑桥、帝国理工工程" },
      { id: "pat", abbr: "PAT", note: "牛津工程科学" },
    ],
    interview: true,
    ukNote: "航空航天属工程大类，数学＋物理必备，笔试与综合工程一致。",
    hkNote: "港校航空／机械相关方向看重数理与实践背景。",
  },
  {
    value: "mechanical", zh: "机械工程", en: "Mechanical Engineering",
    essential: ["Mathematics", "Physics"], recommended: ["Further Mathematics"],
    tests: [
      { id: "esat", abbr: "ESAT", note: "剑桥、帝国理工工程" },
      { id: "pat", abbr: "PAT", note: "牛津工程科学" },
    ],
    interview: true,
    ukNote: "机械工程数学＋物理必备；帝国／剑桥需 ESAT，牛津工程科学需 PAT。",
    hkNote: "港科大机械／港大工程强调数理与项目经历。",
  },
  {
    value: "eee", zh: "电子电气工程", en: "Electrical & Electronic Eng.",
    essential: ["Mathematics", "Physics"], recommended: ["Further Mathematics"],
    tests: [
      { id: "esat", abbr: "ESAT", note: "剑桥、帝国理工工程" },
      { id: "pat", abbr: "PAT", note: "牛津工程科学" },
    ],
    interview: true,
    ukNote: "电子电气属工程大类，数学＋物理必备，笔试与综合工程一致。",
    hkNote: "港校电子电气看重数理基础。",
  },
  {
    value: "physics", zh: "物理", en: "Physics",
    essential: ["Mathematics", "Physics"], recommended: ["Further Mathematics"],
    tests: [
      { id: "pat", abbr: "PAT", note: "牛津物理" },
      { id: "esat", abbr: "ESAT", note: "剑桥自然科学（物理方向）、帝国理工" },
    ],
    interview: true,
    ukNote: "数学＋物理必备。牛津物理用 PAT，剑桥自然科学（物理方向）用 ESAT。",
    hkNote: "港校物理系看重数理成绩与研究兴趣。",
  },
  {
    value: "law", zh: "法律", en: "Law",
    essential: [], recommended: ["History", "English Literature", "Politics"],
    tests: [
      { id: "lnat", abbr: "LNAT", note: "牛津、UCL、LSE、KCL、布里斯托、杜伦等" },
    ],
    interview: true,
    ukNote: "法律无指定选科，但重视读写与论证能力。多所顶尖院校要 LNAT，牛津还有面试。",
    hkNote: "港大法律(LLB)极难，重英语与思辨表达。",
  },
  {
    value: "medicine", zh: "医学", en: "Medicine",
    essential: ["Chemistry", "Biology"], recommended: ["Mathematics", "Physics"],
    tests: [
      { id: "", abbr: "UCAT", note: "英国绝大多数医学院（BMAT 已于 2024 停考，现主要用 UCAT，官网报名）" },
    ],
    interview: true,
    ukNote: "化学＋生物通常硬性要求。几乎所有英国医学院要 UCAT，并有 MMI 多站式面试，申请极其激烈。",
    hkNote: "港大／中大医学竞争极端激烈，成绩＋面试＋综合背景缺一不可。",
  },
  {
    value: "psychology", zh: "心理学", en: "Psychology",
    essential: [], recommended: ["Biology", "Mathematics"],
    tests: [
      { id: "tsa", abbr: "TSA", note: "牛津实验心理学" },
    ],
    interview: true,
    ukNote: "部分院校要求一门科学或数学（尤其偏理的心理学）。牛津实验心理学用 TSA。",
    hkNote: "港校心理学看重科学基础与英语。",
  },
];

export function getDirection(value: string): Direction | undefined {
  return DIRECTIONS.find((d) => d.value === value);
}

export type FeasStatus = "open" | "limited";
export interface Feasibility {
  value: string;
  zh: string;
  en: string;
  status: FeasStatus;
  missing: string[]; // 缺失的硬性选科
}

// 选科可行性扫描：给定学生的 A-Level 选科，逐个方向判断「可申 / 受限(缺哪门)」
export function scanFeasibility(subjects: string[]): Feasibility[] {
  const have = new Set(subjects.filter(Boolean));
  return DIRECTIONS.map((d) => {
    const missing = d.essential.filter((s) => !have.has(s));
    return {
      value: d.value, zh: d.zh, en: d.en,
      status: missing.length === 0 ? "open" : "limited",
      missing,
    };
  });
}

// 预估成绩强度分层（仅作策略框架提示，不点名任何院校，不构成录取判断）
export type GradeTier = "strong" | "solid" | "developing" | "unknown";
export function gradeTier(grades: string[]): GradeTier {
  const g = grades.filter(Boolean);
  if (g.length === 0) return "unknown";
  const score = (x: string) => (x === "A*" ? 4 : x === "A" ? 3 : x === "B" ? 2 : x === "C" ? 1 : 0);
  const avg = g.reduce((a, b) => a + score(b), 0) / g.length;
  if (avg >= 3.4) return "strong";
  if (avg >= 2.5) return "solid";
  return "developing";
}

export const GRADE_TIER_NOTE: Record<GradeTier, { zh: string; en: string }> = {
  strong: {
    zh: "预估成绩优异：冲刺英港顶尖院校较为现实，但顶尖项目仍需笔试／面试／文书全面达标，务必配好保底。",
    en: "Strong predicted grades: top UK/HK universities are realistic reach targets, but still prepare tests/interviews/statements and keep safe options.",
  },
  solid: {
    zh: "预估成绩良好：目标锁定中上院校较稳，可少量冲刺顶尖，并用把握较大的项目做保底。",
    en: "Solid predicted grades: aim at upper-mid universities, with a couple of reach applications and reliable safety choices.",
  },
  developing: {
    zh: "预估成绩仍有提升空间：优先巩固学术成绩，选校以稳妥为主，可考虑要求更灵活的院校或香港部分项目。",
    en: "Developing grades: focus on raising academics first; choose safer options, including more flexible universities or some HK programmes.",
  },
  unknown: {
    zh: "未填写成绩：填入预估成绩后可获得更具体的策略分层建议。",
    en: "No grades entered: add predicted grades for tailored strategy guidance.",
  },
};

// 预算带（人民币/年，含学费+生活，粗略区间，汇率与政策会变动）
export const BUDGET_BANDS: { value: string; zh: string; en: string; note: string }[] = [
  { value: "low", zh: "25 万以内 / 年", en: "Under ¥250k / yr",
    note: "英国本科（学费＋生活）通常约 35–55 万／年，伦敦更高；预算偏紧时，香港（约 15–28 万／年）、苏格兰部分院校或申请奖学金更稳妥。" },
  { value: "mid", zh: "25–40 万 / 年", en: "¥250k–400k / yr",
    note: "可覆盖香港全部及英国部分非伦敦院校；伦敦院校需考虑生活成本，或搭配奖学金。" },
  { value: "high", zh: "40 万以上 / 年", en: "Over ¥400k / yr",
    note: "英港主流院校（含伦敦）基本可覆盖；仍建议关注奖学金与性价比。" },
  { value: "unsure", zh: "暂不确定", en: "Not sure yet",
    note: "参考：英国本科总花费约 35–55 万／年（伦敦更高），香港约 15–28 万／年。以上为粗略区间，实际以各校官网与当年汇率为准。" },
];

export function getBudgetNote(value: string): string {
  return BUDGET_BANDS.find((b) => b.value === value)?.note ?? "";
}
