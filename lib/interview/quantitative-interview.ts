import { reviewQuantitativeResponse } from "./quantitative-interview-review";

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

const BASE_QUANTITATIVE_INTERVIEW_DRILLS: QuantitativeInterviewDrill[] = [
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

function makeQuantitativeDrill(input: Omit<QuantitativeInterviewDrill, "checkpoints">): QuantitativeInterviewDrill {
  return { ...input, checkpoints: CORE_CHECKPOINTS };
}

const EXPANDED_QUANTITATIVE_INTERVIEW_DRILLS: QuantitativeInterviewDrill[] = [
  makeQuantitativeDrill({
    id: "qi-maths-03", subjectIds: ["maths"], title: "两次筛选后的概率", discipline: "数学", pressure: "高压",
    setup: "面试官给出一个装有红球和蓝球的袋子，抽球后不放回，再根据颜色决定第二步操作。",
    prompt: "袋中有 3 个红球和 2 个蓝球。连续抽取两个球，若第一个是红球则第二次抽取前再放入一个蓝球；若第一个是蓝球则不放回。第二个球是红球的概率是多少？请边算边说明条件如何改变。",
    target: "按第一次颜色分情况：第一球红时第二次红球为 3/6，第一球蓝时为 3/4，合并得到 (3/5)(1/2)+(2/5)(3/4)=3/5。",
    followUp: "如果第二次抽到红球，反过来判断第一次是红球的概率是多少？",
    followUpTarget: "用贝叶斯或联合概率，分子为第一次红且第二次红的概率，分母为第二次红的总概率，结果为 1/2。",
    timeLimitSec: 360, followUpSec: 120, approach: "先画出两层概率树，不要把第二步的样本空间当成固定不变。每条路径的概率必须包含第一次结果和第二次条件概率。", commonTrap: "直接把两次抽取当作独立事件，或忘记第一次红球后加入蓝球改变了总数。",
  }),
  makeQuantitativeDrill({
    id: "qi-maths-04", subjectIds: ["maths"], title: "折纸后的最短路径", discipline: "数学", pressure: "极限",
    setup: "一张长方形纸上有两个点，纸沿一条直线折叠，面试官要求你寻找折后两点间的最短路径。",
    prompt: "说明如何选择折痕，使一个点折到另一侧后，连接折后点与原点的直线长度最短。不要只报结论，请构造几何变换并解释为什么。",
    target: "把其中一个点关于折痕反射，折后路径等价于连接原点和反射点的直线；折痕应使反射点落在允许区域并让直线穿过折痕，最短长度由反射几何给出。",
    followUp: "如果折痕必须经过纸张的一条边上的指定点，最短路径还一定能直接实现吗？",
    followUpTarget: "检查直线与允许折痕的交点和边界约束；若交点不在纸内，最优解会落在边界而不是无约束反射解。",
    timeLimitSec: 420, followUpSec: 150, approach: "先把折叠转成镜像，再把可变折痕转成路径必须经过的约束。最后检查解是否真的落在纸张范围内。", commonTrap: "只画出镜像而不检查折痕位置，或把最短路径误认为沿纸张边缘走。",
  }),
  makeQuantitativeDrill({
    id: "qi-maths-05", subjectIds: ["maths"], title: "固定体积的最省材料圆柱", discipline: "数学", pressure: "高压",
    setup: "一个无盖圆柱容器需要装下固定体积的液体，材料成本与表面积成正比。",
    prompt: "设体积固定为 V，半径为 r、高为 h。推导无盖圆柱表面积最小时 r 与 h 的关系，并说明这个结果如何受最小高度或最小半径限制。",
    target: "由 πr²h=V 得 h=V/(πr²)，表面积 S=πr²+2πrh=πr²+2V/r；求导或均衡两项得 πr²=V/r，故 h=r。",
    followUp: "若容器必须有盖，最优的高径关系如何改变？",
    followUpTarget: "表面积变为 2πr²+2πrh，代入体积后求导，得到 h=2r；边界限制可能把无约束最优点截断。",
    timeLimitSec: 420, followUpSec: 150, approach: "先用体积约束消掉一个变量，再优化单变量表达式。即使不正式求导，也可以用两个成本项的边际变化解释平衡点。", commonTrap: "把无盖和有盖公式混用，或只给 h=r 而没有说明约束和边界。",
  }),
  makeQuantitativeDrill({
    id: "qi-physics-03", subjectIds: ["physics"], title: "雨滴为什么有终端速度", discipline: "物理", pressure: "高压",
    setup: "一颗小雨滴从云层落下，阻力随速度增大而增大。面试官不要求记忆阻力常数。",
    prompt: "用受力和数量级解释雨滴为什么不会无限加速，并判断半径变为两倍时终端速度大约如何变化。分别讨论阻力正比于 v 和 v² 的两种模型。",
    target: "终端速度满足阻力等于重力；若 F∝v，则 v_t∝r³，若 F∝v² 且迎风面积∝r²，则 v_t∝r^{1/2}。需说明模型适用的速度范围。",
    followUp: "如果雨滴在下落过程中蒸发，半径不断变小，终端速度和运动状态会怎样变化？",
    followUpTarget: "重力、迎风面积和阻力系数都随半径或形状变化，应把瞬时终端速度当作变化的参考，并比较响应时间与半径变化时间。",
    timeLimitSec: 420, followUpSec: 150, approach: "先写 mg 与阻力的平衡，再用质量∝r³、面积∝r² 做尺度分析。不要把两种阻力模型的结论混在一起。", commonTrap: "只说‘阻力抵消重力’却不能推导半径依赖，或默认终端速度等于落地速度。",
  }),
  makeQuantitativeDrill({
    id: "qi-physics-04", subjectIds: ["physics"], title: "屋顶太阳能的日收益", discipline: "物理", pressure: "中压",
    setup: "一栋学校想在屋顶铺设太阳能板，面试官要求你做一轮工程数量级评估。",
    prompt: "估算 100 m² 太阳能板在晴天一天能提供多少电能。请说明太阳辐照、日照小时数、板效率和逆变损耗的假设，并把功率和能量分开。",
    target: "可取平均有效辐照约 0.5–1 kW/m²、有效日照 4–6 h、系统效率 15–25%，得到约 30–150 kWh/day 的量级，并明确这是天气相关的区间。",
    followUp: "如果面板倾角固定且冬天太阳高度降低，年平均产能应怎样修正？",
    followUpTarget: "不能只乘一个冬夏比例；应引入季节辐照、阴影、温度、倾角和可用小时的加权平均，给出区间而不是虚假精确值。",
    timeLimitSec: 360, followUpSec: 120, approach: "先写 P=面积×辐照×效率，再乘有效时间转成能量。每一步都带单位，最后与家庭或学校日用电量作合理性比较。", commonTrap: "把 kW 当成 kWh，或者只使用正午峰值辐照代表整天。",
  }),
  makeQuantitativeDrill({
    id: "qi-physics-05", subjectIds: ["physics"], title: "摆钟在山顶会变慢吗", discipline: "物理", pressure: "极限",
    setup: "一只简单摆钟从海平面带到高山，摆长和摆锤质量不变，温度先假设不变。",
    prompt: "判断摆钟周期如何变化，并估算海拔升高 3 km 时相对变化的数量级。请从重力变化或势场近似出发。",
    target: "T=2π√(L/g)，高处 g 略小所以周期变长；相对变化约为 ΔT/T≈h/R，3 km/6400 km 约 5×10^-4，需说明地球自转等修正被忽略。",
    followUp: "如果摆长因温度变化增加了 0.1%，这个效应和海拔效应谁更大？",
    followUpTarget: "用 ΔT/T≈(1/2)(ΔL/L−Δg/g) 比较两个一阶效应，温度导致的摆长变化约为海拔效应的两倍量级。",
    timeLimitSec: 420, followUpSec: 150, approach: "先辨认周期公式中的敏感变量，再做一阶相对变化，而不是直接计算一堆绝对数。", commonTrap: "把 g 随高度增加写成变大，或忽略平方根带来的 1/2 系数。",
  }),
  makeQuantitativeDrill({
    id: "qi-engineering-02", subjectIds: ["engineering"], title: "梁的长度与挠度", discipline: "工程", pressure: "极限",
    setup: "一根水平悬臂梁末端承受相同载荷，面试官连续改变梁长和厚度。",
    prompt: "不用查公式，判断梁长增加一倍时挠度为什么会大幅增加，并讨论把厚度增加一倍的效果。请建立尺度模型。",
    target: "悬臂梁末端挠度的尺度为 δ∝FL³/(EI)，长度一倍使挠度约变 8 倍；矩形截面惯性矩 I∝bt³，厚度一倍使挠度约降为 1/8。",
    followUp: "如果材料换成杨氏模量两倍的材料，是否等价于厚度增加一倍？",
    followUpTarget: "材料只给出 2 倍刚度，而厚度给出 8 倍截面惯性矩，不能等价；要用 E 与 I 的乘积比较。",
    timeLimitSec: 420, followUpSec: 150, approach: "先找出弯曲刚度 EI，再区分长度、材料和截面几何对结果的幂次影响。", commonTrap: "把挠度误认为只与载荷和长度成正比，或把厚度和宽度的影响混同。",
  }),
  makeQuantitativeDrill({
    id: "qi-engineering-03", subjectIds: ["engineering"], title: "水箱放空的时间", discipline: "工程", pressure: "高压",
    setup: "一个截面积恒定的大水箱底部有小孔，水面高度随时间下降。先忽略黏性细节。",
    prompt: "判断水箱从满到空的放水速度是否恒定，并推导放空时间与水箱面积、孔面积和初始高度的关系。",
    target: "由托里拆利定律 v∝√h，流量 Q=a√(2gh)，且 A dh/dt=-Q；积分得到 t∝(A/a)√(H/g)，不是简单的体积除以恒定流量。",
    followUp: "如果把水箱换成上宽下窄的锥形容器，临近放空时会更快还是更慢？",
    followUpTarget: "截面积 A(h) 随高度变化，需重新积分；若底部变窄，低水位时储水截面积小，水位下降可能更快。",
    timeLimitSec: 420, followUpSec: 150, approach: "先把速度、体积流量和液面下降速度区分开，再写微分关系。重点是识别 √h 让后半段越来越慢。", commonTrap: "把初始流速乘总时间当成平均流速，或把水面高度和水量线性等同。",
  }),
  makeQuantitativeDrill({
    id: "qi-engineering-04", subjectIds: ["engineering"], title: "桥梁的安全系数", discipline: "工程", pressure: "高压",
    setup: "一座简化桥梁承受车辆、行人和风载，设计师需要决定安全系数。",
    prompt: "如果预测最大静态载荷为 1.0 MN，材料屈服载荷为 2.5 MN，能否直接宣布安全？请列出至少三个需要加入模型的不确定性。",
    target: "名义安全系数为 2.5，但还需考虑疲劳、冲击/动态放大、材料和施工误差、腐蚀、极端风载、模型误差与失效后果，安全结论不能只看一个比值。",
    followUp: "如果载荷预测的标准差很大，安全系数应怎样表达才比一个固定数字更诚实？",
    followUpTarget: "采用分位数、可靠度或概率失效指标，把载荷和强度都视为分布，并说明目标失效概率。",
    timeLimitSec: 360, followUpSec: 120, approach: "先算名义比值，再主动寻找‘最坏情况’与‘不确定性分布’的区别。工程判断要把失效后果纳入。", commonTrap: "把屈服载荷当成唯一极限，或用安全系数掩盖没有验证过的载荷假设。",
  }),
  makeQuantitativeDrill({
    id: "qi-chemistry-02", subjectIds: ["chemistry"], title: "反应半衰期的陷阱", discipline: "化学", pressure: "高压",
    setup: "某反应物浓度从 1.00 mol/L 降到 0.50 mol/L 用时 10 分钟，再降到 0.25 mol/L 用时也是 10 分钟。",
    prompt: "判断这更像一级、零级还是二级反应，并说明仅凭两段数据还需要检查什么。",
    target: "恒定半衰期提示一级反应，一级反应 ln[A] 对 t 线性；但需更多时间点检查半对数图，并控制温度、混合和测量误差。",
    followUp: "如果第二个半衰期变成 20 分钟，哪种反应级数更值得考虑？",
    followUpTarget: "二级反应的半衰期与初始浓度成反比，浓度减半后半衰期加倍；应比较 1/[A] 与 t 的线性关系。",
    timeLimitSec: 300, followUpSec: 120, approach: "先比较时间间隔和浓度变化，再用线性化图像或速率方程验证，不要只凭‘看起来像’下结论。", commonTrap: "把半衰期固定等同于所有反应都是一级，或忽略温度和浓度测量的系统误差。",
  }),
  makeQuantitativeDrill({
    id: "qi-chemistry-03", subjectIds: ["chemistry"], title: "电解镀铜的质量", discipline: "化学", pressure: "高压",
    setup: "铜离子溶液中用电流给钢片镀铜，面试官给出电流、电解时间和铜的相对原子质量。",
    prompt: "说明如何从电流和时间估算析出铜的质量，并指出电流效率只有 80% 时怎样修正。",
    target: "先算电荷 Q=It，再用电子物质的量 Q/F；Cu²⁺每沉积 1 mol 需要 2 mol 电子，质量 m=MQ/(2F)，最后乘以 80% 电流效率。",
    followUp: "若阴极表面有气泡覆盖，实际镀层会出现什么问题？如何从数据判断？",
    followUpTarget: "有效面积下降会导致局部电流密度升高、镀层不均匀或副反应；可比较质量增量与理论值并观察电压/气体变化。",
    timeLimitSec: 360, followUpSec: 120, approach: "把宏观电流翻译成电子数，再用反应计量比转成铜的物质的量，最后检查效率和单位。", commonTrap: "忘记 Cu²⁺ 需要两个电子，或把电流效率当成多加 20% 而不是乘 0.8。",
  }),
  makeQuantitativeDrill({
    id: "qi-chemistry-04", subjectIds: ["chemistry"], title: "湿气体的真实体积", discipline: "化学", pressure: "中压",
    setup: "实验中在水上收集一瓶氢气，量得总压强和温度，水蒸气也占据一部分压力。",
    prompt: "如何从湿气体的总压强得到干燥氢气的物质的量？如果水温升高，误差方向是什么？",
    target: "用道尔顿分压定律 P_H2=P_total−P_H2O，再代入 n=PV/RT；温度改变会同时影响饱和蒸气压和气体体积，必须同步记录。",
    followUp: "若误把总压强全部当成氢气压强，计算的氢气物质的量偏高还是偏低？",
    followUpTarget: "把水蒸气也算成氢气会高估分压和物质的量，偏差随温度升高通常变大。",
    timeLimitSec: 300, followUpSec: 120, approach: "先问‘量到的压力属于谁’，再用分压扣除水蒸气，最后检查温度是否在 K、体积是否与气体状态匹配。", commonTrap: "直接使用总压强，或用摄氏温度代入理想气体方程。",
  }),
  makeQuantitativeDrill({
    id: "qi-biology-02", subjectIds: ["biology"], title: "酶的最适温度", discipline: "生物", pressure: "高压",
    setup: "一组实验测量不同温度下的酶反应速率，曲线先上升后突然下降。",
    prompt: "解释曲线的两个阶段，并设计一个实验区分‘酶变性’与‘底物耗尽’哪个是高温后速率下降的主要原因。",
    target: "低温到中温时分子碰撞和有效碰撞增加；高温导致蛋白结构改变、活性位点破坏。用新鲜底物/新鲜酶交叉恢复实验区分可逆底物耗尽和不可逆失活。",
    followUp: "如果高温处理后降低温度，速率没有恢复，你会如何修改结论？",
    followUpTarget: "支持不可逆变性，但仍需控制 pH、离子强度、时间和测量线性区间，排除其他失活因素。",
    timeLimitSec: 360, followUpSec: 120, approach: "先读曲线形状，再把机制假设转成可区分的对照实验，不要只背‘高温使酶变性’。", commonTrap: "把所有速率下降归因于变性，或没有设置重新加入底物和重新加入酶的对照。",
  }),
  makeQuantitativeDrill({
    id: "qi-biology-03", subjectIds: ["biology"], title: "种群增长的天花板", discipline: "生物", pressure: "高压",
    setup: "一个岛上的兔子种群起初增长很快，接近环境容纳量后增长变慢。",
    prompt: "用一个简单模型解释增长率为什么在中等种群数量时最大，并说明如何从数据估计环境容纳量。",
    target: "逻辑斯蒂模型 dN/dt=rN(1−N/K)，N 很小时个体少，N 接近 K 时资源限制强，中间约 N=K/2 时绝对增长率最大；可拟合增长率对 N 的关系估计 K。",
    followUp: "若一次干旱使环境容纳量突然下降，模型中的哪一项改变，种群会经历什么？",
    followUpTarget: "K 下降而 r 可暂时不变，原种群数量可能超过新 K，出现负增长；若资源结构改变，r 也可能随之变化。",
    timeLimitSec: 420, followUpSec: 150, approach: "区分相对增长率与绝对增长量，再把资源限制写进模型。图像和边界情况比直接背方程更重要。", commonTrap: "认为种群数量越多增长越快，或把 K 当成固定不受环境影响的自然常数。",
  }),
  makeQuantitativeDrill({
    id: "qi-biology-04", subjectIds: ["biology"], title: "氧气输送的瓶颈", discipline: "生物", pressure: "极限",
    setup: "运动员运动时心率、每搏输出量和血液含氧量都会变化，面试官要求你判断哪个环节限制供氧。",
    prompt: "建立一个估算全身每分钟氧输送量的模型，并说明为什么单纯提高心率不一定持续提高运动表现。",
    target: "氧输送 DO2=心输出量×动脉血氧含量，心输出量=心率×每搏量；还受血红蛋白、饱和度、静脉回流和组织提取率限制，心率过高会缩短充盈时间。",
    followUp: "如果血红蛋白浓度增加 10%，但心输出量下降 5%，氧输送量一定上升吗？",
    followUpTarget: "在饱和度等不变的近似下，乘积变化约为 1.10×0.95=1.045，仍上升约 4.5%；但需说明非线性和血液黏度等代价。",
    timeLimitSec: 420, followUpSec: 150, approach: "先把输送拆成‘泵送多少血’和‘每单位血带多少氧’，再考虑限制因素和乘法关系。", commonTrap: "只看心率或血红蛋白一个变量，忽略心输出量是心率与每搏量的乘积。",
  }),
  makeQuantitativeDrill({
    id: "qi-economics-02", subjectIds: ["economics"], title: "税率与税收收入", discipline: "经济学", pressure: "高压",
    setup: "政府考虑提高汽油税，税率提高后销量会下降，财政部门仍希望税收收入增加。",
    prompt: "用需求弹性判断税率提高何时能增加税收收入，并说明为什么不能只看税率变化。",
    target: "税收收入 T=t×Q(t)；若需求缺乏弹性，税率上升带来的单位税额增加超过销量下降，收入可能增加；需区分短期和长期弹性。",
    followUp: "如果消费者长期能改用电动车，短期税收预测还可以直接外推吗？",
    followUpTarget: "不能；替代品、投资和调整使长期需求更有弹性，应做动态情景而不是使用一个固定弹性。",
    timeLimitSec: 360, followUpSec: 120, approach: "先写收入是税率和税基的乘积，再讨论数量对价格的响应，最后加入时间维度和替代行为。", commonTrap: "税率提高就断言收入增加，或用短期销量变化预测多年后的税基。",
  }),
  makeQuantitativeDrill({
    id: "qi-economics-03", subjectIds: ["economics"], title: "最低工资与就业", discipline: "经济学", pressure: "极限",
    setup: "一座城市准备提高最低工资，新闻报道说这一定会减少就业，另一方说一定会增加收入。",
    prompt: "构造至少两个不同的劳动力市场模型，说明为什么两种结论都可能出现，并指出需要什么数据才能区分。",
    target: "竞争性市场中约束性最低工资可能造成供给过剩和就业下降；买方垄断中雇主压低工资，提高最低工资可能提高工资和就业。关键是判断市场结构和工资就业弹性。",
    followUp: "如果只有高技能工人工资上升，低技能工人没有变化，这能证明政策无效吗？",
    followUpTarget: "不能；需定义目标人群、反事实和溢出效应，可能存在替代、工时变化、价格传导或未就业者变化。",
    timeLimitSec: 420, followUpSec: 150, approach: "先拒绝单一结论，画出不同市场结构下的曲线，再把争论转成可检验的反事实问题。", commonTrap: "把一个模型的结论当作普遍规律，或只看平均工资不看就业、工时和分布。",
  }),
  makeQuantitativeDrill({
    id: "qi-economics-04", subjectIds: ["economics"], title: "复利、通胀与真实增长", discipline: "经济学", pressure: "中压",
    setup: "储蓄账户名义年利率 5%，同期通胀率 3%，银行按月复利。",
    prompt: "解释一年后的真实购买力大约增长多少，并比较‘名义利率减通胀率’与精确计算的差异。",
    target: "精确真实增长约为 (1.05/1.03)−1≈1.94%，简单相减给 2% 是一阶近似；若按月复利应使用有效年利率而不是直接加月利率。",
    followUp: "若通胀率突然变成 8%，储蓄者和借款者分别受到什么影响？",
    followUpTarget: "固定利率借款的实际负担可能下降，储蓄实际回报转负；但需考虑工资、重新定价、预期和债务期限。",
    timeLimitSec: 300, followUpSec: 120, approach: "先区分名义和实际，再用比值而不是简单相减做精确近似，最后检查复利周期。", commonTrap: "把 5%−3% 当成永远精确，或把月利率简单乘 12 忽略复利。",
  }),
  makeQuantitativeDrill({
    id: "qi-compsci-02", subjectIds: ["compsci"], title: "哈希表的碰撞", discipline: "计算机科学", pressure: "高压",
    setup: "一个哈希表有 n 个槽位，依次插入大量键，哈希函数假设均匀。",
    prompt: "解释为什么平均查找很快但不能保证 O(1)，并估算插入 n 个键后至少发生一次碰撞的概率为何会很快上升。",
    target: "开放寻址或链式哈希的平均复杂度可近似 O(1)，但最坏可能退化 O(n)；生日悖论说明碰撞概率在键数约 √n 时就显著。",
    followUp: "若攻击者能选择键，为什么随机化哈希或加盐有帮助？",
    followUpTarget: "防止攻击者预先构造大量碰撞，使最坏链长或探测长度受控；但随机化有实现和可复现性权衡。",
    timeLimitSec: 420, followUpSec: 150, approach: "把平均、最坏和概率保证分开，再用槽位占用和配对数解释碰撞为何不是线性直觉。", commonTrap: "把哈希表无条件写成 O(1)，或把 n 个槽位插入 n 个键等同于一定所有槽位都被占满。",
  }),
  makeQuantitativeDrill({
    id: "qi-compsci-03", subjectIds: ["compsci"], title: "网络重传的等待时间", discipline: "计算机科学", pressure: "高压",
    setup: "一个数据包每次发送成功率为 p，失败后等待固定时间再重传，忽略并发。",
    prompt: "推导首次成功前的期望发送次数和期望等待时间，并说明 p 很小时系统为什么会突然变得不可用。",
    target: "发送次数服从几何分布，期望为 1/p；若每次间隔为 τ，等待量级约为 (1/p−1)τ，p 降低时延迟和资源占用非线性上升。",
    followUp: "如果每次重传等待时间指数退避，期望等待还能简单写成 1/p 吗？",
    followUpTarget: "成功次数仍是几何分布，但每次失败的等待取决于失败轮次，需对各轮次概率加权，并考虑最大重传次数。",
    timeLimitSec: 360, followUpSec: 120, approach: "先数失败次数的期望，再把每次失败的成本乘进去。遇到退避时不要继续使用固定间隔假设。", commonTrap: "只算成功概率 p 而不计算失败次数，或把期望时间当成一次发送时间。",
  }),
  makeQuantitativeDrill({
    id: "qi-compsci-04", subjectIds: ["compsci"], title: "递归里的重复工作", discipline: "计算机科学", pressure: "极限",
    setup: "函数 f(n)=f(n−1)+f(n−2) 递归计算斐波那契数，面试官要求你分析它而不是直接运行。",
    prompt: "画出 n=5 的调用树，解释为什么朴素递归是指数级，并给出两种降低重复计算的方法及其空间代价。",
    target: "调用树重复计算相同子问题，时间约 O(φ^n) 或 O(2^n) 上界；记忆化把时间降到 O(n) 但需要 O(n) 空间，迭代滚动变量可降到 O(1) 额外空间。",
    followUp: "如果 n 非常大且结果只需要对一个模数取余，哪些性质可以帮助你进一步优化？",
    followUpTarget: "可用矩阵快速幂把递推提升到 O(log n)，并在每步取模防止数值膨胀；需说明矩阵状态和乘法复杂度。",
    timeLimitSec: 420, followUpSec: 150, approach: "先画小规模调用树看重复，再用缓存或自底向上顺序消除重复。优化必须同时说明时间和空间。", commonTrap: "只说‘用动态规划’而不解释状态，或把记忆化和 O(1) 滚动变量的空间复杂度混为一谈。",
  }),
];

export const QUANTITATIVE_INTERVIEW_DRILLS: QuantitativeInterviewDrill[] = [
  ...BASE_QUANTITATIVE_INTERVIEW_DRILLS,
  ...EXPANDED_QUANTITATIVE_INTERVIEW_DRILLS,
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
  const review = reviewQuantitativeResponse(drill, response, followUpResponse);
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
  const total = review.total;
  return {
    total,
    max: review.max,
    checks,
    defence,
    band: review.band,
    review,
  };
}
