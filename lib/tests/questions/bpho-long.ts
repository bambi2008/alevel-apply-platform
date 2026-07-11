// BPhO Round 1 Section 2 —— 长主题题打样（跳伞：自由落体、空气阻力、终端速度、能量）。
// 原创；结构对标官方 Section 2（25 分、多小问、各部分独立可做）。
// 长推导题不自动判分：作者提供完整解答，学生自评。数值部分已用 sympy 核对。
import type { LongQuestion } from "./types";

export const BPHO_LONG_SAMPLE: LongQuestion[] = [
  {
    id: "bpho-s2-mech-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-mechanics",
    difficulty: 3,
    totalMarks: 25,
    context:
      "本题研究跳伞员从悬停直升机跳下的运动。跳伞员（连装备）总质量 $m = 80\\ \\mathrm{kg}$。全程取 $g = 10\\ \\mathrm{m\\,s^{-2}}$。空气阻力大小可用 $F = kv^2$ 建模，其中 $v$ 为速度，$k$ 为常数（开伞前后 $k$ 值不同）。各小问相互独立：即使前一问未完成，也应尝试后面的部分。",
    parts: [
      {
        label: "a",
        marks: 3,
        question:
          "先忽略空气阻力。跳伞员从静止下落。求下落 $3.0$ 秒后的速度，以及此时下落的距离。",
        solutionOutline:
          "$v = gt = 30\\ \\mathrm{m\\,s^{-1}}$；$s = \\tfrac12 g t^2 = 45\\ \\mathrm{m}$。",
      },
      {
        label: "b",
        marks: 4,
        question:
          "现考虑空气阻力 $F = kv^2$。写出跳伞员下落时的运动方程（牛顿第二定律），并由此推导终端速度 $v_{\\mathrm{T}}$ 的表达式（用 $m$、$g$、$k$ 表示）。",
        solutionOutline:
          "$m\\dfrac{dv}{dt} = mg - kv^2$。终端速度时 $\\dfrac{dv}{dt}=0$：$mg = kv_{\\mathrm{T}}^2$，故 $v_{\\mathrm{T}} = \\sqrt{\\dfrac{mg}{k}}$。",
      },
      {
        label: "c",
        marks: 4,
        question:
          "开伞前，跳伞员的终端速度为 $50\\ \\mathrm{m\\,s^{-1}}$。求此阶段的 $k$ 值（含单位），并计算当跳伞员速度为 $25\\ \\mathrm{m\\,s^{-1}}$ 时的瞬时加速度。",
        solutionOutline:
          "$k = \\dfrac{mg}{v_{\\mathrm{T}}^2} = \\dfrac{80\\times10}{2500} = 0.32\\ \\mathrm{kg\\,m^{-1}}$。在 $v=25$：$a = g - \\dfrac{k v^2}{m} = 10 - \\dfrac{0.32\\times625}{80} = 10 - 2.5 = 7.5\\ \\mathrm{m\\,s^{-2}}$。（在半终端速度处，阻力恰为重力的四分之一。）",
      },
      {
        label: "d",
        marks: 5,
        question:
          "跳伞员在达到 $50\\ \\mathrm{m\\,s^{-1}}$ 的终端速度后打开降落伞，$k$ 值立即增大为原来的 $25$ 倍。(i) 求开伞瞬间跳伞员的加速度（大小与方向）。(ii) 求开伞后新的终端速度。(iii) 简要解释为什么跳伞员此后会减速趋近新的终端速度，而不是在新终端速度处突然停止减速。",
        solutionOutline:
          "(i) 开伞瞬间 $v=50$，阻力 $=25k v^2 = 25\\times0.32\\times2500 = 20000\\ \\mathrm{N}$，重力 $=800\\ \\mathrm{N}$。净力 $=19200\\ \\mathrm{N}$ 向上，$a = 240\\ \\mathrm{m\\,s^{-2}}$，方向向上（剧烈减速——这正是开伞冲击）。(ii) $v_{\\mathrm{T}}' = \\sqrt{\\dfrac{mg}{25k}} = \\dfrac{50}{5} = 10\\ \\mathrm{m\\,s^{-1}}$。(iii) 随 $v$ 减小阻力按 $v^2$ 下降，净力与减速度随之减小，$v$ 以渐近方式趋向 $v_{\\mathrm{T}}'$：越接近终端速度，减速越慢，故为平滑逼近而非突然停止。",
      },
      {
        label: "e",
        marks: 5,
        question:
          "跳伞员从 $2000\\ \\mathrm{m}$ 高度跳下，落地时速度为 $10\\ \\mathrm{m\\,s^{-1}}$。(i) 计算全程损失的机械能。(ii) 说明这些能量到哪里去了。",
        solutionOutline:
          "(i) $\\Delta E = mgh - \\tfrac12 m v^2 = 80\\times10\\times2000 - \\tfrac12\\times80\\times100 = 1.6\\times10^6 - 4\\times10^3 = 1.596\\times10^6\\ \\mathrm{J} \\approx 1.6\\ \\mathrm{MJ}$。(ii) 由空气阻力做负功转化为空气与跳伞员/伞面的内能（发热）以及空气的宏观动能（扰动、声）。",
      },
      {
        label: "f",
        marks: 4,
        question:
          "画出整个下落过程（从跳出到落地前瞬间）的速度—时间草图。标出：初始近似直线段、第一次趋近 $50\\ \\mathrm{m\\,s^{-1}}$ 的渐近段、开伞后的骤减段、以及趋近 $10\\ \\mathrm{m\\,s^{-1}}$ 的第二个渐近段。",
        solutionOutline:
          "曲线从原点以斜率 $g$ 出发，斜率随速度增大而减小，渐近趋向 $50\\ \\mathrm{m\\,s^{-1}}$（水平渐近线）；开伞时刻曲线急剧下折（斜率为很大的负值），随后斜率的绝对值渐减，从上方渐近趋向 $10\\ \\mathrm{m\\,s^{-1}}$ 的第二条水平渐近线。两个渐近段都不应画成折线或触碰渐近线。",
      },
    ],
    fullSolution:
      "**a)** 无阻力：$v=gt=10\\times3=30\\ \\mathrm{m\\,s^{-1}}$；$s=\\tfrac12gt^2=\\tfrac12\\times10\\times9=45\\ \\mathrm{m}$。\\n\\n**b)** 取向下为正，牛顿第二定律：$m\\dfrac{dv}{dt}=mg-kv^2$。终端速度处加速度为零：$mg=kv_{\\mathrm{T}}^2\\Rightarrow v_{\\mathrm{T}}=\\sqrt{mg/k}$。\\n\\n**c)** $k=\\dfrac{mg}{v_{\\mathrm{T}}^2}=\\dfrac{800}{2500}=0.32\\ \\mathrm{kg\\,m^{-1}}$（单位由 $[F]=[k][v]^2$ 得 $\\mathrm{N\\,s^2\\,m^{-2}}=\\mathrm{kg\\,m^{-1}}$）。$v=25$ 时：阻力 $=0.32\\times625=200\\ \\mathrm{N}$，$a=\\dfrac{800-200}{80}=7.5\\ \\mathrm{m\\,s^{-2}}$。\\n\\n**d)** (i) 开伞瞬间速度仍为 $50$：新阻力 $=25\\times0.32\\times2500=2.0\\times10^4\\ \\mathrm{N}$，远大于重力 $800\\ \\mathrm{N}$；净力 $1.92\\times10^4\\ \\mathrm{N}$ 向上，$a=1.92\\times10^4/80=240\\ \\mathrm{m\\,s^{-2}}$（约 $24g$，方向向上）。(ii) $v_{\\mathrm{T}}'=\\sqrt{\\dfrac{mg}{25k}}=\\dfrac{1}{5}\\sqrt{\\dfrac{mg}{k}}=\\dfrac{50}{5}=10\\ \\mathrm{m\\,s^{-1}}$。(iii) 减速使 $v$ 下降，阻力 $\\propto v^2$ 随之下降，净向上的力减小，故减速度不断变小；当 $v\\to v_{\\mathrm{T}}'$ 时净力 $\\to0$，速度以渐近方式逼近 $10\\ \\mathrm{m\\,s^{-1}}$，不会出现突然的转折。\\n\\n**e)** (i) $\\Delta E=mgh-\\tfrac12mv^2=1.6\\times10^6-4.0\\times10^3\\approx1.596\\times10^6\\ \\mathrm{J}\\approx1.6\\ \\mathrm{MJ}$。(ii) 空气阻力做负功：能量转化为空气与身体/伞面的内能（温度略升）及空气被搅动的动能与声能。\\n\\n**f)** 见解答要点：两段渐近曲线 + 开伞骤降，关键是渐近线处斜率趋零、曲线不触线。\\n\\n---\\n*说明：本题为原创长题，对标 BPhO Round 1 Section 2 的风格（一个物理情境、多小问递进、各部分独立）。长推导不设自动判分，请对照解答自评；数值均已程序核对。*",
  },
  {
    id: "bpho-s2-grav-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-mechanics",
    difficulty: 3,
    totalMarks: 25,
    context:
      "本题研究把一颗质量 $m = 500\\ \\mathrm{kg}$ 的卫星部署到圆轨道的能量问题。地球半径 $R = 6.4\\times10^{6}\\ \\mathrm{m}$，表面重力场强度 $g_0 = 10\\ \\mathrm{N\\,kg^{-1}}$。可使用 $GM = g_0R^2$。忽略大气阻力与地球自转。各小问相互独立。",
    parts: [
      { label: "a", marks: 4, question: "证明：在半径 $r$ 的圆轨道上，卫星的轨道速度为 $v = R\\sqrt{g_0/r}$，并计算 $r = 2R$ 时的数值。",
        solutionOutline: "$\\dfrac{GMm}{r^2} = \\dfrac{mv^2}{r} \\Rightarrow v = \\sqrt{GM/r} = \\sqrt{g_0R^2/r} = R\\sqrt{g_0/r}$。$r=2R$：$v = R\\sqrt{g_0/2R} = \\sqrt{g_0R/2} = \\sqrt{3.2\\times10^7} \\approx 5.7\\times10^3\\ \\mathrm{m\\,s^{-1}}$。" },
      { label: "b", marks: 4, question: "写出卫星在半径 $r$ 圆轨道上的动能、引力势能（取无穷远为零）与总机械能的表达式，并说明三者之间的两条简洁关系。",
        solutionOutline: "$E_k = \\dfrac{GMm}{2r}$，$E_p = -\\dfrac{GMm}{r}$，$E = -\\dfrac{GMm}{2r}$。关系：$E_p = -2E_k$；$E = -E_k$（总能为负、大小等于动能）。" },
      { label: "c", marks: 5, question: "计算把卫星从地面（静止）送入 $r=2R$ 圆轨道所需的最小能量（发射能）。",
        solutionOutline: "初：$E_i = -\\dfrac{GMm}{R}$（地面静止）。末：$E_f = -\\dfrac{GMm}{4R}$。$\\Delta E = \\dfrac{GMm}{R}\\left(1 - \\dfrac14\\right) = \\dfrac{3g_0Rm}{4} = \\dfrac{3\\times10\\times6.4\\times10^6\\times500}{4} = 2.4\\times10^{10}\\ \\mathrm{J}$。" },
      { label: "d", marks: 5, question: "卫星在 $r=2R$ 轨道上受到极稀薄大气的微小阻力。有人认为阻力会让卫星变慢。请说明实际发生的情况：卫星的轨道半径、速度与总能量分别如何变化？这看似矛盾的现象如何解释？",
        solutionOutline: "阻力做负功，总能量 $E=-\\dfrac{GMm}{2r}$ 减小 → $r$ 减小 → 但 $v = \\sqrt{GM/r}$ 反而增大（下降过程中引力做的正功超过阻力损耗）。「卫星佯谬」：阻力最终使卫星加速。能量账：势能减少的一半变成动能增加，另一半被阻力耗散。" },
      { label: "e", marks: 4, question: "若改为把卫星送到无穷远（完全逃离地球），从地面发射所需的最小速度是多少？给出表达式并计算数值。",
        solutionOutline: "$\\tfrac12mv_e^2 = \\dfrac{GMm}{R} \\Rightarrow v_e = \\sqrt{2g_0R} = \\sqrt{2\\times10\\times6.4\\times10^6} \\approx 1.13\\times10^4\\ \\mathrm{m\\,s^{-1}}$（约 $11.3\\ \\mathrm{km\\,s^{-1}}$）。" },
      { label: "f", marks: 3, question: "解释为什么发射场通常建在低纬度并向东发射（本题其余部分忽略了这一点）。",
        solutionOutline: "地球自转在赤道处提供最大的向东表面速度（约 $465\\ \\mathrm{m\\,s^{-1}}$），向东发射可「白拿」这部分速度，降低所需燃料；纬度越低此加成越大。" },
    ],
    fullSolution:
      "**a)** 引力提供向心力：$\\dfrac{GMm}{r^2}=\\dfrac{mv^2}{r}$，$v=\\sqrt{GM/r}=R\\sqrt{g_0/r}$。$r=2R$：$v=\\sqrt{g_0R/2}=\\sqrt{10\\times6.4\\times10^6/2}\\approx5.66\\times10^3\\ \\mathrm{m\\,s^{-1}}$。\\n\\n**b)** $E_k=\\tfrac12mv^2=\\dfrac{GMm}{2r}$；$E_p=-\\dfrac{GMm}{r}$；$E=E_k+E_p=-\\dfrac{GMm}{2r}$。故 $E_p=-2E_k$、$E=-E_k$。\\n\\n**c)** $\\Delta E=E_f-E_i=-\\dfrac{GMm}{4R}+\\dfrac{GMm}{R}=\\dfrac{3GMm}{4R}=\\dfrac34 g_0Rm=\\dfrac34\\times10\\times6.4\\times10^6\\times500=2.4\\times10^{10}\\ \\mathrm{J}$。\\n\\n**d)** 阻力耗能 → $E$ 减小 → 轨道半径 $r$ 缓慢减小（螺旋下降）→ 轨道速度 $v=\\sqrt{GM/r}$ **增大**。佯谬的解释：下降中引力做正功大于阻力做的负功，净效果是动能上升；用 b) 的关系看，$E$ 每减少 $\\delta$，$E_k$ 恰好增加 $\\delta$。\\n\\n**e)** 能量守恒到无穷远（动能恰好用尽）：$v_e=\\sqrt{2GM/R}=\\sqrt{2g_0R}\\approx1.13\\times10^4\\ \\mathrm{m\\,s^{-1}}$。\\n\\n**f)** 低纬度+向东：借地球自转的切向速度（赤道最大），等效提高初速度、节省燃料。\\n\\n---\\n*原创长题，对标 BPhO Round 1 Section 2。数值已程序核对；请对照解答自评。*",
  },
  {
    id: "bpho-s2-mom-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-mechanics",
    difficulty: 3,
    totalMarks: 25,
    context:
      "本题研究一维碰撞的能量与动量。取 $g = 10\\ \\mathrm{m\\,s^{-2}}$。除特别说明外忽略摩擦与空气阻力。各小问相互独立。",
    parts: [
      { label: "a", marks: 4, question: "质量 $m$ 的球以速度 $u$ 与静止的质量 $M$ 的球发生一维弹性碰撞。从动量守恒与动能守恒出发，推导碰后两球速度 $v_1 = \\dfrac{m-M}{m+M}u$ 与 $v_2 = \\dfrac{2m}{m+M}u$。",
        solutionOutline: "联立 $mu = mv_1 + Mv_2$ 与 $\\tfrac12mu^2 = \\tfrac12mv_1^2 + \\tfrac12Mv_2^2$。技巧：能量式除以动量式得 $u + v_1 = v_2$（弹性碰撞的相对速度反转），回代即得两式。" },
      { label: "b", marks: 4, question: "讨论 a) 结果的三个极限：$M = m$、$M \\gg m$、$M \\ll m$，各给出碰后图像并举一个日常/物理实例。",
        solutionOutline: "$M=m$：交换速度（台球正碰）。$M\\gg m$：轻球以近 $-u$ 反弹、重球几乎不动（球撞墙）。$M\\ll m$：重球速度几乎不变，轻球以近 $2u$ 飞出（保龄球撞乒乓球；行星引力弹弓的启发式图像）。" },
      { label: "c", marks: 5, question: "「双球叠放下落」：把小球（质量 $m$）叠在大球（质量 $M \\gg m$）正上方，从高度 $h$ 一起自由落下。大球先与地面弹性碰撞反弹，随即与仍在下落的小球弹性碰撞。利用 b) 的极限结果，证明小球反弹后上升的高度约为 $9h$。",
        solutionOutline: "落地时两球速率均为 $v=\\sqrt{2gh}$。大球弹性反弹后以 $v$ 向上，与以 $v$ 向下的小球相遇：在大球参考系中小球以 $2v$ 下落，弹性反弹后以 $2v$ 向上（相对大球），回到地面系为 $2v + v = 3v$ 向上。上升高度 $= \\dfrac{(3v)^2}{2g} = 9\\dfrac{v^2}{2g} = 9h$。" },
      { label: "d", marks: 4, question: "在 c) 中，若把「弹性」改为大球与地面碰撞的恢复系数 $e = 0.5$（其余仍弹性），小球能达到的高度变为多少（用 $h$ 表示）？",
        solutionOutline: "大球反弹速度 $ev = 0.5v$。相对速度 $=v + 0.5v = 1.5v$，反转后小球对地速度 $= 1.5v + 0.5v = 2v$。高度 $= \\dfrac{(2v)^2}{2g} = 4h$。" },
      { label: "e", marks: 5, question: "一颗质量 $10\\ \\mathrm{g}$ 的子弹以 $500\\ \\mathrm{m\\,s^{-1}}$ 水平射入静止在光滑水平面上、质量 $2.49\\ \\mathrm{kg}$ 的木块并嵌入。求：(i) 共同速度；(ii) 损失的动能及其占初动能的比例；(iii) 说明为什么「动量守恒」而「动能不守恒」在这里并不矛盾。",
        solutionOutline: "(i) $v = \\dfrac{0.01\\times500}{2.50} = 2.0\\ \\mathrm{m\\,s^{-1}}$。(ii) $E_i = 1250\\ \\mathrm{J}$，$E_f = \\tfrac12\\times2.5\\times4 = 5\\ \\mathrm{J}$，损失 $1245\\ \\mathrm{J}$，占 $99.6\\%$（$=M/(m+M)$）。(iii) 动量守恒只要求合外力为零；动能可以转化为内能（形变、发热）——嵌入过程中内力做负功耗散能量，但内力成对出现不改变总动量。" },
      { label: "f", marks: 3, question: "画出 e) 过程中系统总动量与总动能随时间的示意图（碰撞前、碰撞中、碰撞后三个阶段）。",
        solutionOutline: "总动量：全程水平直线（守恒）。总动能：碰撞前水平，碰撞的极短时间内迅速下降到 $E_f$，之后再保持水平；下降部分即耗散为内能的 $1245\\ \\mathrm{J}$。" },
    ],
    fullSolution:
      "**a)** 动量：$mu=mv_1+Mv_2$；动能：$mu^2=mv_1^2+Mv_2^2$。改写为 $m(u-v_1)=Mv_2$ 与 $m(u^2-v_1^2)=Mv_2^2$，相除得 $u+v_1=v_2$。回代解得 $v_1=\\dfrac{m-M}{m+M}u$、$v_2=\\dfrac{2m}{m+M}u$。\\n\\n**b)** $M=m$：$v_1=0,v_2=u$（交换速度，台球）。$M\\gg m$：$v_1\\to-u$、$v_2\\to0$（球撞墙反弹）。$M\\ll m$：$v_1\\to u$、$v_2\\to2u$（重物几乎不减速，轻物被打出双倍速度）。\\n\\n**c)** 触地时 $v=\\sqrt{2gh}$。大球弹回 $+v$；小球仍 $-v$。在大球系中小球以 $2v$ 接近，弹性反转后以 $2v$ 远离，即对地 $2v+v=3v$ 向上。$h' = (3v)^2/2g = 9h$。（这就是「篮球+网球」演示网球飞得极高的原理。）\\n\\n**d)** 大球反弹 $0.5v$；相对接近速度 $1.5v$，反转后小球对地 $=0.5v+1.5v=2v$，$h'=4h$。\\n\\n**e)** (i) $2.0\\ \\mathrm{m\\,s^{-1}}$。(ii) 损失 $1245\\ \\mathrm{J}$，占 $\\dfrac{M}{m+M}=\\dfrac{2.49}{2.50}=99.6\\%$。(iii) 动量由外力决定（此处合外力≈0 → 守恒）；动能可被内力耗散为内能，两条定律的适用条件不同，不矛盾。\\n\\n**f)** 动量水平线；动能台阶式骤降后水平。\\n\\n---\\n*原创长题；数值已程序核对；请对照解答自评。*",
  },
  {
    id: "bpho-s2-em-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-em",
    difficulty: 3,
    totalMarks: 25,
    context:
      "本题研究用 RC 电路制作简易定时器。电源电动势 $\\varepsilon = 9.0\\ \\mathrm{V}$（内阻可忽略），电容 $C = 2000\\ \\mu\\mathrm{F}$，电阻 $R$ 可选。开关闭合后电容器经 $R$ 充电；电容电压达到 $6.0\\ \\mathrm{V}$ 时触发蜂鸣器。可能用到 $\\ln 3 \\approx 1.10$。各小问相互独立。",
    parts: [
      { label: "a", marks: 4, question: "对充电回路应用基尔霍夫电压定律，写出以电容器电荷 $Q(t)$ 表示的微分方程，并直接读出时间常数 $\\tau$ 的表达式。",
        solutionOutline: "$\\varepsilon = IR + \\dfrac{Q}{C}$，且 $I = \\dfrac{dQ}{dt}$：$\\varepsilon = R\\dfrac{dQ}{dt} + \\dfrac{Q}{C}$。与标准一阶方程对照得 $\\tau = RC$。" },
      { label: "b", marks: 4, question: "由 a) 的方程说明：$t=0$ 时充电电流为 $\\varepsilon/R$；$t\\to\\infty$ 时电荷趋于 $Q_{\\max} = \\varepsilon C$。画出电容电压随时间的曲线草图，标出 $\\varepsilon$ 与 $\\tau$ 的位置。",
        solutionOutline: "$t=0$：$Q=0$，方程给 $I_0=\\varepsilon/R$。稳态：$dQ/dt=0 \\Rightarrow Q_{\\max}=\\varepsilon C$。曲线由 0 出发、初始斜率 $\\varepsilon/\\tau$、渐近趋向 $\\varepsilon$；$t=\\tau$ 处约达 $63\\%$。" },
      { label: "c", marks: 5, question: "充电电压满足 $V(t) = \\varepsilon\\left(1-e^{-t/RC}\\right)$。求触发蜂鸣器（$V = 6.0\\ \\mathrm{V} = \\tfrac23\\varepsilon$）所需的时间，用 $RC$ 表示；若要定时 $22$ 秒，求所需的 $R$。",
        solutionOutline: "$\\tfrac23 = 1-e^{-t/RC} \\Rightarrow e^{-t/RC} = \\tfrac13 \\Rightarrow t = RC\\ln3$。$R = \\dfrac{t}{C\\ln3} = \\dfrac{22}{2\\times10^{-3}\\times1.10} = 1.0\\times10^{4}\\ \\Omega = 10\\ \\mathrm{k\\Omega}$。" },
      { label: "d", marks: 4, question: "计算充满电（$Q = Q_{\\max}$）时电容器储存的能量；并证明：不论 $R$ 多大，充电全过程中电阻上耗散的总能量恰好等于电容器最终储存的能量。",
        solutionOutline: "$E_C = \\tfrac12C\\varepsilon^2 = \\tfrac12\\times2\\times10^{-3}\\times81 = 8.1\\times10^{-2}\\ \\mathrm{J}$。电源做功 $= Q_{\\max}\\varepsilon = C\\varepsilon^2$，电容存 $\\tfrac12C\\varepsilon^2$，差额 $\\tfrac12C\\varepsilon^2$ 必在 $R$ 上耗散——与 $R$ 无关（$R$ 只改变充电快慢，不改变能量分账）。" },
      { label: "e", marks: 4, question: "实际使用中发现定时总是比计算值偏长。检查发现电容器有漏电，可等效为与 $C$ 并联的大电阻 $r$。定性解释漏电为什么使触发时间变长，且若 $r$ 不够大，蜂鸣器可能永远不触发。给出「恰好永不触发」的临界条件（用 $\\varepsilon$、$R$、$r$ 表示）。",
        solutionOutline: "漏电流分走充电电流，电容电压上升变慢 → 变长。稳态时 $R$、$r$ 构成分压，电容电压最高只能到 $\\dfrac{r}{R+r}\\varepsilon$。若 $\\dfrac{r}{R+r}\\varepsilon < 6.0\\ \\mathrm{V}$（即 $\\dfrac{r}{R+r} < \\dfrac23$，$r < 2R$），永不触发；临界条件 $r = 2R$。" },
      { label: "f", marks: 4, question: "若把定时改为「断电报警」：电容先充满到 $\\varepsilon$，断开电源后经 $R' = 5.0\\ \\mathrm{k\\Omega}$ 放电，电压降到 $3.0\\ \\mathrm{V}$ 时报警。求报警延时。",
        solutionOutline: "放电 $V = \\varepsilon e^{-t/R'C}$；$3.0 = 9.0e^{-t/R'C} \\Rightarrow t = R'C\\ln3 = 5000\\times2\\times10^{-3}\\times1.10 = 11\\ \\mathrm{s}$。" },
    ],
    fullSolution:
      "**a)** 回路电压：$\\varepsilon = R\\dfrac{dQ}{dt} + \\dfrac{Q}{C}$；标准形式 $\\dfrac{dQ}{dt} + \\dfrac{Q}{RC} = \\dfrac{\\varepsilon}{R}$，时间常数 $\\tau = RC = 10^4\\times2\\times10^{-3} = 20\\ \\mathrm{s}$（取 c) 的 $R$）。\\n\\n**b)** $t=0,Q=0 \\Rightarrow I_0=\\varepsilon/R$；稳态 $dQ/dt=0 \\Rightarrow Q_{\\max}=\\varepsilon C$。$V\\text{-}t$ 曲线：指数趋近 $\\varepsilon$，$t=\\tau$ 处达 $\\varepsilon(1-1/e)\\approx0.63\\varepsilon$。\\n\\n**c)** $t = RC\\ln3$；$R = \\dfrac{22}{2\\times10^{-3}\\times1.10} = 1.0\\times10^4\\ \\Omega$。\\n\\n**d)** $E_C = \\tfrac12C\\varepsilon^2 = 0.081\\ \\mathrm{J}$。电源总做功 $C\\varepsilon^2$；能量守恒 → 电阻耗散 $= C\\varepsilon^2 - \\tfrac12C\\varepsilon^2 = \\tfrac12C\\varepsilon^2$，与 $R$ 无关。（也可由 $\\int I^2R\\,dt$ 直接积分证明。）\\n\\n**e)** 稳态分压：$V_{\\max} = \\dfrac{r}{R+r}\\varepsilon$。触发需 $V_{\\max} \\ge \\tfrac23\\varepsilon \\Rightarrow r \\ge 2R$；临界 $r = 2R$。漏电还使有效时间常数变为 $\\dfrac{Rr}{R+r}C < RC$，但渐近值降低是「永不触发」的根源。\\n\\n**f)** $t = R'C\\ln3 = 11\\ \\mathrm{s}$。\\n\\n---\\n*原创长题；与官方 2024 卷同为「RC 电路」主题但情境、结构、数据完全不同；数值已程序核对；请对照解答自评。*",
  },
  {
    id: "bpho-s2-wave-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-waves",
    difficulty: 3,
    totalMarks: 25,
    context:
      "本题研究竖直弹簧振子的简谐运动与能量。质量 $m = 0.20\\ \\mathrm{kg}$ 挂在劲度系数 $k = 80\\ \\mathrm{N\\,m^{-1}}$ 的轻弹簧下，在竖直方向做简谐振动，振幅 $A = 0.10\\ \\mathrm{m}$。各小问相互独立。",
    parts: [
      { label: "a", marks: 3, question: "求角频率 $\\omega$ 与振动周期 $T$。说明为什么周期与重力加速度 $g$ 无关。",
        solutionOutline: "$\\omega=\\sqrt{k/m}=\\sqrt{80/0.20}=20\\ \\mathrm{rad\\,s^{-1}}$；$T=2\\pi/\\omega=0.10\\pi\\approx0.314\\ \\mathrm{s}$。重力只把平衡位置下移 $mg/k$，不改变回复力对位移的比例，故 $T$ 与 $g$ 无关。" },
      { label: "b", marks: 4, question: "求振子的最大速度与最大加速度，并指出它们各自出现在振动的什么位置。",
        solutionOutline: "$v_{\\max}=A\\omega=0.10\\times20=2.0\\ \\mathrm{m\\,s^{-1}}$（在平衡位置）；$a_{\\max}=A\\omega^2=0.10\\times400=40\\ \\mathrm{m\\,s^{-2}}$（在两端最大位移处）。" },
      { label: "c", marks: 4, question: "求振子的总机械能。当位移为 $x = A/2$ 时，动能是多少？此时的速率是多少？",
        solutionOutline: "$E=\\tfrac12kA^2=\\tfrac12\\times80\\times0.01=0.40\\ \\mathrm{J}$。势能 $\\propto x^2$：$x=A/2$ 时 $E_p=\\tfrac14E$，故 $E_k=\\tfrac34E=0.30\\ \\mathrm{J}$，速率 $v=\\sqrt{2E_k/m}=\\sqrt{3}\\approx1.73\\ \\mathrm{m\\,s^{-1}}$。" },
      { label: "d", marks: 5, question: "画出一个完整周期内动能与势能随时间变化的草图（画在同一张图上）。它们的变化频率与振子的振动频率有什么关系？",
        solutionOutline: "$E_k$ 与 $E_p$ 都以两倍于位移的频率振荡（$\\cos^2/\\sin^2$ 含 $2\\omega$），二者反相、之和恒为 $E$。位移每完成一个周期，能量曲线完成两个周期。" },
      { label: "e", marks: 5, question: "实际振子受到轻微阻尼，每振动一个周期振幅衰减为原来的 $0.90$ 倍。求一个周期后剩余的机械能占初始能量的比例；并估算大约经过多少个周期后能量降到初始值的一半以下。",
        solutionOutline: "$E\\propto A^2$，一周期后 $E'/E=0.90^2=0.81$。$0.81^n<0.5\\Rightarrow n>\\dfrac{\\ln0.5}{\\ln0.81}\\approx3.3$，故约 $4$ 个周期后能量降到一半以下。" },
      { label: "f", marks: 4, question: "若把这个弹簧竖直剪成两段等长的弹簧，用其中一段挂同一质量，振动周期变为原来的多少倍？（提示：弹簧越短越硬）",
        solutionOutline: "半段弹簧劲度加倍（$k'=2k$）。$T\\propto1/\\sqrt{k}$，故 $T'=T/\\sqrt2\\approx0.71T$。" },
    ],
    fullSolution:
      "**a)** $\\omega=\\sqrt{k/m}=20\\ \\mathrm{rad\\,s^{-1}}$，$T=2\\pi/\\omega\\approx0.314\\ \\mathrm{s}$；重力仅平移平衡点。\\n\\n**b)** $v_{\\max}=A\\omega=2.0\\ \\mathrm{m\\,s^{-1}}$（平衡位置）；$a_{\\max}=A\\omega^2=40\\ \\mathrm{m\\,s^{-2}}$（端点）。\\n\\n**c)** $E=\\tfrac12kA^2=0.40\\ \\mathrm{J}$；$x=A/2$ 时 $E_k=\\tfrac34E=0.30\\ \\mathrm{J}$，$v=\\sqrt3\\approx1.73\\ \\mathrm{m\\,s^{-1}}$。\\n\\n**d)** $E_k,E_p$ 以 $2\\omega$ 振荡、反相、和为常数 $E$。\\n\\n**e)** 一周期 $E'/E=0.81$；$n\\approx\\ln0.5/\\ln0.81\\approx3.3$，约 4 个周期。\\n\\n**f)** 半段 $k'=2k$，$T'=T/\\sqrt2\\approx0.71T$。\\n\\n---\\n*原创长题；数值已程序核对；请对照解答自评。*",
  },
  {
    id: "bpho-s2-wave-002",
    type: "long",
    testId: "bpho",
    topicId: "bpho-waves",
    difficulty: 3,
    totalMarks: 25,
    context:
      "本题研究两端固定弦上的驻波。一根弦长 $L = 0.50\\ \\mathrm{m}$，线密度 $\\mu = 0.010\\ \\mathrm{kg\\,m^{-1}}$，张力 $T = 100\\ \\mathrm{N}$。横波速度为 $v = \\sqrt{T/\\mu}$。各小问相互独立。",
    parts: [
      { label: "a", marks: 3, question: "求弦上横波的速度。",
        solutionOutline: "$v=\\sqrt{T/\\mu}=\\sqrt{100/0.010}=\\sqrt{10000}=100\\ \\mathrm{m\\,s^{-1}}$。" },
      { label: "b", marks: 4, question: "求基频（第一谐波）的频率，并画出此时弦的振动形状（标出波节与波腹）。",
        solutionOutline: "$f_1=\\dfrac{v}{2L}=\\dfrac{100}{1.0}=100\\ \\mathrm{Hz}$。基频：两端为波节、中点为波腹，半个波长恰好等于弦长。" },
      { label: "c", marks: 4, question: "求第三谐波的频率，并说明它有多少个波节、多少个波腹（含两端）。",
        solutionOutline: "$f_3=3f_1=300\\ \\mathrm{Hz}$；第 $n$ 谐波有 $n$ 个波腹、$n+1$ 个波节，故 3 个波腹、4 个波节。" },
      { label: "d", marks: 5, question: "若要把基频提高到原来的两倍，张力需要变为多少？说明这在乐器调音上意味着什么。",
        solutionOutline: "$f\\propto\\sqrt{T}$，加倍频率需 $T\\times4=400\\ \\mathrm{N}$。调音时拧紧弦（增大张力）升高音调，且频率对张力的响应是平方根关系——所以要升高一个八度需把张力增到四倍。" },
      { label: "e", marks: 5, question: "室温升高时，弦受热膨胀、张力略降。定性说明弦乐器为什么在温暖环境中容易「变低（走音偏低）」；并说明若弦长因膨胀增加 $1\\%$、张力不变，基频大约变化多少。",
        solutionOutline: "温度升高 → 弦变长、张力下降 → $v=\\sqrt{T/\\mu}$ 下降且 $L$ 增大 → $f_1=v/2L$ 下降，音调偏低。若仅 $L$ 增 $1\\%$：$f\\propto1/L$，频率约降 $1\\%$。" },
      { label: "f", marks: 4, question: "用这根弦（基频 $100\\ \\mathrm{Hz}$）与一支基频 $103\\ \\mathrm{Hz}$ 的音叉同时发声，会听到什么现象？其频率是多少？这在调音中有什么用途？",
        solutionOutline: "听到拍音，拍频 $=|103-100|=3\\ \\mathrm{Hz}$（每秒 3 次强弱起伏）。调音时调整弦张力使拍频趋于零，即与标准音叉同频。" },
    ],
    fullSolution:
      "**a)** $v=\\sqrt{T/\\mu}=100\\ \\mathrm{m\\,s^{-1}}$。\\n\\n**b)** $f_1=v/2L=100\\ \\mathrm{Hz}$；两端节、中点腹。\\n\\n**c)** $f_3=300\\ \\mathrm{Hz}$；4 节 3 腹。\\n\\n**d)** $T\\to4T=400\\ \\mathrm{N}$（$f\\propto\\sqrt T$）。\\n\\n**e)** 受热 → 张力降、弦变长 → $f$ 降，偏低；$L$ 增 $1\\%$ 使 $f$ 约降 $1\\%$。\\n\\n**f)** 拍频 $3\\ \\mathrm{Hz}$；调到拍频为零即同频。\\n\\n---\\n*原创长题；数值已程序核对；请对照解答自评。*",
  },
  {
    id: "bpho-s2-therm-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-thermal",
    difficulty: 3,
    totalMarks: 25,
    context:
      "本题研究一台在高温热源 $T_h = 600\\ \\mathrm{K}$ 与低温热源 $T_c = 300\\ \\mathrm{K}$ 之间工作的热机。工作物质为理想气体。$R = 8.31\\ \\mathrm{J\\,mol^{-1}\\,K^{-1}}$，$\\ln 2 \\approx 0.69$。各小问相互独立。",
    parts: [
      { label: "a", marks: 3, question: "求这台热机可能达到的最大（卡诺）效率。",
        solutionOutline: "$\\eta_{\\max}=1-\\dfrac{T_c}{T_h}=1-\\dfrac{300}{600}=0.50$，即 $50\\%$（温度用开尔文）。" },
      { label: "b", marks: 4, question: "若热机以卡诺效率运行，每个循环从高温热源吸收 $1200\\ \\mathrm{J}$。求每循环对外做的功以及排给低温热源的热量。",
        solutionOutline: "$W=\\eta Q_h=0.50\\times1200=600\\ \\mathrm{J}$；$Q_c=Q_h-W=600\\ \\mathrm{J}$。" },
      { label: "c", marks: 5, question: "该循环中有一步是 $1.0\\ \\mathrm{mol}$ 理想气体在 $600\\ \\mathrm{K}$ 下等温膨胀到原体积的两倍。求这一步气体对外做的功，并说明这一步气体吸收的热量与做的功有什么关系。",
        solutionOutline: "$W=nRT\\ln\\dfrac{V_2}{V_1}=1\\times8.31\\times600\\times0.69\\approx3.4\\times10^{3}\\ \\mathrm{J}$。等温过程 $\\Delta U=0$，故吸热 $Q=W$，全部转化为对外做的功。" },
      { label: "d", marks: 5, question: "另一步是单原子理想气体在体积不变的情况下从 $300\\ \\mathrm{K}$ 升温到 $600\\ \\mathrm{K}$。求 $1.0\\ \\mathrm{mol}$ 气体在这一步吸收的热量。（单原子气体 $U=\\tfrac32nRT$）",
        solutionOutline: "等容：$W=0$，$Q=\\Delta U=\\tfrac32nR\\Delta T=\\tfrac32\\times1\\times8.31\\times300\\approx3.7\\times10^{3}\\ \\mathrm{J}$。" },
      { label: "e", marks: 4, question: "解释为什么现实中的热机效率总是低于卡诺效率，至少给出两个物理原因。",
        solutionOutline: "① 存在不可逆过程（有限温差传热、摩擦、湍流）产生熵增；② 实际循环并非可逆卡诺循环（有限时间、非准静态）；③ 热漏、排气与部件散热等损失。卡诺效率是理想上限。" },
      { label: "f", marks: 4, question: "若把低温热源温度从 $300\\ \\mathrm{K}$ 降到 $200\\ \\mathrm{K}$（高温不变），卡诺效率变为多少？由此说明为何降低冷端温度比升高热端温度往往更有效。",
        solutionOutline: "$\\eta=1-200/600=0.667$。效率对 $T_c$ 的敏感度为 $-1/T_h$（每降 1 K 提升固定量），而对 $T_h$ 的敏感度为 $T_c/T_h^2$（随 $T_h$ 增大而减弱）；且升高热端常受材料耐温限制，故降低冷端往往更划算。" },
    ],
    fullSolution:
      "**a)** $\\eta_{\\max}=1-T_c/T_h=0.50$。\\n\\n**b)** $W=600\\ \\mathrm{J}$，$Q_c=600\\ \\mathrm{J}$。\\n\\n**c)** $W=nRT\\ln2\\approx3.4\\times10^3\\ \\mathrm{J}$；等温 $\\Delta U=0$ 故 $Q=W$。\\n\\n**d)** 等容 $Q=\\tfrac32nR\\Delta T\\approx3.7\\times10^3\\ \\mathrm{J}$。\\n\\n**e)** 不可逆熵增、非准静态、热漏摩擦等。\\n\\n**f)** $\\eta=0.667$；降冷端每 K 收益恒定且不受材料耐温制约。\\n\\n---\\n*原创长题；数值已程序核对；请对照解答自评。*",
  },
  {
    id: "bpho-s2-modern-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-modern",
    difficulty: 3,
    totalMarks: 25,
    context:
      "本题研究光电效应实验。某金属的逸出功 $\\phi = 2.0\\ \\mathrm{eV}$。可用 $E(\\mathrm{eV})=\\dfrac{1240}{\\lambda(\\mathrm{nm})}$；$1\\ \\mathrm{eV}=1.6\\times10^{-19}\\ \\mathrm{J}$，$h=6.63\\times10^{-34}\\ \\mathrm{J\\,s}$，$m_e=9.1\\times10^{-31}\\ \\mathrm{kg}$。各小问相互独立。",
    parts: [
      { label: "a", marks: 3, question: "求这种金属的阈值波长（能引起光电发射的最长波长）。",
        solutionOutline: "$\\lambda_0=\\dfrac{1240}{\\phi}=\\dfrac{1240}{2.0}=620\\ \\mathrm{nm}$。波长长于此值则光子能量不足，无光电子。" },
      { label: "b", marks: 4, question: "用波长 $400\\ \\mathrm{nm}$ 的光照射，求单个光子的能量与光电子的最大动能（均以 eV 表示）。",
        solutionOutline: "$E_{\\text{光子}}=1240/400=3.1\\ \\mathrm{eV}$；$KE_{\\max}=E-\\phi=3.1-2.0=1.1\\ \\mathrm{eV}$。" },
      { label: "c", marks: 4, question: "求遏止电压（能使光电流降为零的反向电压）。若把入射光的强度加倍（波长不变），遏止电压会改变吗？为什么？",
        solutionOutline: "$V_s=KE_{\\max}/e=1.1\\ \\mathrm{V}$。加倍强度只增加光子数（电流增大），不改变每个光子的能量，故 $KE_{\\max}$ 与 $V_s$ 不变——这正是光子模型的关键证据。" },
      { label: "d", marks: 5, question: "求这些最大动能光电子的德布罗意波长。",
        solutionOutline: "$KE=1.1\\ \\mathrm{eV}=1.76\\times10^{-19}\\ \\mathrm{J}$；$p=\\sqrt{2m_eKE}=\\sqrt{2\\times9.1\\times10^{-31}\\times1.76\\times10^{-19}}\\approx5.7\\times10^{-25}$；$\\lambda=h/p\\approx1.2\\times10^{-9}\\ \\mathrm{m}\\approx1.2\\ \\mathrm{nm}$。" },
      { label: "e", marks: 5, question: "在坐标轴上画出「光电子最大动能 $KE_{\\max}$ 对入射光频率 $f$」的图线。说明：图线的斜率代表什么物理常数？横轴截距代表什么？纵轴截距代表什么？",
        solutionOutline: "$KE_{\\max}=hf-\\phi$ 是直线：斜率 $=h$（普朗克常数，与金属无关）；横轴截距 $=$ 阈值频率 $f_0=\\phi/h$；纵轴截距 $=-\\phi$。不同金属的直线平行、只是截距不同。" },
      { label: "f", marks: 4, question: "经典波动理论预言：增大光强最终总能打出电子、且动能随光强增大。用本题结果说明实验事实如何否定这一预言、支持爱因斯坦的光子假说。",
        solutionOutline: "实验：低于阈值频率时无论多强都不发射；动能只取决于频率不取决于强度；发射几乎瞬时。这些都与「能量一份份（光子 $hf$）传递」一致，而与经典连续波图像矛盾。" },
    ],
    fullSolution:
      "**a)** $\\lambda_0=1240/2.0=620\\ \\mathrm{nm}$。\\n\\n**b)** 光子 $3.1\\ \\mathrm{eV}$；$KE_{\\max}=1.1\\ \\mathrm{eV}$。\\n\\n**c)** $V_s=1.1\\ \\mathrm{V}$；加倍强度不改变（只增电流）。\\n\\n**d)** $\\lambda=h/\\sqrt{2m_eKE}\\approx1.2\\ \\mathrm{nm}$。\\n\\n**e)** 斜率 $h$、横截距 $f_0=\\phi/h$、纵截距 $-\\phi$。\\n\\n**f)** 阈值频率、动能与强度无关、瞬时发射三点否定经典波动、支持光子说。\\n\\n---\\n*原创长题；数值已程序核对；请对照解答自评。*",
  },
  {
    id: "bpho-s2-em-002",
    type: "long",
    testId: "bpho",
    topicId: "bpho-em",
    difficulty: 3,
    totalMarks: 25,
    context:
      "本题研究「导轨发电机」。两条平行光滑导轨相距 $L = 0.50\\ \\mathrm{m}$，处于垂直纸面的均匀磁场 $B = 0.40\\ \\mathrm{T}$ 中。一根质量 $m = 0.10\\ \\mathrm{kg}$、电阻 $R = 2.0\\ \\Omega$ 的导体棒可在导轨上无摩擦滑动（导轨电阻不计）。各小问相互独立。",
    parts: [
      { label: "a", marks: 3, question: "有人以恒定速度 $v = 10\\ \\mathrm{m\\,s^{-1}}$ 拉动导体棒。求棒中产生的感应电动势。",
        solutionOutline: "$\\varepsilon=BLv=0.40\\times0.50\\times10=2.0\\ \\mathrm{V}$。" },
      { label: "b", marks: 4, question: "求回路中的感应电流，以及磁场作用在载流棒上的力（大小与方向）。",
        solutionOutline: "$I=\\varepsilon/R=2.0/2.0=1.0\\ \\mathrm{A}$。$F=BIL=0.40\\times1.0\\times0.50=0.20\\ \\mathrm{N}$，方向与运动相反（楞次定律，阻碍运动）。" },
      { label: "c", marks: 4, question: "求电阻上消耗的电功率与外力做功的机械功率，并说明二者为何相等。",
        solutionOutline: "$P_{\\text{电}}=I^2R=1.0\\times2.0=2.0\\ \\mathrm{W}$；$P_{\\text{机}}=Fv=0.20\\times10=2.0\\ \\mathrm{W}$。匀速时外力恰好克服安培力，输入的机械功全部转化为电阻热——能量守恒。" },
      { label: "d", marks: 5, question: "现在撤去外力，让棒以初速度 $v_0 = 10\\ \\mathrm{m\\,s^{-1}}$ 自由滑行。写出棒的运动方程，并说明速度随时间如何变化（定性即可）。",
        solutionOutline: "安培力是唯一水平力：$m\\dfrac{dv}{dt}=-BIL=-\\dfrac{B^2L^2}{R}v$。这是 $\\dfrac{dv}{dt}=-\\dfrac{B^2L^2}{mR}v$，速度按指数衰减 $v=v_0e^{-t/\\tau}$，时间常数 $\\tau=\\dfrac{mR}{B^2L^2}$。" },
      { label: "e", marks: 5, question: "求 d) 中的时间常数 $\\tau$ 的数值；并求棒最终滑行的总距离（$t\\to\\infty$）与全过程产生的总热量。",
        solutionOutline: "$\\tau=\\dfrac{mR}{B^2L^2}=\\dfrac{0.10\\times2.0}{0.40^2\\times0.50^2}=\\dfrac{0.20}{0.04}=5.0\\ \\mathrm{s}$。总距离 $=\\int_0^\\infty v_0e^{-t/\\tau}dt=v_0\\tau=50\\ \\mathrm{m}$。总热量 $=$ 初动能 $=\\tfrac12mv_0^2=\\tfrac12\\times0.10\\times100=5.0\\ \\mathrm{J}$。" },
      { label: "f", marks: 4, question: "画出 d) 中速度—时间与感应电流—时间的草图，并说明这个装置作为「电磁刹车」的工作原理。",
        solutionOutline: "$v$ 与 $I$（$I=BLv/R\\propto v$）都从初值指数衰减、渐近趋零。原理：运动切割磁感线生电流，电流受安培力阻碍运动，动能转为电阻热而使物体平滑减速——无接触、无磨损，即电磁刹车。" },
    ],
    fullSolution:
      "**a)** $\\varepsilon=BLv=2.0\\ \\mathrm{V}$。\\n\\n**b)** $I=1.0\\ \\mathrm{A}$；$F=BIL=0.20\\ \\mathrm{N}$，方向阻碍运动。\\n\\n**c)** $P_{\\text{电}}=I^2R=2.0\\ \\mathrm{W}=P_{\\text{机}}=Fv$，能量守恒。\\n\\n**d)** $m\\dot v=-\\dfrac{B^2L^2}{R}v$，指数衰减 $v=v_0e^{-t/\\tau}$。\\n\\n**e)** $\\tau=mR/(B^2L^2)=5.0\\ \\mathrm{s}$；总距离 $v_0\\tau=50\\ \\mathrm{m}$；总热 $=\\tfrac12mv_0^2=5.0\\ \\mathrm{J}$。\\n\\n**f)** $v,I$ 同步指数衰减至零；即无接触电磁刹车。\\n\\n---\\n*原创长题；对标 BPhO Round 1 Section 2；数值已程序核对；请对照解答自评。*",
  },
  {
    id: "bpho-s2r2-rocket-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-mechanics",
    difficulty: 3,
    totalMarks: 25,
    context:
      "【Round 2 风格 · 阶梯式长题】本题一步步推导火箭方程。一枚火箭在无引力的深空中，以相对火箭恒定的速率 $u$ 向后喷出燃气。火箭（含剩余燃料）质量记为 $M$。本题展示 Round 2 的典型套路：从一次离散事件出发 → 推广到 $N$ 次 → 取极限得到连续规律。各小问按顺序完成。",
    parts: [
      { label: "a", marks: 3, question: "第一级台阶：质量为 $M$、速度为 $v$ 的火箭瞬间喷出一小团质量 $\\Delta m$ 的燃气（喷出后燃气相对原火箭以 $u$ 向后运动）。用动量守恒证明火箭获得的速度增量近似为 $\\Delta v \\approx \\dfrac{u\\,\\Delta m}{M}$（当 $\\Delta m \\ll M$）。",
        solutionOutline: "在喷气前的火箭参考系中：$0 = (M-\\Delta m)\\Delta v - \\Delta m\\,u$，故 $\\Delta v = \\dfrac{u\\,\\Delta m}{M-\\Delta m} \\approx \\dfrac{u\\,\\Delta m}{M}$。" },
      { label: "b", marks: 4, question: "第二级台阶：火箭从 $M_0$ 开始，分 $N$ 次、每次喷出当前质量的固定比例 $f$（即每次喷后质量变为原来的 $(1-f)$ 倍）。写出 $N$ 次喷气后火箭质量 $M_N$ 的表达式，以及总速度增量 $\\Delta v_{总}$ 的求和式（用 a) 的近似）。",
        solutionOutline: "$M_N = M_0(1-f)^N$。每次 $\\Delta v_i \\approx u\\dfrac{fM_{i-1}}{M_{i-1}} = uf$（每次增量相同！），故 $\\Delta v_{总} \\approx Nuf$。" },
      { label: "c", marks: 5, question: "第三级台阶（取极限）：令 $N\\to\\infty$、$f\\to0$，但保持最终质量比 $M_0/M_f$ 固定。利用 $(1-f)^N = M_f/M_0$ 与 $\\ln(1-f)\\approx -f$（小 $f$），证明总速度增量趋于 $\\Delta v = u\\ln\\dfrac{M_0}{M_f}$（齐奥尔科夫斯基火箭方程）。",
        solutionOutline: "$N\\ln(1-f) = \\ln(M_f/M_0) \\Rightarrow Nf \\approx \\ln(M_0/M_f)$。代入 $\\Delta v_{总} = Nuf$ 得 $\\Delta v = u\\ln\\dfrac{M_0}{M_f}$。（与微分法 $M\\,dv = -u\\,dM$ 积分的结果一致。）" },
      { label: "d", marks: 4, question: "代入数字：化学火箭 $u = 3.0\\ \\mathrm{km\\,s^{-1}}$，质量比 $M_0/M_f = 20$（即 $95\\%$ 是燃料）。求 $\\Delta v$，并与入轨所需的 $\\approx9.4\\ \\mathrm{km\\,s^{-1}}$（含引力与阻力损耗）比较。",
        solutionOutline: "$\\Delta v = 3.0\\ln20 = 3.0\\times3.0 = 9.0\\ \\mathrm{km\\,s^{-1}}$——即便 $95\\%$ 都是燃料也勉强够不到。对数的「残酷」：想再加 $3\\ \\mathrm{km\\,s^{-1}}$ 就要再乘一个 $e$ 的质量比。" },
      { label: "e", marks: 5, question: "分级的威力：把同样的总质量比 $20$ 拆成两级，每级质量比 $\\sqrt{20}\\approx4.5$，且第一级烧完后抛掉其结构死重。解释为什么分级火箭能获得比单级**更大**的实际 $\\Delta v$（提示：死重）。",
        solutionOutline: "对数可加：$u\\ln\\sqrt{20}+u\\ln\\sqrt{20}=u\\ln20$，看似一样——但单级火箭全程拖着**空油箱与发动机的死重**，实际 $M_f$ 被死重抬高、$\\ln(M_0/M_f)$ 缩水；分级把死重中途抛弃，每一级的有效质量比更接近理想值。所有入轨火箭都分级，这是火箭方程逼出来的工程结论。" },
      { label: "f", marks: 4, question: "画出火箭速度 $v$ 随剩余质量 $M$（从 $M_0$ 到 $M_f$）变化的曲线草图，并标注曲线形状反映的物理：为什么「最后一吨燃料」比「最初一吨」贡献大得多？",
        solutionOutline: "$v = u\\ln(M_0/M)$：随 $M$ 减小对数上升、越来越陡。同样 $\\Delta m$ 的燃料在 $M$ 小时给出更大的 $\\Delta v = u\\Delta m/M$——火箭越轻越「推得动」，曲线在 $M\\to M_f$ 端最陡。" },
    ],
    fullSolution:
      "**a)** 动量守恒（喷气前火箭系）：$(M-\\Delta m)\\Delta v = \\Delta m\\,u \\Rightarrow \\Delta v\\approx u\\Delta m/M$。\\n\\n**b)** $M_N=M_0(1-f)^N$；每次 $\\Delta v_i=uf$，总量 $Nuf$。\\n\\n**c)** $N\\ln(1-f)=\\ln(M_f/M_0)$，小 $f$ 下 $Nf\\to\\ln(M_0/M_f)$，故 $\\Delta v=u\\ln(M_0/M_f)$。\\n\\n**d)** $3.0\\times\\ln20\\approx9.0\\ \\mathrm{km\\,s^{-1}}$，勉强不及 $9.4$——单级入轨在化学推进下处于可行性边缘。\\n\\n**e)** 死重论证：分级抛弃空箱使各级有效质量比更高；对数律下这是唯一出路。\\n\\n**f)** $v=u\\ln(M_0/M)$ 对数曲线，末端最陡。\\n\\n---\\n*R2 风格阶梯长题（离散→求和→取极限），原创；数值程序核对；请对照解答自评。*",
  },
  {
    id: "bpho-s2r2-gaspressure-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-thermal",
    difficulty: 3,
    totalMarks: 25,
    context:
      "【Round 2 风格 · 阶梯式长题】本题从单个分子出发推导理想气体压强公式 $p=\\tfrac13\\rho\\langle c^2\\rangle$。一个边长 $L$ 的立方体盒子里装有 $N$ 个质量 $m$ 的分子。分子与器壁碰撞为弹性碰撞。各小问按顺序完成。",
    parts: [
      { label: "a", marks: 3, question: "第一级台阶：一个分子以速度分量 $v_x$ 垂直撞上与 $x$ 轴垂直的器壁并弹回。求这一次碰撞传给器壁的动量。",
        solutionOutline: "弹性反弹：分子动量从 $+mv_x$ 变为 $-mv_x$，传给器壁 $\\Delta p = 2mv_x$。" },
      { label: "b", marks: 4, question: "第二级台阶：该分子在两次撞击**同一面**器壁之间要横穿盒子往返一次。求撞击该壁的时间间隔，进而求它对该壁的平均作用力。",
        solutionOutline: "往返路程 $2L$：$\\Delta t = \\dfrac{2L}{v_x}$。平均力 $F = \\dfrac{\\Delta p}{\\Delta t} = \\dfrac{2mv_x}{2L/v_x} = \\dfrac{mv_x^2}{L}$。" },
      { label: "c", marks: 4, question: "第三级台阶：把 $N$ 个分子的贡献加起来（各自的 $v_x$ 不同），证明该壁受到的总压强为 $p = \\dfrac{Nm\\langle v_x^2\\rangle}{V}$，其中 $V=L^3$。",
        solutionOutline: "总力 $= \\dfrac{m}{L}\\sum v_{x,i}^2 = \\dfrac{Nm\\langle v_x^2\\rangle}{L}$；压强 $= \\dfrac{F}{L^2} = \\dfrac{Nm\\langle v_x^2\\rangle}{L^3} = \\dfrac{Nm\\langle v_x^2\\rangle}{V}$。" },
      { label: "d", marks: 4, question: "第四级台阶（对称性）：分子运动没有方向偏好。用 $\\langle c^2\\rangle = \\langle v_x^2\\rangle+\\langle v_y^2\\rangle+\\langle v_z^2\\rangle$ 说明 $\\langle v_x^2\\rangle = \\tfrac13\\langle c^2\\rangle$，并得出 $p = \\tfrac13\\rho\\langle c^2\\rangle$（$\\rho = Nm/V$）。",
        solutionOutline: "各向同性 → 三个方向均分：$\\langle v_x^2\\rangle=\\tfrac13\\langle c^2\\rangle$。代入 c)：$p=\\dfrac{Nm\\langle c^2\\rangle}{3V}=\\tfrac13\\rho\\langle c^2\\rangle$。" },
      { label: "e", marks: 5, question: "用这个公式反推现实：空气 $\\rho = 1.2\\ \\mathrm{kg\\,m^{-3}}$、$p = 1.0\\times10^{5}$ Pa。求空气分子的方均根速率，并与声速（$340\\ \\mathrm{m\\,s^{-1}}$）比较、解释二者为何同量级。",
        solutionOutline: "$c_{rms}=\\sqrt{3p/\\rho}=\\sqrt{3\\times10^5/1.2}=500\\ \\mathrm{m\\,s^{-1}}$。声音靠分子相互碰撞传递，「信使」的奔跑速度就是分子热速度——声速必然略低于并同量级于 $c_{rms}$。" },
      { label: "f", marks: 5, question: "把 $p=\\tfrac13\\rho\\langle c^2\\rangle$ 与理想气体方程 $pV=Nk_BT$ 联立，导出单个分子的平均平动动能与温度的关系，并说明这句话的深意：「温度是什么」。",
        solutionOutline: "$\\tfrac13Nm\\langle c^2\\rangle = Nk_BT \\Rightarrow \\tfrac12m\\langle c^2\\rangle = \\tfrac32k_BT$。温度不是别的——就是分子平均平动动能的量度：宏观温标与微观运动在此接通，这正是分子动理论的核心成就。" },
    ],
    fullSolution:
      "**a)** $\\Delta p=2mv_x$。\\n\\n**b)** $\\Delta t=2L/v_x$；$F=mv_x^2/L$。\\n\\n**c)** 求和取平均：$p=Nm\\langle v_x^2\\rangle/V$。\\n\\n**d)** 各向同性均分 → $p=\\tfrac13\\rho\\langle c^2\\rangle$。\\n\\n**e)** $c_{rms}=\\sqrt{3p/\\rho}=500\\ \\mathrm{m\\,s^{-1}}$；声波由分子碰撞传播，故声速同量级略小。\\n\\n**f)** $\\tfrac12m\\langle c^2\\rangle=\\tfrac32k_BT$：温度即平均平动动能。\\n\\n---\\n*R2 风格阶梯长题（单分子→求和→对称性→接通热力学），原创；数值程序核对；请对照解答自评。*",
  },
  {
    id: "bpho-s2r2-tunnel-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-mechanics",
    difficulty: 3,
    totalMarks: 25,
    context:
      "【Round 2 风格 · 阶梯式长题】科幻设想：沿直径打穿地球，挖一条真空、无摩擦的隧道，跳进去会发生什么？把地球当作密度均匀的球，$R = 6.37\\times10^{6}$ m，表面 $g = 9.81\\ \\mathrm{m\\,s^{-2}}$。已知（壳层定理）：均匀球体内部半径 $r$ 处，只有半径 $r$ 以内的质量产生引力，外层球壳的引力恰好抵消。各小问按顺序完成。",
    parts: [
      { label: "a", marks: 4, question: "第一级台阶：利用壳层定理证明，地球内部距球心 $r$ 处的重力加速度为 $g(r) = g\\dfrac{r}{R}$——随深度**线性减小**，到球心为零。",
        solutionOutline: "内部质量 $M(r)=M\\dfrac{r^3}{R^3}$（均匀密度）。$g(r)=\\dfrac{GM(r)}{r^2}=\\dfrac{GM}{R^2}\\cdot\\dfrac{r}{R}=g\\dfrac{r}{R}$。" },
      { label: "b", marks: 4, question: "第二级台阶：跳入隧道的人（质量 $m$）位于距球心 $x$ 处（沿隧道方向）。写出他受到的合力，并说明这是什么类型的运动。",
        solutionOutline: "$F = -mg\\dfrac{x}{R}$：回复力与位移成正比、方向相反——标准 SHM，等效「劲度」$k = \\dfrac{mg}{R}$，$\\omega^2 = \\dfrac{g}{R}$。" },
      { label: "c", marks: 4, question: "第三级台阶：求穿越振动的周期，并算出「从这头跳进去到那头冒出来」的单程时间。",
        solutionOutline: "$T = 2\\pi\\sqrt{\\dfrac{R}{g}} = 2\\pi\\sqrt{\\dfrac{6.37\\times10^6}{9.81}} \\approx 5.06\\times10^3\\ \\mathrm{s} \\approx 84$ 分钟。单程为半周期 $\\approx 42$ 分钟。" },
      { label: "d", marks: 4, question: "求他经过地心时的速度。",
        solutionOutline: "SHM 最大速度 $v_{\\max} = \\omega R = \\sqrt{gR} = \\sqrt{9.81\\times6.37\\times10^6} \\approx 7.9\\times10^{3}\\ \\mathrm{m\\,s^{-1}}$——恰好等于贴地圆轨道的第一宇宙速度（这不是巧合，见 f)）。" },
      { label: "e", marks: 4, question: "更妙的结论：隧道**不必**过球心——任意一条连接地表两点的直线弦（真空无摩擦）中，重力沿弦方向的分量仍给出同一个 $\\omega$。由此可得什么令人惊讶的结论？",
        solutionOutline: "沿弦方向分量：$F_{\\parallel} = -mg\\dfrac{r}{R}\\cos\\alpha = -mg\\dfrac{x}{R}$（$x$ 为沿弦坐标）——与弦的选取无关。于是**任何两城市之间的「重力地铁」单程都是 42 分钟**，无论远近（伦敦到北京与伦敦到巴黎一样准时）。" },
      { label: "f", marks: 5, question: "把 c) 的周期与贴地圆轨道卫星的周期作比较，并解释这一巧合背后的共同物理。",
        solutionOutline: "贴地轨道：$T = 2\\pi\\sqrt{R/g} \\approx 84$ 分钟——与隧道振动**完全相同**。共同根源：两者都由同一个 $\\omega^2 = g/R$ 支配；圆轨道在直径上的投影恰是一个同频率的 SHM，隧道里的人就是「卫星的影子」。（这也解释了 d) 中 $v_{\\max}=\\sqrt{gR}$ 等于第一宇宙速度。）" },
    ],
    fullSolution:
      "**a)** $M(r)\\propto r^3 \\Rightarrow g(r)=g\\,r/R$，线性、球心为零。\\n\\n**b)** $F=-\\dfrac{mg}{R}x$：SHM，$\\omega^2=g/R$。\\n\\n**c)** $T=2\\pi\\sqrt{R/g}\\approx84$ 分钟；单程 $42$ 分钟。\\n\\n**d)** $v_{\\max}=\\sqrt{gR}\\approx7.9\\ \\mathrm{km\\,s^{-1}}$。\\n\\n**e)** 任意弦同周期：所有「重力地铁」单程 $42$ 分钟——SHM 频率与振幅无关的几何化身。\\n\\n**f)** 贴地轨道同为 $84$ 分钟：圆轨道的直径投影就是这支 SHM，二者共享 $\\omega^2=g/R$。\\n\\n---\\n*R2 风格阶梯长题（壳层定理→SHM→惊人推论），原创；数值程序核对；请对照解答自评。*",
  },
];
