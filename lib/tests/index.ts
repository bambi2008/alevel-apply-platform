// 英国大学入学笔试数据层 — 9 种考试

export type TestCategory = "mathematics" | "science" | "law" | "thinking";

export interface TestTopic {
  id: string;
  title: string;       // 中文
  titleEn: string;     // 英文
  description: string;
}

export interface StudyPlan {
  week: string;        // 如 "Week 1–2"
  focus: string;       // 重点内容（中文）
  tasks: string[];     // 具体任务
}

export interface AdmissionsTest {
  id: string;
  name: string;           // 官方全称英文
  abbr: string;           // 缩写
  nameZh: string;         // 中文名
  category: TestCategory;
  icon: string;
  universities: string[]; // 使用该考试的院校
  programs: string[];     // 适用专业（中文）
  programsEn: string[];   // 适用专业（英文）
  duration: string;       // 考试时长
  format: string;         // 考试格式（英文）
  formatZh: string;       // 考试格式（中文）
  registrationUrl: string;
  officialSampleUrl: string;
  hasQuestionBank: boolean; // 是否有 AI 题库（MAT/STEP/ESAT）
  overview: string;         // 中文简介
  structureDetails: string; // 结构说明（中文）
  scoringNote: string;      // 评分说明（中文）
  topics: TestTopic[];
  studyPlan: StudyPlan[];   // 8–12 周备考计划
  tips: string[];           // 备考关键建议
  statusNote?: string;      // 考试现状提示（如有变更）
  pastPaperLinks?: Array<{ label: string; url: string; note?: string }>; // 历年真题链接
}

