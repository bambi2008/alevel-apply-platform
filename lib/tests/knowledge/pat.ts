// PAT 知识点讲解卡 —— 6 大考点的概念梳理与例题。原创内容，仅以官方考纲校准。
import type { TopicKnowledge } from "./esat";

export const PAT_KNOWLEDGE: TopicKnowledge[] = [
  {
    topicId: "pat-mech",
    overview: "力学是 PAT 的第一大板块，约占物理部分的四成。核心包括运动学（SUVAT）、牛顿定律与受力分析、动量与冲量、功能关系与功率、圆周运动与万有引力。PAT 无计算器，重在建立物理过程、先写符号式再代入。",
    concepts: [
      { name: "运动学 SUVAT", body: "匀加速直线运动的四个方程（$u$ 初速、$v$ 末速、$a$ 加速度、$s$ 位移、$t$ 时间）：\n$$v=u+at,\\quad s=ut+\\tfrac12at^2,\\quad v^2=u^2+2as,\\quad s=\\tfrac{u+v}{2}t$$\n**抛体运动**分解为水平（匀速）与竖直（匀加速 $g$）两个独立方向：水平 $x=u\\cos\\theta\\,t$，竖直 $y=u\\sin\\theta\\,t-\\tfrac12gt^2$。最大高度 $h=\\dfrac{u^2\\sin^2\\theta}{2g}$，射程 $R=\\dfrac{u^2\\sin2\\theta}{g}$。", keyPoints: ["竖直上抛最大高度 $h=\\dfrac{u^2}{2g}$，到顶时间 $t=\\dfrac{u}{g}$", "射程在 $\\theta=45^\\circ$ 时最大，$R_{max}=\\dfrac{u^2}{g}$", "选对方程的诀窍：列出已知量，缺哪个量就用不含它的那条"] },
      { name: "牛顿定律与受力", body: "牛顿第二定律 $F_{net}=ma$。重力 $W=mg$。斜面上分量：沿面下滑分量 $mg\\sin\\theta$，垂直压力 $mg\\cos\\theta$，摩擦 $f=\\mu N=\\mu mg\\cos\\theta$。\n**连接体（Atwood 机）**：两质量 $m_1>m_2$ 过滑轮，$a=\\dfrac{(m_1-m_2)g}{m_1+m_2}$，绳张力 $T=\\dfrac{2m_1m_2 g}{m_1+m_2}$。", keyPoints: ["先画受力图，选定正方向再列方程", "斜面无摩擦加速度 $a=g\\sin\\theta$", "系统法：整体求加速度，隔离法：单体求内力/张力"] },
      { name: "动量与冲量", body: "动量 $p=mv$，冲量 $J=Ft=\\Delta p$。**动量守恒**（合外力为零）：$m_1u_1+m_2u_2=m_1v_1+m_2v_2$。\n**完全非弹性碰撞**（粘在一起）：$v=\\dfrac{m_1u_1+m_2u_2}{m_1+m_2}$，动能有损失。\n**弹性碰撞**：动量与动能都守恒；等质量正碰会「交换速度」。", keyPoints: ["碰撞问题永远先用动量守恒", "「粘在一起」= 完全非弹性，共同速度", "等质量弹性正碰：入射球停下、被撞球以原速前进"] },
      { name: "功、能与功率", body: "功 $W=Fd\\cos\\theta$，动能 $E_k=\\tfrac12mv^2$，重力势能 $E_p=mgh$，弹性势能 $\\tfrac12kx^2$。\n**能量守恒**是解题主线：无摩擦时 $E_k+E_p=$ 常数。功率 $P=\\dfrac{W}{t}=Fv$。", keyPoints: ["能量法常比逐段用力学方程更快", "自由下落 $h$ 后速度 $v=\\sqrt{2gh}$（由 $mgh=\\tfrac12mv^2$）", "功率两式：$P=W/t$（平均）与 $P=Fv$（瞬时）"] },
      { name: "圆周运动与引力", body: "向心加速度 $a=\\dfrac{v^2}{r}=\\omega^2r$，向心力 $F=\\dfrac{mv^2}{r}$。**竖直圆环**：顶端最小速度 $v_{top}=\\sqrt{gr}$，底端要完成整圈 $v_{bottom}=\\sqrt{5gr}$。\n**万有引力** $F=\\dfrac{GMm}{r^2}$，地表 $g=\\dfrac{GM}{R^2}$。圆轨道速度 $v=\\sqrt{\\dfrac{GM}{r}}$，逃逸速度 $v_{esc}=\\sqrt{\\dfrac{2GM}{r}}=\\sqrt{2gr}$。开普勒第三定律 $T^2\\propto r^3$。", keyPoints: ["向心力不是新的力，而是合力提供的", "竖直圆环顶端：重力提供向心力 $mg=\\dfrac{mv^2}{r}$", "$T^2\\propto r^3$：轨道半径 4 倍 → 周期 8 倍"] },
    ],
    workedExamples: [
      { title: "竖直上抛最大高度", question: "一小球以 $30\\,\\text{m/s}$ 竖直上抛（$g=10$），求最大高度。", solution: "到顶时末速为零，用 $v^2=u^2-2gh$：$0=30^2-2\\cdot10\\cdot h\\Rightarrow h=\\dfrac{900}{20}=45\\,$m。", tip: "最大高度直接套 $h=\\dfrac{u^2}{2g}$ 更快。" },
      { title: "完成竖直圆环", question: "物体在半径 $2\\,\\text{m}$ 的竖直圆环内侧运动（$g=10$），求底端最小速度。", solution: "顶端最小条件 $v_{top}=\\sqrt{gr}$；由底到顶用能量守恒 $\\tfrac12v_b^2=\\tfrac12v_{top}^2+g(2r)$，化简得 $v_b=\\sqrt{5gr}=\\sqrt{5\\cdot10\\cdot2}=10\\,$m/s。", tip: "记住结论 $v_{bottom}=\\sqrt{5gr}$。" },
    ],
  },
  {
    topicId: "pat-em",
    overview: "电磁学涵盖直流电路、电功率、电场与电容、电磁感应。PAT 常把欧姆定律、串并联、分压器与功率结合成多步题；估算题会要求量级答案。",
    concepts: [
      { name: "欧姆定律与电阻网络", body: "$V=IR$。**串联** $R=R_1+R_2+\\cdots$（电流相同）；**并联** $\\dfrac1R=\\dfrac1{R_1}+\\dfrac1{R_2}+\\cdots$（电压相同），两个并联 $R=\\dfrac{R_1R_2}{R_1+R_2}$。\n**分压器**：串联的 $R_1,R_2$ 上，$V_2=V_{in}\\dfrac{R_2}{R_1+R_2}$。", keyPoints: ["$n$ 个相同电阻 $R$ 并联 = $R/n$", "对称网络（如电阻立方体）用对称性简化：对角电阻 $=\\tfrac56R$", "分压器输出与被测支路电阻成正比"] },
      { name: "电功率与电荷", body: "电功率三式：$P=VI=I^2R=\\dfrac{V^2}{R}$。选哪条看已知量。电荷 $Q=It$，能量 $E=VIt=Pt$。", keyPoints: ["已知电流选 $I^2R$，已知电压选 $V^2/R$", "1 度电 = 1 kWh；焦耳与瓦特·秒等价", "串联电阻功率与阻值成正比，并联则成反比"] },
      { name: "电场与电容", body: "库仑力 $F=\\dfrac{kq_1q_2}{r^2}$（$k=9\\times10^9$）。点电荷电场 $E=\\dfrac{kQ}{r^2}$；匀强场 $E=\\dfrac{V}{d}$。\n**电容** $Q=CV$，储能 $E=\\tfrac12CV^2=\\tfrac12QV=\\dfrac{Q^2}{2C}$。电容串并联规律与电阻**相反**：并联相加，串联取倒数和。", keyPoints: ["库仑力与距离平方成反比", "电容器储能三式可互换", "电容并联相加、串联倒数和（与电阻相反）"] },
      { name: "电磁感应", body: "法拉第定律：感应电动势 $\\varepsilon=-\\dfrac{d\\Phi}{dt}$，磁通 $\\Phi=BA\\cos\\theta$。楞次定律：感应电流方向总是**反抗**磁通变化。动生电动势 $\\varepsilon=BLv$。", keyPoints: ["电动势正比于磁通「变化率」，不是磁通本身", "楞次定律体现能量守恒", "导体棒切割磁感线：$\\varepsilon=BLv$"] },
    ],
    workedExamples: [
      { title: "并联电阻", question: "$3\\,\\Omega$ 与 $6\\,\\Omega$ 并联，求总电阻。", solution: "$R=\\dfrac{3\\times6}{3+6}=\\dfrac{18}{9}=2\\,\\Omega$。", tip: "并联结果总小于最小的那个电阻。" },
      { title: "电容储能", question: "$2\\,\\text{F}$ 电容充到 $4\\,\\text{V}$，储能多少？", solution: "$E=\\tfrac12CV^2=\\tfrac12\\cdot2\\cdot4^2=16\\,$J。", tip: "电压翻倍，储能变四倍。" },
    ],
  },
  {
    topicId: "pat-wave",
    overview: "波动与光学包括波的基本关系、折射与全反射、透镜成像、干涉衍射。PAT 偏爱把几何光学与波动条纹结合的推导题。",
    concepts: [
      { name: "波的基本量", body: "波速、频率、波长关系 $v=f\\lambda$，周期 $T=\\dfrac1f$。横波（振动垂直传播方向，如光）与纵波（平行，如声）。波的能量正比于振幅平方。", keyPoints: ["$v=f\\lambda$ 是所有波的通用关系", "同一介质中 $v$ 固定，$f$ 由波源决定，$\\lambda$ 随之确定", "进入新介质频率不变，波长改变"] },
      { name: "折射与全反射", body: "斯涅尔定律 $n_1\\sin\\theta_1=n_2\\sin\\theta_2$。折射率 $n=\\dfrac{c}{v}$。从光密到光疏（$n_1>n_2$）存在**临界角** $\\sin\\theta_c=\\dfrac{n_2}{n_1}$，大于临界角发生全反射（光纤原理）。", keyPoints: ["从光疏进光密（$n$ 变大）折射角变小，偏向法线", "临界角只在光密→光疏时存在", "全反射：入射角 $>\\theta_c$"] },
      { name: "透镜成像", body: "薄透镜公式 $\\dfrac1f=\\dfrac1u+\\dfrac1v$，放大率 $m=\\dfrac{v}{u}$。凸透镜 $f>0$：物在焦外成倒立实像，焦内成正立虚像（放大镜）。", keyPoints: ["实像 $v>0$，虚像 $v<0$（符号约定）", "物在 $2f$ 处成等大倒立实像", "$v=\\dfrac{fu}{u-f}$（由公式解出）"] },
      { name: "干涉与衍射", body: "**双缝干涉**条纹间距 $w=\\dfrac{\\lambda D}{d}$（$D$ 缝屏距，$d$ 缝间距）。**衍射光栅** $d\\sin\\theta=n\\lambda$（$n$ 为级次）。相长干涉：光程差 $=n\\lambda$；相消：$=(n+\\tfrac12)\\lambda$。", keyPoints: ["条纹间距与波长、缝屏距成正比，与缝间距成反比", "光栅缝越密（$d$ 越小），同级衍射角越大", "白光经光栅/棱镜色散：红光偏折小、紫光偏折大"] },
    ],
    workedExamples: [
      { title: "临界角", question: "介质折射率 $\\tfrac32$，射向空气，求临界角正弦。", solution: "$\\sin\\theta_c=\\dfrac1n=\\dfrac{1}{3/2}=\\dfrac23$。", tip: "临界角公式对空气取 $n_2=1$。" },
      { title: "凸透镜成像", question: "物距 $15\\,\\text{cm}$，焦距 $10\\,\\text{cm}$，求像距。", solution: "$\\dfrac1v=\\dfrac1f-\\dfrac1u=\\dfrac1{10}-\\dfrac1{15}=\\dfrac{1}{30}\\Rightarrow v=30\\,$cm。", tip: "物在焦外（$u>f$）得实像 $v>0$。" },
    ],
  },
  {
    topicId: "pat-thermo",
    overview: "热力学考理想气体定律、热量与比热、气体动理论初步。多为代入推导，注意温度必须用开尔文（K）。",
    concepts: [
      { name: "理想气体定律", body: "$PV=nRT$（$T$ 用 K）。特例：**玻意耳** $P_1V_1=P_2V_2$（等温）；**查理** $\\dfrac{V_1}{T_1}=\\dfrac{V_2}{T_2}$（等压）；**盖-吕萨克** $\\dfrac{P_1}{T_1}=\\dfrac{P_2}{T_2}$（等容）。综合 $\\dfrac{P_1V_1}{T_1}=\\dfrac{P_2V_2}{T_2}$。", keyPoints: ["温度一律换成开尔文：$T_K=T_C+273$", "等温压缩体积减小、压强增大", "综合气体定律一步到位求任一未知量"] },
      { name: "热量与比热", body: "升温所需热量 $Q=mc\\Delta T$（$c$ 比热容）。相变（熔化/汽化）时温度不变，$Q=mL$（$L$ 潜热）。", keyPoints: ["相变过程温度恒定，热量用潜热公式", "加热曲线的水平段 = 正在相变", "比热大的物质升温慢（如水）"] },
      { name: "气体动理论", body: "分子平均平动动能 $\\bar{E}_k=\\tfrac32kT$，与温度成正比。均方根速率 $v_{rms}=\\sqrt{\\dfrac{3kT}{m}}$。压强源于分子对器壁的碰撞。", keyPoints: ["温度是分子平均动能的量度", "$v_{rms}\\propto\\sqrt{T}$：温度 4 倍，速率 2 倍", "同温下轻分子跑得快"] },
    ],
    workedExamples: [
      { title: "查理定律", question: "等压下 $V_1=2$、$T_1=300\\,\\text{K}$，升温到 $600\\,\\text{K}$，求体积。", solution: "$\\dfrac{V_1}{T_1}=\\dfrac{V_2}{T_2}\\Rightarrow V_2=\\dfrac{2\\times600}{300}=4$。", tip: "等压时体积与绝对温度成正比。" },
      { title: "加热", question: "$2\\,\\text{kg}$ 物质，$c=500\\,\\text{J/kg·K}$，升温 $4\\,\\text{K}$，需多少热量？", solution: "$Q=mc\\Delta T=2\\cdot500\\cdot4=4000\\,$J。", tip: "注意区分升温（$mc\\Delta T$）与相变（$mL$）。" },
    ],
  },
  {
    topicId: "pat-modern",
    overview: "现代物理考光电效应、波粒二象性、放射性衰变与核反应、质能关系。多为公式代入，注意量级（$10^{-19}$、$10^{-34}$ 等）。",
    concepts: [
      { name: "光电效应", body: "光子能量 $E=hf=\\dfrac{hc}{\\lambda}$。爱因斯坦方程：$KE_{max}=hf-\\phi$（$\\phi$ 逸出功）。存在**截止频率** $f_0=\\dfrac{\\phi}{h}$，低于它无论光多强都不发射电子。", keyPoints: ["光电子最大动能只由频率决定，与光强无关", "光强只影响电子数目（电流大小）", "低于截止频率 → 无光电效应"] },
      { name: "波粒二象性", body: "德布罗意波长 $\\lambda=\\dfrac{h}{p}=\\dfrac{h}{mv}$。任何运动粒子都有波动性，动量越大波长越短。电子衍射是其实验证据。", keyPoints: ["$\\lambda=h/p$：动量越大波长越短", "宏观物体波长极小，观察不到波动性", "$h=6.6\\times10^{-34}\\,$J·s"] },
      { name: "放射性与半衰期", body: "衰变规律 $N=N_0\\left(\\tfrac12\\right)^{t/T_{1/2}}$。经过 $n$ 个半衰期剩余 $\\left(\\tfrac12\\right)^n$。活度 $A=\\lambda N$。三种射线：$\\alpha$（$^4_2\\text{He}$）、$\\beta$（电子）、$\\gamma$（光子）。", keyPoints: ["每过一个半衰期，数量减半", "剩余 $\\tfrac1{2^n}$ ⟺ 经过 $n$ 个半衰期", "$\\alpha$ 穿透力弱、电离强；$\\gamma$ 相反"] },
      { name: "核反应与质能", body: "核反应中**质量数 $A$ 与电荷数 $Z$ 分别守恒**，用来求未知粒子。质能关系 $E=mc^2$，质量亏损 $\\Delta m$ 释放能量 $\\Delta m\\,c^2$。", keyPoints: ["配平核方程：上标（$A$）和下标（$Z$）两边各自相等", "质量亏损转化为结合能", "$c=3\\times10^8\\,$m/s"] },
    ],
    workedExamples: [
      { title: "光电效应", question: "光子能量 $5\\times10^{-19}\\,\\text{J}$，逸出功 $2\\times10^{-19}\\,\\text{J}$，求最大光电子动能。", solution: "$KE_{max}=hf-\\phi=(5-2)\\times10^{-19}=3\\times10^{-19}\\,$J。", tip: "若 $hf<\\phi$ 则无光电子发射。" },
      { title: "半衰期", question: "样品衰变到初始的 $\\tfrac1{32}$，经过几个半衰期？", solution: "$\\left(\\tfrac12\\right)^n=\\tfrac1{32}=\\left(\\tfrac12\\right)^5\\Rightarrow n=5$。", tip: "把剩余分数写成 $2$ 的幂即可读出 $n$。" },
    ],
  },
  {
    topicId: "pat-math",
    overview: "数学工具是 PAT 的另一半，考微积分、向量、三角与对数在物理情境中的应用。工具要熟到「不假思索」，才能把精力留给物理。",
    concepts: [
      { name: "微积分在物理中", body: "位置、速度、加速度的关系：$v=\\dfrac{ds}{dt}$，$a=\\dfrac{dv}{dt}=\\dfrac{d^2s}{dt^2}$。反过来位移是速度的积分 $s=\\int v\\,dt$。力做的功 $W=\\int F\\,dx$（变力时）。", keyPoints: ["求速度对位移求一阶导，求加速度求二阶导", "匀变速下 $s$-$t$ 图是抛物线，$v$-$t$ 图是直线", "变力做功 = 力-位移图下的面积 = $\\int F\\,dx$"] },
      { name: "向量", body: "向量 $a\\mathbf{i}+b\\mathbf{j}$ 模长 $|\\mathbf{v}|=\\sqrt{a^2+b^2}$。点积 $\\mathbf{a}\\cdot\\mathbf{b}=a_1b_1+a_2b_2=|\\mathbf{a}||\\mathbf{b}|\\cos\\theta$，可求夹角 $\\cos\\theta=\\dfrac{\\mathbf{a}\\cdot\\mathbf{b}}{|\\mathbf{a}||\\mathbf{b}|}$。点积为零 ⟺ 垂直。", keyPoints: ["力、速度、动量都是向量，要分量处理", "点积 $=0$ 表示两向量垂直", "合矢量用平行四边形/分量法"] },
      { name: "三角与近似", body: "常用值 $\\sin30^\\circ=\\tfrac12$、$\\sin45^\\circ=\\tfrac{\\sqrt2}{2}$、$\\sin60^\\circ=\\tfrac{\\sqrt3}{2}$。小角近似（弧度）：$\\sin\\theta\\approx\\theta$，$\\cos\\theta\\approx1-\\tfrac{\\theta^2}{2}$，$\\tan\\theta\\approx\\theta$。恒等式 $\\sin^2\\theta+\\cos^2\\theta=1$。", keyPoints: ["斜面、抛体常用 $\\sin/\\cos$ 分解", "单摆、小振动用小角近似", "3-4-5、5-12-13 直角三角形能省算三角函数"] },
      { name: "对数与指数", body: "指数衰减/增长 $N=N_0e^{kt}$（$k<0$ 衰减）。取对数线性化：$\\ln N=\\ln N_0+kt$，用于放射性、RC 电路、冷却等。指数法则与换底公式同 A-Level。", keyPoints: ["衰减过程取 $\\ln$ 变直线，斜率即衰变常数", "半衰期 $T_{1/2}=\\dfrac{\\ln2}{|k|}$", "$e\\approx2.718$，$\\ln2\\approx0.693$"] },
    ],
    workedExamples: [
      { title: "由位置求速度", question: "$s(t)=t^3-3t$，求 $t=2$ 时的速度。", solution: "$v=\\dfrac{ds}{dt}=3t^2-3$；代入 $t=2$：$v=3\\cdot4-3=9$。", tip: "速度是位置的一阶导数。" },
      { title: "向量模长", question: "求向量 $3\\mathbf{i}+4\\mathbf{j}$ 的模长。", solution: "$|\\mathbf{v}|=\\sqrt{3^2+4^2}=\\sqrt{25}=5$。", tip: "记住 3-4-5 直角三角形。" },
    ],
  },
];
