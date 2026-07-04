// 在线课题（进阶版 · 硬核工程）——平台自有、贴近专业、用工业级软件完成、有量化验收的高含金量课题。
// 与「背景提升项目目录（外部活动推荐）」并存：目录=去参加什么；在线课题=在平台真做一个。
// 设计原则（据用户反馈升级）：
//   1. 指定专业软件（ANSYS 学生版等，官方支持高中生、免费）完成具体操作任务；
//   2. 用可量化指标验收（应力、安全系数、升阻比等），并设「基础线 / 挑战目标」分层；
//   3. 融合编程/AI（Python 做后处理、参数扫描、优化），面向未来趋势。
// 平台负责：课题说明书 + 量化验收标准 + 成果归档；实际操作在学生本机的专业软件中完成，上传结果。
// 内容为原创设计，采用真实工程方法与工业软件工作流。

export type ProjectField = "MECH" | "AERO";

export const PROJECT_FIELDS: { value: ProjectField; label: string; labelEn: string; emoji: string }[] = [
  { value: "MECH", label: "机械工程", labelEn: "Mechanical Engineering", emoji: "⚙️" },
  { value: "AERO", label: "航空航天工程", labelEn: "Aerospace Engineering", emoji: "🚀" },
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
];

export function getProjectById(id: string): OnlineProject | undefined {
  return ONLINE_PROJECTS.find((p) => p.id === id);
}

export function projectsByField(field: ProjectField): OnlineProject[] {
  return ONLINE_PROJECTS.filter((p) => p.field === field);
}
