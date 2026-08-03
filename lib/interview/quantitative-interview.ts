export type QuantitativeDiscipline = "maths" | "physics" | "engineering" | "chemistry" | "biology" | "economics" | "compsci";

export type QuantitativeCheckpoint = {
  id: "model" | "calculation" | "units" | "sanity" | "defence";
  label: string;
  description: string;
  signals: string[];
};

export type QuantitativeInterviewDrill = {
  id: string;
  subjectIds: QuantitativeDiscipline[];
  title: string;
  discipline: string;
  pressure: "中压" | "高压" | "极限";
  setup: string;
  prompt: string;
  target: string;
  followUp: string;
  followUpTarget: string;
  timeLimitSec: number;
  followUpSec: number;
  checkpoints: QuantitativeCheckpoint[];
  approach: string;
  commonTrap: string;
};

const CORE_CHECKPOINTS: QuantitativeCheckpoint[] = [
  { id: "model", label: "先建模", description: "明确变量、假设和要估计的量。", signals: ["假设", "设", "近似", "变量", "模型", "忽略"] },
  { id: "calculation", label: "计算链", description: "把关系式、代入和数量级说出来。", signals: ["=", "≈", "约", "代入", "因此", "所以", "比例", "平方", "立方"] },
  { id: "units", label: "单位与量纲", description: "给出单位，或主动检查量纲是否一致。", signals: ["单位", "焦耳", "瓦", "米", "秒", "千克", "mol", "百分比", "量纲"] },
  { id: "sanity", label: "量级复核", description: "比较结果是否合理，并指出误差来源。", signals: ["量级", "合理", "误差", "检查", "大约", "范围", "上限", "下限", "极限"] },
];

const DEFENCE_CHECKPOINT: QuantitativeCheckpoint = {
  id: "defence",
  label: "面对追问",
  description: "面对新条件时，能修正模型而不是只重复答案。",
  signals: ["如果", "改变", "修正", "重新", "取决于", "敏感", "边界", "限制"],
};

