// MAT / STEP 知识点讲解（learn 页内容）。
// 此前 MAT、STEP 没有讲解，点「学习讲解」会 404；这里补齐 15 个知识点。
// 结构与 ./esat.ts 中 TopicKnowledge 一致，在 index.ts 合并。

import type { TopicKnowledge } from "./esat";

export const MAT_STEP_KNOWLEDGE: TopicKnowledge[] = [
  // ═══════════════════ MAT ═══════════════════
  {
    topicId: "mat-poly",
    overview:
      "多项式与代数是 MAT 的基石：因式定理、多项式除法、韦达定理、二项式展开几乎每年都考，且常以多步组合题出现。MAT 第一题（5 选 1）尤其偏爱用这些工具做快速判断。",
    concepts: [
      {
        name: "因式定理与余式定理",
        body: "**余式定理**：多项式 $f(x)$ 除以 $(x-a)$ 的余数为 $f(a)$。**因式定理**：$(x-a)$ 是 $f(x)$ 的因式 $\\\\iff f(a)=0$。\\n\\n用于：判断/寻找根、由已知因式反求系数、分解高次多项式。",
        keyPoints: [
          "求余数不必做长除法，直接代入 $x=a$",
          "已知 $(x-a)$ 为因式 → 令 $f(a)=0$ 解未知系数",
          "找到一个根后用除法降次，再分解剩余二次",
        ],
      },
      {
        name: "韦达定理（根与系数）",
        body: "对 $ax^2+bx+c=0$，根 $\\\\alpha,\\\\beta$ 满足 $\\\\alpha+\\\\beta=-\\\\dfrac{b}{a}$，$\\\\alpha\\\\beta=\\\\dfrac{c}{a}$。\\n\\n常配合恒等式：$\\\\alpha^2+\\\\beta^2=(\\\\alpha+\\\\beta)^2-2\\\\alpha\\\\beta$，$\\\\dfrac{1}{\\\\alpha}+\\\\dfrac{1}{\\\\beta}=\\\\dfrac{\\\\alpha+\\\\beta}{\\\\alpha\\\\beta}$。",
        keyPoints: [
          "不解方程也能求对称式（和、积、平方和等）",
          "三次方程也有类似关系：和 $=-b/a$、两两积之和 $=c/a$、积 $=-d/a$",
          "构造以某对称式为根的新方程是常见技巧",
        ],
      },
      {
        name: "二项式展开",
        body: "$(1+x)^n=\\\\sum_{r=0}^{n}\\\\binom{n}{r}x^r$；一般项 $(a+b)^n$ 的第 $r+1$ 项为 $\\\\binom{n}{r}a^{n-r}b^r$。\\n\\n求特定项系数时只需锁定对应的 $r$，不必展开全部。",
        keyPoints: [
          "$\\\\binom{n}{r}=\\\\dfrac{n!}{r!(n-r)!}$",
          "求 $x^k$ 系数：令幂次方程 $=k$ 解出 $r$ 再代入",
          "注意括号内系数（如 $(2+x)^n$ 的 $2^{n-r}$）",
        ],
      },
    ],
    workedExamples: [
      {
        title: "因式定理求系数",
        question: "已知 $(x-2)$ 是 $x^3-3x^2+kx-2$ 的因式，求 $k$。",
        answer: "k=3",
        solution:
          "由因式定理 $f(2)=0$：$8-12+2k-2=2k-6=0\\\\Rightarrow k=3$。",
        tip: "见到『……是……的因式』，立刻令对应的 $f(a)=0$。",
      },
    ],
  },
  {
    topicId: "mat-trig",
    overview:
      "三角部分考查恒等式化简、方程在给定区间内求解，以及 $\\\\sin/\\\\cos/\\\\tan$ 图像的平移与伸缩。MAT 常把三角与代数、图像结合成判断题。",
    concepts: [
      {
        name: "核心恒等式",
        body: "$\\\\sin^2\\\\theta+\\\\cos^2\\\\theta=1$；$\\\\tan\\\\theta=\\\\dfrac{\\\\sin\\\\theta}{\\\\cos\\\\theta}$。\\n\\n二倍角：$\\\\sin2\\\\theta=2\\\\sin\\\\theta\\\\cos\\\\theta$，$\\\\cos2\\\\theta=\\\\cos^2\\\\theta-\\\\sin^2\\\\theta=1-2\\\\sin^2\\\\theta=2\\\\cos^2\\\\theta-1$。",
        keyPoints: [
          "$1-\\\\cos^2\\\\theta=\\\\sin^2\\\\theta$ 是化简的高频替换",
          "$\\\\cos2\\\\theta$ 的三种形式按需选用",
          "遇到 $\\\\sin\\\\theta\\\\cos\\\\theta$ 想到二倍角",
        ],
      },
      {
        name: "方程在区间内求解",
        body: "解三角方程时先求主值，再依函数符号在各象限补出区间内全部解。\\n\\n如 $\\\\sin x=k$ 在 $[0,360^\\\\circ]$：第一、二象限各一解；$\\\\cos x=k$：一、四象限；$\\\\tan x=k$：一、三象限。",
        keyPoints: [
          "务必按题目给定区间数清解的个数",
          "$\\\\sin x=k(k>0)$ → $x$ 与 $180^\\\\circ-x$",
          "先换元（如令 $u=2x$）再回代区间，别漏解",
        ],
      },
      {
        name: "图像变换",
        body: "$y=f(x)+a$ 上移 $a$；$y=f(x-a)$ 右移 $a$；$y=af(x)$ 纵向伸缩 $a$ 倍；$y=f(bx)$ 横向压缩到 $1/b$。\\n\\n如 $y=\\\\sin(2x)$ 周期变为 $180^\\\\circ$，$y=2\\\\sin x$ 振幅变为 2。",
        keyPoints: [
          "括号内变换『反直觉』：$f(x-a)$ 是右移、$f(bx)$ 是压缩",
          "周期 $=\\\\dfrac{360^\\\\circ}{b}$（角度）",
          "组合变换注意先后顺序",
        ],
      },
    ],
    workedExamples: [
      {
        title: "化简",
        question: "化简 $\\\\dfrac{\\\\sin^2\\\\theta}{1-\\\\cos^2\\\\theta}$。",
        answer: "1",
        solution:
          "因 $1-\\\\cos^2\\\\theta=\\\\sin^2\\\\theta$，原式 $=\\\\dfrac{\\\\sin^2\\\\theta}{\\\\sin^2\\\\theta}=1$。",
        tip: "看到 $1-\\\\cos^2$ 或 $1-\\\\sin^2$ 立刻替换。",
      },
    ],
  },
  {
    topicId: "mat-calc",
    overview:
      "微积分基础考查求导（幂法则）、积分（含定积分求面积）、驻点与极值判断。MAT 常把『切线 / 面积 / 极值』和坐标几何结合成多步题。",
    concepts: [
      {
        name: "求导与切线",
        body: "幂法则 $\\\\dfrac{d}{dx}x^n=nx^{n-1}$。曲线在 $x=a$ 处切线斜率 $=f'(a)$；法线斜率 $=-\\\\dfrac{1}{f'(a)}$。\\n\\n切线方程：$y-f(a)=f'(a)(x-a)$。",
        keyPoints: [
          "切线斜率 = 该点导数值",
          "法线与切线斜率乘积为 $-1$",
          "平行于某直线 → 令导数等于该直线斜率",
        ],
      },
      {
        name: "驻点与极值",
        body: "驻点处 $f'(x)=0$。用二阶导判断：$f''>0$ 为极小，$f''<0$ 为极大，$f''=0$ 需进一步判断（如拐点）。",
        keyPoints: [
          "先解 $f'(x)=0$ 求驻点横坐标",
          "$f''(x)$ 的符号定极大/极小",
          "三次曲线通常一极大一极小",
        ],
      },
      {
        name: "积分与面积",
        body: "$\\\\int x^n\\\\,dx=\\\\dfrac{x^{n+1}}{n+1}+c$（$n\\\\neq-1$）。定积分 $\\\\int_a^b f(x)\\\\,dx$ 给出曲线与 $x$ 轴间的有向面积。\\n\\n两曲线间面积 $=\\\\int_a^b(\\\\text{上}-\\\\text{下})\\\\,dx$。",
        keyPoints: [
          "定积分先求原函数再代上下限相减",
          "面积题先求交点定积分上下限",
          "曲线在 $x$ 轴下方时积分为负，按面积取绝对值",
        ],
      },
    ],
    workedExamples: [
      {
        title: "曲线间面积",
        question: "求 $y=x$ 与 $y=x^2$ 在 $x=0$ 到 $x=1$ 之间围成的面积。",
        answer: "1/6",
        solution:
          "上为 $y=x$，下为 $y=x^2$：$\\\\int_0^1(x-x^2)\\\\,dx=\\\\left[\\\\tfrac{x^2}{2}-\\\\tfrac{x^3}{3}\\\\right]_0^1=\\\\tfrac12-\\\\tfrac13=\\\\tfrac16$。",
        tip: "先判断哪条在上，面积 = ∫(上−下)。",
      },
    ],
  },
  {
    topicId: "mat-log",
    overview:
      "对数与指数考查 $\\\\ln/e$ 性质、对数运算律、指数方程与增长模型。MAT 常借对数律把复杂方程化简为线性方程。",
    concepts: [
      {
        name: "对数运算律",
        body: "$\\\\log(ab)=\\\\log a+\\\\log b$；$\\\\log\\\\dfrac{a}{b}=\\\\log a-\\\\log b$；$\\\\log a^n=n\\\\log a$；换底 $\\\\log_b a=\\\\dfrac{\\\\ln a}{\\\\ln b}$。",
        keyPoints: [
          "乘除化加减、幂化系数",
          "$\\\\log_b 1=0$，$\\\\log_b b=1$",
          "$\\\\log_b(1/b)=-1$",
        ],
      },
      {
        name: "指数方程",
        body: "化同底比较指数：$a^{f(x)}=a^{g(x)}\\\\Rightarrow f(x)=g(x)$。不同底时两边取对数。\\n\\n如 $2^{x+1}=16=2^4\\\\Rightarrow x+1=4$。",
        keyPoints: [
          "优先尝试化成同底",
          "$e^x$ 与 $\\\\ln x$ 互为反函数：$e^{\\\\ln a}=a$",
          "形如 $e^{2x}-3e^x+2=0$ 可令 $u=e^x$ 化二次",
        ],
      },
      {
        name: "指数增长与衰减",
        body: "模型 $N=N_0 e^{kt}$（$k>0$ 增长，$k<0$ 衰减）或 $N=N_0 a^t$。半衰期/倍增时间由 $\\\\ln$ 求出。",
        keyPoints: [
          "倍增：$2=e^{kT}\\\\Rightarrow T=\\\\dfrac{\\\\ln2}{k}$",
          "题中『每……翻倍/减半』提示几何变化",
          "图像在半对数坐标下为直线",
        ],
      },
    ],
    workedExamples: [
      {
        title: "对数方程",
        question: "解 $\\\\log_2 x+\\\\log_2(x-2)=3$。",
        answer: "x=4",
        solution:
          "合并：$\\\\log_2[x(x-2)]=3\\\\Rightarrow x^2-2x=8\\\\Rightarrow(x-4)(x+2)=0$。因需 $x>2$，舍去 $-2$，得 $x=4$。",
        tip: "对数方程务必回代检验定义域（真数 > 0）。",
      },
    ],
  },
  {
    topicId: "mat-geo",
    overview:
      "坐标几何考查直线、圆、抛物线及其相交与切线。MAT 常用『判别式判断交点个数』『圆心半径配方』等技巧。",
    concepts: [
      {
        name: "直线",
        body: "斜率 $m=\\\\dfrac{y_2-y_1}{x_2-x_1}$；点斜式 $y-y_1=m(x-x_1)$。两直线垂直 $\\\\iff m_1m_2=-1$，平行 $\\\\iff m_1=m_2$。",
        keyPoints: [
          "中点 $\\\\left(\\\\dfrac{x_1+x_2}{2},\\\\dfrac{y_1+y_2}{2}\\\\right)$",
          "距离 $\\\\sqrt{(\\\\Delta x)^2+(\\\\Delta y)^2}$",
          "垂直平分线：过中点且斜率为负倒数",
        ],
      },
      {
        name: "圆",
        body: "圆 $(x-a)^2+(y-b)^2=r^2$，圆心 $(a,b)$、半径 $r$。一般式 $x^2+y^2+Dx+Ey+F=0$ 通过配方化为标准式。",
        keyPoints: [
          "配方求圆心半径",
          "切线与半径垂直",
          "点到圆心距离与 $r$ 比较判断点的内外",
        ],
      },
      {
        name: "相交与判别式",
        body: "把直线代入曲线得二次方程，判别式 $\\\\Delta$：$>0$ 两交点、$=0$ 相切、$<0$ 不相交。",
        keyPoints: [
          "求交点个数用判别式，不必真解",
          "相切条件 $\\\\Delta=0$ 常用来反求参数",
          "联立后注意整理成标准二次",
        ],
      },
    ],
    workedExamples: [
      {
        title: "直线与圆的交点个数",
        question: "$y=x+1$ 与圆 $x^2+y^2=25$ 有几个交点？",
        answer: "2",
        solution:
          "代入：$x^2+(x+1)^2=25\\\\Rightarrow 2x^2+2x-24=0\\\\Rightarrow x^2+x-12=0$，$\\\\Delta=1+48=49>0$，故两个交点。",
        tip: "判别式 > 0 即两交点，无需把交点解出来。",
      },
    ],
  },
  {
    topicId: "mat-seq",
    overview:
      "数列与级数考查等差/等比的通项与求和、递推关系、以及无穷等比级数的极限。MAT 偏爱把数列嵌入函数或求和恒等式。",
    concepts: [
      {
        name: "等差数列 (AP)",
        body: "通项 $a_n=a+(n-1)d$；前 $n$ 项和 $S_n=\\\\dfrac{n}{2}[2a+(n-1)d]=\\\\dfrac{n}{2}(a_1+a_n)$。",
        keyPoints: [
          "$d$ 为公差（相邻项之差恒定）",
          "$1+2+\\\\cdots+n=\\\\dfrac{n(n+1)}{2}$",
          "已知两项可解 $a$ 与 $d$",
        ],
      },
      {
        name: "等比数列 (GP)",
        body: "通项 $a_n=ar^{n-1}$；前 $n$ 项和 $S_n=\\\\dfrac{a(r^n-1)}{r-1}$（$r\\\\neq1$）。当 $|r|<1$，无穷和 $S_\\\\infty=\\\\dfrac{a}{1-r}$。",
        keyPoints: [
          "$r$ 为公比（相邻项之比恒定）",
          "无穷和仅在 $|r|<1$ 时存在",
          "两项之比可定 $r$（如 $a_5/a_3=r^2$）",
        ],
      },
      {
        name: "递推与极限",
        body: "递推 $a_{n+1}=f(a_n)$ 描述数列演化。若收敛到 $L$，则 $L=f(L)$（不动点）。",
        keyPoints: [
          "求极限令 $a_{n+1}=a_n=L$ 解方程",
          "判断收敛需看 $f$ 的性质",
          "MAT 常给递推求前几项或通项规律",
        ],
      },
    ],
    workedExamples: [
      {
        title: "无穷等比和",
        question: "求 $12+6+3+\\\\cdots$ 的无穷和。",
        answer: "24",
        solution:
          "$a=12,\\\\ r=\\\\tfrac12$（$|r|<1$）：$S_\\\\infty=\\\\dfrac{12}{1-\\\\tfrac12}=24$。",
        tip: "先确认 $|r|<1$ 才能用无穷和公式。",
      },
    ],
  },
  {
    topicId: "mat-logic",
    overview:
      "逻辑与证明是 MAT 的特色：数学归纳法、反例否定命题、充分必要条件、逻辑蕴含。第一题里常出现『以下哪个陈述为真/为假』的判断。",
    concepts: [
      {
        name: "数学归纳法",
        body: "证明对所有 $n\\\\ge n_0$ 成立：①**基础步**验证 $n=n_0$；②**归纳步**假设 $n=k$ 成立，推出 $n=k+1$ 成立。",
        keyPoints: [
          "两步缺一不可",
          "归纳步要『用上』归纳假设",
          "适合证明求和公式、整除性、不等式",
        ],
      },
      {
        name: "反例与全称命题",
        body: "『对所有 $x$，$P(x)$』为假，只需找**一个**反例。『存在 $x$ 使 $P(x)$』为真，只需找**一个**例子。",
        keyPoints: [
          "否定全称命题 → 举一个反例足矣",
          "不能用例子『证明』全称命题（只能否定）",
          "MAT 判断题常靠快速找反例排除选项",
        ],
      },
      {
        name: "充分与必要",
        body: "$A\\\\Rightarrow B$：$A$ 是 $B$ 的充分条件，$B$ 是 $A$ 的必要条件。$A\\\\iff B$ 为充要。\\n\\n注意 $A\\\\Rightarrow B$ 不代表 $B\\\\Rightarrow A$。",
        keyPoints: [
          "『充分』在前，『必要』在后",
          "逆命题不一定成立",
          "逆否命题与原命题等价",
        ],
      },
    ],
    workedExamples: [
      {
        title: "归纳法证明求和",
        question: "用归纳法证明 $1+2+\\\\cdots+n=\\\\dfrac{n(n+1)}{2}$ 的归纳步关键是什么？",
        answer: "用 n=k 的假设推 n=k+1",
        solution:
          "假设 $1+\\\\cdots+k=\\\\dfrac{k(k+1)}{2}$，则 $1+\\\\cdots+k+(k+1)=\\\\dfrac{k(k+1)}{2}+(k+1)=\\\\dfrac{(k+1)(k+2)}{2}$，正是 $n=k+1$ 的形式，得证。",
        tip: "归纳步一定要把上一步的假设代进来。",
      },
    ],
  },
  {
    topicId: "mat-cs",
    overview:
      "算法与计算仅针对计算机科学方向考生：基础算法思想、时间复杂度的直观估计、以及逻辑推理。重在概念理解而非编程实现。",
    concepts: [
      {
        name: "算法与伪代码",
        body: "算法是解决问题的有限步骤。MAT 常给一段伪代码或流程，要求追踪其输出或判断其作用（如排序、查找、计数）。",
        keyPoints: [
          "逐步『手动执行』追踪变量值",
          "注意循环边界与终止条件",
          "关注算法『做了什么』而非语法",
        ],
      },
      {
        name: "时间复杂度直观",
        body: "用『随输入规模 $n$ 增长，操作次数如何增长』来比较：常见有常数 $O(1)$、线性 $O(n)$、平方 $O(n^2)$、对数 $O(\\\\log n)$。",
        keyPoints: [
          "嵌套循环往往是 $O(n^2)$",
          "每次折半的查找是 $O(\\\\log n)$",
          "比较算法效率看增长阶，不看常数",
        ],
      },
      {
        name: "逻辑推理",
        body: "组合计数、奇偶性、抽屉原理等离散思想常出现：用结构性论证而非穷举得到结论。",
        keyPoints: [
          "抽屉原理：$n+1$ 个物体放进 $n$ 个抽屉必有重复",
          "奇偶不变量常用于证明『不可能'",
          "先找规律再一般化",
        ],
      },
    ],
    workedExamples: [
      {
        title: "复杂度比较",
        question: "一个对长度 $n$ 数组『每次折半查找』的算法，其时间复杂度约为？",
        answer: "O(log n)",
        solution:
          "每一步把搜索范围缩小一半，所需步数约为 $\\\\log_2 n$，故为 $O(\\\\log n)$（二分查找）。",
        tip: "『每次减半』是对数复杂度的标志。",
      },
    ],
  },

  // ═══════════════════ STEP ═══════════════════
  {
    topicId: "step-pure1",
    overview:
      "STEP 纯数 A 考查代数与多项式的深度运用：因式定理、复杂因式分解、以及不等式的严格证明。STEP 重过程与论证，答案对但过程不严谨也会失分。",
    concepts: [
      {
        name: "因式与多项式恒等",
        body: "因式定理 $f(a)=0\\\\iff(x-a)|f(x)$。恒等式两边对应系数相等（待定系数法）可拆分复杂表达式。",
        keyPoints: [
          "恒等式对『所有 $x$』成立 → 对应系数相等",
          "对称多项式可用基本对称式表示",
          "高次先找有理根（$\\\\pm$ 常数项因子/首项因子）",
        ],
      },
      {
        name: "不等式证明",
        body: "常用：$(a-b)^2\\\\ge0$ 之类的平方非负；AM–GM $\\\\dfrac{a+b}{2}\\\\ge\\\\sqrt{ab}$（$a,b\\\\ge0$）；以及作差法 $A-B\\\\ge0$。",
        keyPoints: [
          "证 $A\\\\ge B$ 常化为某平方 $\\\\ge0$",
          "等号成立条件要写清",
          "分情况讨论时覆盖所有情形",
        ],
      },
      {
        name: "代数变形技巧",
        body: "配方、对称代换、引入辅助变量是 STEP 化简长表达式的常见手段。目标是把陌生结构化为已知可处理的形式。",
        keyPoints: [
          "配方揭示最值与符号",
          "对称式用 $s=a+b,\\\\ p=ab$ 简化",
          "保持每步可逆（等价变形）",
        ],
      },
    ],
    workedExamples: [
      {
        title: "平方非负证不等式",
        question: "证明对任意实数 $a,b$ 有 $a^2+b^2\\\\ge 2ab$。",
        answer: "由 (a−b)²≥0",
        solution:
          "$(a-b)^2\\\\ge0\\\\Rightarrow a^2-2ab+b^2\\\\ge0\\\\Rightarrow a^2+b^2\\\\ge2ab$，等号当且仅当 $a=b$。",
        tip: "证两项之和 ≥ 交叉项，先想完全平方。",
      },
    ],
  },
  {
    topicId: "step-pure2",
    overview:
      "STEP 纯数 B 是微积分进阶：换元积分、分部积分、无穷级数与微分方程。计算量大、技巧性强，需要选对方法并严谨执行。",
    concepts: [
      {
        name: "换元与分部积分",
        body: "换元：$\\\\int f(g(x))g'(x)\\\\,dx=\\\\int f(u)\\\\,du$（$u=g(x)$）。分部：$\\\\int u\\\\,dv=uv-\\\\int v\\\\,du$。",
        keyPoints: [
          "换元找『复合 + 其导数』结构",
          "分部用 LIATE 选 $u$（对数→反三角→代数→三角→指数）",
          "定积分换元记得换上下限",
        ],
      },
      {
        name: "微分方程",
        body: "可分离变量：$\\\\dfrac{dy}{dx}=f(x)g(y)\\\\Rightarrow\\\\int\\\\dfrac{dy}{g(y)}=\\\\int f(x)\\\\,dx$。$\\\\dfrac{dy}{dx}=ky$ 解为 $y=Ae^{kx}$。",
        keyPoints: [
          "先分离变量再两边积分",
          "别忘任意常数，用初值定出",
          "$dy/dx=ky$ 是指数增长/衰减模型",
        ],
      },
      {
        name: "级数",
        body: "等比级数 $\\\\sum ar^{n}$ 当 $|r|<1$ 收敛于 $\\\\dfrac{a}{1-r}$；常见展开如 $(1+x)^n$ 的二项级数用于近似。",
        keyPoints: [
          "收敛性先判 $|r|<1$ 或比值判别",
          "求和常用错位相减或已知展开",
          "近似时注意余项与适用范围",
        ],
      },
    ],
    workedExamples: [
      {
        title: "可分离变量",
        question: "解 $\\\\dfrac{dy}{dx}=2xy$（$y>0$），求通解。",
        answer: "y = A e^{x^2}",
        solution:
          "分离：$\\\\dfrac{dy}{y}=2x\\\\,dx\\\\Rightarrow\\\\ln y=x^2+C\\\\Rightarrow y=Ae^{x^2}$。",
        tip: "右边含 $x$、左边含 $y$ 时优先分离变量。",
      },
    ],
  },
  {
    topicId: "step-pure3",
    overview:
      "STEP 纯数 C 处理参数方程、极坐标，以及由它们求面积与弧长。重在把几何量翻译成对参数/角度的积分。",
    concepts: [
      {
        name: "参数方程",
        body: "$x=x(t),\\\\ y=y(t)$。斜率 $\\\\dfrac{dy}{dx}=\\\\dfrac{dy/dt}{dx/dt}$。消参可得直角坐标方程。",
        keyPoints: [
          "求切线斜率用 $\\\\dfrac{dy/dt}{dx/dt}$",
          "消参时注意参数范围限制曲线",
          "二阶导需对 $t$ 再求并除以 $dx/dt$",
        ],
      },
      {
        name: "极坐标",
        body: "$r=f(\\\\theta)$。与直角坐标关系 $x=r\\\\cos\\\\theta,\\\\ y=r\\\\sin\\\\theta$，$r^2=x^2+y^2$。",
        keyPoints: [
          "对称性可简化作图与积分",
          "$\\\\theta$ 范围决定曲线一圈/一瓣",
          "圆、心形线、玫瑰线是常见极坐标曲线",
        ],
      },
      {
        name: "面积与弧长",
        body: "极坐标扇形面积 $A=\\\\dfrac12\\\\int_\\\\alpha^\\\\beta r^2\\\\,d\\\\theta$。参数曲线弧长 $L=\\\\int\\\\sqrt{(dx/dt)^2+(dy/dt)^2}\\\\,dt$。",
        keyPoints: [
          "极坐标面积用 $\\\\tfrac12\\\\int r^2 d\\\\theta$",
          "弧长是速度大小对参数积分",
          "先定积分上下限（角度或参数范围）",
        ],
      },
    ],
    workedExamples: [
      {
        title: "参数曲线斜率",
        question: "曲线 $x=t^2,\\\\ y=t^3$ 在 $t=1$ 处的切线斜率是多少？",
        answer: "3/2",
        solution:
          "$\\\\dfrac{dy}{dx}=\\\\dfrac{dy/dt}{dx/dt}=\\\\dfrac{3t^2}{2t}=\\\\dfrac{3t}{2}$，在 $t=1$ 时为 $\\\\tfrac32$。",
        tip: "参数方程斜率别忘了是『$y$ 对 $t$』除以『$x$ 对 $t$』。",
      },
    ],
  },
  {
    topicId: "step-pure4",
    overview:
      "STEP 纯数 D（STEP 3）专攻复数：De Moivre 定理、单位根、以及复数的几何意义。常用复数证三角恒等式或求方程的全部复根。",
    concepts: [
      {
        name: "复数与模辐角",
        body: "$z=a+bi$，模 $|z|=\\\\sqrt{a^2+b^2}$，辐角 $\\\\arg z$。极式 $z=r(\\\\cos\\\\theta+i\\\\sin\\\\theta)=re^{i\\\\theta}$。",
        keyPoints: [
          "$i^2=-1$，共轭 $\\\\bar z=a-bi$",
          "$|z_1z_2|=|z_1||z_2|$，辐角相加",
          "$z\\\\bar z=|z|^2$",
        ],
      },
      {
        name: "De Moivre 定理",
        body: "$(\\\\cos\\\\theta+i\\\\sin\\\\theta)^n=\\\\cos n\\\\theta+i\\\\sin n\\\\theta$。用于求复数幂、推导多倍角三角公式。",
        keyPoints: [
          "求 $z^n$ 先化极式",
          "展开后比较实/虚部得三角恒等式",
          "$e^{i\\\\theta}$ 形式让乘幂变指数运算",
        ],
      },
      {
        name: "方程的复根（单位根）",
        body: "$z^n=1$ 的 $n$ 个根均匀分布在单位圆上：$z_k=e^{2\\\\pi i k/n}$，$k=0,\\\\dots,n-1$。一般 $z^n=w$ 同理绕圆等分。",
        keyPoints: [
          "$n$ 次方程恰有 $n$ 个复根（计重数）",
          "单位根之和为 0（$n\\\\ge2$）",
          "根在复平面构成正 $n$ 边形",
        ],
      },
    ],
    workedExamples: [
      {
        title: "复数方程",
        question: "求 $z^2=-9$ 的所有解。",
        answer: "z = ±3i",
        solution: "$z^2=-9\\\\Rightarrow z=\\\\pm\\\\sqrt{-9}=\\\\pm3i$。",
        tip: "$n$ 次方程在复数域恰有 $n$ 个根，别只写一个。",
      },
    ],
  },
  {
    topicId: "step-pure5",
    overview:
      "STEP 纯数 E（STEP 3）线性代数入门：矩阵运算、行列式、特征值与特征向量的基本概念,以及它们与线性变换的联系。",
    concepts: [
      {
        name: "矩阵与行列式",
        body: "$2\\\\times2$ 行列式 $\\\\det\\\\begin{pmatrix}a&b\\\\\\\\c&d\\\\end{pmatrix}=ad-bc$。$\\\\det=0$ 时矩阵奇异（不可逆）。",
        keyPoints: [
          "矩阵乘法不可交换",
          "$\\\\det=0\\\\iff$ 无逆、行/列线性相关",
          "单位矩阵 $I$ 满足 $IA=AI=A$",
        ],
      },
      {
        name: "特征值与特征向量",
        body: "若 $A\\\\mathbf{v}=\\\\lambda\\\\mathbf{v}$（$\\\\mathbf{v}\\\\neq\\\\mathbf{0}$），则 $\\\\lambda$ 为特征值。由 $\\\\det(A-\\\\lambda I)=0$ 求出。",
        keyPoints: [
          "对角/三角矩阵特征值即对角元",
          "迹 = 特征值之和，行列式 = 特征值之积",
          "特征向量满足 $(A-\\\\lambda I)\\\\mathbf v=\\\\mathbf 0$",
        ],
      },
      {
        name: "线性变换",
        body: "矩阵可视为线性变换（旋转、缩放、剪切）。行列式的绝对值表示该变换的面积/体积放缩因子。",
        keyPoints: [
          "$\\\\det$ 为负表示翻转定向",
          "特征向量是变换下方向不变的向量",
          "复合变换对应矩阵相乘",
        ],
      },
    ],
    workedExamples: [
      {
        title: "对角矩阵特征值",
        question: "矩阵 $\\\\begin{pmatrix}2&0\\\\\\\\0&3\\\\end{pmatrix}$ 的特征值是？",
        answer: "2 和 3",
        solution:
          "对角（或三角）矩阵的特征值就是其对角元，故为 $2$ 与 $3$。",
        tip: "对角/三角矩阵直接读对角线即得特征值。",
      },
    ],
  },
  {
    topicId: "step-mech",
    overview:
      "STEP 力学考查质点运动学、受约束运动、动量与冲量。需要把物理情景准确建模为方程，并用微积分处理变力/变加速度。",
    concepts: [
      {
        name: "运动学与牛顿定律",
        body: "匀加速：$v=u+at$，$s=ut+\\\\tfrac12at^2$，$v^2=u^2+2as$。牛顿第二定律 $F=ma$；变力下 $a=\\\\dfrac{dv}{dt}=v\\\\dfrac{dv}{dx}$。",
        keyPoints: [
          "匀加速三公式仅在 $a$ 恒定时用",
          "变加速度要用微积分关系",
          "先画受力图再列方程",
        ],
      },
      {
        name: "动量与冲量",
        body: "动量 $p=mv$；冲量 $=Ft=\\\\Delta p$。碰撞中（无外力）动量守恒：$m_1u_1+m_2u_2=m_1v_1+m_2v_2$。",
        keyPoints: [
          "守恒只在合外力为零的方向成立",
          "完全非弹性碰撞后共速",
          "冲量是力对时间的积累",
        ],
      },
      {
        name: "约束运动",
        body: "斜面、连接体、绳与滑轮等约束需对每个物体分别列方程，再用约束关系（同绳张力、同加速度）联立。",
        keyPoints: [
          "光滑斜面下滑加速度 $g\\\\sin\\\\theta$",
          "绳不可伸长 → 连接体加速度相同",
          "分别隔离受力分析再联立",
        ],
      },
    ],
    workedExamples: [
      {
        title: "光滑斜面加速度",
        question: "物体在光滑 $30^\\\\circ$ 斜面上下滑（$g=10$），加速度多大？",
        answer: "5 m/s²",
        solution:
          "沿斜面方向 $a=g\\\\sin\\\\theta=10\\\\times\\\\sin30^\\\\circ=10\\\\times0.5=5\\\\,\\\\text{m/s}^2$。",
        tip: "光滑斜面只有重力分量 $g\\\\sin\\\\theta$ 驱动。",
      },
    ],
  },
  {
    topicId: "step-stats",
    overview:
      "STEP 统计与概率考查离散/连续分布、条件概率、期望与方差。重在建立概率模型并严谨计算，常结合微积分（连续分布求期望）。",
    concepts: [
      {
        name: "概率与条件概率",
        body: "$P(A\\\\cup B)=P(A)+P(B)-P(A\\\\cap B)$。条件概率 $P(A|B)=\\\\dfrac{P(A\\\\cap B)}{P(B)}$。独立 $\\\\iff P(A\\\\cap B)=P(A)P(B)$。",
        keyPoints: [
          "互斥与独立是不同概念",
          "贝叶斯：$P(A|B)=\\\\dfrac{P(B|A)P(A)}{P(B)}$",
          "树状图理清多步事件",
        ],
      },
      {
        name: "期望与方差",
        body: "离散：$E(X)=\\\\sum xP(x)$，$\\\\text{Var}(X)=E(X^2)-[E(X)]^2$。连续：用密度函数 $f(x)$ 积分代替求和。",
        keyPoints: [
          "$E(aX+b)=aE(X)+b$",
          "$\\\\text{Var}(aX+b)=a^2\\\\text{Var}(X)$",
          "连续分布 $E(X)=\\\\int x f(x)\\\\,dx$",
        ],
      },
      {
        name: "常见分布",
        body: "二项 $B(n,p)$：$E=np$，$\\\\text{Var}=np(1-p)$。连续型由概率密度函数 $f(x)$ 描述，$\\\\int f=1$。",
        keyPoints: [
          "二项用于 $n$ 次独立同概率试验",
          "密度函数非负且总积分为 1",
          "分布的累积函数 $F(x)=P(X\\\\le x)$",
        ],
      },
    ],
    workedExamples: [
      {
        title: "离散期望",
        question: "掷一枚公平骰子，点数的期望 $E(X)$ 是多少？",
        answer: "3.5",
        solution:
          "$E(X)=\\\\dfrac{1+2+3+4+5+6}{6}=\\\\dfrac{21}{6}=3.5$。",
        tip: "等概率时期望即所有取值的算术平均。",
      },
    ],
  },

  // ═══════════════════ TMUA ═══════════════════
  {
    topicId: "tmua-algebra",
    overview:
      "TMUA Paper 1 的代数与函数：方程与不等式、多项式、指数对数、复合函数与二项式。TMUA 全为多选、无负分，重在快速准确判断，避免代数失误。",
    concepts: [
      {
        name: "方程与不等式",
        body: "二次方程用判别式 $\\\\Delta=b^2-4ac$ 判根的个数；绝对值不等式 $|x|<a\\\\iff -a<x<a$；分式不等式看分子分母同号区间。",
        keyPoints: [
          "$\\\\Delta>0$ 两根、$=0$ 重根、$<0$ 无实根",
          "$|f(x)|<a$ 展开为双边不等式",
          "分式不等式勿两边直接乘（符号未知）",
        ],
      },
      {
        name: "指数与对数",
        body: "对数律 $\\\\log ab=\\\\log a+\\\\log b$、$\\\\log a^n=n\\\\log a$。指数方程化同底或令 $u=a^x$ 化二次。",
        keyPoints: [
          "$a^{2x}$ 型方程常令 $u=a^x$",
          "对数方程回代检验真数 $>0$",
          "化同底后比较指数",
        ],
      },
      {
        name: "函数与二项式",
        body: "复合 $f(g(x))$ 先算内层；二项式一般项 $\\\\binom{n}{r}a^{n-r}b^r$，求特定项只锁 $r$。",
        keyPoints: [
          "复合函数从内往外算",
          "求 $x^k$ 系数令幂次 $=k$ 解 $r$",
          "注意括号内系数的幂",
        ],
      },
    ],
    workedExamples: [
      {
        title: "指数方程化二次",
        question: "解 $2^{2x}-5\\\\cdot2^{x}+4=0$。",
        answer: "x=0 或 x=2",
        solution:
          "令 $u=2^x$：$u^2-5u+4=0\\\\Rightarrow(u-1)(u-4)=0$，得 $2^x=1(x=0)$ 或 $2^x=4(x=2)$。",
        tip: "见 $a^{2x}$ 与 $a^x$ 同现，令 $u=a^x$。",
      },
    ],
  },
  {
    topicId: "tmua-calc",
    overview:
      "TMUA 微积分：求导（含链式法则）、定积分、驻点与极值、面积。计算须快而准，善用图形直觉排除错误选项。",
    concepts: [
      {
        name: "求导与链式法则",
        body: "幂法则 $\\\\dfrac{d}{dx}x^n=nx^{n-1}$；链式 $\\\\dfrac{d}{dx}[g(x)]^n=n[g(x)]^{n-1}g'(x)$。",
        keyPoints: [
          "复合函数用链式法则",
          "切线斜率 = 该点导数",
          "驻点处 $f'(x)=0$",
        ],
      },
      {
        name: "极值判断",
        body: "解 $f'(x)=0$ 求驻点，二阶导 $f''>0$ 极小、$f''<0$ 极大。",
        keyPoints: [
          "先求驻点再判性质",
          "三次函数常一极大一极小",
          "四次可有三个驻点",
        ],
      },
      {
        name: "定积分与面积",
        body: "$\\\\int x^n dx=\\\\dfrac{x^{n+1}}{n+1}+c$。曲线与 $x$ 轴围面积先求交点作为上下限。",
        keyPoints: [
          "面积题先解交点定限",
          "对称图形可算一半再乘 2",
          "曲线在轴下方积分取绝对值",
        ],
      },
    ],
    workedExamples: [
      {
        title: "曲线与轴围成面积",
        question: "求 $y=4-x^2$ 与 $x$ 轴围成的面积。",
        answer: "32/3",
        solution:
          "交点 $x=\\\\pm2$：$\\\\int_{-2}^{2}(4-x^2)\\\\,dx=\\\\left[4x-\\\\tfrac{x^3}{3}\\\\right]_{-2}^{2}=\\\\tfrac{32}{3}$。",
        tip: "先求交点当积分上下限。",
      },
    ],
  },
  {
    topicId: "tmua-stats",
    overview:
      "TMUA 统计与概率：古典概率、条件与独立、期望、排列组合。题目常需快速枚举或用计数公式，避免遗漏样本。",
    concepts: [
      {
        name: "概率基础",
        body: "古典概率 $P=\\\\dfrac{\\\\text{有利结果}}{\\\\text{总结果}}$。互斥相加，独立相乘 $P(A\\\\cap B)=P(A)P(B)$。",
        keyPoints: [
          "独立事件概率相乘",
          "无放回抽取概率随步变化",
          "对立事件 $P(\\\\bar A)=1-P(A)$",
        ],
      },
      {
        name: "期望",
        body: "$E(X)=\\\\sum xP(x)$。等概率时即算术平均。",
        keyPoints: [
          "期望是加权平均",
          "公平骰子期望 $3.5$",
          "$E(aX+b)=aE(X)+b$",
        ],
      },
      {
        name: "排列组合",
        body: "排列 $n!$（有序）；组合 $\\\\binom{n}{r}=\\\\dfrac{n!}{r!(n-r)!}$（无序）。",
        keyPoints: [
          "顺序重要用排列，否则组合",
          "『握手/连线』类是组合 $\\\\binom{n}{2}$",
          "分步用乘法、分类用加法",
        ],
      },
    ],
    workedExamples: [
      {
        title: "无放回概率",
        question: "袋中 3 红 2 蓝，不放回取 2 个，求两个都红的概率。",
        answer: "3/10",
        solution: "$\\\\dfrac{3}{5}\\\\times\\\\dfrac{2}{4}=\\\\dfrac{6}{20}=\\\\dfrac{3}{10}$。",
        tip: "无放回时第二次的分母要减 1。",
      },
    ],
  },
  {
    topicId: "tmua-logic",
    overview:
      "TMUA Paper 2 数学推理与证明是其特色：命题真伪、逆命题/逆否命题、反例、归纳与反证。重在逻辑严谨，不能凭直觉。",
    concepts: [
      {
        name: "命题与逆否",
        body: "$P\\\\Rightarrow Q$ 与其逆否 $\\\\lnot Q\\\\Rightarrow\\\\lnot P$ 等价；与逆命题 $Q\\\\Rightarrow P$ 不等价。",
        keyPoints: [
          "原命题 ≡ 逆否命题",
          "逆命题真假需单独判断",
          "证 $P\\\\Rightarrow Q$ 可改证逆否",
        ],
      },
      {
        name: "反例与量词",
        body: "否定全称『所有…』只需一个反例；否定存在『某个…』需证全都不成立。",
        keyPoints: [
          "反驳全称命题举一个反例即可",
          "$\\\\lnot(\\\\forall x\\\\,P)=\\\\exists x\\\\,\\\\lnot P$",
          "例子不能证明全称，只能否定",
        ],
      },
      {
        name: "证明方法",
        body: "直接证明、反证法（假设结论不成立导出矛盾）、数学归纳法（基础步 + 归纳步）。",
        keyPoints: [
          "『不存在最大素数』用反证法",
          "求和/整除命题常用归纳法",
          "归纳步必须用上归纳假设",
        ],
      },
    ],
    workedExamples: [
      {
        title: "判断逆命题",
        question: "已知『$x>2\\\\Rightarrow x^2>4$』，其逆命题成立吗？",
        answer: "不成立",
        solution:
          "逆命题为 $x^2>4\\\\Rightarrow x>2$。取 $x=-3$：$x^2=9>4$ 但 $x<2$，故逆命题为假。",
        tip: "判逆命题真假，优先找反例。",
      },
    ],
  },
  {
    topicId: "tmua-discrete",
    overview:
      "TMUA 离散数学入门：集合运算、计数、逻辑（真值、De Morgan）、图论基础（度数、边数、完全图）。用结构性论证而非穷举。",
    concepts: [
      {
        name: "集合与计数",
        body: "容斥 $|A\\\\cup B|=|A|+|B|-|A\\\\cap B|$；$n$ 元集有 $2^n$ 个子集。",
        keyPoints: [
          "并集用容斥避免重复计数",
          "子集数 $2^n$",
          "$A\\\\subseteq B$ 且 $B\\\\subseteq A\\\\Rightarrow A=B$",
        ],
      },
      {
        name: "逻辑与真值",
        body: "De Morgan：$\\\\lnot(A\\\\land B)=\\\\lnot A\\\\lor\\\\lnot B$，$\\\\lnot(A\\\\lor B)=\\\\lnot A\\\\land\\\\lnot B$。$A\\\\lor\\\\lnot A$ 恒真。",
        keyPoints: [
          "否定合取变析取（反之亦然）",
          "$A\\\\lor\\\\lnot A$ 是永真式",
          "$A\\\\land\\\\lnot A$ 是永假式",
        ],
      },
      {
        name: "图论基础",
        body: "握手定理：所有顶点度数之和 $=2\\\\times$ 边数。完全图 $K_n$ 有 $\\\\binom{n}{2}$ 条边。",
        keyPoints: [
          "度数之和为偶数（= 2×边数）",
          "$K_n$ 边数 $\\\\binom{n}{2}$",
          "$n$ 人两两握手 = $\\\\binom{n}{2}$ 次",
        ],
      },
    ],
    workedExamples: [
      {
        title: "握手定理求边数",
        question: "一个图有 5 个顶点、每个度数为 2，有多少条边？",
        answer: "5",
        solution:
          "度数之和 $=5\\\\times2=10=2\\\\times$ 边数，故边数 $=5$。",
        tip: "度数总和永远是边数的两倍。",
      },
    ],
  },
];
