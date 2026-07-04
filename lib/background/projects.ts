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
];

export function getProjectById(id: string): OnlineProject | undefined {
  return ONLINE_PROJECTS.find((p) => p.id === id);
}

export function projectsByField(field: ProjectField): OnlineProject[] {
  return ONLINE_PROJECTS.filter((p) => p.field === field);
}