export const ADMISSIONS_TESTS: AdmissionsTest[] = [
  {
    id: "mat",
    name: "Mathematics Admissions Test",
    abbr: "MAT",
    nameZh: "数学入学考试",
    category: "mathematics",
    icon: "∑",
    universities: ["University of Oxford", "Imperial College London"],
    programs: ["数学", "计算机科学", "数学与统计", "数学与计算机"],
    programsEn: ["Mathematics", "Computer Science", "Mathematics & Statistics", "Mathematics & Computer Science"],
    duration: "2.5 小时",
    format: "Multiple choice (Part A, 10 questions) + Long answer (Part B, 4 from 6 questions, 15 marks each)",
    formatZh: "Part A：10 道选择题（共 40 分）；Part B：从 6 题中选 4 题作答，每题 15 分（共 60 分）。总分 100 分。",
    registrationUrl: "https://www.ox.ac.uk/admissions/undergraduate/applying-to-oxford/guide/admissions-tests/mat",
    officialSampleUrl: "https://www.ox.ac.uk/admissions/undergraduate/applying-to-oxford/guide/admissions-tests/mat",
    hasQuestionBank: true,
    overview: "MAT 是牛津大学数学、计算机科学及相关专业的必考笔试，也用于帝国理工数学系。考试旨在测试 A-Level 数学知识的深度应用与解题推导能力，而非仅靠记忆公式。",
    structureDetails: "考试内容覆盖 A-Level Core/Pure Mathematics（不含 Statistics/Mechanics），题目风格独特：选择题看似基础，但选项设计陷阱多；大题需书面推导过程，空白步骤无分。",
    scoringNote: "Part A 每题 4 分，仅选答案（无计算步骤分）。Part B 按解题步骤给分，即使最终答案错误，正确的中间步骤也可得分。",
    topics: [
      { id: "mat-poly", title: "多项式与代数", titleEn: "Polynomials & Algebra", description: "因式分解、多项式除法、韦达定理、二项式展开" },
      { id: "mat-trig", title: "三角函数", titleEn: "Trigonometry", description: "恒等式、方程求解、sinx/cosx/tanx 图像变换" },
      { id: "mat-calc", title: "微积分基础", titleEn: "Calculus", description: "导数规则、积分基础、面积与体积、微分方程入门" },
      { id: "mat-log", title: "对数与指数", titleEn: "Logarithms & Exponentials", description: "ln/e 的性质、对数方程、指数增长" },
      { id: "mat-geo", title: "坐标几何", titleEn: "Coordinate Geometry", description: "直线、圆、抛物线、相交与切线" },
      { id: "mat-seq", title: "数列与级数", titleEn: "Sequences & Series", description: "等差数列、等比数列、递推关系、极限初步" },
      { id: "mat-logic", title: "逻辑与证明", titleEn: "Logic & Proof", description: "数学归纳法、反例、逻辑推导" },
      { id: "mat-cs", title: "算法与计算（CS 方向）", titleEn: "Algorithms & Computation", description: "仅适用于计算机科学方向：基础算法、时间复杂度概念" },
    ],
    studyPlan: [
      { week: "第 1–2 周", focus: "摸底 + 代数基础", tasks: ["做 2017 年真题 Part A 摸底", "复习多项式、因式定理、韦达定理", "每天 3–5 道 MAT 风格选择题"] },
      { week: "第 3–4 周", focus: "三角函数 + 坐标几何", tasks: ["系统复习三角恒等式与方程", "练习坐标几何（圆与直线综合题）", "完成 1 套历年 Part B（大题）"] },
      { week: "第 5–6 周", focus: "微积分", tasks: ["导数规则熟练练习（链式法则、隐函数）", "积分技巧（换元、分部）", "面积/体积类大题 3 题"] },
      { week: "第 7–8 周", focus: "数列 + 对数 + 综合", tasks: ["数列递推推导练习", "对数/指数方程综合", "完成 2 套完整真题（计时）"] },
      { week: "第 9–10 周", focus: "真题模拟 + 弱点补强", tasks: ["每周 1 套完整模拟（计时 2.5 小时）", "逐题分析错误模式", "重点突破 Part B 最后一题（难度最高）"] },
    ],
    tips: [
      "Part A 每题不超过 3 分钟，不确定先跳过，保时间给 Part B。",
      "Part B 先选最有把握的 4 题，不要死磕难题浪费时间。",
      "2016 年起改革题型，重点做 2016–2023 历年真题。",
      "牛津官网提供逐年真题与评分标准，每题都要对着答案理解失分原因。",
      "数学 MAT 与 CS-MAT 部分大题不同，CS 申请者做 MAT1（Q1-4）+MAT2（CS 题）。",
    ],
  },

  {
    id: "pat",
    name: "Physics Aptitude Test",
    abbr: "PAT",
    nameZh: "物理能力测试",
    category: "science",
    icon: "⚛",
    universities: ["University of Oxford"],
    programs: ["物理", "工程科学", "材料科学", "地球科学"],
    programsEn: ["Physics", "Engineering Science", "Materials Science", "Earth Sciences"],
    duration: "2 小时",
    format: "Mixed: multiple choice + short answer + longer problems (all written, no calculator)",
    formatZh: "混合题型：选择题 + 简答题 + 综合推导题，不可使用计算器，考查数学推导与物理直觉。",
    registrationUrl: "https://www.ox.ac.uk/admissions/undergraduate/applying-to-oxford/guide/admissions-tests/pat",
    officialSampleUrl: "https://www.ox.ac.uk/admissions/undergraduate/applying-to-oxford/guide/admissions-tests/pat",
    hasQuestionBank: false,
    overview: "PAT 是牛津物理、工程科学等专业的必考笔试。考试考查 A-Level 数学与物理知识的综合应用，题目偏重推导与估算，不依赖死记公式。",
    structureDetails: "内容覆盖 A-Level 物理全部核心模块（力学、电磁学、波动、热力学、量子与粒子物理初步）以及 A-Level 数学（微积分、向量、三角等）。题目通常将数学工具直接用于物理情境。",
    scoringNote: "每题书面作答，按步骤给分。无计算器，大量计算会简化为「精确到 1 位有效数字」或「用字母表示」。",
    topics: [
      { id: "pat-mech", title: "力学", titleEn: "Mechanics", description: "牛顿定律、动量守恒、能量守恒、圆周运动、转动惯量" },
      { id: "pat-em", title: "电磁学", titleEn: "Electromagnetism", description: "电场、磁场、感应电动势、交直流电路、电容/电感" },
      { id: "pat-wave", title: "波动与光学", titleEn: "Waves & Optics", description: "干涉、衍射、折射、偏振、多普勒效应" },
      { id: "pat-thermo", title: "热力学", titleEn: "Thermodynamics", description: "理想气体、热力学定律、热传导" },
      { id: "pat-modern", title: "现代物理", titleEn: "Modern Physics", description: "光电效应、放射性、核反应、波粒二象性" },
      { id: "pat-math", title: "数学工具（物理应用）", titleEn: "Mathematical Methods", description: "微积分在物理中的应用、向量运算、三角函数" },
    ],
    studyPlan: [
      { week: "第 1–2 周", focus: "力学系统复习", tasks: ["牛顿定律 + 动量/能量综合题", "圆周运动与引力", "做 3 道 PAT 历年力学大题"] },
      { week: "第 3–4 周", focus: "电磁学", tasks: ["电场与电势推导练习", "Faraday/Lenz 定律应用", "交流电路分析"] },
      { week: "第 5–6 周", focus: "波动 + 热力学", tasks: ["干涉/衍射题型专项", "理想气体推导题", "完成 1 套历年完整卷"] },
      { week: "第 7–8 周", focus: "现代物理 + 数学工具", tasks: ["光电/核反应计算", "微积分在运动中的应用", "向量场计算专项"] },
      { week: "第 9–10 周", focus: "计时模拟 + 弱点攻克", tasks: ["每周 1 套完整模拟（计时 2 小时）", "重点整理估算量级题的思路", "总结常见陷阱（如量纲分析）"] },
    ],
    tips: [
      "PAT 无计算器——不要把时间浪费在复杂运算，优先理解物理过程。",
      "估算题：先写公式再代入，保留字母比算出数字更容易得分。",
      "2019 年起改革，题型更灵活，需综合应用多模块知识。",
      "牛津官网提供历年真题与范围说明，重点看 2019–2023 真题。",
    ],
  },

  {
    id: "step",
    name: "Sixth Term Examination Paper",
    abbr: "STEP",
    nameZh: "剑桥数学高阶笔试",
    category: "mathematics",
    icon: "∫",
    universities: ["University of Cambridge", "University of Warwick"],
    programs: ["数学", "数学与物理"],
    programsEn: ["Mathematics", "Mathematics with Physics"],
    duration: "3 小时（STEP 2 / STEP 3 各独立考）",
    format: "STEP 2 & 3: 12 questions each (8 Pure + 2 Mech + 2 Stats), answer any 6. All written proof.",
    formatZh: "STEP 2 和 STEP 3 各自独立：每套 12 题（8 纯数 + 2 力学 + 2 统计），从中选 6 题作答，全书面推导。",
    registrationUrl: "https://www.maths.cam.ac.uk/undergrad/admissions/step",
    officialSampleUrl: "https://www.maths.cam.ac.uk/undergrad/admissions/step",
    hasQuestionBank: true,
    overview: "STEP 是英国数学类考试中难度最高的入学笔试，由剑桥数学系主导。与 MAT 不同，STEP 更接近大学数学风格：题目需要完整推导论证，常要求延伸思考。剑桥数学系通常要求 STEP 2 成绩达到 Grade 1 或 S。",
    structureDetails: "STEP 2 考 A-Level 纯数范围；STEP 3 包含进一步数学（Further Mathematics）内容。每题分值相等，每套试卷只选 6 道作答。题目难度梯度大，第 6 题通常极具挑战。",
    scoringNote: "每题最高 20 分，共 120 分。等级：S（Outstanding，≈100+），1（非常优秀），2（优秀），3（良好），U。剑桥数学通常要求 1,1 或 S,1。",
    topics: [
      { id: "step-pure1", title: "纯数 A — 代数与多项式", titleEn: "Pure A: Algebra & Polynomials", description: "因式定理、复杂因式分解、不等式证明" },
      { id: "step-pure2", title: "纯数 B — 微积分进阶", titleEn: "Pure B: Advanced Calculus", description: "换元积分、分部积分、无穷级数、微分方程" },
      { id: "step-pure3", title: "纯数 C — 坐标几何与曲线", titleEn: "Pure C: Coordinate Geometry & Curves", description: "参数方程、极坐标、面积与弧长" },
      { id: "step-pure4", title: "纯数 D — 复数（STEP 3）", titleEn: "Pure D: Complex Numbers (STEP 3)", description: "De Moivre 定理、复数根、几何应用" },
      { id: "step-pure5", title: "纯数 E — 线性代数入门（STEP 3）", titleEn: "Pure E: Linear Algebra Intro (STEP 3)", description: "矩阵运算、行列式、特征值初步" },
      { id: "step-mech", title: "力学", titleEn: "Mechanics", description: "质点运动、约束运动、动量与冲量" },
      { id: "step-stats", title: "统计与概率", titleEn: "Statistics & Probability", description: "离散/连续分布、条件概率、期望与方差" },
    ],
    studyPlan: [
      { week: "第 1–3 周", focus: "纯数基础夯实", tasks: ["系统复习 A-Level 纯数全部模块（含 Further Maths 初步）", "做剑桥 STEP Support Programme（官网）Week 1–6", "每周完成 3 道 STEP 2 历年纯数题"] },
      { week: "第 4–6 周", focus: "微积分 + 坐标几何深化", tasks: ["积分技巧专项（换元/分部/归结法）", "参数方程与极坐标大题 5 道", "STEP Support Programme Week 7–12"] },
      { week: "第 7–8 周", focus: "STEP 3 特有内容（如有需求）", tasks: ["复数专题", "线性代数入门", "STEP 3 历年纯数题 5 道"] },
      { week: "第 9–10 周", focus: "力学 + 统计", tasks: ["STEP 力学题 6 道", "概率分布专项", "完整模拟（选 6 题计时 3 小时）"] },
      { week: "第 11–12 周", focus: "全真题模拟 + 总结", tasks: ["每周 1 套完整 STEP 2 模拟", "整理高分解题框架（先审题 10 分钟再动笔）", "重点复盘高频失分题型"] },
    ],
    tips: [
      "STEP 比 A-Level 难得多——不要用 A-Level 做题速度预估 STEP 时间，每题可能需要 20–30 分钟。",
      "只需选 6 题：先浏览全部 12 题，选你最有把握的 6 题，不要贪多。",
      "剑桥官方提供 STEP Support Programme（免费在线课程），是最好的备考材料。",
      "Grade 不靠绝对分数，STEP 2 做对 4.5 题满分即可得 S——不追求全做，追求精准。",
      "STEP 2 & 3 分开备考，多数剑桥申请者只需 STEP 2。",
    ],
  },

  {
    id: "esat",
    name: "Engineering and Science Admissions Test",
    abbr: "ESAT",
    nameZh: "工程与科学入学测试",
    category: "science",
    icon: "⚙",
    universities: ["University of Cambridge", "Imperial College London"],
    programs: ["工程学", "自然科学（物理/化学方向）", "化学工程", "兽医学"],
    programsEn: ["Engineering", "Natural Sciences (Physics/Chemistry)", "Chemical Engineering", "Veterinary Medicine"],
    duration: "每模块 40 分钟（共 3 模块，约 120 分钟）",
    format: "3 modules × 27 MCQ (5 options, 40 min each): Module 1 Mathematics (all) + 2 of: Biology/Chemistry/Physics/Mathematics 2 (by course)",
    formatZh: "共 3 模块，每模块 27 道五选一选择题（40 分钟）：模块一数学（必选）+ 从生物/化学/物理/数学2中选 2 个模块（按专业）。工程选数学+物理；自然科学(物化方向)选物理+化学；自然科学(生化方向)选化学+生物。",
    registrationUrl: "https://www.undergraduate.study.cam.ac.uk/applying/admissions-tests",
    officialSampleUrl: "https://www.undergraduate.study.cam.ac.uk/applying/admissions-tests",
    hasQuestionBank: true,
    overview: "ESAT 自 2024 年 11 月起全面取代 ENGAA 和 NSAA，成为剑桥工程、自然科学、化学工程、兽医及帝国理工部分课程的统一入学笔试。考试由 2 个独立计时模块组成：Module 1 数学（必选）+ Module 2 理科（按专业）。",
    structureDetails: "Module 1 数学：代数与函数、微积分、几何、数列与级数——与 A-Level Pure Maths 范围一致，但题目设计需快速判断，平均每题不到 90 秒。Module 2 物理（工程方向）：力学、电磁学、波动与现代物理。全为五选一选择题，无负分。",
    scoringNote: "每题 1 分，无负分。两个模块各自独立计分。剑桥综合两模块成绩及面试成绩评估录取。历年 ENGAA 真题（2016–2023）内容结构高度相似，是目前最优质的 ESAT 备考材料。",
    topics: [
      { id: "esat-math1", title: "数学1 — 代数与函数", titleEn: "Math 1: Algebra & Functions", description: "方程组、不等式、多项式、二项式定理、函数变换（Module 1 必考）" },
      { id: "esat-math2", title: "数学1 — 微积分", titleEn: "Math 1: Calculus", description: "导数规则、积分基础、运动方程推导、面积计算（Module 1 必考）" },
      { id: "esat-math3", title: "数学1 — 几何与数列", titleEn: "Math 1: Geometry & Sequences", description: "坐标几何、圆与直线、等差等比数列、三角函数（Module 1 必考）" },
      { id: "esat-math2a", title: "数学2 — 复数与进阶代数", titleEn: "Math 2: Complex Numbers & Algebra", description: "复数运算与极坐标、进阶多项式、向量点积与叉积（选修 Module 2）" },
      { id: "esat-math2b", title: "数学2 — 微分方程与矩阵", titleEn: "Math 2: Differential Equations & Matrices", description: "一阶/二阶 ODE、矩阵运算、行列式与特征值（选修 Module 2）" },
      { id: "esat-phys1", title: "物理 — 力学", titleEn: "Physics: Mechanics", description: "牛顿定律、动量守恒、能量守恒、圆周运动、简单碰撞（选修 Module 2）" },
      { id: "esat-phys2", title: "物理 — 电磁学", titleEn: "Physics: Electromagnetism", description: "电场、磁场、感应定律、电路分析、电容与电感（选修 Module 2）" },
      { id: "esat-phys3", title: "物理 — 波与现代物理", titleEn: "Physics: Waves & Modern", description: "波动方程、干涉衍射、光谱、放射性与核物理（选修 Module 2）" },
      { id: "esat-chem1", title: "化学 — 原子结构与化学键", titleEn: "Chemistry: Atomic Structure & Bonding", description: "原子模型、电子排布、离子键/共价键/金属键、分子形状（选修 Module 2）" },
      { id: "esat-chem2", title: "化学 — 有机化学", titleEn: "Chemistry: Organic Chemistry", description: "烃类、卤代烃、醇醛酸酯、反应机理、同分异构体（选修 Module 2）" },
      { id: "esat-chem3", title: "化学 — 物理化学", titleEn: "Chemistry: Physical Chemistry", description: "化学平衡、酸碱与 pH、热化学、电化学与氧化还原（选修 Module 2）" },
      { id: "esat-bio1", title: "生物 — 细胞与分子生物学", titleEn: "Biology: Cell & Molecular Biology", description: "细胞结构、细胞分裂、DNA 复制与蛋白质合成、酶（选修 Module 2）" },
      { id: "esat-bio2", title: "生物 — 遗传与进化", titleEn: "Biology: Genetics & Evolution", description: "孟德尔遗传、基因型与表型、自然选择、物种形成（选修 Module 2）" },
      { id: "esat-bio3", title: "生物 — 生理学与生态学", titleEn: "Biology: Physiology & Ecology", description: "循环/呼吸/神经/激素系统、光合作用、呼吸作用、种群与生态系统（选修 Module 2）" },
    ],
    studyPlan: [
      { week: "第 1–2 周", focus: "数学 Module 1 专项", tasks: ["A-Level Pure Maths 快速复习（代数 / 微积分 / 坐标几何）", "每天 20 道 ESAT 风格数学选择题（90 秒/题节奏）", "完成 1 套 ENGAA 历年数学真题（与 ESAT 高度一致）"] },
      { week: "第 3–4 周", focus: "物理 Module 2 — 力学与电磁学", tasks: ["力学综合：牛顿定律 + 能量守恒 20 题", "电磁学基础：电路 + 磁场 15 题", "做 ENGAA Section 1 物理部分历年真题"] },
      { week: "第 5–6 周", focus: "物理深化 + 波与现代物理", tasks: ["波动与光学 10 题专项", "核物理 & 放射性 8 题", "完成 1 套 ENGAA 完整历年卷（2 小时）"] },
      { week: "第 7–8 周", focus: "全套模拟 + 弱点击破", tasks: ["每周 1 套完整 ESAT 模拟（双模块，各 40 分钟）", "逐题分析错因（知识盲区 vs. 计算失误）", "针对弱点专项补强，特别是 Module 1 代数题速度"] },
    ],
    tips: [
      "无负分——所有题必须作答，不确定的要猜，不要留空白。",
      "Module 1 数学节奏是关键：27 题 40 分钟，平均 89 秒/题——速度和准确度同样重要。",
      "ENGAA 历年真题（2016–2023）是目前最好的 ESAT 备考材料，结构几乎一致。",
      "Module 2 物理需要结合数学能力：公式推导 + 代入计算，不只是定性理解。",
      "帝国理工 EEE/ME 方向也使用 ESAT，备考思路与剑桥工程完全相同。",
    ],
    pastPaperLinks: [
      { label: "官方 ESAT 学科指南（数学 / 物理 / 化学 / 生物，完全免费）", url: "https://esat-tmua.ac.uk/esat-preparation-materials/", note: "UAT 官方发布的各科备考指南（对应官方考纲逐节讲解）+ ESAT 规范说明。官方明确：所有备考资源均免费，且不推荐、不背书任何付费课程。" },
      { label: "官方 ESAT 备考资料（含历年 ENGAA / NSAA 真题）", url: "https://esat-tmua.ac.uk/esat-preparation-materials/", note: "含历年 ENGAA / NSAA 真题（已标注哪些题不在 ESAT 范围）。ESAT 自 2024/25 起取代 ENGAA / NSAA，历年真题仍是最佳练习素材。" },
      { label: "ESAT / ENGAA 真题与解析（免费下载，含答案与评分标准）", url: "https://firstclasseducation.org.uk/esat-past-papers", note: "含 2016–2023 ENGAA / NSAA 真题与详解，适合计时模考与自我批改。" },
    ],
  },

  {
    id: "nsaa",
    name: "Natural Sciences Admissions Assessment",
    abbr: "NSAA",
    nameZh: "自然科学入学评估",
    category: "science",
    icon: "🔬",
    universities: ["University of Cambridge"],
    programs: ["自然科学（物理/化学/生物方向）"],
    programsEn: ["Natural Sciences (Physical/Chemical/Biological track)"],
    duration: "2 小时",
    format: "Section 1: 40 MCQ (2 from: Math, Physics, Chemistry, Biology – 20 each, 60 min); Section 2: 20 MCQ advanced topic (60 min)",
    formatZh: "第一部分：从数学/物理/化学/生物中选 2 科，各 20 道选择题（共 40 题，60 分钟）；第二部分：所选科目的深度题 20 道（60 分钟）。",
    registrationUrl: "https://esat-tmua.ac.uk/about-the-tests/esat-test/",
    officialSampleUrl: "https://www.undergraduate.study.cam.ac.uk/applying/natural-sciences",
    hasQuestionBank: false,
    overview: "NSAA 是剑桥自然科学（Natural Sciences）的入学笔试，考生根据自己的研究方向选择 2 个科目作答。物理/化学方向通常选数学+物理+化学；生物方向加入生物。",
    structureDetails: "Section 1 考察 A-Level 基础；Section 2 的深度题考察拓展知识。两节成绩独立，面试邀请综合两节结果评估。",
    scoringNote: "同 ENGAA，选择题无负分。Section 1 和 Section 2 分别成绩，剑桥综合两节评估。",
    statusNote: "⚠️ 注意：2025 年起剑桥自然科学改用 ESAT 替代 NSAA（物理/化学/生物方向）。数学方向改用 TMUA。建议确认最新考试要求。",
    topics: [
      { id: "nsaa-math", title: "数学（必选）", titleEn: "Mathematics", description: "代数、微积分、几何、数列" },
      { id: "nsaa-phys", title: "物理", titleEn: "Physics", description: "力学、热学、电磁、波动与量子" },
      { id: "nsaa-chem", title: "化学", titleEn: "Chemistry", description: "物理化学、有机化学、无机化学基础" },
      { id: "nsaa-bio", title: "生物", titleEn: "Biology", description: "细胞生物学、遗传、进化、生态" },
    ],
    studyPlan: [
      { week: "第 1–3 周", focus: "两科 A-Level 全面复习", tasks: ["按选定科目（物+化 或 物+生）逐章复习", "做每科 A-Level 历年题 1 套（热身）", "每天练习 40 道 NSAA 风格题"] },
      { week: "第 4–5 周", focus: "Section 2 深度专项", tasks: ["拓展阅读选定两科的 A-Level Further 内容", "NSAA 历年 Section 2 题型专项", "计时练习（Section 1+2 连续 2 小时）"] },
      { week: "第 6–8 周", focus: "完整模拟 + 总结", tasks: ["每周 1 套完整模拟", "整理易错知识点", "与同学交叉讲解题目（加深理解）"] },
    ],
    tips: [
      "NSAA 已被 ESAT 替代（2025 年起），备考方向与 ENGAA 相似，历年真题仍有价值。",
      "两科选择建议：物理+化学或物理+数学最常见，选你 A-Level 最强的两科。",
      "Section 1 是速度考验，Section 2 是深度考验，备考时需分开策略。",
    ],
  },

  {
    id: "tmua",
    name: "Test of Mathematics for University Admission",
    abbr: "TMUA",
    nameZh: "大学入学数学测试",
    category: "mathematics",
    icon: "π",
    universities: ["University of Cambridge (Economics, Land Economy)", "University of Bath", "University of Bristol", "London School of Economics", "University of Southampton", "Durham University"],
    programs: ["经济学", "数学", "统计学", "工程学（部分院校）"],
    programsEn: ["Economics", "Mathematics", "Statistics", "Engineering (selected)"],
    duration: "2.5 小时（Paper 1 + Paper 2，各 75 分钟）",
    format: "Paper 1: 20 MCQ (mathematical knowledge, 75 min); Paper 2: 20 MCQ (mathematical reasoning & proof, 75 min)",
    formatZh: "Paper 1：20 道选择题，考查数学知识应用（75 分钟）；Paper 2：20 道选择题，考查数学推理与证明（75 分钟）。",
    registrationUrl: "https://esat-tmua.ac.uk/about-the-tests/tmua-test/",
    officialSampleUrl: "https://esat-tmua.ac.uk/prepare/",
    hasQuestionBank: true,
    overview: "TMUA 是多所英国顶尖大学数学/经济类专业的入学笔试，由 Cambridge Assessment Admissions Testing 主办。剑桥大学将其用于经济学专业的申请评估。",
    structureDetails: "Paper 1 偏知识应用（A-Level 数学范围）；Paper 2 偏逻辑推理与数学论证，需要判断数学命题的真伪。",
    scoringNote: "每题 1 分，无惩罚分。各 Paper 分别给出标准化分数（1–9），院校综合评估。",
    topics: [
      { id: "tmua-algebra", title: "代数与函数", titleEn: "Algebra & Functions", description: "方程、不等式、多项式、复合函数" },
      { id: "tmua-calc", title: "微积分", titleEn: "Calculus", description: "微分、积分、微分方程基础" },
      { id: "tmua-stats", title: "统计与概率", titleEn: "Statistics & Probability", description: "分布、期望、概率推导" },
      { id: "tmua-logic", title: "数学推理与证明（Paper 2）", titleEn: "Mathematical Reasoning & Proof", description: "命题真伪判断、反例、数学归纳法" },
      { id: "tmua-discrete", title: "离散数学入门", titleEn: "Discrete Mathematics", description: "集合、逻辑门、图论基础" },
    ],
    studyPlan: [
      { week: "第 1–3 周", focus: "A-Level 数学全面复习", tasks: ["纯数 (Paper 1 范围) 逐章精练", "统计模块 2 套历年题", "每天 20 道选择题计时练习"] },
      { week: "第 4–6 周", focus: "Paper 2 推理专项", tasks: ["数学推理题型分析（命题判断技巧）", "数学归纳法 + 反例构造 10 题", "完成 1 套 TMUA 历年完整卷"] },
      { week: "第 7–8 周", focus: "模拟 + 弱点补强", tasks: ["完整 2.5 小时模拟 2 次", "错题归因（知识漏洞 vs. 技巧问题）", "Paper 2 逻辑题额外强化"] },
    ],
    tips: [
      "Paper 2 是 TMUA 的特色：考数学推理，不靠记忆，靠逻辑分析——多做此类题型提升解题思维。",
      "TMUA 通常 10 月底考，需要 9 月下旬开始密集备考。",
      "剑桥经济学对 TMUA 成绩十分看重（约 6.5+），准备充分的学生可与 A-Level 成绩形成互补。",
    ],
  },

  {
    id: "tsa",
    name: "Thinking Skills Assessment",
    abbr: "TSA",
    nameZh: "思维技能评估",
    category: "thinking",
    icon: "🧠",
    universities: ["University of Oxford (PPE, Philosophy, Economics, Geography, etc.)", "University of Cambridge (selected courses)"],
    programs: ["哲学、政治学与经济学 (PPE)", "地理", "实验心理学", "经济学（部分）"],
    programsEn: ["Philosophy, Politics & Economics (PPE)", "Geography", "Experimental Psychology", "Economics (selected)"],
    duration: "1 小时（牛津 TSA Section 1）",
    format: "Section 1: 50 MCQ (25 Critical Thinking + 25 Problem Solving, 60 min); Section 2: 1 essay (30 min, Oxford only)",
    formatZh: "第一节：50 道选择题（25 道批判性思维 + 25 道问题解决，60 分钟）；第二节：30 分钟小论文（仅牛津部分课程要求）。",
    registrationUrl: "https://www.ox.ac.uk/admissions/undergraduate/applying-to-oxford/guide/admissions-tests/tsa",
    officialSampleUrl: "https://www.ox.ac.uk/admissions/undergraduate/applying-to-oxford/guide/admissions-tests/tsa",
    hasQuestionBank: false,
    overview: "TSA 测试逻辑推理、批判性思维与数学解题能力，不依赖任何具体学科知识（无需 A-Level 内容），更考查思维方式。牛津 PPE 等人文社科专业通常要求 TSA。",
    structureDetails: "批判性思维题：分析论证、识别假设、评估证据。问题解决题：逻辑谜题、数学推理（初中数学水平，重逻辑不重计算）。Section 2 小论文要求从两题中选一题，30 分钟内写出论点清晰的短文。",
    scoringNote: "Section 1：原始分换算成 0–100 标准化分数。Section 2：独立评分（0–6）。两部分合并评估。",
    topics: [
      { id: "tsa-critical", title: "批判性思维", titleEn: "Critical Thinking", description: "识别论证结构、假设、谬误与反驳" },
      { id: "tsa-problem", title: "问题解决", titleEn: "Problem Solving", description: "逻辑谜题、概率推断、空间推理" },
      { id: "tsa-essay", title: "论文写作（Section 2）", titleEn: "Essay Writing", description: "论点构建、反驳分析、简洁英文表达" },
    ],
    studyPlan: [
      { week: "第 1–2 周", focus: "批判性思维基础", tasks: ["学习论证结构（前提、结论、假设）", "完成 50 道 Critical Thinking 历年题", "做错题解析，归纳题型规律"] },
      { week: "第 3–4 周", focus: "问题解决专项", tasks: ["逻辑谜题每天 10 道", "概率推断题 20 道", "完成 1 套历年 Section 1（计时 60 分钟）"] },
      { week: "第 5–6 周", focus: "Section 2 论文训练（如需）", tasks: ["阅读牛津 TSA 历年论文题", "每周写 2 篇 30 分钟限时小论文", "朋友或老师反馈论点是否清晰"] },
      { week: "第 7–8 周", focus: "完整模拟 + 总结", tasks: ["每周 1 套完整模拟（1.5 小时）", "整理批判性思维题的高频陷阱", "检查论文语言简洁度"] },
    ],
    tips: [
      "TSA 不考学科知识，考的是思维方式——提前刷历年题效果远超看教材。",
      "批判性思维题：每次先找「结论」再找「前提」，有助于快速定位假设。",
      "Section 2 论文：30 分钟只写一个清晰论点，比面面俱到更好，不要写成「列举式」。",
      "问题解决题用逆向推理（先看答案再推条件）可节省时间。",
    ],
  },

  {
    id: "bmat",
    name: "BioMedical Admissions Test",
    abbr: "BMAT",
    nameZh: "生物医学入学考试",
    category: "science",
    icon: "🧬",
    universities: ["University of Leeds (Medicine)", "Lancaster University (Medicine)"],
    programs: ["医学", "兽医学（部分）"],
    programsEn: ["Medicine", "Veterinary Medicine (selected)"],
    duration: "2 小时（Section 1：32 分钟 + Section 2：30 分钟 + Section 3：30 分钟）",
    format: "Sec 1: 32 MCQ (Aptitude/Skills); Sec 2: 27 MCQ (Sci Knowledge); Sec 3: 1 essay from 3 prompts",
    formatZh: "第一节：32 道能力测试（批判性思维+问题解决）；第二节：27 道科学知识选择题（生物、化学、物理、数学）；第三节：从 3 道题中选 1 道写短文（30 分钟）。",
    registrationUrl: "https://www.undergraduate.study.cam.ac.uk/applying/admissions-tests",
    officialSampleUrl: "https://www.undergraduate.study.cam.ac.uk/applying/admissions-tests",
    hasQuestionBank: false,
    overview: "BMAT 是医学类专业的入学笔试，原用于牛津、剑桥、帝国理工、UCL 医学。注意：UCL、帝国理工、牛津医学已于 2023 年停止使用 BMAT，改用 UCAT。目前主要由利兹大学、兰开斯特大学等医学院使用。",
    structureDetails: "Section 2 科学知识范围约为英国 GCSE/AS 水平（略低于 A-Level），考量生物、化学、物理、数学基础。Section 3 论文要求用英文论证一个科学相关观点。",
    scoringNote: "Section 1 & 2 分别给出 1–9 分（标准化）；Section 3 按论证质量和英文准确性给 E/D/C/B/A（语言分 1–5）。",
    statusNote: "⚠️ 重要变化：牛津、剑桥、帝国理工、UCL 已停用 BMAT（2023 年起）。申请医学专业前请仔细确认目标院校的当前笔试要求——部分已改用 UCAT 或无笔试要求。",
    topics: [
      { id: "bmat-bio", title: "生物学", titleEn: "Biology", description: "细胞、遗传、消化系统、神经系统、生态（GCSE–AS 级别）" },
      { id: "bmat-chem", title: "化学", titleEn: "Chemistry", description: "原子结构、有机化学基础、反应速率、酸碱（GCSE–AS 级别）" },
      { id: "bmat-phys", title: "物理", titleEn: "Physics", description: "力学、电学、波动、热学（GCSE–AS 级别）" },
      { id: "bmat-math", title: "数学", titleEn: "Mathematics", description: "代数、几何、数据处理（GCSE 级别）" },
      { id: "bmat-apt", title: "能力测试（Section 1）", titleEn: "Aptitude & Skills", description: "批判性思维、数据分析、推理" },
    ],
    studyPlan: [
      { week: "第 1–2 周", focus: "Section 2 科学知识复习", tasks: ["GCSE 生物、化学各 1 本教材快速过一遍", "物理基础（GCSE 到 AS 过渡部分）", "每科 20 题 BMAT 历年题"] },
      { week: "第 3–4 周", focus: "Section 1 能力题 + Section 3 写作", tasks: ["批判性思维题 50 道专项", "每周写 2 篇 Section 3 限时短文", "找医学相关伦理话题练习表达"] },
      { week: "第 5–6 周", focus: "完整模拟", tasks: ["每周 1 套完整 BMAT 模拟", "整理 Section 2 知识盲区", "对照官方评分标准改写 Section 3"] },
    ],
    tips: [
      "确认目标院校是否仍使用 BMAT——2023 年后多数顶尖医学院已改用 UCAT。",
      "BMAT Section 2 是 GCSE 到 AS 级别，不是 A-Level 全部内容，不要过度备考。",
      "Section 3 用字要精准、论点清晰，字数 200–300 字即可，勿追求数量。",
    ],
  },

  {
    id: "lnat",
    name: "Law National Aptitude Test",
    abbr: "LNAT",
    nameZh: "全国法律能力测试",
    category: "thinking",
    icon: "⚖",
    universities: ["University of Oxford", "University College London", "University of Glasgow", "Durham University", "University of Nottingham", "King's College London", "University of Bristol", "SOAS", "University of Edinburgh"],
    programs: ["法学（LLB）", "法学与其他专业联合学位"],
    programsEn: ["Law (LLB)", "Combined Degrees with Law"],
    duration: "2 小时 15 分钟（Section A：95 分钟 + Section B：40 分钟）",
    format: "Section A: 42 MCQ (12 passages × 3–4 questions, reading comprehension & inference); Section B: 1 essay from 3 prompts",
    formatZh: "第一节：42 道选择题（阅读 12 篇文章，每篇 3–4 道推断/理解题，95 分钟）；第二节：从 3 个话题中选 1 题写短文（40 分钟）。",
    registrationUrl: "https://lnat.ac.uk/",
    officialSampleUrl: "https://lnat.ac.uk/lnat-preparation/free-test-resources/",
    hasQuestionBank: false,
    overview: "LNAT 是英国法学院最广泛使用的入学能力测试，不考法律知识，而是测试批判性阅读、推断分析和论证写作能力。无论背景如何，都可以通过系统训练显著提升成绩。",
    structureDetails: "Section A 是速度与准确度的双重考验：12 篇学术类文章，文章长度 500–700 词，共 42 题，平均每题 2.2 分钟。Section B 小论文由牛津等院校直接评阅（部分院校不使用 B 节）。",
    scoringNote: "Section A：原始分/42，换算为平均分报告。牛津通常期望 Section A 在 28–29 分以上（约 67%）。Section B 独立评分，由目标院校自行评阅。",
    topics: [
      { id: "lnat-read", title: "批判性阅读与推断", titleEn: "Critical Reading & Inference", description: "从文章中推断隐含信息、识别论证结构与前提" },
      { id: "lnat-analyse", title: "论证分析", titleEn: "Argument Analysis", description: "评估论证强弱、识别假设与漏洞、区分事实与观点" },
      { id: "lnat-essay", title: "议论文写作（Section B）", titleEn: "Essay Writing (Sec. B)", description: "话题多为社会、法律、政治伦理类，要求英文论证清晰" },
    ],
    studyPlan: [
      { week: "第 1–2 周", focus: "批判性阅读入门", tasks: ["每天精读 2 篇 The Guardian/BBC 等英文评论文章", "做 LNAT 官网免费样题 Section A", "学习阅读推断题的常见题型与策略"] },
      { week: "第 3–4 周", focus: "Section A 大量练题", tasks: ["每天 1 篇 LNAT 阅读文章（计时 8–10 分钟）", "完成 LNAT 官网全部免费样卷", "分析错题：是理解错误还是题干陷阱"] },
      { week: "第 5–6 周", focus: "Section B 写作训练", tasks: ["每周写 3 篇 LNAT 限时论文（40 分钟）", "建立论点—反驳—结论的写作框架", "阅读 LNAT 官方高分论文样例"] },
      { week: "第 7–8 周", focus: "完整模拟 + 查漏补缺", tasks: ["完整 2 小时 15 分钟模拟 2 次", "Section A 速度专项（目标：95 分钟完成 42 题）", "Section B 重点打磨论点清晰度"] },
    ],
    tips: [
      "LNAT 不考法律知识——不要备考法律内容，专注阅读理解和逻辑分析。",
      "Section A 速度极为关键：每篇文章建议 7–8 分钟（含阅读），不要超时。",
      "先跳读找文章主旨，再回头找答案依据——不要逐句精读。",
      "Section B 写作牛津评阅：论点清晰、有具体论据，强于面面俱到的平庸分析。",
      "LNAT 可在指定考试中心参加，大陆学生可在中国境内的 Pearson VUE 考场预约。",
    ],
  },
];

export function getTestById(id: string): AdmissionsTest | undefined {
  return ADMISSIONS_TESTS.find((t) => t.id === id);
}

export const TEST_CATEGORIES: Record<TestCategory, { label: string; labelEn: string }> = {
  mathematics: { label: "数学类", labelEn: "Mathematics" },
  science: { label: "理科类", labelEn: "Science" },
  law: { label: "法学类", labelEn: "Law" },
  thinking: { label: "思维类", labelEn: "Thinking Skills" },
};
