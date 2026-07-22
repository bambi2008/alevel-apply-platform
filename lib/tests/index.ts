// 英国大学入学笔试数据层 — 10 种考试

export type TestCategory = "mathematics" | "science" | "law" | "thinking" | "competition";

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
    format: "Historical 2025 format: 25 multiple-choice questions + 2 typed-response questions; 100 marks",
    formatZh: "历史 2025 格式：25 道选择题 + 2 道键入长题，考试 2.5 小时，总分 100 分。2026 起不再举行。",
    registrationUrl: "https://www.maths.ox.ac.uk/study-here/undergraduate-study/maths-admissions-test",
    officialSampleUrl: "https://www.maths.ox.ac.uk/system/files/inline-files/test25.pdf",
    hasQuestionBank: true,
    statusNote: "MAT 已于 2025 年后停用。2026 起 Oxford 数学、计算机及相关专业改用 TMUA；本页保留为历史题库与深度推理训练。",
    overview: "MAT 是 Oxford 在 2007–2025 年使用的数学入学考试。虽然已由 TMUA 取代，其长题仍适合训练 A-Level 数学知识的深度应用、解释与推导能力。",
    structureDetails: "最后一届 2025 MAT 含 25 道选择题和 2 道多小问键入长题，所有题目均需作答。长题要求解释推理，但不要求输入复杂数学排版。",
    scoringNote: "2025 MAT 总分 100 分；选择题按题目标示为 2、3 或 4 分，两道长题各 15 分并按步骤给部分分。",
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
    format: "Historical final format: a two-hour multiple-choice paper combining mathematics and physics",
    formatZh: "历史最终格式：2 小时全选择题，综合考查数学与物理。2026 起由 ESAT 取代。",
    registrationUrl: "https://www.physics.ox.ac.uk/study/undergraduates/how-apply/engineering-and-science-admissions-test-esat",
    officialSampleUrl: "https://www.physics.ox.ac.uk/study/undergraduates/how-apply/engineering-and-science-admissions-test-esat",
    hasQuestionBank: true,
    statusNote: "PAT 已于 2025 年后停用。2026 起 Oxford 物理与工程申请者改考 ESAT；PAT 题库继续用于物理问题解决与面试训练。",
    overview: "PAT 是 Oxford 过去用于物理、工程等专业的入学测试。它已由 ESAT 取代，但其中的数学物理综合题仍适合训练建模、估算和陌生情境推理。",
    structureDetails: "PAT 最后阶段采用 2 小时全选择题形式，综合覆盖数学与物理。本站的“书面拓展卷”会额外要求写出过程，用于能力训练，并非历史官方卷面结构。",
    scoringNote: "历史最终格式按选择题答案计分。本站书面拓展卷采用过程评分，仅用于训练，不对应官方 PAT 或现行 ESAT 成绩。",
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
    registrationUrl: "https://esat-tmua.ac.uk/about-the-tests/esat-test/",
    officialSampleUrl: "https://esat-tmua.ac.uk/esat-preparation-materials/",
    hasQuestionBank: true,
    overview: "ESAT 取代 ENGAA 和 NSAA，供剑桥、帝国理工、牛津及 UCL 的部分工程与科学课程使用。多数考生完成 3 个独立计时模块：Mathematics 1 必考，再按课程要求选择 Biology、Chemistry、Physics 或 Mathematics 2 中的两个模块。",
    structureDetails: "每个模块均为 27 道五选一选择题、40 分钟且不可使用计算器。Mathematics 1 为所有考生必考；其余两个模块由目标课程指定。五个模块分别独立计时，重点考查在短时间内应用数学与科学知识解决问题。",
    scoringNote: "答错不扣分，建议作答每一道题。考生所参加的每个模块分别报告 1.0–9.0 分，保留一位小数；院校会结合其他申请材料使用这些成绩，ESAT 不设统一及格线。",
    topics: [
      { id: "esat-math1", title: "数学1 — 代数与函数", titleEn: "Math 1: Algebra & Functions", description: "方程组、不等式、多项式、二项式定理、函数变换（Module 1 必考）" },
      { id: "esat-math2", title: "数学1 — 微积分", titleEn: "Math 1: Calculus", description: "导数规则、积分基础、运动方程推导、面积计算（Module 1 必考）" },
      { id: "esat-math3", title: "数学1 — 几何与数列", titleEn: "Math 1: Geometry & Sequences", description: "坐标几何、圆与直线、等差等比数列、三角函数（Module 1 必考）" },
      { id: "esat-math2a", title: "数学2 — 复数与进阶代数", titleEn: "Math 2: Complex Numbers & Algebra", description: "复数运算与极坐标、进阶多项式、向量点积与叉积（选修 Module 2）" },
      { id: "esat-math2b", title: "数学2 — 微分方程与矩阵", titleEn: "Math 2: Differential Equations & Matrices", description: "一阶/二阶 ODE、矩阵运算、行列式与特征值（选修 Module 2）" },
      { id: "esat-phys1", title: "物理 — 力学", titleEn: "Physics: Mechanics", description: "牛顿定律、动量守恒、能量守恒、圆周运动、简单碰撞（选修 Module 2）" },
      { id: "esat-phys2", title: "物理 — 能量与功率", titleEn: "Physics: Energy & Power", description: "功、动能与势能、功率与效率、能量守恒（选修 Module 2）" },
      { id: "esat-phys3", title: "物理 — 电学", titleEn: "Physics: Electricity", description: "欧姆定律、串并联电路、电功率、电荷与电流（选修 Module 2）" },
      { id: "esat-phys4", title: "物理 — 波", titleEn: "Physics: Waves", description: "波速公式 v=fλ、横波与纵波、反射与折射、电磁波谱（官方 P6）" },
      { id: "esat-phys5", title: "物理 — 放射性", titleEn: "Physics: Radioactivity", description: "α/β/γ 辐射、穿透与电离、半衰期、核衰变方程（官方 P7）" },
      { id: "esat-phys6", title: "物理 — 热与物质", titleEn: "Physics: Thermal & Matter", description: "比热容、潜热与状态变化、热传递、密度与压强、气体粒子模型（官方 P4/P5）" },
      { id: "esat-phys7", title: "物理 — 磁学与电磁", titleEn: "Physics: Magnetism", description: "磁场与磁极、电磁铁、电动机效应 F=BIL、电磁感应与变压器（官方 P2）" },
      { id: "esat-chem1", title: "化学 — 原子结构与化学键", titleEn: "Chemistry: Atomic Structure & Bonding", description: "原子模型、电子排布、离子键/共价键/金属键、分子形状（官方 C1/C6）" },
      { id: "esat-chem2", title: "化学 — 有机化学", titleEn: "Chemistry: Organic Chemistry", description: "烃类、卤代烃、醇醛酸酯、反应机理、同分异构体（官方 C13）" },
      { id: "esat-chem3", title: "化学 — 物理化学", titleEn: "Chemistry: Physical Chemistry", description: "化学平衡、酸碱与 pH、热化学、氧化还原与速率（官方 C5/C9/C10/C11）" },
      { id: "esat-chem4", title: "化学 — 定量化学（摩尔）", titleEn: "Chemistry: Quantitative Chemistry", description: "相对分子质量、摩尔与摩尔质量、化学计量、浓度与气体体积、经验式（官方 C4）" },
      { id: "esat-chem5", title: "化学 — 电解", titleEn: "Chemistry: Electrolysis", description: "电解质、阴阳极反应、熔融盐与水溶液电解、提铝与电镀（官方 C12）" },
      { id: "esat-bio1", title: "生物 — 细胞与分子生物学", titleEn: "Biology: Cell & Molecular Biology", description: "细胞结构、细胞分裂、DNA 复制与蛋白质合成、酶（官方 B1/B2/B3/B5/B8）" },
      { id: "esat-bio2", title: "生物 — 遗传与进化", titleEn: "Biology: Genetics & Evolution", description: "孟德尔遗传、基因型与表型、自然选择、变异与物种形成（官方 B4/B7）" },
      { id: "esat-bio3", title: "生物 — 生理学", titleEn: "Biology: Physiology", description: "循环/呼吸/神经/激素系统、光合作用、呼吸作用、稳态（官方 B9/B11）" },
      { id: "esat-bio4", title: "生物 — 基因技术与生态", titleEn: "Biology: Gene Technology & Ecology", description: "基因工程与转基因、选择育种、营养级与能量流动、碳循环（官方 B6/B10）" },
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
      "两个选修模块由目标课程指定；预约前必须核对课程要求，考点现场不能更换模块。",
      "帝国理工 EEE/ME 方向也使用 ESAT，备考思路与剑桥工程完全相同。",
    ],
    pastPaperLinks: [
      { label: "官方 ESAT 学科指南（数学 / 物理 / 化学 / 生物，完全免费）", url: "https://esat-tmua.ac.uk/esat-preparation-materials/", note: "UAT 官方发布的各科备考指南（对应官方考纲逐节讲解）+ ESAT 规范说明。官方明确：所有备考资源均免费，且不推荐、不背书任何付费课程。" },
      { label: "官方 ESAT 备考资料（含历年 ENGAA / NSAA 真题）", url: "https://esat-tmua.ac.uk/esat-preparation-materials/", note: "含历年 ENGAA / NSAA 真题（已标注哪些题不在 ESAT 范围）。ESAT 自 2024/25 起取代 ENGAA / NSAA，历年真题仍是最佳练习素材。" },
      { label: "ESAT / ENGAA 真题与解析（免费下载，含答案与评分标准）", url: "https://firstclasseducation.org.uk/esat-past-papers", note: "含 2016–2023 ENGAA / NSAA 真题与详解，适合计时模考与自我批改。" },
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
      { id: "tmua-number", title: "数、比例与估算", titleEn: "Number, Ratio & Estimation", description: "数值、单位、界限、比例与增长衰减" },
      { id: "tmua-algebra", title: "代数与函数", titleEn: "Algebra & Functions", description: "方程、不等式、多项式、复合函数" },
      { id: "tmua-geometry", title: "坐标几何与三角", titleEn: "Geometry & Trigonometry", description: "直线、圆、圆定理、弧度与三角方程" },
      { id: "tmua-calc", title: "微积分", titleEn: "Calculus", description: "微分、积分、微分方程基础" },
      { id: "tmua-stats", title: "统计与概率", titleEn: "Statistics & Probability", description: "分布、期望、概率推导" },
      { id: "tmua-logic", title: "数学推理与证明（Paper 2）", titleEn: "Mathematical Reasoning & Proof", description: "命题真伪判断、反例、数学归纳法" },
      { id: "tmua-discrete", title: "数列与计数", titleEn: "Sequences & Counting", description: "递推、系统枚举与组合计数" },
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
    id: "tara",
    name: "Test of Academic Reasoning for Admissions",
    abbr: "TARA",
    nameZh: "学术推理入学测试",
    category: "thinking",
    icon: "🧠",
    universities: ["University of Oxford (Economics & Management, PPE, Human Sciences, Experimental Psychology, PPL, History & Economics, History & Politics)", "UCL (Computer Science, European & International Social and Political Studies)"],
    programs: ["经济与管理", "哲学、政治学与经济学 (PPE)", "人类科学", "实验心理学", "心理学、哲学与语言学 (PPL)", "历史与经济/历史与政治"],
    programsEn: ["Economics & Management", "Philosophy, Politics & Economics (PPE)", "Human Sciences", "Experimental Psychology", "Psychology, Philosophy & Linguistics (PPL)", "History & Economics / History & Politics"],
    duration: "2 小时（三个模块，各 40 分钟）",
    format: "三个模块，各 40 分钟：批判性思维 22 道选择题 + 问题解决 22 道选择题 + 写作任务（三选一，≤750 词）。计算机机考，不可用计算器/词典。",
    formatZh: "三个模块，各 40 分钟：批判性思维（22 道选择题）+ 问题解决（22 道选择题）+ 写作任务（从 3 个题目中选 1，不超过 750 词）。机考，不可用计算器与词典。",
    registrationUrl: "https://esat-tmua.ac.uk/about-the-tests/tara/",
    officialSampleUrl: "https://esat-tmua.ac.uk/about-the-tests/tara/",
    hasQuestionBank: true,
    overview: "TARA（学术推理入学测试）是 UAT-UK（剑桥与帝国理工合办）推出的新考试，2027 入学起由牛津用于经管、PPE、人类科学、实验心理学、历史类等社科专业，UCL 用于计算机等专业。它替代了原牛津 TSA，不考任何具体学科知识，只考通用的批判性思维、问题解决与书面表达能力。",
    structureDetails: "批判性思维（22 题）：评估日常语言论证——找主结论、推出结论、识别假设、评估新证据影响、找推理错误、匹配论证、应用原则（共七类题型）。问题解决（22 题）：数值推理——相关选择、找程序、识别相似，仅需基础数学、不可用计算器。写作任务：给一句陈述，要求三步作答——解释其含义、给出反对论证、讨论你在多大程度上同意；限 40 分钟、750 词。",
    scoringNote: "批判性思维与问题解决各出一个 1.0–9.0 分（报到小数点后一位）；写作任务 UAT-UK 不评分，答卷直接发送给报考院校自行参考。答错不倒扣。",
    topics: [
      { id: "tara-critical", title: "批判性思维", titleEn: "Critical Thinking", description: "找主结论、假设、推理错误、匹配论证、应用原则（七类题型）" },
      { id: "tara-problem", title: "问题解决", titleEn: "Problem Solving", description: "数值推理：相关选择、找程序、识别相似（基础数学，无计算器）" },
      { id: "tara-writing", title: "写作任务", titleEn: "Writing Task", description: "给一句陈述，三步作答：解释、反驳、讨论认同程度（≤750 词）" },
    ],
    studyPlan: [
      { week: "第 1–2 周", focus: "批判性思维七类题型", tasks: ["逐一掌握七种题型（结论/假设/推理错误/匹配论证/应用原则等）", "完成官方样题的批判性思维模块", "归纳每类题型的解题套路"] },
      { week: "第 3–4 周", focus: "问题解决专项", tasks: ["练习相关选择、找程序、识别相似三类技能", "限时（40 分钟 22 题）训练", "无计算器心算与估算训练"] },
      { week: "第 5–6 周", focus: "写作任务三段式", tasks: ["练习「解释—反驳—讨论认同度」三步结构", "每周写 2 篇限时（40 分钟）写作任务", "对照范文检查是否三部分都充分展开"] },
      { week: "第 7–8 周", focus: "完整模拟 + 官方样卷", tasks: ["做完 UAT-UK 官网两套官方样题", "每周 1 套完整模拟（三模块连做）", "整理批判性思维高频陷阱"] },
    ],
    tips: [
      "TARA 不考学科知识，考思维方式——务必做完 UAT-UK 官网的两套官方样题（含解析）。",
      "批判性思维题：先找「结论」再找「前提」，能快速定位假设与推理错误。",
      "写作任务不是自由议论文：必须把「解释含义、给出反对论证、讨论认同程度」三部分都写到。",
      "问题解决无计算器：练心算与估算，先排除明显错误选项能省时间。",
      "三模块各 40 分钟、时间不串用；某模块提前做完的时间不能留给下一模块。",
    ],
  },


  {
    id: "bmo",
    name: "British Mathematical Olympiad (via UKMT Senior Challenge)",
    abbr: "BMO",
    nameZh: "英国数学奥林匹克（UKMT → BMO）",
    category: "competition",
    icon: "🧮",
    universities: ["由英国数学信托（UKMT）运营；BMO 成绩受 Oxford、Cambridge、Imperial、Warwick 等数学方向招生高度认可，也是数学 PS 与面试的有力学术信号"],
    programs: ["数学", "数学与统计", "数学与计算机", "计算机科学", "工程"],
    programsEn: ["Mathematics", "Mathematics & Statistics", "Mathematics & Computer Science", "Computer Science", "Engineering"],
    duration: "SMC：90 分钟；BMO1：3.5 小时",
    format: "Senior Maths Challenge (SMC): 90 min, 25 questions (22 multiple-choice + 3 numeric answers 000–999), increasing difficulty. British Mathematical Olympiad Round 1 (BMO1): 3.5 hours, 6 proof questions, 10 marks each — full written proofs required.",
    formatZh: "SMC（晋级入口）：90 分钟 25 题，前 22 题为选择题、最后 3 题为 000–999 三位数字作答，难度递增；BMO1：3.5 小时 6 道纯证明题，每题 10 分，须写出完整证明，仅有答案不得分。BMO1 常见配比：数论约 2 题、几何 1–2 题、组合/博弈约 2 题、代数/数列 1 题。",
    registrationUrl: "https://www.ukmt.org.uk/",
    officialSampleUrl: "https://www.ukmt.org.uk/",
    hasQuestionBank: true,
    overview: "BMO 是英国最高水平的中学数学竞赛，由 UKMT 运营，是选拔英国队参加国际数学奥赛（IMO）的通道。注意：这是学术竞赛而非入学考试——不用于报名大学，但 SMC 的 Gold 证书、尤其 BMO1 的优异成绩，是数学与相关专业申请中极有分量的学术信号，其解题与证明风格也与牛剑面试高度一致。晋级路径：Senior Maths Challenge → BMO1 → BMO2 → 国家队集训。",
    structureDetails: "竞赛为分级系列：Senior Maths Challenge（10 月，选择/数字题，本平台 SMC 题库对标）→ BMO Round 1（11 月，6 道证明题，本平台长题对标）→ BMO Round 2（次年 1 月，IMO 级难度，受邀参加）→ 国家队集训与 IMO。SMC 允许普通计算器（部分年份禁用计算器，以当年规则为准）；BMO 为纯手写证明、不得使用计算器。评分特点：BMO 满分极难，一道写到位的完整证明往往胜过六道半成品——书写与严格性本身就是重要得分点。",
    scoringNote: "SMC 按比例授予 Gold / Silver / Bronze，并据分数线发出 BMO1 邀请；BMO1 按成绩授予奖项并选拔进入 BMO2。本平台题库：SMC 短题已转为选择题以支持自动判分与即时反馈（其中原为 000–999 数字作答的题目会在题干注明，均经程序验算）；BMO1 风格证明长题保留完整格式，配引导小问与完整解答供自评。",
    topics: [
      { id: "bmo-number", title: "数论", titleEn: "Number Theory", description: "整除与同余、素数与因数分解、平方差与奇偶约束、完全平方判定、模运算（BMO1 最高频主题之一）" },
      { id: "bmo-algebra", title: "代数与不等式", titleEn: "Algebra & Inequalities", description: "多项式与因式分解、数列与求和、函数方程入门、AM–GM / QM–AM / Cauchy–Schwarz 等经典不等式与等号分析" },
      { id: "bmo-geometry", title: "几何", titleEn: "Geometry", description: "三角形与圆、角度追逐、相似与全等、面积法、圆内接四边形与幂、坐标与向量方法" },
      { id: "bmo-combinatorics", title: "组合与博弈", titleEn: "Combinatorics & Games", description: "计数与鸽巢原理、不变量与单调量、图与染色、博弈策略与必胜态（BMO1 证明题的常客）" },
    ],
    studyPlan: [
      { week: "第 1–2 周", focus: "SMC 手感 + 数论地基", tasks: ["刷 SMC 题库数论/代数分段，适应 90 分钟节奏", "掌握同余、平方差因式分解、奇偶性约束因数对三件套", "开始接触官方 SMC 真题（ukmt.org.uk）"] },
      { week: "第 3–4 周", focus: "组合不变量 + 几何", tasks: ["组合题库：练不变量/单调量与鸽巢", "几何题库：角度追逐与圆的性质", "每周 1 套 SMC 计时练习，最后 3 道数字题重点练"] },
      { week: "第 5–6 周", focus: "从选择题过渡到完整证明", tasks: ["完成平台 BMO1 风格证明长题并对照解答自评", "专练证明书写：不变量法、平方配方、不等式等号分析", "官方 BMO1 真题每周精做 1–2 道，只求写到位"] },
      { week: "第 7–8 周", focus: "全真模拟与查漏", tasks: ["完成平台 SMC 模拟卷与 BMO1 阶梯模考", "官方近年 BMO1 整卷限时模拟（3.5 小时选做 3–4 题）", "整理错题：区分「不会」与「会但写不严」"] },
    ],
    tips: [
      "SMC 通常 10 月经学校统一报名；BMO1 可凭 SMC 达线晋级，或由学校付费直报（每人约 £40）——尽早与学校数学老师沟通。",
      "BMO 的第一心态关：满分不是目标。一道完整、严谨的解答，胜过六道半成品——评分按证明的严格性给分。",
      "务必做官方历年真题（ukmt.org.uk 免费下载）：本题库负责主题化训练与即时反馈，真题负责手感与证明书写。",
      "SMC 最后 3 题为 000–999 数字作答（本平台以选择题呈现并已注明）：难度最高，会做再回头攻，别在此耗光时间。",
      "证明题写「双向完整」：既要给出解/构造，也要论证再无其他、或不等式等号何时成立——漏掉这一半常被扣分。",
      "常用武器备好：数论用平方差+奇偶/同余；组合先找不变量或单调量；不等式想 AM–GM / Cauchy–Schwarz 并单独分析等号。",
    ],
  },


  {
    id: "bpho",
    name: "British Physics Olympiad (Round 1)",
    abbr: "BPhO",
    nameZh: "英国物理奥林匹克（学术竞赛）",
    category: "competition",
    icon: "🏆",
    universities: ["由牛津大学物理系运营；成绩受 Oxford、Cambridge、Imperial 等物理/工程方向招生认可"],
    programs: ["物理", "工程", "自然科学（物理方向）"],
    programsEn: ["Physics", "Engineering", "Natural Sciences (Physical)"],
    duration: "Round 1：两节各 80 分钟（可连堂 2 小时 40 分钟或分两次）",
    format: "Section 1: one multi-part question (~13 independent parts, ≈76 marks capped at 50); Section 2: choose 2 of ~5 thematic 25-mark long questions (also capped at 50).",
    formatZh: "第一节：一道多小问大题（约 13 个独立小问、总分约 76、上限 50 分，80 分钟）；第二节：约 5 道 25 分主题长题中任选 2 道作答（上限 50 分，80 分钟）。需写出完整过程，仅有答案不得分。",
    registrationUrl: "https://www.bpho.org.uk/",
    officialSampleUrl: "https://www.bpho.org.uk/",
    hasQuestionBank: true,
    overview: "BPhO 是英国最高水平的中学物理竞赛，由牛津大学物理系运营，是选拔英国国家队参加国际物理奥赛（IPhO）的通道。注意：这是学术竞赛而非入学考试——它不用于报名大学，但 Round 1 的 Gold/Top Gold 证书是物理与工程方向申请中极有分量的学术信号，其解题风格也与牛剑面试高度一致。BPhO 无固定考纲：题目取自 A-Level 核心物理，但以陌生、多步的方式应用，并需要微积分与向量等超出 A-Level 的数学工具。",
    structureDetails: "竞赛为分级系列：Physics Challenges（Y11/Y12/Y13 入门）→ Round 1（11 月，本题库对标）→ Round 2（次年 1 月底，受邀参加，IPhO 级难度）→ Round 3 牛津集训营 → 英国国家队。Round 1 允许使用标准考试局公式表与普通计算器（不可编程/符号运算）。评分特点：满分极难，50–60% 已是奖牌线水平；A* 水平的学生首次裸考常只有 30–40%——这是竞赛的正常现象，不代表能力不足。",
    scoringNote: "按成绩比例授予 Top Gold / Gold / Silver / Bronze 等证书；Top Gold 获邀参加 Round 2。本平台题库：Section 1 短题已转为选择题以支持自动判分与即时反馈（全部经程序双重验算）；Section 2 长题保留原始格式，附完整解答供自评。",
    topics: [
      { id: "bpho-mechanics", title: "力学", titleEn: "Mechanics", description: "运动学与动力学、圆周与引力、能量动量碰撞、转动力学（含微积分方法）" },
      { id: "bpho-waves", title: "振动与波", titleEn: "Oscillations & Waves", description: "SHM 能量与周期、波动方程、驻波、多普勒、干涉与光学" },
      { id: "bpho-em", title: "电与磁", titleEn: "Electricity & Magnetism", description: "含内阻电路、RC 充放电与时间常数、场与力、电磁感应、变压器" },
      { id: "bpho-thermal", title: "热学", titleEn: "Thermal Physics", description: "理想气体、热量收支、潜热、传导、卡诺效率、r.m.s. 速率" },
      { id: "bpho-modern", title: "现代物理与估算", titleEn: "Modern Physics & Estimation", description: "光电效应、德布罗意、核物理、相对论入门、数量级估算（BPhO 招牌）" },
    ],
    studyPlan: [
      { week: "第 1–3 周", focus: "力学攻坚", tasks: ["刷完力学题库（占 Round 1 半壁江山）", "掌握 a = v dv/dx、相对速度反转、轨道能量三件套", "开始做官方历年 Round 1 真题的 Section 1（bpho.org.uk/Papers/R1/）"] },
      { week: "第 4–5 周", focus: "波与电磁", tasks: ["振动与波 + 电磁题库", "重点练 RC 电路「读方程不积分」", "每周 1 份官方真题 Section 1 计时练习"] },
      { week: "第 6–7 周", focus: "热学、现代与长题", tasks: ["热学 + 现代与估算题库", "完成平台 4 道原创 Section 2 长题并对照解答自评", "官方真题的 Section 2 每周精做 2 道"] },
      { week: "第 8 周", focus: "全真模拟", tasks: ["完成平台 2 套双模块模拟卷", "官方近年真题整卷限时模拟（2 小时 40 分钟）", "整理错题：区分「知识缺口」与「陌生情境不适应」"] },
    ],
    tips: [
      "BPhO 的第一心态关：满分不是目标，50–60% 就是奖牌水平——别被真题吓退。",
      "务必做官方历年真题（bpho.org.uk/Papers/R1/ 免费下载）：本题库负责主题化训练与即时反馈，真题负责手感与书写训练。",
      "Section 1 各小问相互独立：卡住立刻跳过，先把会做的分拿满（总分 76 上限 50，意味着可以战略性放弃约 1/3）。",
      "Section 2 只选 2 题：开考先花 3 分钟通读所有题，选最顺手的主题，每题约 40 分钟。",
      "写过程！评分按步骤给分，只有答案不得分；关键中间结果圈出来方便阅卷人找到。",
      "报名由学校老师在 BPhO 平台统一注册（每校一位教师账号），个人无法直接报名——尽早与学校沟通。",
    ],
  },

  {
    id: "ucat",
    name: "University Clinical Aptitude Test",
    abbr: "UCAT",
    nameZh: "大学临床能力倾向测试",
    category: "thinking",
    icon: "✚",
    universities: ["UK and partner consortium medical and dental schools"],
    programs: ["医学", "牙医学"],
    programsEn: ["Medicine", "Dentistry"],
    duration: "约 2 小时（正式作答 111 分钟）",
    format: "VR 44 questions / 22 min; DM 35 / 37 min; QR 36 / 26 min; SJT 69 / 26 min",
    formatZh: "四个独立计时模块：文字推理 44 题/22 分钟、决策判断 35 题/37 分钟、数量推理 36 题/26 分钟、情境判断 69 题/26 分钟。",
    registrationUrl: "https://www.ucat.ac.uk/register/",
    officialSampleUrl: "https://www.ucat.ac.uk/prepare/practice-tests/",
    hasQuestionBank: true,
    statusNote: "本题库按现行四模块结构制作；抽象推理已从 2025 年起移除。平台换算分与 SJT Band 仅作训练估计，不是官方成绩。",
    overview: "UCAT 是英国及合作地区医学、牙医学申请广泛使用的计算机能力倾向测试。它不考医学知识，核心挑战是高时间压力下的阅读、逻辑、数量处理与职业判断。",
    structureDetails: "全卷分为 Verbal Reasoning、Decision Making、Quantitative Reasoning 和 Situational Judgement。模块独立计时；Decision Making 含五陈述 Yes/No 组合题，Situational Judgement 按与最佳答案的接近程度给予部分分。",
    scoringNote: "前三个认知模块各按 300-900 报告，总分 900-2700；SJT 单独报告 Band 1-4。答错不倒扣。本站显示的是基于原始得分率的训练估计，不能替代官方等值换算。",
    topics: [
      { id: "ucat-vr", title: "文字推理", titleEn: "Verbal Reasoning", description: "快速阅读、证据定位、True/False/Can't Tell 与观点推断" },
      { id: "ucat-dm", title: "决策判断", titleEn: "Decision Making", description: "三段论、逻辑谜题、论证、概率、维恩图与多陈述判断" },
      { id: "ucat-qr", title: "数量推理", titleEn: "Quantitative Reasoning", description: "表格图表、比例百分比、汇率、速率与多步估算" },
      { id: "ucat-sjt", title: "情境判断", titleEn: "Situational Judgement", description: "患者安全、诚信、沟通、保密、团队合作与职业边界" },
    ],
    studyPlan: [
      { week: "第 1-2 周", focus: "摸底与方法", tasks: ["完成四模块短诊断", "建立错题原因标签", "熟悉屏幕计算器与计时节奏"] },
      { week: "第 3-4 周", focus: "分模块提速", tasks: ["VR 每日两组证据定位", "DM 轮换逻辑与概率", "QR 训练心算、估算和跳题"] },
      { week: "第 5-6 周", focus: "SJT 与混合训练", tasks: ["按患者安全和诚信原则复盘 SJT", "完成半套混合计时", "减少无效重读与答案修改"] },
      { week: "第 7-8 周", focus: "全真机考", tasks: ["每周完成两次整卷或四模块连做", "按模块分析速度与正确率", "固定跳题、标记和回看策略"] },
    ],
    tips: [
      "UCAT 是速度考试：卡住时先标记并前进，避免一题吞掉整个模块。",
      "VR 只依据给定文本作答，不用常识补全；Can't Tell 需要确认文本既未证明也未否定。",
      "DM 多陈述题要逐条判断，不能用第一条的结论代替其余判断。",
      "QR 先估算数量级，再使用屏幕计算器确认，注意单位和百分比基数。",
      "SJT 优先患者安全、诚实、及时升级、尊重保密和自身能力边界。",
    ],
    pastPaperLinks: [
      { label: "UCAT 官方练习题与全真测试", url: "https://www.ucat.ac.uk/prepare/practice-tests/", note: "官方界面与题型最接近正式考试" },
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
    hasQuestionBank: true,
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
  competition: { label: "竞赛", labelEn: "Competition" },
  mathematics: { label: "数学类", labelEn: "Mathematics" },
  science: { label: "理科类", labelEn: "Science" },
  law: { label: "法学类", labelEn: "Law" },
  thinking: { label: "思维类", labelEn: "Thinking Skills" },
};
