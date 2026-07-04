// 在线课题（进阶版 · 硬核工程）——平台自有、贴近专业、用工业级软件完成、有量化验收的高含金量课题。
// 与「背景提升项目目录（外部活动推荐）」并存：目录=去参加什么；在线课题=在平台真做一个。
// 设计原则（据用户反馈升级）：
//   1. 指定专业软件（ANSYS 学生版等，官方支持高中生、免费）完成具体操作任务；
//   2. 用可量化指标验收（应力、安全系数、升阻比等），并设「基础线 / 挑战目标」分层；
//   3. 融合编程/AI（Python 做后处理、参数扫描、优化），面向未来趋势。
// 平台负责：课题说明书 + 量化验收标准 + 成果归档；实际操作在学生本机的专业软件中完成，上传结果。
// 内容为原创设计，采用真实工程方法与工业软件工作流。

export type ProjectField = "MECH" | "AERO" | "CS" | "ECON" | "BIO" | "MATH";

export const PROJECT_FIELDS: { value: ProjectField; label: string; labelEn: string; emoji: string }[] = [
  { value: "MECH", label: "机械工程", labelEn: "Mechanical Engineering", emoji: "⚙️" },
  { value: "AERO", label: "航空航天工程", labelEn: "Aerospace Engineering", emoji: "🚀" },
  { value: "CS", label: "计算机科学", labelEn: "Computer Science", emoji: "💻" },
  { value: "ECON", label: "经济学", labelEn: "Economics", emoji: "📊" },
  { value: "BIO", label: "生物科学", labelEn: "Biological Sciences", emoji: "🧬" },
  { value: "MATH", label: "数学", labelEn: "Mathematics", emoji: "➗" },
];

export function projectFieldLabel(f: ProjectField): string {
  return PROJECT_FIELDS.find((x) => x.value === f)?.label ?? f;
}
export function projectFieldEmoji(f: ProjectField): string {
  return PROJECT_FIELDS.find((x) => x.value === f)?.emoji ?? "•";
}

export interface ProjectTool {
  name: string;
  note: string;
}

export interface ProjectStage {
  num: number;
  title: string;
  goal: string;
  software?: string;
  learn: string[];
  task: string;
  deliverable: string;
  metrics: string[];
  rubric: string[];
  humanReview: boolean;
}

export interface OnlineProject {
  id: string;
  field: ProjectField;
  title: string;
  titleEn: string;
  summary: string;
  scenario: string;
  whyValuable: string;
  targetMajors: string[];
  difficulty: 1 | 2 | 3;
  estimatedHours: string;
  primaryTool: ProjectTool;
  altTool?: ProjectTool;
  techStack: string[];
  baseline: string;
  challenge: string;
  skills: string[];
  stages: ProjectStage[];
  outcome: string;
}