export const QUANTITATIVE_INTERVIEW_DRILLS: QuantitativeInterviewDrill[] = [
  {
    id: "qi-maths-01",
    subjectIds: ["maths"],
    title: "一页纸与 30 秒估算",
    discipline: "数学",
    pressure: "中压",
    setup: "面试官把一张 A4 纸递给你，不允许使用计算器。",
    prompt: "估算一张 A4 纸被随机撕成两半后，较长一边的平均长度。你不需要给出精确答案，但要说明你的几何模型和近似。",
    target: "重点不是猜中数值，而是把随机撕裂、长度尺度和平均值的限制说清楚。",
    followUp: "如果纸不是随机撕，而是总沿着短边附近撕开，你的估计会如何变化？",
    followUpTarget: "比较两种撕法的模型差异，说明哪一个假设改变了结果。",
    timeLimitSec: 300,
    followUpSec: 120,
    checkpoints: CORE_CHECKPOINTS,
    approach: "先画出 210 mm × 297 mm 的矩形，区分沿长边和沿短边的撕裂方向。不要把‘平均’假设成中点；应说明你选择的分布、为什么能作为首轮近似，以及这个模型最多可信到什么程度。",
    commonTrap: "直接报 297/2 或把纸当成一条线，跳过随机性和几何模型。",
  },
  {
    id: "qi-maths-02",
    subjectIds: ["maths"],
    title: "递推中的增长与边界",
    discipline: "数学",
    pressure: "高压",
    setup: "黑板上写着 a₀ = 1，aₙ₊₁ = aₙ + 1/aₙ。面试官要求你不用求出通项。",
    prompt: "判断 aₙ 大致如何增长，并给出一个能证明增长阶的上下界。然后说明 aₙ² 的变化为什么比 aₙ 更容易研究。",
    target: "应把平方差展开为 aₙ₊₁² - aₙ² = 2 + 1/aₙ²，并由此得到平方量级接近 2n。",
    followUp: "若递推改为 aₙ₊₁ = aₙ + c/aₙ，c > 0，你的结论如何变化？",
    followUpTarget: "指出 aₙ² 的每步增量接近 2c，增长阶仍为 √n，但常数改变。",
    timeLimitSec: 420,
    followUpSec: 150,
    checkpoints: CORE_CHECKPOINTS,
    approach: "先平方，不要执着于求通项。平方差给出一个常数 2 和一个正的小修正项，从而能用求和或上下夹逼控制 aₙ²，再把结论转回 aₙ。",
    commonTrap: "只凭前几项猜 aₙ 线性增长，或把递推式中的 1/aₙ 当成常数。",
  },
  {
    id: "qi-physics-01",
    subjectIds: ["physics"],
    title: "全英国烧水的能量",
    discipline: "物理",
    pressure: "高压",
    setup: "面试官说：英国人每天喝茶。你只有纸笔，不查资料。",
    prompt: "估算英国一天把泡茶用水从 15°C 加热到 100°C 所需的能量。先列出你采用的人口、杯数和每杯水量，再给出量级。",
    target: "应使用 Q = mcΔT，合理取人口约 7×10⁷、每人每天 2–4 杯、每杯约 0.25 L，并得到约 10¹³–10¹⁴ J/day 的量级。",
    followUp: "如果只有 70% 的热量真正进入水中，结果如何解释？再和一座大型发电站的日发电量比较。",
    followUpTarget: "除以效率得到输入能量，并用功率 × 一天时间进行数量级比较。",
    timeLimitSec: 360,
    followUpSec: 150,
    checkpoints: CORE_CHECKPOINTS,
    approach: "先说清楚这是数量级问题，不追求虚假的精确。把人数、杯数、质量和温差拆开，检查每一步单位，再用 4×10³ J kg⁻¹ K⁻¹ 做心算。",
    commonTrap: "直接给一个精确数字，或者忘记把升换成千克、把每天的能量和功率混淆。",
  },
  {
    id: "qi-physics-02",
    subjectIds: ["physics", "engineering"],
    title: "自由落体中的阻力",
    discipline: "物理 / 工程",
    pressure: "极限",
    setup: "两个相同材料的球，一个半径是另一个的两倍，从高处同时下落。",
    prompt: "不查空气阻力公式，判断较大的球是否一定先落地。请建立至少两个模型，并说明哪个无量纲比值决定模型何时失效。",
    target: "真空模型中同时落地；有阻力时表面积与质量的缩放不同，阻力相对重力取决于密度、尺寸、速度和阻力系数。",
    followUp: "把球换成相同质量但半径不同的薄壳，你的判断会怎么改？",
    followUpTarget: "指出质量不再随体积缩放，质量/迎风面积改变，不能沿用实心球结论。",
    timeLimitSec: 420,
    followUpSec: 150,
    checkpoints: CORE_CHECKPOINTS,
    approach: "先给理想模型，再主动指出空气阻力使问题依赖尺寸。比较重力随 L³ 变化、迎风面积随 L² 变化，最后说明速度进入阻力模型后结论不再只由尺寸决定。",
    commonTrap: "说‘大的更重所以一定先落地’，没有比较阻力和重力的缩放。",
  },
  {
    id: "qi-engineering-01",
    subjectIds: ["engineering"],
    title: "弹簧升降平台",
    discipline: "工程",
    pressure: "高压",
    setup: "一个质量 m 的平台由四根相同弹簧支撑，每根劲度系数 k。平台被压下 x 后释放。",
    prompt: "推导平台的振动周期，并说明四根弹簧如何组合。然后说明如果其中一根弹簧变软，模型哪一步需要重做。",
    target: "并联等效劲度系数为 4k，角频率 ω = √(4k/m)，周期 T = 2π√(m/4k)；若不对称，需考虑耦合/倾斜或重新求等效刚度。",
    followUp: "平台同时承载一个位置偏心的重物，为什么不能只用竖直一维模型？",
    followUpTarget: "指出偏心载荷会引入转动和不同弹簧伸长，需加入力矩平衡。",
    timeLimitSec: 420,
    followUpSec: 150,
    checkpoints: CORE_CHECKPOINTS,
    approach: "先画受力图，把四根弹簧的伸长相同作为对称假设，再由合力写出等效恢复力。追问时检查对称性是否仍然成立。",
    commonTrap: "把四根弹簧误当成串联，或直接背 T = 2π√(m/k) 而不解释 k 的含义。",
  },
  {
    id: "qi-chemistry-01",
    subjectIds: ["chemistry"],
    title: "滴定的稀释陷阱",
    discipline: "化学",
    pressure: "高压",
    setup: "25.0 mL 的一元酸样品用 0.100 mol L⁻¹ 的碱滴定，终点消耗 18.6 mL。",
    prompt: "在没有计算器的情况下估算酸的浓度，并说出你需要的化学计量假设。若酸是二元酸，答案如何变化？",
    target: "一元酸浓度约为 0.100×18.6/25.0 ≈ 0.0744 mol L⁻¹；二元酸在相同计量关系下约减半。",
    followUp: "如果滴定前把样品稀释到原体积的两倍，但仍取 25.0 mL 滴定，如何修正？",
    followUpTarget: "先求稀释后浓度，再乘以稀释倍数还原原样浓度。",
    timeLimitSec: 300,
    followUpSec: 120,
    checkpoints: CORE_CHECKPOINTS,
    approach: "先写反应物的摩尔比，再用 n = cV；注意 mL 约去比值时两边必须使用同一体积单位。二元酸的关键不是重算，而是检查计量系数。",
    commonTrap: "把体积直接当成浓度，或忽略一元/二元酸的化学计量比。",
  },
  {
    id: "qi-biology-01",
    subjectIds: ["biology"],
    title: "捕获—标记—再捕获",
    discipline: "生物",
    pressure: "高压",
    setup: "池塘第一次捕获 40 条鱼并标记，第二次捕获 50 条，其中 10 条有标记。",
    prompt: "估算池塘鱼群规模，并说明这个估计最依赖哪两个假设。面试官会继续追问抽样是否真的随机。",
    target: "Lincoln–Petersen 估计 N ≈ 40×50/10 = 200；需要标记不影响生存/被捕概率，且两次捕获期间群体近似封闭并充分混合。",
    followUp: "如果标记鱼更容易被发现，估计值会偏高还是偏低？为什么？",
    followUpTarget: "标记鱼更容易被捕会使再捕中的标记比例偏高，从而 N = M×C/R 被低估。",
    timeLimitSec: 300,
    followUpSec: 120,
    checkpoints: CORE_CHECKPOINTS,
    approach: "先利用样本中标记比例近似总体中标记比例，再列比例求 N。答案不止是 200，还必须谈群体封闭、混合、标记效应和捕获概率。",
    commonTrap: "只报计算结果，不说明为什么样本比例可以代表总体比例。",
  },
  {
    id: "qi-economics-01",
    subjectIds: ["economics"],
    title: "票价与收入的弹性",
    discipline: "经济学",
    pressure: "中压",
    setup: "电影院把票价从 £10 提高到 £12，观影人数从 1000 降到 850。",
    prompt: "判断总票房收入变化，并估算需求价格弹性。不要只说‘涨价所以收入增加’，要指出区间选择和近似方法。",
    target: "收入从 £10,000 变为 £10,200，约增加 2%；简单百分比弹性约为 -15%/+20% = -0.75，需求相对缺乏弹性。",
    followUp: "如果竞争对手同时降价，原来的弹性估计还能直接用于预测吗？",
    followUpTarget: "不能直接外推；价格变化、替代品、季节、顾客构成等因素可能混杂，需要控制或重新估计。",
    timeLimitSec: 300,
    followUpSec: 120,
    checkpoints: CORE_CHECKPOINTS,
    approach: "先分别算收入，避免凭弹性符号跳结论；再声明使用简单百分比还是中点弹性。最后把统计关联和因果预测区分开。",
    commonTrap: "只看销量下降就判断收入下降，或把一次价格变化的相关结果当成稳定结构参数。",
  },
  {
    id: "qi-compsci-01",
    subjectIds: ["compsci"],
    title: "找出隐藏的重复工作",
    discipline: "计算机科学",
    pressure: "极限",
    setup: "程序对长度为 n 的数组执行：对每个 i，向左扫描直到找到比 a[i] 大的元素。",
    prompt: "给出最坏情况下的时间复杂度，并提出一个能把它降到线性复杂度的思路。请用一个具体数组解释你的数据结构如何变化。",
    target: "朴素双循环最坏为 O(n²)；可用单调栈，每个元素最多入栈和出栈一次，达到 O(n)。",
    followUp: "如果题目改成寻找右侧第一个更小元素，单调栈方向和比较符号如何调整？",
    followUpTarget: "从右向左或等价地维护相应单调性，先弹出不可能成为答案的元素，再读取栈顶。",
    timeLimitSec: 420,
    followUpSec: 150,
    checkpoints: CORE_CHECKPOINTS,
    approach: "先构造递增或递减数组展示 O(n²) 的重复扫描，再观察已被淘汰的元素不会重新成为答案，使用单调栈保存候选。复杂度必须同时说明每个元素的入栈/出栈次数。",
    commonTrap: "只背 O(n) 结论，不能说明栈保持什么不变量，或忽略最坏输入。",
  },
];

