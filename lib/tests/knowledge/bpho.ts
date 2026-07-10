// BPhO 知识卡 —— 力学 / 振动与波 / 电磁 / 热学 / 现代与估算。原创，按 Round 1 真题主题分布校准。
import type { TopicKnowledge } from "./esat";

export const BPHO_KNOWLEDGE: TopicKnowledge[] = [
  {
    topicId: "bpho-mechanics",
    overview: "力学是 BPhO Round 1 的半壁江山：Section 1 中约一半小问、Section 2 常有整道大题。涵盖四个训练主题：①运动学与动力学 ②圆周运动与引力 ③能量·动量·碰撞 ④转动力学。BPhO 不设固定考纲——考的是把 A-Level 核心原理用在陌生情境里的能力，常需多步推理与（超 A-Level 的）微积分。",
    concepts: [
      { name: "多步运动学与 a = v dv/dx", body: "BPhO 很少一步套公式。常见套路：\\n- **分段运动**（先加速后匀速/先上后下）：对每段列式，用衔接条件连起来，常反解出总时间/总长\\n- **等时间隔**：匀加速中相邻等时位移差恒为 $a\\\\tau^2$\\n- **链式法则**：$a = \\\\dfrac{dv}{dt} = v\\\\dfrac{dv}{dx}$ —— 已知 $v(x)$ 求加速度的钥匙（如 $v=k\\\\sqrt{x}\\\\Rightarrow a=k^2/2$ 恒定）", keyPoints: ["分段列式+衔接条件", "相邻等时位移差 = aτ²", "v(x) 型问题用 a = v dv/dx"] },
      { name: "圆周与引力：三件套", body: "1) **向心方程**：找出「谁提供向心力」（张力/摩擦/重力/引力），令其 $=\\\\dfrac{mv^2}{r}$\\n2) **轨道能量**：圆轨道 $E_k=\\\\dfrac{GMm}{2r}$，$E_p=-2E_k$，$E=-E_k$（记住这组关系，能秒杀一批题）\\n3) **开普勒/角动量**：$T^2\\\\propto r^3$；中心力 → 角动量守恒 → 近日点快远日点慢（$v_1r_1=v_2r_2$）\\n常用替换 $GM=g_0R^2$ 免记 $G$。", keyPoints: ["先认「向心力由谁提供」", "E = −E_k（圆轨道）", "GM = g₀R² 代换"] },
      { name: "碰撞与「相对速度」技巧", body: "弹性碰撞与其硬解联立方程，不如记住结论：**碰前后相对速度反转**（$u_1-u_2 = -(v_1-v_2)$）。由此秒得等质量交换速度、轻碰重反弹、重碰轻打出 $2u$。完全非弹性损失动能占比 $\\\\dfrac{M}{m+M}$。**叠球下落**（篮球+网球）用两次「相对速度反转」推出小球以 $3v$ 弹起、升高 $9h$——BPhO 最爱的惊奇结论。", keyPoints: ["弹性碰撞=相对速度反转", "粘连损失占比 M/(m+M)", "叠球 3v → 9h"] },
      { name: "转动：能量法优先", body: "BPhO 会直接给转动惯量公式（如棒 $\\\\tfrac13M\\\\ell^2$、盘 $\\\\tfrac12MR^2$、球 $\\\\tfrac25MR^2$）。多数题用**能量守恒**最快：倒下的棒 $Mg\\\\tfrac{\\\\ell}{2}=\\\\tfrac12I\\\\omega^2$；滚动 $mgh=\\\\tfrac12mv^2(1+k)$（$I=kmr^2$，k 越小滚得越快）。角动量守恒管「收臂变快」类；剪断支撑瞬间用力矩法（棒端加速度可达 $\\\\tfrac32g>g$！）。", keyPoints: ["能量法优先，公式题面会给", "滚动竞速：k 小者胜", "剪断瞬间用力矩，别用旧平衡"] },
    ],
    workedExamples: [
      { title: "卫星佯谬", question: "稀薄大气阻力作用于圆轨道卫星，卫星最终变快还是变慢？", solution: "阻力使总能量 $E=-\\\\dfrac{GMm}{2r}$ 减小 → $r$ 减小 → $v=\\\\sqrt{GM/r}$ **增大**。势能释放的一半补给动能、一半被阻力耗散。阻力反而使卫星加速——检验你是否真的理解轨道能量关系。", tip: "E=−E_k：总能少多少，动能就多多少。" },
      { title: "叠球 9h", question: "网球叠在篮球上从高 h 落下，网球反弹多高（全弹性、篮球远重于网球）？", solution: "触地时均为 $v=\\\\sqrt{2gh}$。篮球弹回 $+v$；在篮球参考系中网球以 $2v$ 接近、反转后 $2v$ 离开，回地面系 $3v$。$h'=(3v)^2/2g=9h$。", tip: "两次「相对速度反转」，别硬解方程。" },
      { title: "a = v dv/dx", question: "质点速度 $v=k\\\\sqrt{x}$，求加速度。", solution: "$a=v\\\\dfrac{dv}{dx}=k\\\\sqrt{x}\\\\cdot\\\\dfrac{k}{2\\\\sqrt{x}}=\\\\dfrac{k^2}{2}$，恒定！（对照 $v^2=2ax$ 即 $v\\\\propto\\\\sqrt{x}$ 正是匀加速的特征。）", tip: "见 v(x) 就想链式法则。" },
    ],
  },
  {
    topicId: "bpho-waves",
    overview: "振动与波在 Section 1 稳定出现：SHM 能量与周期、波动方程读参、驻波谐频、多普勒、干涉、折射与全反射。BPhO 的考法是给出略陌生的表达式或组合情境，考你是否真的理解每个公式里量的含义。",
    concepts: [
      { name: "SHM：比例关系反应快", body: "$T=2\\\\pi\\\\sqrt{m/k}$、$T=2\\\\pi\\\\sqrt{\\\\ell/g}$ —— 考的常是**比例**：弹簧串联 $k/2$ 并联 $2k$ → 周期比 2；摆长 +21% → 周期 +10%；上月球 $g/6$ → 周期 ×√6。能量：$E_p\\\\propto x^2$，故 $x=A/2$ 处动能占 $3/4$；$v_{\\\\max}=A\\\\omega$。", keyPoints: ["先看比例再算数", "x=A/2 → KE 占 3/4", "串联变软并联变硬"] },
      { name: "读波动方程", body: "$y=A\\\\cos(\\\\omega t \\\\pm kx)$：对照读出 $\\\\omega$、$k$，则 $v=\\\\omega/k$、$\\\\lambda=2\\\\pi/k$、$f=\\\\omega/2\\\\pi$。相位差 $=\\\\dfrac{2\\\\pi}{\\\\lambda}\\\\Delta x$（间隔 λ/4 → π/2）。真题就考过直接从表达式读波速。", keyPoints: ["v=ω/k 一步到位", "相位差=2πΔx/λ", "±号定传播方向"] },
      { name: "驻波·多普勒·干涉", body: "两端固定弦：$f_n=\\\\dfrac{nv}{2L}$。多普勒（声源靠近）：$f'=f\\\\dfrac{v}{v-v_s}$——分母是「被追赶的波」。拍频 $=|f_1-f_2|$。双缝条纹间距 $w=\\\\dfrac{\\\\lambda D}{d}$。全反射 $\\\\sin C=1/n$。", keyPoints: ["谐频=基频整数倍", "靠近→分母减→变高", "w=λD/d"] },
    ],
    workedExamples: [
      { title: "从表达式读波速", question: "$y=(2\\\\,\\\\mathrm{mm})\\\\cos(600t-2.0x)$，求波速。", solution: "$\\\\omega=600$，$k=2.0$，$v=\\\\omega/k=300\\\\ \\\\mathrm{m\\\\,s^{-1}}$。负号表示沿 +x 传播。", tip: "别被表达式吓住，就是读系数。" },
      { title: "弹簧组合周期", question: "同一质量分别挂在两根相同弹簧的串联组合与并联组合上，周期之比？", solution: "串联等效 $k/2$、并联 $2k$；$T\\\\propto1/\\\\sqrt{k}$，比值 $=\\\\sqrt{2k/(k/2)}=2$。", tip: "弹簧组合先算等效 k。" },
    ],
  },
  {
    topicId: "bpho-em",
    overview: "电与磁在 Round 1 常考：含内阻电路、RC 充放电（Section 2 曾整题考「漏电电容」模型）、场与力、电磁感应、变压器。微分方程会以「写出方程并直接读出时间常数」的方式出现——不要求积分，但要求理解方程结构。",
    concepts: [
      { name: "电路：内阻与最大功率", body: "$\\\\varepsilon=I(R+r)$；「丢失伏特」$\\\\varepsilon-V=Ir$ 是求内阻最快路径。负载功率 $P=\\\\dfrac{\\\\varepsilon^2R}{(R+r)^2}$ 在 $R=r$ 时最大，$P_{\\\\max}=\\\\dfrac{\\\\varepsilon^2}{4r}$（此时一半能量耗在内阻上）。电阻丝拉长 n 倍（体积不变）→ 电阻 $n^2$ 倍。", keyPoints: ["先算丢失伏特", "R=r 最大功率", "拉长 n 倍电阻 n² 倍"] },
      { name: "RC 电路：读方程不积分", body: "KVL 给 $\\\\varepsilon=R\\\\dfrac{dQ}{dt}+\\\\dfrac{Q}{C}$。三个「免积分」读法：\\n- 时间常数 $\\\\tau=RC$（对照标准形式）\\n- $t=0$：$Q=0\\\\Rightarrow I_0=\\\\varepsilon/R$\\n- 稳态：$dQ/dt=0\\\\Rightarrow Q_{\\\\max}=\\\\varepsilon C$\\n半衰时间 $t_{1/2}=\\\\tau\\\\ln2$；到 2/3 满用 $\\\\tau\\\\ln3$。能量分账：充电全程电阻恰耗散 $\\\\tfrac12C\\\\varepsilon^2$，与 R 无关。", keyPoints: ["τ=RC 直接读", "初值/稳态看方程两端", "电阻耗散恒为存能的一倍"] },
      { name: "场与感应", body: "点电荷叠加注意**方向**：异号中点场强相加（$8kQ/d^2$）不是零。磁场圆周 $r=\\\\dfrac{mv}{qB}$；速度选择器 $v=E/B$。感应 $\\\\varepsilon=B\\\\ell v$；理想变压器功率守恒 $V_pI_p=V_sI_s$。同向电流相吸。", keyPoints: ["先画方向再叠加", "r=mv/qB", "变压器=功率守恒"] },
    ],
    workedExamples: [
      { title: "漏电电容永不触发", question: "RC 定时器中电容并联漏电阻 r，何时永远到不了 ⅔ε 的触发电压？", solution: "稳态时 R、r 分压，电容电压上限 $\\\\dfrac{r}{R+r}\\\\varepsilon$。要求它 < ⅔ε 即 $r<2R$ 时永不触发；临界 $r=2R$。", tip: "渐近值由分压决定，与时间常数无关。" },
      { title: "充电能量分账", question: "证明充电全程电阻耗散能量与 R 无关。", solution: "电源做功 $Q_{\\\\max}\\\\varepsilon=C\\\\varepsilon^2$；电容储能 $\\\\tfrac12C\\\\varepsilon^2$；差额 $\\\\tfrac12C\\\\varepsilon^2$ 必耗散于 R。R 只影响快慢，不影响分账。", tip: "能量守恒比积分 I²R 快得多。" },
    ],
  },
  {
    topicId: "bpho-thermal",
    overview: "热学考点：理想气体定律（含气泡上浮这类隐藏压强变化）、比热混合、潜热、热传导、卡诺效率、r.m.s. 速率、热膨胀、Stefan 定律。数值题多、单位陷阱多（温度必须用开尔文）。",
    concepts: [
      { name: "理想气体与隐藏条件", body: "$pV=nRT$。BPhO 爱把压强藏起来：湖底气泡 $p=p_0+\\\\rho gh$（30 m 深 ≈ 4 atm → 体积 ×4）；「等温」「绝热」「等容」决定哪个量不变。$C_p-C_V=R$；单原子 $U=\\\\tfrac32nRT$。r.m.s.：$v\\\\propto\\\\sqrt{T/M}$（同温 H₂:O₂ = 4:1）。", keyPoints: ["气泡=压强题", "先判哪个量不变", "v_rms ∝ √(T/M)"] },
      { name: "热量收支", body: "混合：热得=热失（同物质就是质量加权平均温度）。潜热优先级：先融冰/汽化再变温。传导 $P=\\\\dfrac{kA\\\\Delta T}{d}$。卡诺 $\\\\eta=1-\\\\dfrac{T_c}{T_h}$——**开尔文**！Stefan $P\\\\propto T^4$（翻倍 → ×16）。", keyPoints: ["列热量收支表", "潜热别忘", "卡诺用 K 不用 ℃"] },
    ],
    workedExamples: [
      { title: "湖底气泡", question: "30 m 深湖底释放的气泡升到水面，体积变为几倍（温度不变，ρg≈10⁴ Pa/m）？", solution: "湖底压强 $=10^5+3\\\\times10^5=4\\\\times10^5$ Pa。等温 $V\\\\propto1/p$ → ×4。", tip: "每 10 m 水深 ≈ 1 个大气压。" },
      { title: "瀑布温升", question: "水落下 420 m 全部转为内能，升温多少？", solution: "$gh=c\\\\Delta T$：$\\\\Delta T=\\\\dfrac{10\\\\times420}{4200}=1.0$ K。质量消掉——每 420 m 约 1 K。", tip: "焦耳当年真在瀑布边测过。" },
    ],
  },
  {
    topicId: "bpho-modern",
    overview: "现代物理与估算：光电效应、德布罗意、能级、半衰期与活度、质能与结合能、狭义相对论入门（γ、时延、长度收缩）、以及 BPhO 标志性的**数量级估算**（费米问题）。估算题没有唯一答案，考的是合理假设+量级正确。",
    concepts: [
      { name: "量子三板斧", body: "光电 $KE_{\\\\max}=hf-\\\\phi$（eV 算最快）。德布罗意 $\\\\lambda=h/mv$（电子 10⁶ m/s → ~7×10⁻¹⁰ m，原子尺度 → 晶体衍射）。氢能级 $E_n=-13.6/n^2$ eV：$2\\\\to1$ 放出 10.2 eV。光子动量 $p=h/\\\\lambda=E/c$。", keyPoints: ["用 eV 别换焦耳", "λ=h/mv 记数量级", "2→1 = 10.2 eV"] },
      { name: "核与相对论", body: "$N=N_0(1/2)^{t/T}$：剩 1/8 → 3 个半衰期。活度 $A=\\\\lambda N=\\\\dfrac{\\\\ln2}{T_{1/2}}N$。质能 $1\\\\,\\\\mathrm{u}=931.5\\\\,\\\\mathrm{MeV}/c^2$；1 g ↔ 9×10¹³ J。$\\\\gamma=(1-v^2/c^2)^{-1/2}$：0.6c → 1.25；μ 子靠时延/长度收缩到达地面。", keyPoints: ["数半衰期个数", "u→MeV 乘 931.5", "0.6c → γ=1.25"] },
      { name: "数量级估算（BPhO 招牌）", body: "套路：拆成可估的因子 → 每个取 1 位有效数字 → 只保量级。心跳一生 ~70×60×24×365×80≈3×10⁹；大气总质量 $p_0\\\\cdot4\\\\pi R^2/g\\\\approx5\\\\times10^{18}$ kg；一杯水分子 ~10²⁵。练到「敢写下第一个数」。", keyPoints: ["拆因子、一位有效数字", "答案只看量级", "常识常数要背几个"] },
    ],
    workedExamples: [
      { title: "大气总质量", question: "由地面气压估算地球大气总质量。", solution: "气压=单位面积上方空气柱重量：$M=\\\\dfrac{p_0\\\\cdot4\\\\pi R^2}{g}=\\\\dfrac{10^5\\\\times4\\\\pi(6.4\\\\times10^6)^2}{10}\\\\approx5\\\\times10^{18}$ kg。", tip: "气压的本质就是「头顶空气有多重」。" },
      { title: "μ 子到达地面", question: "γ=5 的 μ 子在实验室系穿过 100 m 大气，在其本征系中这段距离是多少？", solution: "长度收缩 $L=L_0/\\\\gamma=20$ m。μ 子看来大气变薄了，所以来得及在衰变前到达地面——同一事实在地面系解释为时间膨胀。", tip: "两个参考系、两种说法、同一结论。" },
    ],
  },
];
