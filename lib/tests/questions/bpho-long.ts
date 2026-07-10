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
];