export const QUANTITATIVE_INTERVIEW_SUBJECTS = new Set<QuantitativeDiscipline>([
  "maths", "physics", "engineering", "chemistry", "biology", "economics", "compsci",
]);

export function getQuantitativeDrills(subjectId: string) {
  return QUANTITATIVE_INTERVIEW_DRILLS.filter((drill) => drill.subjectIds.includes(subjectId as QuantitativeDiscipline));
}

export function isQuantitativeInterviewSubject(subjectId: string) {
  return QUANTITATIVE_INTERVIEW_SUBJECTS.has(subjectId as QuantitativeDiscipline);
}

export function scoreQuantitativeResponse(drill: QuantitativeInterviewDrill, response: string, followUpResponse: string) {
  const main = response.toLocaleLowerCase();
  const followUp = followUpResponse.toLocaleLowerCase();
  const checks = drill.checkpoints.map((checkpoint) => ({
    ...checkpoint,
    passed: checkpoint.signals.some((signal) => main.includes(signal.toLocaleLowerCase())),
  }));
  const defence = {
    ...DEFENCE_CHECKPOINT,
    passed: DEFENCE_CHECKPOINT.signals.some((signal) => followUp.includes(signal.toLocaleLowerCase())),
  };
  const mainScore = checks.filter((check) => check.passed).length;
  const defenceScore = defence.passed ? 1 : 0;
  const total = mainScore + defenceScore;
  return {
    total,
    max: checks.length + 1,
    checks,
    defence,
    band: total >= 5 ? "可承受高压追问" : total >= 3 ? "方法基本成形，需继续练习" : "先练习把计算过程说完整",
  };
}
