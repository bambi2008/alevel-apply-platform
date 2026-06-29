export interface KnowledgeConcept {
  name: string;
  body: string; // LaTeX-friendly markdown
  keyPoints?: string[];
}

export interface WorkedExample {
  title: string;
  question: string;
  options?: { key: string; text: string }[];
  answer?: string;
  solution: string;
  tip?: string;
}

export interface TopicKnowledge {
  topicId: string;
  overview: string;
  concepts: KnowledgeConcept[];
  workedExamples: WorkedExample[];
}

export const ESAT_KNOWLEDGE: TopicKnowledge[] = [
  {
    topicId: "esat-math1",
    overview:
      "代数与函数是 ESAT 数学模块的核心考点，占比约 35%。考查重点包括：二次方程与判别式、函数的复合与反函数、指数对数方程、不等式、因式定理与余数定理。题目通常要求快速代入与化简，计算能力和公式熟练度至关重要。",
    concepts: [
      {
        name: "二次方程与判别式",
        body: "对于 $ax^2 + bx + c = 0$，判别式 $\\Delta = b^2 - 4ac$ 决定根的性质：\n\n- $\\Delta > 0$：两个不同实根 $x = \\dfrac{-b \\pm \\sqrt{\\Delta}}{2a}$\n- $\\Delta = 0$：两个相等实根（重根）$x = -\\dfrac{b}{2a}$\n- $\\Delta < 0$：无实根（两个共轭复根）\n\n**配方法**（用于推导顶点坐标）：$ax^2+bx+c = a\\left(x+\\dfrac{b}{2a}\\right)^2 - \\dfrac{\\Delta}{4a}$",
        keyPoints: [
          "ESAT 常考「判别式 = k 时求参数范围」类型",
          "韦达定理：$x_1+x_2 = -b/a$，$x_1 x_2 = c/a$",
          "二次不等式记住「开口向上，外侧大于，内侧小于」",
        ],
      },
      {
        name: "函数：复合与反函数",
        body: "设 $f: A \\to B$，$g: B \\to C$，则复合函数 $g \\circ f(x) = g(f(x))$，注意顺序：**先 $f$ 后 $g$**。\n\n**反函数**：若 $f$ 是双射，则 $f^{-1}$ 满足 $f(f^{-1}(x)) = x$。求反函数步骤：令 $y = f(x)$，解出 $x = f^{-1}(y)$，再互换变量名。\n\n**定义域与值域**：$f^{-1}$ 的定义域 = $f$ 的值域；$f^{-1}$ 的值域 = $f$ 的定义域。",
        keyPoints: [
          "复合函数先算括号里的（右边先）",
          "$f^{-1}(f(x)) = x$ 只在 $f$ 的定义域内成立",
          "图形关系：$y=f^{-1}(x)$ 是 $y=f(x)$ 关于直线 $y=x$ 的对称",
        ],
      },
      {
        name: "指数与对数",
        body: "**指数法则**（$a>0, a\\neq 1$）：\n$$a^m \\cdot a^n = a^{m+n}, \\quad \\frac{a^m}{a^n} = a^{m-n}, \\quad (a^m)^n = a^{mn}$$\n\n**对数换底公式**：$\\log_a b = \\dfrac{\\ln b}{\\ln a} = \\dfrac{\\log_{10} b}{\\log_{10} a}$\n\n**常用恒等式**：$\\log_a(xy) = \\log_a x + \\log_a y$，$\\log_a(x/y) = \\log_a x - \\log_a y$，$\\log_a x^n = n\\log_a x$\n\n求解方程 $a^x = b$ 时，取对数得 $x = \\log_a b$；若两边底数不同，统一换成自然对数 $\\ln$。",
        keyPoints: [
          "ESAT 常见：$2^x = 3^{x-1}$ 型，两边取 ln 后解线性方程",
          "对数方程要验根（真数必须 > 0）",
          "指数增长/衰减：$N(t) = N_0 e^{kt}$，考结合物理背景的应用题",
        ],
      },
      {
        name: "因式定理与余数定理",
        body: "**余数定理**：多项式 $f(x)$ 除以 $(x-a)$ 的余数为 $f(a)$。\n\n**因式定理**：$(x-a)$ 是 $f(x)$ 的因式 $\\Leftrightarrow$ $f(a) = 0$。\n\n常见技巧：先用有理根定理猜根（试因数 $\\pm 1, \\pm 2, \\ldots$），找到一个根后做多项式除法，将次数降低再分解。",
        keyPoints: [
          "三次多项式 $ax^3+bx^2+cx+d$，有理根一定是 $\\pm\\dfrac{d\\text{ 的因数}}{a\\text{ 的因数}}$",
          "考试常给一个根，要求求其他根或待定系数",
          "ESAT 题型：已知 $(x-2)$ 是 $f(x)$ 的因式，求参数 $k$",
        ],
      },
    ],
    workedExamples: [
      {
        title: "例 1：判别式与参数范围",
        question:
          "方程 $x^2 - 2kx + (k+6) = 0$ 有两个不同实根，求 $k$ 的范围。",
        solution:
          "**分析**：两个不同实根 $\\Leftrightarrow$ 判别式 $\\Delta > 0$。\n\n$$\\Delta = (-2k)^2 - 4 \\cdot 1 \\cdot (k+6) = 4k^2 - 4k - 24$$\n\n令 $\\Delta > 0$：\n$$4k^2 - 4k - 24 > 0 \\implies k^2 - k - 6 > 0 \\implies (k-3)(k+2) > 0$$\n\n因此 $k < -2$ 或 $k > 3$。",
        tip: "先整理成标准式再套公式；注意题目问「两个不同实根」用严格 $>$，「至少两实根」（含重根）用 $\\geq$。",
      },
      {
        title: "例 2：复合函数与反函数",
        question:
          "设 $f(x) = 2x+1$，$g(x) = x^2 - 3$（$x \\geq 0$）。\n(a) 求 $g(f(x))$；\n(b) 求 $g^{-1}(x)$ 及其定义域。",
        solution:
          "(a) $g(f(x)) = g(2x+1) = (2x+1)^2 - 3 = 4x^2 + 4x - 2$\n\n(b) 令 $y = x^2 - 3$（$x \\geq 0$），则 $x^2 = y+3$，$x = \\sqrt{y+3}$（取正根因 $x \\geq 0$）。\n\n所以 $g^{-1}(x) = \\sqrt{x+3}$，定义域 $x \\geq -3$（对应 $g$ 的值域 $[-3, +\\infty)$）。",
        tip: "求反函数时一定要标明定义域；$g$ 限制 $x \\geq 0$ 是为了使其成为单射（可逆）。",
      },
      {
        title: "例 3：指数方程",
        question:
          "求解方程 $4^x - 5 \\cdot 2^x + 4 = 0$。",
        solution:
          "**换元**：令 $u = 2^x$，则 $4^x = (2^x)^2 = u^2$，方程化为：\n\n$$u^2 - 5u + 4 = 0 \\implies (u-1)(u-4) = 0$$\n\n所以 $u = 1$ 或 $u = 4$，即 $2^x = 1$ 或 $2^x = 4$。\n\n$2^x = 1 \\Rightarrow x = 0$；$2^x = 4 = 2^2 \\Rightarrow x = 2$。\n\n答：$x = 0$ 或 $x = 2$。",
        tip: "ESAT 常考「令 $u = a^x$ 换元」技巧，本质是把指数方程转化为关于 $u$ 的二次方程。",
      },
    ],
  },
  {
    topicId: "esat-math2",
    overview:
      "微积分是 ESAT 的高分考点，约占数学模块 30%。重点考查：微分法则（乘积法则、商法则、链式法则）、积分技巧（换元法、分部积分）、极值与曲线分析、面积与体积的积分计算。Cambridge/Imperial 特别偏爱应用微积分于物理和几何情境中。",
    concepts: [
      {
        name: "微分法则",
        body: "**基本公式**：$\\dfrac{d}{dx}(x^n) = nx^{n-1}$，$\\dfrac{d}{dx}(e^x) = e^x$，$\\dfrac{d}{dx}(\\ln x) = \\dfrac{1}{x}$，$\\dfrac{d}{dx}(\\sin x) = \\cos x$，$\\dfrac{d}{dx}(\\cos x) = -\\sin x$\n\n**乘积法则**：$(uv)' = u'v + uv'$\n\n**商法则**：$\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^2}$\n\n**链式法则**：$\\dfrac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$",
        keyPoints: [
          "链式法则：「外层导数 × 内层导数」，不要漏乘内层导数",
          "$\\dfrac{d}{dx}(a^x) = a^x \\ln a$",
          "隐函数微分：对含 $y$ 的式子关于 $x$ 求导，记得 $\\dfrac{dy}{dx}$",
        ],
      },
      {
        name: "极值与曲线分析",
        body: "**驻点**（stationary point）：$f'(x) = 0$ 的点。\n\n**二阶导数判断**：\n- $f''(x_0) < 0$：极大值\n- $f''(x_0) > 0$：极小值\n- $f''(x_0) = 0$：需用一阶导数符号变化判断（可能是拐点）\n\n**单调性**：$f'(x) > 0$ 时 $f$ 递增；$f'(x) < 0$ 时 $f$ 递减。\n\n**凹凸性**：$f''(x) > 0$ 为凸（向下弯，中文「下凸」= 英文 concave up）；$f''(x) < 0$ 为凹。",
        keyPoints: [
          "ESAT 常考「在闭区间 $[a,b]$ 上找最大值/最小值」——同时检查端点值",
          "优化问题：先建立函数表达式，再求导令 $f'=0$",
          "拐点：$f''(x_0) = 0$ 且 $f''$ 在 $x_0$ 两侧变号",
        ],
      },
      {
        name: "积分技巧",
        body: "**换元积分法**：令 $u = g(x)$，则 $\\displaystyle\\int f(g(x))g'(x)\\,dx = \\int f(u)\\,du$\n\n**分部积分**：$\\displaystyle\\int u\\,dv = uv - \\int v\\,du$\n\n口诀选 $u$ 的优先级（LIATE）：Logarithm > Inverse trig > Algebraic > Trig > Exponential\n\n**常用结果**：\n$$\\int e^{ax}\\,dx = \\frac{1}{a}e^{ax}+C, \\quad \\int \\frac{1}{ax+b}\\,dx = \\frac{1}{a}\\ln|ax+b|+C$$\n$$\\int \\sin(ax)\\,dx = -\\frac{1}{a}\\cos(ax)+C, \\quad \\int x^n\\,dx = \\frac{x^{n+1}}{n+1}+C \\;(n \\neq -1)$$",
        keyPoints: [
          "定积分几何意义：曲线与 $x$ 轴围成的（有向）面积",
          "面积总取绝对值：若曲线在 $x$ 轴下方，积分为负，面积取 $|\\int|$",
          "两曲线间面积：$\\int_a^b [f(x)-g(x)]\\,dx$（$f$ 在上方）",
        ],
      },
    ],
    workedExamples: [
      {
        title: "例 1：链式法则微分",
        question: "求 $y = \\sin^3(2x)$ 的导数 $\\dfrac{dy}{dx}$。",
        solution:
          "将 $y$ 看作两层复合函数：外层 $u^3$，中层 $\\sin(2x)$，内层 $2x$。\n\n$$\\frac{dy}{dx} = 3\\sin^2(2x) \\cdot \\cos(2x) \\cdot 2 = 6\\sin^2(2x)\\cos(2x)$$\n\n或利用二倍角：$= 3\\sin^2(2x)\\cdot \\sin(4x)/\\sin(2x) \\cdots$ 通常保留第一种形式。",
        tip: "链式法则有几层嵌套就乘几个导数；ESAT 中常见 $e^{f(x)}$、$\\ln(f(x))$ 形式，记住「外导 × 内导」。",
      },
      {
        title: "例 2：优化问题",
        question:
          "一个开口圆柱形容器（无盖），体积为 $500\\,\\text{cm}^3$，求使表面积最小时的底面半径 $r$。",
        solution:
          "设底面半径 $r$，高 $h$。体积约束：$\\pi r^2 h = 500 \\Rightarrow h = \\dfrac{500}{\\pi r^2}$\n\n表面积（底面 + 侧面）：\n$$S = \\pi r^2 + 2\\pi r h = \\pi r^2 + 2\\pi r \\cdot \\frac{500}{\\pi r^2} = \\pi r^2 + \\frac{1000}{r}$$\n\n令 $\\dfrac{dS}{dr} = 2\\pi r - \\dfrac{1000}{r^2} = 0$：\n$$r^3 = \\frac{1000}{2\\pi} = \\frac{500}{\\pi} \\Rightarrow r = \\left(\\frac{500}{\\pi}\\right)^{1/3} \\approx 5.42\\,\\text{cm}$$\n\n验证：$\\dfrac{d^2S}{dr^2} = 2\\pi + \\dfrac{2000}{r^3} > 0$，确为极小值。",
        tip: "优化三步走：①建立目标函数（用约束消去一个变量）②求导令 $f'=0$ ③用二阶导或符号变化验证极小值。",
      },
      {
        title: "例 3：分部积分",
        question: "求 $\\displaystyle\\int x e^{2x}\\,dx$。",
        solution:
          "令 $u = x$，$dv = e^{2x}\\,dx$，则 $du = dx$，$v = \\dfrac{1}{2}e^{2x}$。\n\n$$\\int x e^{2x}\\,dx = x \\cdot \\frac{1}{2}e^{2x} - \\int \\frac{1}{2}e^{2x}\\,dx = \\frac{x}{2}e^{2x} - \\frac{1}{4}e^{2x} + C = \\frac{e^{2x}}{4}(2x-1) + C$$",
        tip: "LIATE 优先级：$x$ 是代数式（A），$e^{2x}$ 是指数（E），A > E，故选 $u = x$。若选反了，积分会越来越复杂。",
      },
    ],
  },
  {
    topicId: "esat-math3",
    overview:
      "几何与数列约占数学模块 35%，涵盖：坐标几何（直线、圆、抛物线）、等差等比数列与无穷级数、二项式定理、向量基础。这部分计算较直接，得分效率高，建议优先攻克。",
    concepts: [
      {
        name: "等差与等比数列",
        body: "**等差数列**（AP）：首项 $a$，公差 $d$\n- 第 $n$ 项：$a_n = a + (n-1)d$\n- 前 $n$ 项和：$S_n = \\dfrac{n}{2}(2a + (n-1)d) = \\dfrac{n}{2}(a + a_n)$\n\n**等比数列**（GP）：首项 $a$，公比 $r$\n- 第 $n$ 项：$a_n = ar^{n-1}$\n- 前 $n$ 项和：$S_n = \\dfrac{a(1-r^n)}{1-r}$（$r \\neq 1$）\n- **无穷级数**（$|r|<1$）：$S_\\infty = \\dfrac{a}{1-r}$",
        keyPoints: [
          "ESAT 常用无穷等比级数求分数的循环小数，如 $0.\\overline{3} = \\frac{3/10}{1-1/10} = 1/3$",
          "判断 $|r|<1$ 才有无穷和",
          "混合题：数列 $a_n$ 满足某递推关系，建方程解参数",
        ],
      },
      {
        name: "二项式定理",
        body: "$(a+b)^n = \\displaystyle\\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^k$，其中 $\\binom{n}{k} = \\dfrac{n!}{k!(n-k)!}$\n\n**展开式第 $(r+1)$ 项（通项）**：$T_{r+1} = \\binom{n}{r} a^{n-r} b^r$\n\n常用：$(1+x)^n \\approx 1 + nx + \\dfrac{n(n-1)}{2!}x^2 + \\cdots$（$|x|\\ll 1$ 时近似）",
        keyPoints: [
          "找「含 $x^k$ 的项」：令通项中 $x$ 的指数 = $k$，解出 $r$",
          "Pascal 三角形只适合小 $n$；大 $n$ 直接用组合数公式",
          "ESAT 常考：展开 $(2-3x)^5$ 找特定项系数",
        ],
      },
      {
        name: "圆的坐标几何",
        body: "**标准形式**：$(x-a)^2 + (y-b)^2 = r^2$，圆心 $(a,b)$，半径 $r$\n\n**一般形式**：$x^2 + y^2 + Dx + Ey + F = 0$，配方转为标准形式：圆心 $\\left(-\\dfrac{D}{2}, -\\dfrac{E}{2}\\right)$\n\n**切线性质**：切线垂直于过切点的半径；切线方程可由斜率（= $-\\dfrac{1}{\\text{半径斜率}}$）推导\n\n**交点**：联立直线与圆方程，代入消元后解二次方程。",
        keyPoints: [
          "弦的中点与圆心连线垂直于弦",
          "过外部点 $P$ 作圆的切线，切点到 $P$ 的距离 $= \\sqrt{|PO|^2 - r^2}$",
          "ESAT 常见：判断直线与圆相交/相切/相离（用圆心到直线距离与 $r$ 比较）",
        ],
      },
    ],
    workedExamples: [
      {
        title: "例 1：等比级数与无穷和",
        question:
          "等比数列首项为 12，第三项为 3。求公比、无穷级数之和，以及第一个小于 0.1 的项是第几项。",
        solution:
          "设公比为 $r$，第三项 $= ar^2 = 12r^2 = 3 \\Rightarrow r^2 = 1/4 \\Rightarrow r = \\pm 1/2$。\n\n若 $r = 1/2$（正值）：$S_\\infty = \\dfrac{12}{1-1/2} = 24$\n\n若 $r = -1/2$：$S_\\infty = \\dfrac{12}{1+1/2} = 8$（两种情况均 $|r|<1$ 有无穷和）\n\n取 $r = 1/2$，第 $n$ 项 $a_n = 12 \\cdot (1/2)^{n-1} < 0.1$：\n$$\\left(\\frac{1}{2}\\right)^{n-1} < \\frac{0.1}{12} = \\frac{1}{120}$$\n$$(n-1)\\ln(1/2) < \\ln(1/120) \\Rightarrow n-1 > \\frac{\\ln 120}{\\ln 2} \\approx 6.91 \\Rightarrow n \\geq 8$$\n\n第 **8** 项是第一个小于 0.1 的项。",
        tip: "遇到两种公比时都要列出来，除非题目额外限制（如公比为正）。",
      },
      {
        title: "例 2：二项式定理——找特定项",
        question:
          "展开 $\\left(x + \\dfrac{2}{x}\\right)^6$，求不含 $x$ 的常数项。",
        solution:
          "通项 $T_{r+1} = \\binom{6}{r} x^{6-r} \\left(\\frac{2}{x}\\right)^r = \\binom{6}{r} 2^r \\cdot x^{6-r} \\cdot x^{-r} = \\binom{6}{r} 2^r x^{6-2r}$\n\n令 $x$ 的指数为 0：$6-2r = 0 \\Rightarrow r = 3$\n\n常数项 $= \\binom{6}{3} \\cdot 2^3 = 20 \\times 8 = \\mathbf{160}$",
        tip: "关键步骤：化简通项中 $x$ 的总指数，令其为目标值解 $r$；注意 $r$ 必须为非负整数。",
      },
      {
        title: "例 3：圆与直线相切",
        question:
          "圆 $C$：$x^2 + y^2 - 6x + 4y - 3 = 0$，直线 $l$：$y = kx + 1$。求 $l$ 与 $C$ 相切时 $k$ 的值。",
        solution:
          "配方得圆心 $(3, -2)$，半径 $r = \\sqrt{9+4+3} = 4$。\n\n直线 $kx - y + 1 = 0$，圆心到直线距离：\n$$d = \\frac{|3k - (-2) + 1|}{\\sqrt{k^2+1}} = \\frac{|3k+3|}{\\sqrt{k^2+1}}$$\n\n相切条件 $d = r = 4$：\n$$(3k+3)^2 = 16(k^2+1) \\Rightarrow 9k^2 + 18k + 9 = 16k^2 + 16$$\n$$7k^2 - 18k + 7 = 0 \\Rightarrow k = \\frac{18 \\pm \\sqrt{324-196}}{14} = \\frac{18 \\pm \\sqrt{128}}{14} = \\frac{9 \\pm 4\\sqrt{2}}{7}$$",
        tip: "相切 ⟺ 圆心到直线距离 = 半径；距离公式 $d = |Ax_0+By_0+C|/\\sqrt{A^2+B^2}$，先把直线化成 $Ax+By+C=0$ 形式。",
      },
    ],
  },
  {
    topicId: "esat-phys1",
    overview:
      "力学是 ESAT 物理模块最重要的考点，约占 40%。核心内容：SUVAT 运动学方程、牛顿三定律与合力分析、功能定理与能量守恒、动量守恒、圆周运动、引力。题目多为情景应用题，需要建立物理模型后列方程求解，矢量方向务必明确。",
    concepts: [
      {
        name: "SUVAT 运动学方程",
        body: "匀加速直线运动的五个量：位移 $s$，初速度 $u$，末速度 $v$，加速度 $a$，时间 $t$。\n\n$$v = u + at$$\n$$s = ut + \\tfrac{1}{2}at^2$$\n$$v^2 = u^2 + 2as$$\n$$s = \\tfrac{1}{2}(u+v)t$$\n$$s = vt - \\tfrac{1}{2}at^2$$\n\n**竖直抛体**：取向上为正，$a = -g = -9.81\\,\\text{m/s}^2$（ESAT 通常用 $g=10$）。抛体运动分解为水平（匀速）和竖直（匀加速）两个独立分量。",
        keyPoints: [
          "每个方程缺少五量中的一个，选不含未知量的那个方程",
          "注意方向：加速度与速度同向为加速，反向为减速",
          "抛体：水平 $x = u_x t$，竖直 $y = u_y t - \\frac{1}{2}gt^2$，两式联立消 $t$",
        ],
      },
      {
        name: "牛顿定律与受力分析",
        body: "**牛顿第二定律**：$\\vec{F}_{net} = m\\vec{a}$（注意是合力！）\n\n**受力分析步骤**：\n1. 隔离研究对象\n2. 画出所有力（重力 $mg$、法向力 $N$、摩擦力 $f$、绳张力 $T$ 等）\n3. 选定正方向，列方程\n\n**摩擦力**：$f_{max} = \\mu_s N$（静）；滑动摩擦 $f = \\mu_k N$\n\n**斜面问题**：平行方向 $ma = mg\\sin\\theta - f$；垂直方向 $N = mg\\cos\\theta$",
        keyPoints: [
          "连接体：绳子张力相同，加速度相同，列两个方程联立",
          "静摩擦力方向：与物体相对运动趋势方向相反",
          "ESAT 常考升降机题：超重 $N = m(g+a)$，失重 $N = m(g-a)$",
        ],
      },
      {
        name: "功能定理与能量守恒",
        body: "**功**：$W = Fs\\cos\\theta$（$\\theta$ 为力与位移夹角）\n\n**动能定理**：$W_{net} = \\Delta KE = \\tfrac{1}{2}mv^2 - \\tfrac{1}{2}mu^2$\n\n**机械能守恒**（只有重力/弹性力做功时）：$KE_1 + PE_1 = KE_2 + PE_2$\n\n**功率**：$P = \\dfrac{W}{t} = Fv$（瞬时功率）\n\n**效率**：$\\eta = \\dfrac{P_{useful}}{P_{input}}$\n\n非守恒情况（有摩擦）：$W_{friction} = -\\mu_k mg d$（负功），总能量 $= KE + PE + |W_{friction}|$",
        keyPoints: [
          "弹性势能 $E_p = \\frac{1}{2}kx^2$；弹簧问题常与能量守恒联用",
          "摩擦力做负功 = 转化为热能，不守恒时别忘记",
          "ESAT 高频：物体从高处滑下，求底部速度（用能量守恒比 SUVAT 更快）",
        ],
      },
      {
        name: "动量与冲量",
        body: "**动量**：$\\vec{p} = m\\vec{v}$；**冲量**：$\\vec{J} = \\vec{F}\\Delta t = \\Delta \\vec{p}$\n\n**动量守恒**（系统无外力或外力之和为零）：$m_1\\vec{u}_1 + m_2\\vec{u}_2 = m_1\\vec{v}_1 + m_2\\vec{v}_2$\n\n**碰撞分类**：\n- 弹性碰撞：动量 + 动能均守恒\n- 完全非弹性碰撞：碰后粘在一起，$v = \\dfrac{m_1 u_1 + m_2 u_2}{m_1+m_2}$\n- 非弹性碰撞：只有动量守恒",
        keyPoints: [
          "碰撞问题先写动量守恒，再看是否给出弹性条件（动能守恒）",
          "爆炸、反冲：分离前后动量之和不变（初始静止则总动量 = 0）",
          "方向：取正方向后，反向速度代入负值",
        ],
      },
    ],
    workedExamples: [
      {
        title: "例 1：抛体运动",
        question:
          "一物体从高 $45\\,\\text{m}$ 的悬崖边缘以水平速度 $20\\,\\text{m/s}$ 抛出，取 $g = 10\\,\\text{m/s}^2$。求：(a) 落地时间；(b) 落点距崖底的水平距离；(c) 落地时速度大小与方向。",
        solution:
          "(a) 竖直方向（向下为正，初速为 0）：$h = \\frac{1}{2}gt^2$\n$$45 = \\frac{1}{2}\\times 10 \\times t^2 \\Rightarrow t = 3\\,\\text{s}$$\n\n(b) 水平距离：$x = u_x t = 20 \\times 3 = 60\\,\\text{m}$\n\n(c) 落地时速度分量：\n- 水平：$v_x = 20\\,\\text{m/s}$\n- 竖直（向下）：$v_y = gt = 10\\times 3 = 30\\,\\text{m/s}$\n- 合速度：$v = \\sqrt{20^2+30^2} = \\sqrt{1300} = 10\\sqrt{13} \\approx 36.1\\,\\text{m/s}$\n- 角度：$\\theta = \\arctan(30/20) = \\arctan(1.5) \\approx 56.3°$（与水平方向夹角）",
        tip: "抛体运动：水平和竖直完全独立，分别列方程，最后合成。时间是连接两个方向的桥梁。",
      },
      {
        title: "例 2：能量守恒 + 摩擦",
        question:
          "质量 $2\\,\\text{kg}$ 的物体从 $5\\,\\text{m}$ 高的斜面滑下，斜面长 $10\\,\\text{m}$，动摩擦因数 $\\mu=0.2$，取 $g=10$。求到达底端的速度。",
        solution:
          "**法向力**：斜面倾角 $\\sin\\theta = 5/10 = 0.5 \\Rightarrow \\theta = 30°$，$N = mg\\cos30° = 2\\times10\\times\\frac{\\sqrt{3}}{2} = 10\\sqrt{3}\\,\\text{N}$\n\n**摩擦力**：$f = \\mu N = 0.2\\times10\\sqrt{3} = 2\\sqrt{3}\\,\\text{N}$\n\n**能量方程**：\n$$mgh = \\frac{1}{2}mv^2 + f\\cdot L$$\n$$2\\times10\\times5 = \\frac{1}{2}\\times2\\times v^2 + 2\\sqrt{3}\\times10$$\n$$100 = v^2 + 20\\sqrt{3}$$\n$$v^2 = 100 - 20\\sqrt{3} \\approx 100 - 34.6 = 65.4$$\n$$v \\approx 8.09\\,\\text{m/s}$$",
        tip: "有摩擦时不能简单用 $mgh=\\frac{1}{2}mv^2$；摩擦做功 = 摩擦力 × 路径长度（不是高度差）。",
      },
      {
        title: "例 3：完全非弹性碰撞",
        question:
          "质量 $3\\,\\text{kg}$ 的子弹以 $400\\,\\text{m/s}$ 射入静止的 $7\\,\\text{kg}$ 木块并嵌入其中，求碰后共同速度，以及损失的动能。",
        solution:
          "动量守恒：\n$$m_1 u_1 = (m_1+m_2)v$$\n$$3\\times400 = (3+7)\\times v \\Rightarrow v = 120\\,\\text{m/s}$$\n\n碰前总动能：$KE_i = \\frac{1}{2}\\times3\\times400^2 = 240\\,000\\,\\text{J}$\n\n碰后动能：$KE_f = \\frac{1}{2}\\times10\\times120^2 = 72\\,000\\,\\text{J}$\n\n损失动能：$\\Delta KE = 240000 - 72000 = 168\\,000\\,\\text{J} = 168\\,\\text{kJ}$",
        tip: "完全非弹性碰撞动能损失最大（但不是全部损失，除非在质心参考系）。损失的动能转为热和形变能。",
      },
    ],
  },
  {
    topicId: "esat-phys2",
    overview:
      "电磁学约占物理模块 30%，重点考查：电场与库仑定律、电路（欧姆定律、基尔霍夫定律、功率）、磁场中的带电粒子运动、电磁感应（法拉第定律、楞次定律）。Cambridge 题目常将电磁学与力学结合，如带电粒子在磁场中做圆周运动。",
    concepts: [
      {
        name: "电场与库仑定律",
        body: "**库仑定律**：两点电荷间的力：$F = k\\dfrac{q_1 q_2}{r^2}$，其中 $k = 8.99\\times10^9\\,\\text{N·m}^2/\\text{C}^2$\n\n**电场强度**：$E = \\dfrac{F}{q} = k\\dfrac{Q}{r^2}$（点电荷产生）；方向由正电荷指向负电荷\n\n**电位（电势）**：$V = k\\dfrac{Q}{r}$；电位差 $\\Delta V = V_A - V_B$；移动电荷做功 $W = q\\Delta V$\n\n**匀强电场**：平行板电容器，$E = \\dfrac{V}{d}$（$V$ 为板间电压，$d$ 为间距）",
        keyPoints: [
          "电场力 $F = qE$，方向：正电荷与 $E$ 同向，负电荷反向",
          "电场中粒子加速：动能增量 $= qV$（$V$ 为加速电压）",
          "ESAT 高频：平行板间匀强电场类似重力场，竖直方向有匀加速",
        ],
      },
      {
        name: "直流电路",
        body: "**欧姆定律**：$V = IR$\n\n**串联**：$R_{total} = R_1 + R_2 + \\cdots$，电流相同，电压分配\n\n**并联**：$\\dfrac{1}{R_{total}} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2} + \\cdots$，电压相同，电流分配\n\n**基尔霍夫定律**：\n- KCL（节点定律）：流入节点的电流之和 = 流出电流之和\n- KVL（回路定律）：回路中所有电压降之和 = 0\n\n**功率**：$P = IV = I^2R = V^2/R$",
        keyPoints: [
          "含内阻的电源：路端电压 $V = \\varepsilon - Ir$（$\\varepsilon$ 为电动势，$r$ 为内阻）",
          "分压器：$V_{out} = V_{in} \\times \\dfrac{R_2}{R_1+R_2}$",
          "ESAT 考题：混联电路求等效电阻、各支路电流、各元件功率",
        ],
      },
      {
        name: "磁场与带电粒子",
        body: "**安培力**（载流导体）：$F = BIL\\sin\\theta$，方向由左手定则（力 $\\perp$ 磁场 $\\perp$ 电流）\n\n**洛伦兹力**（运动电荷）：$F = qvB\\sin\\theta$，$\\theta$ 为 $v$ 与 $B$ 夹角\n\n**带电粒子在匀强磁场中的圆周运动**（$v \\perp B$）：\n$$qvB = \\frac{mv^2}{r} \\Rightarrow r = \\frac{mv}{qB}$$\n周期 $T = \\dfrac{2\\pi m}{qB}$（与速度无关！）",
        keyPoints: [
          "洛伦兹力不做功（力 $\\perp$ 速度），只改变运动方向，不改变速率",
          "判断方向：右手定则（正电荷）；或记「$v\\times B$方向即力方向」",
          "质谱仪原理：先用电场加速，再用磁场偏转，由半径推质荷比",
        ],
      },
    ],
    workedExamples: [
      {
        title: "例 1：平行板间粒子运动",
        question:
          "质子（$m = 1.67\\times10^{-27}\\,\\text{kg}$，$q = 1.6\\times10^{-19}\\,\\text{C}$）从静止经 $500\\,\\text{V}$ 电压加速后，进入板间距 $d = 0.05\\,\\text{m}$、板长 $L = 0.1\\,\\text{m}$ 的偏转电容器，偏转电压 $U = 100\\,\\text{V}$。求：(a) 进入偏转场的初速度；(b) 经过偏转场后的竖直位移。",
        solution:
          "(a) 加速：$qV_0 = \\frac{1}{2}mv^2$\n$$v = \\sqrt{\\frac{2qV_0}{m}} = \\sqrt{\\frac{2\\times1.6\\times10^{-19}\\times500}{1.67\\times10^{-27}}} \\approx 3.09\\times10^5\\,\\text{m/s}$$\n\n(b) 偏转场中：$E = U/d = 100/0.05 = 2000\\,\\text{V/m}$\n加速度 $a = qE/m = 1.6\\times10^{-19}\\times2000/(1.67\\times10^{-27}) \\approx 1.92\\times10^{11}\\,\\text{m/s}^2$\n\n通过时间 $t = L/v = 0.1/(3.09\\times10^5) \\approx 3.24\\times10^{-7}\\,\\text{s}$\n\n竖直位移：$y = \\frac{1}{2}at^2 = \\frac{1}{2}\\times1.92\\times10^{11}\\times(3.24\\times10^{-7})^2 \\approx 0.010\\,\\text{m} = 1.0\\,\\text{cm}$",
        tip: "带电粒子偏转 = 斜抛运动：水平匀速，竖直匀加速。先从加速阶段求初速，再套 SUVAT。",
      },
      {
        title: "例 2：混联电路",
        question:
          "电路由 $R_1=6\\,\\Omega$ 串联 ($R_2=3\\,\\Omega$ 与 $R_3=6\\,\\Omega$ 并联) 组成，总电压 $12\\,\\text{V}$，内阻不计。求各电阻电流与功率。",
        solution:
          "并联部分等效：$R_{23} = \\dfrac{3\\times6}{3+6} = 2\\,\\Omega$\n\n总电阻：$R_{total} = 6+2 = 8\\,\\Omega$\n\n总电流（通过 $R_1$）：$I_1 = \\dfrac{12}{8} = 1.5\\,\\text{A}$\n\n并联两端电压：$V_{23} = I_1 \\times R_{23} = 1.5\\times2 = 3\\,\\text{V}$\n\n$I_2 = 3/3 = 1\\,\\text{A}$；$I_3 = 3/6 = 0.5\\,\\text{A}$（验证：$1+0.5=1.5\\,\\text{A}$ ✓）\n\n功率：$P_1 = 1.5^2\\times6 = 13.5\\,\\text{W}$；$P_2 = 1^2\\times3 = 3\\,\\text{W}$；$P_3 = 0.5^2\\times6 = 1.5\\,\\text{W}$",
        tip: "混联电路解题顺序：先化简并联求等效，再算总电流，再拆回各支路。",
      },
      {
        title: "例 3：磁场中圆周运动",
        question:
          "电子（$m = 9.11\\times10^{-31}\\,\\text{kg}$，$q = 1.6\\times10^{-19}\\,\\text{C}$）以速度 $2\\times10^6\\,\\text{m/s}$ 垂直进入 $B = 0.05\\,\\text{T}$ 的匀强磁场，求圆周运动半径和周期。",
        solution:
          "洛伦兹力提供向心力：$qvB = \\dfrac{mv^2}{r}$\n$$r = \\frac{mv}{qB} = \\frac{9.11\\times10^{-31}\\times2\\times10^6}{1.6\\times10^{-19}\\times0.05} = \\frac{1.822\\times10^{-24}}{8\\times10^{-21}} \\approx 2.28\\times10^{-4}\\,\\text{m} = 0.228\\,\\text{mm}$$\n\n周期：$T = \\dfrac{2\\pi m}{qB} = \\dfrac{2\\pi\\times9.11\\times10^{-31}}{1.6\\times10^{-19}\\times0.05} \\approx 7.16\\times10^{-10}\\,\\text{s}$\n\n注意：$T$ 与速度无关，这是质谱仪和回旋加速器工作的理论基础。",
        tip: "ESAT 考点：由 $r$ 反推粒子质量（质谱仪）；周期与速度无关意味着同一粒子在匀强磁场中周期恒定，无论速度大小。",
      },
    ],
  },
  {
    topicId: "esat-phys3",
    overview:
      "波与现代物理约占物理模块 30%，覆盖：波动方程与波的性质（反射、折射、衍射、干涉）、驻波与共鸣、光电效应与量子力学基础、原子核衰变与核反应（质量-能量等价）。这部分公式密度高，建议通过刷题建立公式条件反射。",
    concepts: [
      {
        name: "波的基本性质",
        body: "**波动方程**：$v = f\\lambda$（波速 = 频率 × 波长）\n\n**波的类型**：\n- 横波：振动方向 $\\perp$ 传播方向（光、电磁波）\n- 纵波：振动方向 $\\parallel$ 传播方向（声波）\n\n**干涉**：两列相干波叠加\n- 相长干涉（加强）：路径差 $\\Delta = n\\lambda$（$n \\in \\mathbb{Z}$）\n- 相消干涉（减弱）：路径差 $\\Delta = (n+\\frac{1}{2})\\lambda$\n\n**衍射**：缝宽 $\\approx \\lambda$ 时衍射最明显；单缝衍射第一暗纹角度 $\\sin\\theta = \\lambda/a$",
        keyPoints: [
          "折射定律（斯涅尔定律）：$n_1\\sin\\theta_1 = n_2\\sin\\theta_2$，$n = c/v$",
          "全内反射：仅当光从光密到光疏，且入射角 > 临界角 $\\theta_c = \\arcsin(n_2/n_1)$",
          "双缝干涉条纹间距：$\\Delta y = \\lambda D/d$（$D$=屏距，$d$=缝距）",
        ],
      },
      {
        name: "驻波",
        body: "两列振幅相同、方向相反的行波叠加形成**驻波**。\n\n**弦上驻波**（两端固定）：$L = n\\dfrac{\\lambda}{2}$（$n = 1, 2, 3, \\ldots$），基频 $f_1 = \\dfrac{v}{2L}$，泛音 $f_n = nf_1$\n\n**管内驻波**：\n- 两端开口：$L = n\\dfrac{\\lambda}{2}$，$f_n = \\dfrac{nv}{2L}$（含所有谐波）\n- 一端开口一端封闭：$L = (2n-1)\\dfrac{\\lambda}{4}$，$f_n = \\dfrac{(2n-1)v}{4L}$（只含奇次谐波）",
        keyPoints: [
          "波节（node）：振幅为零的点；波腹（antinode）：振幅最大的点",
          "固定端 = 波节；自由端 = 波腹",
          "ESAT 常考：给定管长求基频，或基频求管长",
        ],
      },
      {
        name: "光电效应与量子物理",
        body: "**光电效应**（Einstein 解释，1905）：光由光子组成，每个光子能量 $E = hf = \\dfrac{hc}{\\lambda}$\n\n**光电方程**：$hf = \\Phi + KE_{max}$\n- $\\Phi = hf_0$：逸出功（截止频率 $f_0$ 对应）\n- $KE_{max} = \\frac{1}{2}mv_{max}^2$：最大初动能\n\n**截止电压**（遏止电压）：$eV_s = KE_{max}$\n\n**德布罗意波长**：$\\lambda = \\dfrac{h}{mv} = \\dfrac{h}{p}$（粒子的物质波波长）",
        keyPoints: [
          "$h = 6.626\\times10^{-34}\\,\\text{J·s}$，$c = 3\\times10^8\\,\\text{m/s}$，$eV = 1.6\\times10^{-19}\\,\\text{J}$",
          "频率低于截止频率 $f_0$ 时，无论光强多大均不产生光电效应",
          "增大光强：光电流增大（光子数多）；提高频率：最大初动能增大",
        ],
      },
      {
        name: "核物理基础",
        body: "**放射性衰变**：$N(t) = N_0 e^{-\\lambda t} = N_0 \\left(\\frac{1}{2}\\right)^{t/T_{1/2}}$\n\n**半衰期**：$T_{1/2} = \\dfrac{\\ln 2}{\\lambda} \\approx \\dfrac{0.693}{\\lambda}$\n\n**质能方程**：$E = mc^2$；核反应中质量亏损 $\\Delta m$ 释放能量 $\\Delta E = \\Delta m c^2$\n\n**核反应守恒**：质量数（A）守恒，原子序数（Z）守恒\n- $\\alpha$ 衰变：$A-4$，$Z-2$\n- $\\beta^-$ 衰变：$A$ 不变，$Z+1$（中子 → 质子 + 电子 + 反中微子）",
        keyPoints: [
          "1 原子质量单位 $u = 931.5\\,\\text{MeV}/c^2 = 1.66\\times10^{-27}\\,\\text{kg}$",
          "半衰期题型：经过 $n$ 个半衰期，剩余 $N_0/2^n$",
          "ESAT 常考：写出完整核方程，补全未知粒子的 A 和 Z",
        ],
      },
    ],
    workedExamples: [
      {
        title: "例 1：双缝干涉",
        question:
          "双缝间距 $d = 0.5\\,\\text{mm}$，缝到屏距离 $D = 2\\,\\text{m}$，相邻亮纹间距 $\\Delta y = 2.4\\,\\text{mm}$。求光的波长，并说明若将双缝间距缩小为原来一半，条纹间距如何变化。",
        solution:
          "由公式 $\\Delta y = \\dfrac{\\lambda D}{d}$：\n$$\\lambda = \\frac{\\Delta y \\cdot d}{D} = \\frac{2.4\\times10^{-3}\\times0.5\\times10^{-3}}{2} = 6\\times10^{-7}\\,\\text{m} = 600\\,\\text{nm}$$\n（橙色可见光）\n\n若 $d' = d/2$，则 $\\Delta y' = \\dfrac{\\lambda D}{d/2} = 2\\Delta y = 4.8\\,\\text{mm}$——条纹间距**翻倍**。",
        tip: "记忆 $\\Delta y = \\lambda D/d$：波长越长、屏越远、缝越近，条纹越宽。物理直觉：衍射角 $\\approx \\lambda/d$，屏距 $D$ 放大为条纹间距。",
      },
      {
        title: "例 2：光电效应",
        question:
          "某金属逸出功 $\\Phi = 2.0\\,\\text{eV}$，用波长 $\\lambda = 250\\,\\text{nm}$ 的紫外线照射。求：(a) 光子能量；(b) 光电子最大初动能；(c) 截止电压。",
        solution:
          "(a) 光子能量：\n$$E = \\frac{hc}{\\lambda} = \\frac{6.626\\times10^{-34}\\times3\\times10^8}{250\\times10^{-9}} = 7.95\\times10^{-19}\\,\\text{J} = \\frac{7.95\\times10^{-19}}{1.6\\times10^{-19}}\\,\\text{eV} \\approx 4.97\\,\\text{eV}$$\n\n(b) 最大初动能：$KE_{max} = E - \\Phi = 4.97 - 2.0 = 2.97\\,\\text{eV}$\n\n(c) 截止电压：$eV_s = KE_{max}$，$V_s = 2.97\\,\\text{V}$",
        tip: "换算：$1\\,\\text{eV} = 1.6\\times10^{-19}\\,\\text{J}$；直接用 eV 做单位计算通常更简洁。截止电压 = 最大初动能（以 eV 表示）。",
      },
      {
        title: "例 3：放射性半衰期",
        question:
          "某放射性样品初始活度为 $A_0 = 1600\\,\\text{Bq}$，经 $12$ 小时后活度降至 $200\\,\\text{Bq}$。求半衰期，以及再经过 $6$ 小时后的活度。",
        solution:
          "活度与粒子数成正比，所以 $A(t) = A_0 (1/2)^{t/T_{1/2}}$。\n\n$$\\frac{200}{1600} = \\left(\\frac{1}{2}\\right)^{12/T_{1/2}} \\Rightarrow \\left(\\frac{1}{2}\\right)^3 = \\left(\\frac{1}{2}\\right)^{12/T_{1/2}} \\Rightarrow T_{1/2} = 4\\,\\text{h}$$\n\n再经 6 小时 = 再经 1.5 个半衰期：\n$$A = 200\\times\\left(\\frac{1}{2}\\right)^{6/4} = 200\\times\\left(\\frac{1}{2}\\right)^{1.5} = \\frac{200}{2\\sqrt{2}} = \\frac{200}{2.828} \\approx 70.7\\,\\text{Bq}$$",
        tip: "先数「经过几个半衰期」（$1600 \\to 800 \\to 400 \\to 200$，3 次）再求 $T_{1/2}$，比直接用对数公式更快；但非整数半衰期必须用指数公式。",
      },
    ],
  },
];