export const ONLINE_PROJECTS: OnlineProject[] = [
  // ═══════════════ 机械工程 ═══════════════
  {
    id: "mech-truss-fea",
    field: "MECH",
    title: "桁架桥的有限元仿真与轻量化优化设计",
    titleEn: "FEA Simulation & Lightweight Optimisation of a Truss Bridge",
    summary:
      "用工业级有限元软件 ANSYS Mechanical 对一座承载桥架做真实的结构仿真，读出应力与安全系数，再用优化把它做得更轻更强。",
    scenario:
      "你是结构工程团队的实习生，需要为一座 12 米跨度的人行桁架桥做结构校核：在规定荷载下，结构安全吗？能不能在保证安全的前提下减重、省材料？你将用工程师真正在用的有限元分析（FEA）软件完成建模、仿真、读数与优化——这正是机械/土木/航空结构工程师的日常工作流。",
    whyValuable:
      "「我用 ANSYS 做了一座桥的有限元仿真，把结构减重 20% 且安全系数仍达 2.0」——这是招生官能立刻识别的真实工程能力：会用工业软件、懂量化指标、能做优化决策。远胜于「参加过工程夏令营」这类空泛经历。",
    targetMajors: ["机械工程", "土木/结构工程", "航空航天工程（结构方向）", "工程学（通用）"],
    difficulty: 3,
    estimatedHours: "25–40 小时（约 4–6 周）",
    primaryTool: {
      name: "ANSYS Mechanical（学生版，免费）",
      note: "官方免费学生版，含有限元结构分析（FEA）。官网 ansys.com/academic/students 下载，约 9–10GB，Windows，许可 1 年可免费续期；官方明确支持高中 STEM 学生使用。",
    },
    altTool: {
      name: "Autodesk Fusion 360（学生版，免费，备选）",
      note: "自带 FEA 仿真、更易上手；若电脑装不下 ANSYS，可用它完成同样的应力/安全系数分析。",
    },
    techStack: ["ANSYS Mechanical (FEA)", "CAD 建模", "Python（数据后处理/优化）"],
    baseline:
      "基础线：完成静力有限元仿真，正确读出最大 von Mises 应力与最大变形，并算出安全系数 ≥ 2.0。",
    challenge:
      "挑战目标：在安全系数仍 ≥ 2.0 的前提下，通过优化把结构质量降低 ≥ 20%（或最大应力降低 ≥ 25%），并用 Python 画出多方案对比曲线。",
    skills: ["有限元分析（FEA）", "工业软件工作流", "工程量化决策", "Python 数据处理", "技术报告写作"],
    stages: [
      {
        num: 1,
        title: "几何建模与背景",
        goal: "理解 FEA 原理，在软件中建立桁架结构模型并设定材料。",
        software: "ANSYS SpaceClaim / DesignModeler（或 Fusion 360）",
        learn: [
          "有限元分析（FEA）的核心思想：把连续结构离散成大量小单元（网格），逐个求解再拼装，得到整体应力与变形。",
          "von Mises 应力：衡量材料是否会屈服的等效应力指标。",
          "安全系数 = 材料屈服强度 ÷ 结构最大应力；工程上常要求 ≥ 1.5~2.0。",
          "选材：常用结构钢（如 Q235 / ASTM A36，屈服强度约 235 MPa）。",
        ],
        task:
          "在 ANSYS（或 Fusion 360）中建立你的桁架桥几何模型（可先做 2D 杆系或简化 3D），设定跨度 12 m 与杆件截面，指定材料为结构钢并确认其屈服强度。",
        deliverable: "模型几何截图 + 材料与主要尺寸说明。",
        metrics: ["几何跨度/节间符合设定", "材料属性（弹性模量、屈服强度）正确设置"],
        rubric: [
          "正确解释 FEA 为何能求解结构应力",
          "几何模型与设计参数一致",
          "材料属性设置正确、注明屈服强度",
          "截图清晰、可追溯",
        ],
        humanReview: false,
      },
      {
        num: 2,
        title: "网格划分与静力仿真",
        goal: "施加约束与荷载，求解并读出应力、变形、安全系数。",
        software: "ANSYS Mechanical",
        learn: [
          "网格（mesh）：单元越细结果越准但越慢；需做「网格无关性」检查（加密后结果基本不变）。",
          "边界条件：固定支座（fixed support）+ 施加荷载（force / pressure）。",
          "求解静力结构（Static Structural），查看 von Mises 应力云图与总变形云图。",
        ],
        task:
          "对桥梁两端设固定/铰支约束，在下弦节点施加竖向荷载（例如总计 60 kN，模拟人群+自重）。划分网格并做一次加密对比（网格无关性），求解后读出最大 von Mises 应力、最大变形，并计算安全系数。",
        deliverable: "应力云图 + 变形云图 + 关键数值表（最大应力、最大变形、安全系数）+ 网格无关性简述。",
        metrics: [
          "最大 von Mises 应力（MPa）",
          "最大变形（mm）",
          "安全系数 = 屈服强度 / 最大应力（基础线需 ≥ 2.0）",
        ],
        rubric: [
          "边界条件与荷载设置合理",
          "做了网格无关性检查",
          "正确读取应力/变形数值",
          "安全系数计算正确，并判断是否达基础线",
        ],
        humanReview: true,
      },
      {
        num: 3,
        title: "轻量化优化（可用 Python）",
        goal: "在保证安全的前提下减重或降应力，并量化对比。",
        software: "ANSYS Mechanical + Python（可选）",
        learn: [
          "轻量化思路：去除低应力区材料、调整杆件截面、改变桁高/节间、或了解拓扑优化概念。",
          "参数扫描：改变一个设计变量（如桁高），重复仿真，找应力/质量最优点。",
          "进阶（编程）：用 Python（pandas + matplotlib）汇总多个方案的「质量—最大应力—安全系数」，画对比曲线；甚至用简单优化算法搜索最优参数。",
        ],
        task:
          "至少做一种优化（调整截面/去材料/改桁高），重新仿真，定量对比优化前后的质量、最大应力、安全系数。进阶：用 Python 记录 ≥ 4 个方案的数据并画出优化曲线，找出最佳方案。",
        deliverable: "优化前后对比表 + （进阶）Python 优化曲线图 + 优化决策说明。",
        metrics: [
          "质量下降百分比（挑战目标 ≥ 20%）",
          "最大应力变化百分比",
          "优化后安全系数仍 ≥ 2.0",
        ],
        rubric: [
          "优化方案有工程依据，非随意改动",
          "对优化前后做了定量对比（有数字）",
          "达到基础线；尽力冲击挑战目标",
          "（进阶）用 Python 完成数据处理与作图",
        ],
        humanReview: false,
      },
      {
        num: 4,
        title: "工程报告",
        goal: "整合为一份规范的仿真分析报告。",
        learn: [
          "报告结构：摘要 → 背景 → 方法（软件、材料、网格、边界条件）→ 结果（云图、数值）→ 优化 → 讨论与局限 → 结论。",
          "工程严谨性：说明网格无关性、假设与简化（如忽略连接节点细节、动载、疲劳）。",
          "图表规范：云图/曲线有编号与标题，数值带单位。",
        ],
        task: "把建模、仿真、优化整合成一份完整工程报告（建议 8–12 页），突出软件工作流、量化结果与优化决策。",
        deliverable: "最终仿真分析报告（PDF），含云图、数据表、优化对比与局限反思。",
        metrics: ["报告含完整方法链路（软件/网格/边界条件/材料）", "关键结论有量化数据支撑"],
        rubric: [
          "报告结构完整、专业",
          "云图/图表规范、被正文引用",
          "包含网格无关性与假设局限的反思",
          "结论有量化依据、逻辑连贯",
        ],
        humanReview: true,
      },
    ],
    outcome:
      "一份用 ANSYS 完成的桥梁结构有限元仿真与轻量化优化报告（含应力云图、安全系数、优化曲线）。可作为个人陈述中「用工业软件解决工程问题」的硬核素材，或放入工程作品集。",
  },

  // ═══════════════ 航空航天工程 ═══════════════
  {
    id: "aero-airfoil-cfd",
    field: "AERO",
    title: "机翼翼型的 CFD 气动仿真与升阻比优化",
    titleEn: "CFD Aerodynamic Simulation & L/D Optimisation of an Aerofoil",
    summary:
      "用工业级 CFD 软件 ANSYS Fluent 对翼型做真实的流场仿真，算出升力、阻力与升阻比，用 Python 找出最佳攻角。",
    scenario:
      "你在学生航空团队负责气动分析，要为一架小型无人机选择并评估机翼翼型。你将用航空业界标准的计算流体力学（CFD）软件 ANSYS Fluent 仿真翼型周围的流场，量化升力系数、阻力系数与升阻比，扫描不同攻角找出最高效的飞行状态——这是每个空气动力学工程师的核心工作流。",
    whyValuable:
      "CFD 是航空工程的核心技能。「我用 ANSYS Fluent 仿真了翼型流场，扫描攻角画出极曲线并找出最佳升阻比攻角」——招生官会看到你真正掌握了工业级气动分析，而不只是「喜欢飞机」。",
    targetMajors: ["航空航天工程", "机械工程", "工程学（通用）"],
    difficulty: 3,
    estimatedHours: "30–45 小时（约 5–7 周）",
    primaryTool: {
      name: "ANSYS Fluent（学生版，免费）",
      note: "航空业界标准 CFD 软件，官方免费学生版与商业版界面一致。限制：CFD 网格上限约 51.2 万单元、限并行——对 2D 翼型课题完全够用。官网 ansys.com/academic/students 下载。",
    },
    altTool: {
      name: "XFLR5（免费，备选）",
      note: "轻量的翼型/机翼气动分析工具，安装小、上手快；若装不了 ANSYS，可用它完成升力/升阻比分析（基于面元法/XFOIL）。",
    },
    techStack: ["ANSYS Fluent (CFD)", "网格划分", "Python（极曲线/数据后处理）"],
    baseline:
      "基础线：完成翼型 2D CFD 仿真并收敛，正确读出某攻角下的升力系数 CL、阻力系数 CD，并算出升阻比 L/D。",
    challenge:
      "挑战目标：扫描 0°–15° 多个攻角，用 Python 画 CL–α 与 L/D–α 极曲线，找出最佳升阻比攻角并识别失速起点；更进一步可对比两种翼型或两种湍流模型。",
    skills: ["计算流体力学（CFD）", "网格划分与收敛判断", "空气动力学", "Python 数据分析", "技术报告写作"],
    stages: [
      {
        num: 1,
        title: "背景、几何与网格准备",
        goal: "理解 CFD 原理，导入翼型、建立流域并划分网格。",
        software: "ANSYS Fluent（SpaceClaim + Meshing）或 XFLR5",
        learn: [
          "升力来源、攻角（AoA）、升力系数 CL 与阻力系数 CD 的概念。",
          "CFD 原理：把流场离散成网格，数值求解流体控制方程（Navier–Stokes）。",
          "翼面附近要加密网格以捕捉边界层；流域要足够大避免边界干扰。",
          "雷诺数 Re：表征流动状态，决定湍流模型选择。",
        ],
        task:
          "选定一个 NACA 翼型（如 NACA 2412），导入翼型坐标，建立 C 型或矩形流域，划分网格并在翼面附近加密（边界层网格）。注意学生版 51.2 万网格上限。",
        deliverable: "翼型几何 + 网格截图（含翼面加密局部放大）+ 流域尺寸说明。",
        metrics: ["翼型坐标正确导入", "流域尺寸合理（多倍弦长）", "翼面边界层网格已加密", "网格量在学生版上限内"],
        rubric: [
          "能解释 CFD 如何求解流场",
          "翼型与流域设置合理",
          "翼面附近网格加密到位",
          "截图清晰、标注关键设置",
        ],
        humanReview: false,
      },
      {
        num: 2,
        title: "CFD 求解（单攻角）",
        goal: "设定边界条件与湍流模型，求解收敛并读出 CL、CD。",
        software: "ANSYS Fluent",
        learn: [
          "边界条件：速度入口（velocity inlet）、压力出口（pressure outlet）、翼面无滑移壁面。",
          "湍流模型：入门常用 k-ω SST，适合翼型绕流。",
          "收敛判据：残差（residuals）下降到阈值，且升/阻力监测值稳定。",
          "用来流速度与攻角的分量设置攻角；求解后 Fluent 可直接输出 CL、CD。",
        ],
        task:
          "设定来流速度（如 20 m/s）与某个攻角（如 5°），选 k-ω SST 湍流模型，求解至收敛。读出 CL、CD，计算升阻比 L/D，并查看压力云图与速度云图。",
        deliverable: "残差/收敛曲线 + 压力云图 + 速度云图 + CL、CD、L/D 数值。",
        metrics: ["残差收敛达标", "升/阻力监测稳定", "CL、CD 数值量级合理", "升阻比 L/D 计算正确"],
        rubric: [
          "边界条件与湍流模型设置正确",
          "达到收敛并能判断收敛",
          "正确读出 CL、CD 并算 L/D",
          "云图能反映合理的流场（驻点、上表面低压）",
        ],
        humanReview: true,
      },
      {
        num: 3,
        title: "攻角扫描与升阻比优化（Python）",
        goal: "扫描多个攻角，用 Python 画极曲线，找最佳攻角与失速点。",
        software: "ANSYS Fluent + Python",
        learn: [
          "极曲线（polar）：CL–α、CD–α、L/D–α 曲线是评估翼型效率的核心。",
          "最佳攻角：升阻比 L/D 最大处，最省能量。",
          "失速（stall）：攻角过大时上表面气流分离、CL 骤降。",
          "用 Python（pandas 读数据、matplotlib 作图）汇总各攻角结果、自动找最佳点。",
        ],
        task:
          "对多个攻角重复仿真（基础：3–4 个攻角；挑战：0°–15° 全扫）。用 Python 读入各攻角的 CL、CD，画出 CL–α 与 L/D–α 曲线，找出升阻比最大的最佳攻角，并识别失速起始攻角。",
        deliverable: "多攻角数据表 + Python 绘制的 CL–α 与 L/D–α 曲线 + 最佳攻角与失速点结论。",
        metrics: ["攻角样本数（挑战 ≥ 8 个）", "极曲线趋势正确", "最佳攻角识别正确", "失速起点识别"],
        rubric: [
          "完成多攻角扫描并整理数据",
          "用 Python 正确绘制极曲线",
          "从曲线中找出最佳升阻比攻角",
          "能解释失速现象与工程意义",
        ],
        humanReview: false,
      },
      {
        num: 4,
        title: "工程报告",
        goal: "整合为一份规范的 CFD 气动分析报告。",
        learn: [
          "报告结构：摘要 → 背景 → 方法（翼型、网格、边界条件、湍流模型）→ 结果（云图、极曲线）→ 讨论（最佳攻角、失速、局限）→ 结论。",
          "CFD 严谨性：讨论网格无关性、2D 简化、雷诺数、学生版网格上限对精度的影响。",
          "图表规范：曲线含坐标物理量与单位、图例。",
        ],
        task: "把几何/网格、CFD 求解、攻角扫描整合为一份完整气动分析报告（建议 8–12 页），突出 CFD 工作流、量化结果与工程判断。",
        deliverable: "最终 CFD 气动分析报告（PDF），含云图、极曲线、最佳攻角结论与局限反思。",
        metrics: ["报告含完整 CFD 方法链路", "关键结论有极曲线/数值支撑"],
        rubric: [
          "报告结构完整、专业",
          "云图/极曲线规范、被正文引用",
          "包含网格无关性与 2D/雷诺数等局限反思",
          "结论有量化依据、逻辑连贯",
        ],
        humanReview: true,
      },
    ],
    outcome:
      "一份用 ANSYS Fluent 完成的翼型 CFD 气动分析报告（含流场云图、极曲线、最佳升阻比攻角）。可作为个人陈述中「用工业级 CFD 解决气动问题」的硬核素材，或放入航空方向作品集。",
  },

  // ═══════════════ 机械工程（新增） ═══════════════
  {
    id: "mech-part-fatigue",
    field: "MECH",
    title: "受力零件的应力集中与疲劳寿命分析",
    titleEn: "Stress Concentration & Fatigue Life Analysis of a Machine Part",
    summary:
      "用 ANSYS Mechanical 分析一个反复受力零件的应力集中，估算它的疲劳寿命，再改进几何让它更耐用——疲劳是机械失效的头号原因。",
    scenario:
      "你是机械设计工程师，要评估一个在循环载荷下工作的零件（如带孔连杆、带台阶的轴或支架）：它会不会在远低于屈服强度的应力下、经过反复受力后疲劳断裂？你将用 ANSYS 找出应力集中的危险部位，用疲劳分析估算它能承受多少次循环，并通过改进几何延长寿命。",
    whyValuable:
      "疲劳分析是机械工程的进阶核心技能，很多学生连听都没听过。「我用 ANSYS 分析了零件的应力集中系数，估算疲劳寿命并通过加大圆角把寿命提升 2 倍」——这是招生官眼里真正的工程深度。",
    targetMajors: ["机械工程", "材料科学与工程", "航空航天工程（结构方向）"],
    difficulty: 3,
    estimatedHours: "25–40 小时（约 4–6 周）",
    primaryTool: {
      name: "ANSYS Mechanical（学生版，免费，含 Fatigue Tool）",
      note: "静力分析 + 内置疲劳工具（Fatigue Tool）。官网 ansys.com/academic/students 下载，学生版对本课题足够。",
    },
    altTool: {
      name: "Autodesk Fusion 360（学生版，免费，备选）",
      note: "含 FEA 静力仿真；疲劳可结合手算 S-N 曲线完成。",
    },
    techStack: ["ANSYS Mechanical (FEA)", "疲劳分析 (S-N)", "Python（载荷谱/数据处理）"],
    baseline:
      "基础线：完成静力仿真，找出最大应力位置并计算应力集中系数 Kt 与安全系数；用 Fatigue Tool 得到疲劳寿命（循环数）。",
    challenge:
      "挑战目标：通过改进几何（如加大圆角半径）把最大应力或 Kt 降低 ≥ 20%，疲劳寿命提升 ≥ 2 倍；并用 Python 处理 S-N 数据或变幅载荷谱。",
    skills: ["有限元分析（FEA）", "应力集中与疲劳", "工业软件工作流", "Python 数据处理", "技术报告写作"],
    stages: [
      {
        num: 1,
        title: "建模与背景（应力集中与疲劳）",
        goal: "理解应力集中与疲劳，建立一个含几何突变的受力零件模型。",
        software: "ANSYS SpaceClaim / DesignModeler（或 Fusion 360）",
        learn: [
          "应力集中：孔、圆角、台阶等几何突变处应力会被放大，用应力集中系数 Kt = 峰值应力 / 名义应力 衡量。",
          "疲劳：零件在循环载荷下，即使应力低于屈服强度，反复多次也会开裂失效——这是机械失效最常见的原因。",
          "S-N 曲线：材料能承受的应力幅 S 与循环次数 N 的关系，是疲劳寿命估算的基础。",
          "选材：铝合金或结构钢，需含疲劳（S-N）数据。",
        ],
        task:
          "建立一个含应力集中特征的受力零件模型（如带中心孔的板、带台阶的轴或带圆角的支架），设定材料并确认其屈服强度与疲劳数据。",
        deliverable: "零件几何截图（标出应力集中特征）+ 材料与尺寸说明。",
        metrics: ["几何含明确的应力集中特征（孔/圆角/台阶）", "材料属性含 S-N 疲劳数据"],
        rubric: [
          "能解释应力集中与疲劳的概念",
          "几何模型含合理的应力集中特征",
          "材料属性（含疲劳数据）设置正确",
          "截图清晰、标注关键特征",
        ],
        humanReview: false,
      },
      {
        num: 2,
        title: "静力仿真与应力集中分析",
        goal: "求解静力，找最大应力位置，计算 Kt 与安全系数。",
        software: "ANSYS Mechanical",
        learn: [
          "在应力集中区（孔边、圆角）网格要加密，否则峰值应力算不准。",
          "读取最大 von Mises 应力及其位置；用名义应力（如截面平均应力）算 Kt。",
          "安全系数 = 屈服强度 / 最大应力。",
        ],
        task:
          "施加约束与循环载荷的峰值，在应力集中区加密网格，求解后找出最大应力位置，计算应力集中系数 Kt 与静力安全系数。",
        deliverable: "应力云图（突出集中区）+ 最大应力、Kt、安全系数数值。",
        metrics: ["最大 von Mises 应力（MPa）与位置", "应力集中系数 Kt", "安全系数"],
        rubric: [
          "应力集中区网格加密到位",
          "正确找出最大应力位置",
          "Kt 与安全系数计算正确",
          "云图清晰反映应力集中",
        ],
        humanReview: true,
      },
      {
        num: 3,
        title: "疲劳寿命分析与优化（可用 Python）",
        goal: "估算疲劳寿命，改进几何延长寿命并量化对比。",
        software: "ANSYS Fatigue Tool + Python（可选）",
        learn: [
          "用 ANSYS Fatigue Tool 基于 S-N 曲线，在给定循环载荷下估算疲劳寿命（循环数）。",
          "优化思路：增大圆角半径、优化过渡形状以降低应力集中，从而延长寿命。",
          "进阶（编程）：用 Python 处理 S-N 数据、绘制寿命对比，或处理变幅载荷谱（雨流计数概念）。",
        ],
        task:
          "设定循环载荷，用 Fatigue Tool 得到疲劳寿命。再改进几何（如加大圆角半径）重新分析，定量对比优化前后的最大应力、Kt 与疲劳寿命。进阶：用 Python 辅助数据处理与作图。",
        deliverable: "疲劳寿命对比表 + 优化前后几何/应力对比 + （进阶）Python 图。",
        metrics: [
          "疲劳寿命（循环数）",
          "最大应力 / Kt 降幅（挑战 ≥ 20%）",
          "疲劳寿命提升倍数（挑战 ≥ 2×）",
        ],
        rubric: [
          "疲劳寿命估算方法正确",
          "优化有工程依据并量化对比",
          "达到基础线；尽力冲击挑战目标",
          "（进阶）用 Python 完成数据处理",
        ],
        humanReview: false,
      },
      {
        num: 4,
        title: "工程报告",
        goal: "整合为一份规范的应力与疲劳分析报告。",
        learn: [
          "报告结构：摘要 → 背景 → 方法（软件、材料、网格、载荷）→ 结果（应力、Kt、寿命）→ 优化 → 讨论与局限 → 结论。",
          "严谨性：讨论网格无关性、S-N 数据来源、恒幅假设等局限。",
          "图表规范：云图、寿命对比有编号与单位。",
        ],
        task: "把建模、静力分析、疲劳分析与优化整合为一份完整工程报告（建议 8–12 页）。",
        deliverable: "最终应力与疲劳分析报告（PDF），含云图、Kt、寿命对比与局限反思。",
        metrics: ["报告含完整方法链路", "关键结论有量化数据支撑"],
        rubric: [
          "报告结构完整、专业",
          "图表规范、被正文引用",
          "包含网格无关性与疲劳假设的反思",
          "结论有量化依据、逻辑连贯",
        ],
        humanReview: true,
      },
    ],
    outcome:
      "一份用 ANSYS 完成的零件应力集中与疲劳寿命分析报告（含应力云图、Kt、寿命对比）。展示你掌握机械工程进阶的疲劳分析，是 PS 与作品集的硬核素材。",
  },

  // ═══════════════ 航空航天工程（新增） ═══════════════
  {
    id: "aero-rocket-trajectory",
    field: "AERO",
    title: "火箭飞行轨迹的建模、仿真与优化",
    titleEn: "Modelling, Simulation & Optimisation of Rocket Trajectory",
    summary:
      "用 Python 建立火箭的运动方程（含推力、重力、空气阻力），数值积分求出飞行轨迹，再优化发射角找出飞得最高/最远的方案。",
    scenario:
      "你在学生火箭团队负责飞行仿真：这枚火箭能飞多高？什么发射角射程最远？你将用 Python 建立火箭的运动方程，考虑推力、重力与空气阻力，用数值积分求解飞行轨迹，并用优化找出最佳发射策略——这是航天工程「轨迹分析」的入门核心，也充分融合物理建模与编程。",
    whyValuable:
      "轨迹仿真把物理建模与编程结合，含金量高且能力可见。「我用 Python 建立了火箭运动方程，考虑空气阻力与变质量，数值积分求出轨迹并优化发射角」——招生官会看到扎实的数理功底与真实的编程能力，这正是航空航天最看重的。",
    targetMajors: ["航空航天工程", "机械工程", "工程学 / 物理"],
    difficulty: 3,
    estimatedHours: "25–40 小时（约 4–6 周）",
    primaryTool: {
      name: "Python（numpy / scipy / matplotlib，免费）",
      note: "用 Python 做数值积分与优化，是航天轨迹分析的标准做法。可在本地安装 Anaconda，或用免费的 Google Colab 在线运行。",
    },
    altTool: {
      name: "OpenRocket（免费，备选/对照）",
      note: "图形化火箭仿真软件，可用来对照验证你的 Python 结果（交叉检验是很好的工程习惯）。",
    },
    techStack: ["Python（数值积分）", "物理建模", "优化算法", "数据可视化"],
    baseline:
      "基础线：用 Python 建立含重力与空气阻力的运动方程并数值积分，画出高度-时间与轨迹图，得到最大高度（apogee）与飞行时间。",
    challenge:
      "挑战目标：加入变质量（燃料消耗）或扫描发射角，用 Python（循环或 scipy.optimize）自动找出射程/高度最优的发射角，并画出「发射角-射程」曲线。",
    skills: ["物理建模", "Python 数值方法", "优化", "数据可视化", "技术报告写作"],
    stages: [
      {
        num: 1,
        title: "物理建模：写出运动方程",
        goal: "分析火箭受力，建立可编程求解的运动方程组。",
        software: "纸笔推导 + Python 环境准备",
        learn: [
          "火箭受力：推力 T、重力 mg、空气阻力 D = ½·ρ·v²·Cd·A（方向与速度相反）。",
          "牛顿第二定律 F = ma，把合力分解到水平/垂直方向得到加速度。",
          "数值积分思想：把连续飞行切成很小的时间步，逐步推进位置与速度（欧拉法 / RK4）。",
          "准备 Python 环境（本地 Anaconda 或在线 Colab），装 numpy、matplotlib、scipy。",
        ],
        task:
          "对火箭做受力分析，写出水平与垂直方向的运动方程组，明确各力表达式与参数（质量、推力、阻力系数 Cd、迎风面积 A、空气密度 ρ）。",
        deliverable: "受力分析图 + 运动方程组 + 参数表。",
        metrics: ["方程包含推力/重力/阻力", "力被正确分解到两个方向", "参数完整且有合理取值"],
        rubric: [
          "受力分析完整正确",
          "运动方程推导正确",
          "参数设定合理、有依据",
          "体现对数值积分思想的理解",
        ],
        humanReview: false,
      },
      {
        num: 2,
        title: "Python 数值仿真",
        goal: "用 Python 数值积分求解轨迹，得到最大高度。",
        software: "Python (numpy / scipy / matplotlib)",
        learn: [
          "用时间步进实现数值积分：欧拉法易懂，RK4 更精确；或用 scipy.integrate.solve_ivp。",
          "用 numpy 存储时间序列，用 matplotlib 画「高度-时间」和「水平-垂直」轨迹图。",
          "时间步长要足够小以保证精度（可做步长收敛检查，类比网格无关性）。",
        ],
        task:
          "用 Python 数值积分求解运动方程，画出高度-时间曲线与飞行轨迹图，读出最大高度（apogee）与总飞行时间。",
        deliverable: "Python 代码 + 高度-时间图 + 轨迹图 + 最大高度与飞行时间数值。",
        metrics: ["代码可正确运行", "轨迹物理上合理（先升后降）", "最大高度与飞行时间数值", "做了步长收敛检查（进阶）"],
        rubric: [
          "Python 正确实现数值积分",
          "轨迹与曲线物理合理",
          "正确读出关键结果",
          "代码结构清晰、有注释",
        ],
        humanReview: true,
      },
      {
        num: 3,
        title: "优化：最佳发射角与变质量（Python）",
        goal: "扫描/优化发射角，找出最优发射策略。",
        software: "Python (numpy / scipy.optimize)",
        learn: [
          "射程/高度随发射角变化：无阻力时 45° 射程最大，有阻力时最优角会偏移——值得你亲自算出来。",
          "变质量：火箭燃烧时质量下降，推力段与滑行段不同，可让模型更真实。",
          "优化方法：用循环扫描发射角，或用 scipy.optimize 自动求最优。",
        ],
        task:
          "扫描一系列发射角（如 30°–80°），用 Python 画出「发射角-射程（或最大高度）」曲线，找出最优发射角。进阶：加入变质量（燃料消耗）或用 scipy.optimize 自动寻优。",
        deliverable: "发射角-射程曲线 + 最优角结论 + （进阶）变质量模型或自动寻优。",
        metrics: ["扫描发射角样本数（挑战 ≥ 8）", "曲线趋势正确", "最优发射角识别正确", "（挑战）变质量或 optimize"],
        rubric: [
          "完成发射角扫描并作图",
          "正确找出最优发射角",
          "能解释为何有阻力时最优角偏离 45°",
          "（进阶）实现变质量或自动优化",
        ],
        humanReview: false,
      },
      {
        num: 4,
        title: "工程报告",
        goal: "整合为一份规范的轨迹仿真报告。",
        learn: [
          "报告结构：摘要 → 背景 → 物理模型（方程与假设）→ 方法（数值积分、参数）→ 结果（轨迹、最优角）→ 讨论与局限 → 结论。",
          "严谨性：讨论数值方法精度、假设（如恒定 Cd、忽略风、二维简化）与局限。",
          "工程习惯：若用 OpenRocket 对照，说明交叉验证结果。",
        ],
        task: "把物理建模、数值仿真、优化整合为一份完整报告（建议 8–12 页），突出模型、代码方法与优化结论。",
        deliverable: "最终轨迹仿真报告（PDF），含方程、轨迹图、优化曲线与局限反思。",
        metrics: ["报告含完整建模-仿真-优化链路", "关键结论有图表/数据支撑"],
        rubric: [
          "报告结构完整、专业",
          "图表规范、被正文引用",
          "包含数值精度与模型假设的反思",
          "结论有量化依据、逻辑连贯",
        ],
        humanReview: true,
      },
    ],
    outcome:
      "一份用 Python 完成的火箭轨迹建模与优化报告（含运动方程、轨迹图、最优发射角）。展示你把物理建模与编程结合解决航天问题的能力，是 PS 与作品集的硬核素材。",
  },

  // ═══════════════ 机械工程（新增 · 热仿真） ═══════════════
  {
    id: "mech-heatsink-thermal",
    field: "MECH",
    title: "电子器件散热片的热仿真与散热优化",
    titleEn: "Thermal Simulation & Cooling Optimisation of a Heat Sink",
    summary:
      "用 ANSYS 稳态热分析仿真一个 CPU/功率器件散热片的温度分布，优化翅片让芯片温度降下来——散热是所有电子设备的生死线。",
    scenario:
      "你是一名热设计工程师，一块芯片（如 CPU 或功率器件）发热严重，若温度过高就会降频甚至烧毁。你的任务是用 ANSYS 稳态热分析仿真散热片的温度分布，找出最高温度，并通过优化翅片结构把芯片温度降到安全范围——这是电子、机械、能源工程中无处不在的热管理问题。",
    whyValuable:
      "热管理是工程界的普遍刚需，但高中生几乎没人做过热仿真。「我用 ANSYS 做了散热片的热仿真，通过优化翅片把芯片温度降了 15°C」——量化、专业、贴近真实产品，招生官会印象深刻。",
    targetMajors: ["机械工程", "能源与动力工程", "电子工程", "航空航天工程（热控方向）"],
    difficulty: 3,
    estimatedHours: "25–38 小时（约 4–6 周）",
    primaryTool: {
      name: "ANSYS（学生版，免费；Steady-State Thermal / Icepak）",
      note: "用稳态热分析（Steady-State Thermal）仿真固体导热与对流散热；进阶可用 Fluent/Icepak 做共轭传热。学生版足够本课题。",
    },
    altTool: {
      name: "Autodesk Fusion 360（学生版，免费，备选）",
      note: "含热仿真模块，可完成散热片温度分布分析。",
    },
    techStack: ["ANSYS 热分析", "传热学（导热/对流）", "Python（参数扫描/作图）"],
    baseline:
      "基础线：完成散热片稳态热仿真，得到芯片/基板最高温度与温度分布云图，并算出散热片热阻。",
    challenge:
      "挑战目标：在体积或材料用量不增加的前提下，通过优化翅片（数量/厚度/高度/间距）把最高温度降低 ≥ 10°C（或热阻降低 ≥ 15%）；用 Python 扫描翅片参数画优化曲线。",
    skills: ["传热学", "热仿真（FEA/CFD）", "工业软件工作流", "Python 参数优化", "技术报告写作"],
    stages: [
      {
        num: 1,
        title: "建模与传热背景",
        goal: "理解散热原理，建立散热片与热源模型并设定材料。",
        software: "ANSYS SpaceClaim（或 Fusion 360）",
        learn: [
          "三种传热方式：导热（固体内）、对流（表面与空气）、辐射（本课题可简化忽略或估算）。",
          "散热片原理：用高导热材料（铝/铜）+ 大量翅片增大散热面积，把热量从芯片带走。",
          "关键参数：材料导热系数 k、发热功率 Q（W）、对流换热系数 h、环境温度。",
          "热阻 R = ΔT / Q：衡量散热能力，越小越好。",
        ],
        task:
          "建立散热片（基板 + 翅片）与芯片热源的几何模型，设定材料（如铝 6061，k≈167 W/m·K），确定发热功率与环境条件。",
        deliverable: "散热片几何截图 + 材料、功率、边界条件说明。",
        metrics: ["几何含基板与翅片", "材料导热系数设置正确", "发热功率与环境温度设定合理"],
        rubric: [
          "能解释导热与对流散热原理",
          "几何模型合理",
          "材料与热参数设置正确",
          "截图清晰、标注关键参数",
        ],
        humanReview: false,
      },
      {
        num: 2,
        title: "稳态热仿真",
        goal: "施加热载荷与对流边界，求解温度分布与热阻。",
        software: "ANSYS Steady-State Thermal",
        learn: [
          "热载荷：在芯片接触面施加发热功率（Heat Flow / Internal Heat Generation）。",
          "对流边界：在翅片表面施加对流换热系数 h 与环境温度。",
          "网格无关性同样适用；求解得到温度云图，读最高温度。",
        ],
        task:
          "在芯片面施加发热功率，在翅片表面施加对流边界，划分网格并做无关性检查，求解得到温度分布云图，读出最高温度并计算热阻 R = (T_max − T_env) / Q。",
        deliverable: "温度分布云图 + 最高温度、热阻数值 + 网格无关性简述。",
        metrics: ["最高温度（°C）", "散热片热阻 R（°C/W）", "温度分布合理（芯片处最热）"],
        rubric: [
          "热载荷与对流边界设置正确",
          "做了网格无关性检查",
          "正确读出最高温度并算热阻",
          "云图物理合理",
        ],
        humanReview: true,
      },
      {
        num: 3,
        title: "翅片优化（可用 Python）",
        goal: "优化翅片结构降低温度/热阻并量化对比。",
        software: "ANSYS Thermal + Python（可选）",
        learn: [
          "翅片优化方向：增加翅片数量/高度、减小间距（但太密会挡住空气）、改材料（铜比铝导热好但更重更贵）。",
          "存在权衡：面积越大散热越好，但体积/重量/成本上升——工程就是找平衡。",
          "进阶（编程）：用 Python 扫描翅片参数（如翅片数），汇总「参数—最高温度」画优化曲线找最优。",
        ],
        task:
          "至少做一种翅片优化（改数量/高度/间距/材料），重新仿真，定量对比优化前后的最高温度与热阻。进阶：用 Python 扫描 ≥ 4 组参数并画优化曲线。",
        deliverable: "优化前后对比表 + （进阶）Python 优化曲线 + 优化决策说明。",
        metrics: [
          "最高温度降幅（挑战 ≥ 10°C）",
          "热阻降幅（挑战 ≥ 15%）",
          "体积/材料是否受控",
        ],
        rubric: [
          "优化有工程依据、考虑权衡",
          "定量对比优化前后",
          "达到基础线；尽力冲击挑战目标",
          "（进阶）用 Python 完成参数扫描",
        ],
        humanReview: false,
      },
      {
        num: 4,
        title: "工程报告",
        goal: "整合为一份规范的热分析报告。",
        learn: [
          "报告结构：摘要 → 背景 → 方法（材料、功率、对流、网格）→ 结果（温度云图、热阻）→ 优化 → 讨论与局限 → 结论。",
          "严谨性：讨论对流系数取值依据、忽略辐射的影响、网格无关性等。",
          "图表规范：温度云图与优化曲线有编号与单位。",
        ],
        task: "把建模、热仿真、翅片优化整合为一份完整报告（建议 8–12 页）。",
        deliverable: "最终热分析报告（PDF），含温度云图、热阻、优化对比与局限反思。",
        metrics: ["报告含完整方法链路", "关键结论有量化数据支撑"],
        rubric: [
          "报告结构完整、专业",
          "云图/图表规范、被正文引用",
          "包含对流假设与网格无关性的反思",
          "结论有量化依据、逻辑连贯",
        ],
        humanReview: true,
      },
    ],
    outcome:
      "一份用 ANSYS 完成的散热片热仿真与优化报告（含温度云图、热阻、优化对比）。展示你掌握工程界普遍需要的热管理与热仿真能力，是 PS 与作品集的硬核素材。",
  },

  // ═══════════════ 航空航天工程（新增 · 结构 FEA） ═══════════════
  {
    id: "aero-uav-wing-fea",
    field: "AERO",
    title: "无人机机翼的气动载荷与结构强度分析",
    titleEn: "Aerodynamic Load & Structural Strength Analysis of a UAV Wing",
    summary:
      "把气动升力换算成机翼上的分布载荷，用 ANSYS Mechanical 做结构仿真，校核翼尖变形与安全系数，再优化翼梁减重。",
    scenario:
      "你在学生无人机团队负责机翼结构：飞行时机翼要承受升力产生的分布载荷，既不能变形过大，也不能断裂，还要尽量轻（越轻续航越久）。你将把气动升力换算成机翼载荷，用 ANSYS 做结构强度分析，校核翼尖变形与安全系数，并优化翼梁（spar）结构在保证强度下减重——这是航空结构设计的核心工作流。",
    whyValuable:
      "这个课题把「气动」和「结构」两大航空核心打通：从升力算载荷、再做结构校核与减重。「我用 ANSYS 分析了无人机机翼在飞行载荷下的变形与安全系数，优化翼梁减重 18%」——招生官会看到系统的航空工程思维。可与「翼型 CFD」课题联动（用 CFD 算出的升力做本课题的载荷）。",
    targetMajors: ["航空航天工程", "机械工程", "工程学（通用）"],
    difficulty: 3,
    estimatedHours: "28–42 小时（约 5–6 周）",
    primaryTool: {
      name: "ANSYS Mechanical（学生版，免费，FEA）",
      note: "结构静力有限元分析。学生版足够本课题的机翼结构分析。",
    },
    altTool: {
      name: "Autodesk Fusion 360（学生版，免费，备选）",
      note: "含 FEA，可完成机翼结构变形与应力分析。",
    },
    techStack: ["ANSYS Mechanical (FEA)", "气动载荷换算", "结构优化", "Python（载荷分布/数据）"],
    baseline:
      "基础线：把总升力换算为机翼分布载荷，完成结构仿真，得到翼尖最大变形与最大应力，并算出安全系数。",
    challenge:
      "挑战目标：在保证安全系数 ≥ 1.5、翼尖变形在允许范围内的前提下，优化翼梁/内部结构把机翼质量降低 ≥ 15%；用 Python 生成沿翼展的载荷分布。",
    skills: ["结构有限元分析", "气动-结构耦合概念", "工业软件工作流", "Python 数据处理", "技术报告写作"],
    stages: [
      {
        num: 1,
        title: "机翼建模与载荷换算",
        goal: "建立机翼结构模型，把升力换算为分布载荷。",
        software: "ANSYS SpaceClaim + 纸笔/Python 计算载荷",
        learn: [
          "机翼结构：蒙皮（skin）+ 翼梁（spar）+ 翼肋（rib）共同承载。",
          "升力换算：总升力 L = 飞机重量 × 载荷因子 n（机动时 n>1）；沿翼展分布（可简化为均布或椭圆分布）。",
          "选材：常用航空铝合金（如 2024/7075）或复合材料（简化为等效材料）。",
        ],
        task:
          "建立机翼简化结构模型（含翼梁），根据无人机重量与设计载荷因子算出总升力，换算成沿翼展的分布载荷（基础可用均布，进阶用椭圆分布）。",
        deliverable: "机翼几何截图 + 载荷换算过程 + 材料说明。",
        metrics: ["几何含翼梁等承力结构", "升力→分布载荷换算正确", "材料属性正确"],
        rubric: [
          "理解机翼承力结构组成",
          "升力到载荷换算正确",
          "材料与载荷因子设定合理",
          "截图与计算清晰",
        ],
        humanReview: false,
      },
      {
        num: 2,
        title: "结构静力仿真",
        goal: "施加分布载荷，求解翼尖变形与应力、安全系数。",
        software: "ANSYS Mechanical",
        learn: [
          "边界条件：翼根固定（fixed support，模拟与机身连接），翼面施加分布升力载荷。",
          "关注指标：翼尖最大变形（不能过大影响操控）、最大 von Mises 应力、安全系数。",
          "网格无关性检查。",
        ],
        task:
          "翼根固定，施加分布升力载荷，划分网格并检查无关性，求解得到翼尖最大变形、最大应力，计算安全系数。",
        deliverable: "变形云图 + 应力云图 + 翼尖变形、最大应力、安全系数数值。",
        metrics: ["翼尖最大变形（mm）", "最大 von Mises 应力（MPa）", "安全系数（基础线需算出）"],
        rubric: [
          "边界与载荷设置合理",
          "做了网格无关性检查",
          "正确读出变形/应力并算安全系数",
          "云图物理合理（翼根应力大、翼尖变形大）",
        ],
        humanReview: true,
      },
      {
        num: 3,
        title: "翼梁优化与减重（可用 Python）",
        goal: "优化内部结构，在保证强度下减重并量化对比。",
        software: "ANSYS Mechanical + Python（可选）",
        learn: [
          "减重思路：优化翼梁截面/位置、去除低应力区材料、调整蒙皮厚度——但要守住安全系数与变形红线。",
          "轻量化对航空意义重大：每减一点重量就能多带载荷或多飞一段。",
          "进阶（编程）：用 Python 生成椭圆升力分布或汇总多方案「质量—变形—安全系数」画对比。",
        ],
        task:
          "优化翼梁或内部结构（截面/布局/厚度），重新仿真，定量对比优化前后的质量、翼尖变形、安全系数。进阶：用 Python 处理载荷分布或多方案对比。",
        deliverable: "优化前后对比表 + （进阶）Python 图 + 优化决策说明。",
        metrics: [
          "质量降幅（挑战 ≥ 15%）",
          "安全系数仍 ≥ 1.5",
          "翼尖变形在允许范围",
        ],
        rubric: [
          "优化有工程依据、守住强度红线",
          "定量对比优化前后",
          "达到基础线；尽力冲击挑战目标",
          "（进阶）用 Python 完成数据处理",
        ],
        humanReview: false,
      },
      {
        num: 4,
        title: "工程报告",
        goal: "整合为一份规范的机翼结构分析报告。",
        learn: [
          "报告结构：摘要 → 背景 → 方法（载荷换算、材料、网格、边界）→ 结果（变形、应力、安全系数）→ 优化 → 讨论与局限 → 结论。",
          "严谨性：讨论载荷简化（均布vs椭圆）、静力假设、忽略气动弹性等局限。",
          "可提及与 CFD 课题的联动（用真实升力分布）。",
        ],
        task: "把建模、载荷换算、结构仿真、减重优化整合为一份完整报告（建议 8–12 页）。",
        deliverable: "最终机翼结构分析报告（PDF），含云图、安全系数、减重对比与局限反思。",
        metrics: ["报告含完整方法链路（载荷/结构/优化）", "关键结论有量化数据支撑"],
        rubric: [
          "报告结构完整、专业",
          "云图/图表规范、被正文引用",
          "包含载荷简化与静力假设的反思",
          "结论有量化依据、逻辑连贯",
        ],
        humanReview: true,
      },
    ],
    outcome:
      "一份用 ANSYS 完成的无人机机翼气动载荷与结构强度分析报告（含变形/应力云图、安全系数、减重优化）。打通气动与结构，是 PS 与作品集里体现系统航空工程能力的硬核素材。",
  },

  // ═══════════════ 计算机科学（样板） ═══════════════
  {
    id: "cs-ml-classifier",
    field: "CS",
    title: "用真实数据集训练与评估机器学习分类模型",
    titleEn: "Training & Evaluating an ML Classifier on a Real Dataset",
    summary:
      "用 Python 和 scikit-learn 在一个真实公开数据集上完成数据清洗、训练分类模型、严谨评估并调优——一个完整的机器学习项目。",
    scenario:
      "你要解决一个真实的预测问题（如：根据体检指标预测是否患病、根据特征预测客户是否违约）。你将用业界最主流的机器学习库 scikit-learn，走完一个真实的数据科学流程：数据探索与清洗 → 训练模型 → 用多种指标评估 → 调优对比。这是 CS/数据科学最核心、最能展示能力的项目类型。",
    whyValuable:
      "机器学习项目是 CS 申请最有说服力的素材之一。「我在真实数据集上训练了分类模型，用交叉验证对比多个算法，把 F1 提升到 0.89」——招生官能看到你会写代码、懂机器学习、能严谨评估，而且成果可放 GitHub 直接展示。",
    targetMajors: ["计算机科学", "数据科学 / 人工智能", "统计学", "工程学（含计算方向）"],
    difficulty: 3,
    estimatedHours: "25–40 小时（约 4–6 周）",
    primaryTool: {
      name: "Python + scikit-learn / pandas（免费）",
      note: "数据科学与机器学习的行业标准工具。无需安装可直接用免费的 Google Colab 或 Kaggle Notebooks 在线运行。",
    },
    altTool: {
      name: "Kaggle（免费，数据+环境）",
      note: "提供大量真实公开数据集与免费在线运行环境，很适合本课题起步。",
    },
    techStack: ["Python", "scikit-learn", "数据分析 (pandas)", "机器学习"],
    baseline:
      "基础线：在一个真实公开数据集上完成 EDA 与清洗，正确划分训练/测试集，训练一个分类模型，报告准确率、精确率、召回率与 F1。",
    challenge:
      "挑战目标：对比 ≥ 3 种算法或做超参调优，用交叉验证把 F1（或准确率）显著提升，并做特征重要性分析、讨论过拟合与类别不平衡。",
    skills: ["Python 编程", "机器学习", "数据清洗与分析", "模型评估", "技术写作"],
    stages: [
      {
        num: 1,
        title: "问题定义与数据探索（EDA）",
        goal: "选定真实数据集，做探索性分析与清洗。",
        software: "Python (pandas, matplotlib) / Colab",
        learn: [
          "监督学习与分类问题的概念：用带标签的数据训练模型预测类别。",
          "公开数据集来源：Kaggle、UCI Machine Learning Repository。",
          "探索性数据分析（EDA）：看分布、相关性、类别是否平衡。",
          "数据清洗：处理缺失值、异常值、类别编码。",
        ],
        task:
          "选一个真实分类数据集（比 iris 更有难度，如心脏病预测、信用违约、泰坦尼克生存），用 pandas 做 EDA（分布、相关性、缺失值），并完成数据清洗。",
        deliverable: "EDA 与清洗的 Notebook（含图表）+ 数据集来源与问题说明。",
        metrics: ["数据集真实且公开可溯源", "EDA 含分布与相关性分析", "缺失值/异常值已处理"],
        rubric: [
          "问题定义清晰、是分类任务",
          "EDA 充分、有可视化",
          "数据清洗合理",
          "Notebook 结构清晰、有说明",
        ],
        humanReview: false,
      },
      {
        num: 2,
        title: "建模与训练",
        goal: "正确划分数据并训练一个基线分类模型。",
        software: "Python (scikit-learn)",
        learn: [
          "训练/测试集划分：为什么必须分开，防止数据泄露（data leakage）。",
          "基线模型：先用简单模型（逻辑回归/决策树）建立参照。",
          "特征处理：标准化/归一化、类别特征编码。",
        ],
        task:
          "用 train_test_split 正确划分数据，做必要的特征处理，训练一个基线分类模型（如逻辑回归或决策树），得到初步结果。",
        deliverable: "训练代码 + 基线模型的初步指标。",
        metrics: ["正确划分训练/测试集", "特征处理合理", "基线模型成功训练并给出指标"],
        rubric: [
          "数据划分正确、无泄露",
          "特征处理得当",
          "基线模型训练成功",
          "代码清晰、可复现",
        ],
        humanReview: true,
      },
      {
        num: 3,
        title: "评估与优化",
        goal: "用多指标严谨评估，对比模型或调优。",
        software: "Python (scikit-learn)",
        learn: [
          "评估指标：准确率、精确率、召回率、F1、混淆矩阵——为什么准确率在类别不平衡时会骗人。",
          "交叉验证（cross-validation）：更可靠地评估模型。",
          "超参调优（GridSearchCV）与多模型对比；过拟合的识别与缓解。",
          "特征重要性：理解模型依赖哪些特征。",
        ],
        task:
          "用多指标 + 混淆矩阵评估基线；再对比 ≥ 3 种算法或对最优模型调参，用交叉验证验证，做特征重要性分析，讨论过拟合与类别不平衡。",
        deliverable: "多模型指标对比表 + 混淆矩阵 + 最优模型与特征重要性。",
        metrics: ["用了多种评估指标（含 F1）", "模型对比或调参完成", "F1/准确率的提升幅度", "做了交叉验证"],
        rubric: [
          "评估指标使用正确、解读到位",
          "模型对比/调参有依据",
          "达到基础线；尽力冲击挑战目标",
          "讨论了过拟合/不平衡等真实问题",
        ],
        humanReview: false,
      },
      {
        num: 4,
        title: "项目报告",
        goal: "整合为一份规范的机器学习项目报告。",
        learn: [
          "报告/README 结构：问题 → 数据 → 方法 → 结果 → 讨论与局限 → 结论。",
          "严谨性：说明数据划分、评估方法、局限（数据偏差、泛化性）。",
          "可复现：代码整洁、可放 GitHub。",
        ],
        task: "把 EDA、建模、评估整合为一份完整项目报告（或 GitHub README + Notebook），突出方法与结果。",
        deliverable: "最终项目报告（PDF 或 GitHub 仓库），含代码、图表、评估与反思。",
        metrics: ["报告含完整数据科学链路", "关键结论有指标支撑", "代码可复现"],
        rubric: [
          "报告/README 结构完整、专业",
          "图表规范、被正文引用",
          "包含数据偏差与泛化性的反思",
          "代码整洁、可复现",
        ],
        humanReview: true,
      },
    ],
    outcome:
      "一份完整的机器学习项目（含代码、数据分析、模型评估），可放 GitHub 展示。是 CS/数据科学申请里最有说服力的硬核素材之一。",
  },

  // ═══════════════ 经济学（样板） ═══════════════
  {
    id: "econ-regression-policy",
    field: "ECON",
    title: "用真实数据做一次实证经济学回归分析",
    titleEn: "An Empirical Economics Study with Real-World Data",
    summary:
      "提出一个可检验的经济问题，用真实公开数据做多元回归，解读系数与显著性，并审慎讨论「相关还是因果」。",
    scenario:
      "你对一个经济现象感兴趣（如：教育投入是否促进经济增长？最低工资是否影响就业？）。你将像经济学者一样，提出可检验的假设，从世界银行/FRED 等公开数据库取数，用计量方法做回归分析，解读结果，并审慎讨论能否得出因果结论——这是实证经济学的核心方法。",
    whyValuable:
      "经济学申请最看重「用数据和逻辑思考」。「我用世界银行数据做多元回归，检验教育投入与增长的关系，并讨论了遗漏变量偏误」——招生官会看到你懂计量方法、有数据能力、且具备经济学最珍贵的因果审慎思维，远胜空谈「我喜欢经济」。",
    targetMajors: ["经济学", "计量经济学 / 金融", "公共政策", "数据科学（社科方向）"],
    difficulty: 3,
    estimatedHours: "25–38 小时（约 4–6 周）",
    primaryTool: {
      name: "Python (pandas + statsmodels) 或 R（免费）",
      note: "计量分析的主流工具，均免费。Python 可用 Colab 在线运行；R 是经济学界常用。数据来自世界银行、FRED、OECD 等公开库。",
    },
    altTool: {
      name: "Excel / Google Sheets（备选）",
      note: "可完成基础回归（数据分析工具库），适合入门；但控制变量与稳健性检验建议用 Python/R。",
    },
    techStack: ["计量经济学", "回归分析", "Python/R", "数据可视化"],
    baseline:
      "基础线：提出可检验的经济假设，用真实公开数据做多元线性回归，正确报告并解读回归系数、显著性（p 值）与 R²。",
    challenge:
      "挑战目标：加入控制变量缓解遗漏变量偏误，做稳健性检验，审慎讨论相关 vs 因果（可引入双重差分/工具变量的概念）。",
    skills: ["计量经济学", "统计与回归", "数据分析", "因果推断思维", "技术写作"],
    stages: [
      {
        num: 1,
        title: "研究问题与数据",
        goal: "提出可检验的经济问题并找到真实数据。",
        software: "世界银行 / FRED / OECD 数据库",
        learn: [
          "实证经济学：用数据检验理论；区分相关与因果。",
          "如何提出可检验的假设：明确自变量、因变量与预期关系。",
          "公开数据源：世界银行 WDI、美联储 FRED、OECD、各国统计局。",
        ],
        task:
          "提出一个具体可检验的研究问题（如「教育支出占比对人均 GDP 增长的影响」），明确变量，从公开数据库获取相关数据。",
        deliverable: "研究问题 + 假设 + 变量定义 + 数据来源。",
        metrics: ["问题具体且可检验", "数据真实公开可溯源", "自变量/因变量明确"],
        rubric: [
          "研究问题有经济意义",
          "假设清晰、可检验",
          "数据来源可靠",
          "变量定义准确",
        ],
        humanReview: false,
      },
      {
        num: 2,
        title: "描述统计与回归",
        goal: "清洗数据、可视化，并跑多元线性回归。",
        software: "Python (statsmodels) / R",
        learn: [
          "描述性统计与数据可视化（散点图、相关系数）。",
          "多元线性回归（OLS）：如何解读回归系数（其它变量不变时的边际效应）。",
          "统计显著性：p 值、置信区间；拟合优度 R²。",
        ],
        task:
          "清洗数据，做描述统计与可视化，建立多元线性回归模型，输出回归结果，正确解读系数、显著性与 R²。",
        deliverable: "描述统计与图表 + 回归结果表 + 系数解读。",
        metrics: ["回归模型设定合理", "系数解读正确", "显著性（p 值）判断正确", "报告 R²"],
        rubric: [
          "数据清洗与可视化到位",
          "回归模型正确",
          "系数与显著性解读准确",
          "结果呈现规范",
        ],
        humanReview: true,
      },
      {
        num: 3,
        title: "稳健性与因果讨论",
        goal: "加控制变量、做稳健性检验，审慎讨论因果。",
        software: "Python (statsmodels) / R",
        learn: [
          "遗漏变量偏误：漏掉重要变量会让系数有偏——为什么要加控制变量。",
          "稳健性检验：换设定/子样本看结论是否稳定；稳健标准误。",
          "相关 ≠ 因果：内生性问题；因果推断方法（双重差分 DID、工具变量 IV）的基本概念。",
        ],
        task:
          "加入控制变量重新回归，比较系数变化；做至少一种稳健性检验；审慎讨论你的结果能否支持因果结论，还是仅是相关。",
        deliverable: "含控制变量的回归对比 + 稳健性检验 + 因果讨论。",
        metrics: ["加入了合理的控制变量", "做了稳健性检验", "对因果 vs 相关有审慎讨论"],
        rubric: [
          "理解并处理遗漏变量偏误",
          "稳健性检验合理",
          "因果讨论审慎、不过度声称",
          "体现经济学思维",
        ],
        humanReview: false,
      },
      {
        num: 4,
        title: "研究报告",
        goal: "整合为一份规范的实证研究报告。",
        learn: [
          "报告结构：摘要 → 研究问题 → 文献/背景 → 数据与方法 → 结果 → 讨论与局限 → 结论。",
          "严谨性：说明数据局限、内生性、外部有效性等。",
          "图表规范：回归表、图有编号与说明。",
        ],
        task: "把研究问题、数据、回归、稳健性与因果讨论整合为一份完整实证研究报告（建议 8–12 页）。",
        deliverable: "最终实证研究报告（PDF），含回归表、图、因果讨论与局限。",
        metrics: ["报告含完整实证研究链路", "关键结论有回归结果支撑"],
        rubric: [
          "报告结构完整、专业",
          "回归表/图规范、被正文引用",
          "包含数据与因果局限的反思",
          "结论审慎、有依据",
        ],
        humanReview: true,
      },
    ],
    outcome:
      "一份用真实数据完成的实证经济学研究报告（研究问题 + 回归分析 + 因果讨论）。展示你的计量能力与经济学思维，是经济/社科申请的硬核素材。",
  },

  // ═══════════════ 生物科学（样板） ═══════════════
  {
    id: "bio-bioinformatics-sequence",
    field: "BIO",
    title: "生物信息学：基因/蛋白序列的比对与进化分析",
    titleEn: "Bioinformatics: Sequence Alignment & Phylogenetic Analysis",
    summary:
      "从公开数据库获取基因/蛋白序列，用 BLAST 做序列比对，跨物种比较相似性，并构建进化树——不用实验室也能做的真实生物研究。",
    scenario:
      "你对某个基因或蛋白（如胰岛素、血红蛋白、某病毒蛋白）感兴趣。你将从 NCBI 等公开数据库获取它的序列，用生物信息学标准工具 BLAST 找出相似序列、跨物种比较，并构建进化树看物种间的亲缘关系。这是现代生物学高度依赖、且高中生在家就能做的真实研究方向。",
    whyValuable:
      "生物信息学让你不进实验室也能做真研究。「我用 BLAST 比对了不同物种的血红蛋白序列，构建进化树分析亲缘关系」——招生官会看到你掌握现代生物学的计算方法、能处理真实数据，比「参观了实验室」有分量得多。",
    targetMajors: ["生物科学 / 生物医学", "生物信息学", "遗传学", "医学（科研方向）"],
    difficulty: 2,
    estimatedHours: "20–35 小时（约 3–5 周）",
    primaryTool: {
      name: "NCBI BLAST（免费在线）+ Python (Biopython)",
      note: "NCBI 提供免费的序列数据库与在线 BLAST 工具，无需安装；进阶用 Biopython 或在线 MSA 工具（如 Clustal Omega、MEGA）做多序列比对与进化树。",
    },
    altTool: {
      name: "MEGA / Clustal Omega（免费，备选）",
      note: "常用的免费多序列比对与进化树构建工具，图形化、易上手。",
    },
    techStack: ["生物信息学", "BLAST 序列比对", "Python (Biopython)", "系统发育分析"],
    baseline:
      "基础线：从公开数据库获取目标序列，用 BLAST 完成比对，正确解读 E-value 与相似度（identity），识别同源序列与物种。",
    challenge:
      "挑战目标：对多个物种的同源序列做多序列比对（MSA）并构建进化树，分析亲缘关系；或用 Python 批量处理一组公开基因表达/序列数据。",
    skills: ["生物信息学", "序列分析", "Python 数据处理", "科学解读", "技术写作"],
    stages: [
      {
        num: 1,
        title: "背景与获取序列",
        goal: "选定目标基因/蛋白，从公开库获取序列。",
        software: "NCBI（GenBank / UniProt）",
        learn: [
          "DNA、RNA、蛋白序列与中心法则的基础。",
          "公开数据库：NCBI GenBank（核酸）、UniProt（蛋白）。",
          "FASTA 格式；序列相似性为何能反映功能与亲缘关系。",
        ],
        task:
          "选一个你感兴趣的基因或蛋白（如胰岛素 INS、血红蛋白 HBB），从 NCBI 获取其序列（FASTA），并了解其生物学背景。",
        deliverable: "目标序列（FASTA）+ 来源 + 生物学背景说明。",
        metrics: ["序列来自公开数据库", "FASTA 格式正确", "背景描述准确"],
        rubric: [
          "理解序列的生物学意义",
          "正确获取并记录序列来源",
          "背景说明清楚",
          "选题有一定意义",
        ],
        humanReview: false,
      },
      {
        num: 2,
        title: "序列比对分析（BLAST）",
        goal: "用 BLAST 比对，跨物种比较并解读结果。",
        software: "NCBI BLAST",
        learn: [
          "BLAST 原理：局部序列比对，快速找相似序列。",
          "关键指标：E-value（越小越可信）、identity（相似度百分比）、覆盖度。",
          "同源（homology）与跨物种比较的意义。",
        ],
        task:
          "用 BLAST 比对你的序列，找出相似序列，做跨物种比较（如人 vs 小鼠 vs 其它），解读 E-value 与相似度，识别同源关系。",
        deliverable: "BLAST 结果截图/表 + 对 E-value、相似度、物种的解读。",
        metrics: ["BLAST 正确完成", "E-value 与 identity 解读正确", "有跨物种发现"],
        rubric: [
          "BLAST 操作正确",
          "指标解读到位",
          "跨物种比较有意义",
          "结论有生物学依据",
        ],
        humanReview: true,
      },
      {
        num: 3,
        title: "多序列比对与进化树（或表达分析）",
        goal: "构建进化树分析亲缘，或分析表达数据。",
        software: "Clustal Omega / MEGA / Python (Biopython)",
        learn: [
          "多序列比对（MSA）：同时对齐多条序列，看保守区与差异。",
          "系统发育树：用序列差异推断物种/基因的进化亲缘关系。",
          "（替代路线）用 Python 处理一组公开基因表达数据，比较差异表达。",
        ],
        task:
          "对多个物种的同源序列做 MSA 并构建进化树，分析亲缘关系；或用 Python 分析一组公开表达数据的差异。",
        deliverable: "MSA 结果 + 进化树（或表达分析图）+ 解读。",
        metrics: ["MSA/进化树合理（或表达分析正确）", "亲缘关系解读有据", "图表清晰"],
        rubric: [
          "MSA/树构建正确",
          "生物学解读合理",
          "达到基础线；尽力冲击挑战目标",
          "（进阶）用 Python 完成分析",
        ],
        humanReview: false,
      },
      {
        num: 4,
        title: "研究报告",
        goal: "整合为一份规范的生物信息学分析报告。",
        learn: [
          "报告结构：摘要 → 背景 → 方法（数据库、工具、参数）→ 结果（比对、树）→ 讨论与局限 → 结论。",
          "严谨性：说明数据来源、工具版本、结果的生物学意义与局限。",
          "图表规范：比对图、进化树有说明。",
        ],
        task: "把序列获取、BLAST、MSA/进化树整合为一份完整生物信息学报告（建议 6–10 页）。",
        deliverable: "最终生物信息学分析报告（PDF），含比对结果、进化树与解读。",
        metrics: ["报告含完整分析链路", "结论有比对/树的数据支撑"],
        rubric: [
          "报告结构完整、专业",
          "图表规范、被正文引用",
          "包含方法与生物学局限的反思",
          "结论有据、逻辑连贯",
        ],
        humanReview: true,
      },
    ],
    outcome:
      "一份生物信息学分析报告（序列比对 + 跨物种比较 + 进化树）。展示你掌握现代生物学的计算研究方法，是生物/医学申请里少见又有分量的硬核素材。",
  },

  // ═══════════════ 数学（样板） ═══════════════
  {
    id: "math-modelling-exploration",
    field: "MATH",
    title: "数学探究：从数值实验到严谨证明",
    titleEn: "Mathematical Exploration: From Numerical Experiments to Proof",
    summary:
      "选一个有深度的数学问题，用 Python 做数值/图形实验发现规律，提出猜想，再给出严谨证明，并尝试推广——像数学家一样思考。",
    scenario:
      "数学的魅力在于「发现规律并证明它」。你将选一个有深度的问题（数论、组合、概率或微分方程），先用 Python/Desmos 做数值与图形实验发现规律、提出猜想，再用严谨的数学论证证明它，最后尝试推广到更一般的情形。这条「实验 → 猜想 → 证明」的路径，正是真实数学研究的缩影。",
    whyValuable:
      "数学申请最看重「证明能力与探究精神」。「我通过数值实验发现了一个规律，提出猜想并给出严谨证明，还推广到一般情形」——招生官会看到你不只是会解题，而是具备真正的数学研究思维，这在申请者中极其稀缺。",
    targetMajors: ["数学 / 应用数学", "统计学", "计算机科学（理论方向）", "物理学"],
    difficulty: 3,
    estimatedHours: "25–40 小时（约 4–6 周）",
    primaryTool: {
      name: "Python (numpy / matplotlib / sympy) 或 Desmos / GeoGebra（免费）",
      note: "用 Python 做数值实验与符号计算（sympy），用 Desmos/GeoGebra 做图形探索。均免费，Python 可用 Colab。工具用于「发现」，证明仍需严谨推理。",
    },
    altTool: {
      name: "纸笔 + Desmos（备选）",
      note: "核心是数学推理；计算工具辅助探索，Desmos 足以完成图形实验。",
    },
    techStack: ["数学建模", "数值/符号计算", "Python", "证明与推理"],
    baseline:
      "基础线：选定一个有深度的问题，用计算工具做数值/图形探索、发现规律并提出明确猜想，再给出一个严谨的证明（或反例）。",
    challenge:
      "挑战目标：把结论推广到更一般的情形并证明；或用数学对一个真实现象建模（如 SIR 传染病、Logistic 人口增长），数值求解并验证。",
    skills: ["数学证明", "数值/符号计算", "Python", "抽象与推广", "数学写作"],
    stages: [
      {
        num: 1,
        title: "选题与数值探索",
        goal: "选定问题，用计算工具实验并提出猜想。",
        software: "Python (numpy/matplotlib) / Desmos",
        learn: [
          "数学探究 vs 解题：探究是发现并证明新规律，而非套用已知方法。",
          "实验数学：用具体例子/数值/图形发现模式，形成猜想。",
          "好问题的来源：数论规律、组合恒等式、几何猜想、概率悖论、迭代与混沌等。",
        ],
        task:
          "选一个有深度的问题（如某数列/求和的规律、某几何量的性质、某概率问题），用 Python 或 Desmos 做数值/图形实验，观察规律并提出明确猜想。",
        deliverable: "探索过程（数据/图）+ 明确表述的猜想。",
        metrics: ["问题有深度、非套路题", "数值/图形探索充分", "猜想表述明确"],
        rubric: [
          "选题有数学深度",
          "探索充分、有实验记录",
          "猜想清晰、可证",
          "体现探究精神",
        ],
        humanReview: false,
      },
      {
        num: 2,
        title: "严谨证明",
        goal: "对猜想给出严谨证明（或反例）。",
        software: "纸笔推理 + Python/sympy 验证",
        learn: [
          "证明的严谨性：每一步都要有依据，不能靠「看起来对」。",
          "常见方法：数学归纳法、反证法、构造法、不等式技巧。",
          "计算工具能验证边界情形、但不能替代证明。",
        ],
        task:
          "对你的猜想给出严谨的数学证明；若猜想不成立，找出反例并修正。用 Python/sympy 验证若干情形以增强信心（但证明本身要靠推理）。",
        deliverable: "完整的证明过程（或反例与修正）+ 计算验证。",
        metrics: ["证明逻辑完整严谨", "每步有依据", "计算验证支持结论"],
        rubric: [
          "证明严谨、无逻辑漏洞",
          "方法恰当",
          "验证与证明相互印证",
          "数学表述规范",
        ],
        humanReview: true,
      },
      {
        num: 3,
        title: "推广或建模应用",
        goal: "把结论推广并证明，或用数学建模真实现象。",
        software: "Python (numpy/scipy/matplotlib)",
        learn: [
          "推广：把特殊结论推广到一般情形（如从特例到任意 n）并证明。",
          "（替代路线）数学建模：用微分方程/迭代模型描述真实现象，如 SIR 传染病模型、Logistic 人口增长。",
          "用 Python 数值求解模型并验证/可视化。",
        ],
        task:
          "把你的结论推广到更一般情形并证明；或选一个真实现象建立数学模型，用 Python 数值求解、可视化并讨论其合理性。",
        deliverable: "推广证明，或建模 + 数值求解结果与图。",
        metrics: ["推广/建模有实质深度", "证明或数值方法正确", "结果经过验证"],
        rubric: [
          "推广/建模合理且有挑战性",
          "证明或数值方法正确",
          "达到基础线；尽力冲击挑战目标",
          "结果可信、有验证",
        ],
        humanReview: false,
      },
      {
        num: 4,
        title: "数学报告",
        goal: "整合为一份规范的数学探究报告。",
        learn: [
          "报告结构：引言（问题）→ 探索与猜想 → 证明 → 推广/应用 → 反思 → 结论。",
          "数学写作规范：定义、定理、证明清晰分明；符号一致。",
          "反思：讨论方法的局限与可继续探索的方向。",
        ],
        task: "把探索、猜想、证明、推广整合为一份完整的数学探究报告（建议 8–12 页），注重逻辑与表述的严谨。",
        deliverable: "最终数学探究报告（PDF），含探索、证明、推广与反思。",
        metrics: ["报告含完整探究链路", "证明与结论严谨呈现"],
        rubric: [
          "报告结构完整、专业",
          "数学表述规范、符号一致",
          "包含方法局限与延伸的反思",
          "逻辑严谨、可读性好",
        ],
        humanReview: true,
      },
    ],
    outcome:
      "一份数学探究报告（数值实验 → 猜想 → 严谨证明 → 推广/建模）。展示你稀缺的数学研究思维与证明能力，是数学/理论方向申请的硬核素材。",
  },
];

export function getProjectById(id: string): OnlineProject | undefined {
  return ONLINE_PROJECTS.find((p) => p.id === id);
}

export function projectsByField(field: ProjectField): OnlineProject[] {
  return ONLINE_PROJECTS.filter((p) => p.field === field);
}
