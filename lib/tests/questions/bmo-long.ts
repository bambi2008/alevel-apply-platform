// BMO1 风格证明长题（16 道，每考点 4 道）。原创；对标 BMO1 Q1–4 难度与 "Prove that / Determine, with proof" 句式；
// 作者锁定；每题数值事实均由 sympy/程序断言核对（几何题以坐标法在 2 万随机实例上验证），见交接包 manifest 与 gen 脚本。
// 配比：数论 4（nt-001..004）/ 代数与不等式 4（in-001/in-002/al-001/al-002）/ 几何 4（ge-001..004）/ 组合与博弈 4（co-001..004）。
import type { LongQuestion } from "./types";

export const BMO_LONG_SAMPLE: LongQuestion[] = [
  {
    id: "bmo1-nt-001",
    type: "long",
    testId: "bmo",
    topicId: "bmo-number",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO1 风格 · 完整证明题】Determine, with proof, all positive integers $n$ for which $n^2 + 20n$ is a perfect square.（确定并证明：使 $n^2+20n$ 为完全平方数的所有正整数 $n$。）真实 BMO1 中本题不设小问——下面的小问是引导脚手架，建议先自己独立尝试 20 分钟再看。",
    parts: [
      { label: "a", marks: 3, question: "引导一：设 $n^2+20n=m^2$（$m$ 为非负整数）。通过配方把等式改写成「两个平方数之差等于常数」的形式。",
        solutionOutline: "$n^2+20n=(n+10)^2-100$，故 $(n+10)^2-m^2=100$。" },
      { label: "b", marks: 4, question: "引导二：把 a) 的式子写成 $(n+10-m)(n+10+m)=100$。设 $d=n+10-m$、$e=n+10+m$。证明 $d,e$ 必须同奇偶，并由此列出全部可行的因数对 $(d,e)$。",
        solutionOutline: "$d+e=2(n+10)$ 为偶数，故 $d,e$ 同奇偶；又 $de=100$ 为偶数，同奇偶只能是**同偶**。$100$ 的正偶因数对（$d\\le e$）：$(2,50)$ 与 $(10,10)$。（负因数对使 $n+10=\\tfrac{d+e}{2}\\le0$，排除。）" },
      { label: "c", marks: 3, question: "引导三：对每个因数对解出 $n$ 与 $m$，验证并写出最终结论。",
        solutionOutline: "$(2,50)$：$n+10=26$，$m=24$ → $n=16$，验证 $16^2+320=576=24^2$ ✓。$(10,10)$：$m=0$，$n=0$，非正整数，舍。**结论：唯一解 $n=16$。**" },
    ],
    fullSolution:
      "**完整证明（BMO1 书写规范示范）**\\n\\n设 $n^2+20n=m^2$，$m\\ge0$ 为整数。配方：$(n+10)^2-100=m^2$，即\\n$$(n+10-m)(n+10+m)=100.$$\\n记 $d=n+10-m$，$e=n+10+m$，则 $de=100$ 且 $d+e=2(n+10)$。\\n\\n由 $d+e$ 为偶数知 $d,e$ 同奇偶；若同为奇数则 $de$ 为奇数，与 $de=100$ 矛盾，故 $d,e$ 同为偶数。又 $n\\ge1$ 给出 $e\\ge d$ 且 $d+e=2(n+10)\\ge22>0$，故 $d,e$ 均为正。\\n\\n$100=2^2\\cdot5^2$ 的正偶因数对（$d\\le e$）只有 $(2,50)$ 与 $(10,10)$：\\n- $(d,e)=(2,50)$：$n+10=26$，$n=16$；$m=24$。验证：$16^2+20\\cdot16=256+320=576=24^2$ ✓\\n- $(d,e)=(10,10)$：$m=0$，$n=0$，不是正整数，舍。\\n\\n**故满足条件的正整数只有 $n=16$。** $\\blacksquare$\\n\\n---\\n**方法要点（BMO1 通用武器）**：平方差因式分解 + 奇偶性约束因数对，是 BMO1 数论题最高频的组合拳之一。注意证明必须**双向完整**：既要找到解，也要论证再无其他（本题由因数对穷尽性保证）。\\n\\n**延伸练习**：把 $20$ 换成 $12$，用同样方法可证唯一解为 $n=4$（$(n+6)^2-36=m^2$，偶因数对 $(2,18)$）。\\n\\n---\\n*原创题；对标 BMO1 第 1–2 题难度；数值事实已程序核对；请对照证明自评（每步严格性各占分）。*",
  },

  {
    id: "bmo1-co-001",
    type: "long",
    testId: "bmo",
    topicId: "bmo-combinatorics",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO1 风格 · 完整证明题】The integers $1,2,3,\\dots,2026$ are written on a board. In each move you erase two of the numbers $a,b$ and write their absolute difference $|a-b|$ in their place. After $2025$ moves a single number remains. Prove that this number is odd.（黑板上写着整数 $1,2,\\dots,2026$。每一步擦去其中两个数 $a,b$，写上 $|a-b|$；$2025$ 步后只剩一个数。求证：它必为奇数。）真实 BMO1 中本题不设小问——下面的小问是引导脚手架，建议先独立尝试寻找「什么量不随操作改变」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（找不变量）：设某一步之前黑板上所有数之和为 $S$。证明这一步操作**不改变 $S$ 的奇偶性**。（提示：比较 $|a-b|$ 与 $a+b$ 的奇偶。）",
        solutionOutline: "一步把 $a,b$ 换成 $|a-b|$，总和变化量为 $|a-b|-(a+b)=-2\\min(a,b)$，为偶数；故 $S$ 的奇偶性不变。等价地 $|a-b|\\equiv a+b\\pmod 2$（两者相差 $2\\min(a,b)$）。因此「总和的奇偶性」是一个**不变量**。" },
      { label: "b", marks: 4, question: "引导二（算初值）：计算初始时黑板上所有数之和 $1+2+\\cdots+2026$，并判断其奇偶性。",
        solutionOutline: "$1+2+\\cdots+2026=\\dfrac{2026\\cdot2027}{2}=1013\\cdot2027=2053351$。$1013$ 与 $2027$ 均为奇数，奇$\\times$奇$=$奇，故初始和为**奇数**。" },
      { label: "c", marks: 3, question: "引导三（收尾）：把不变量与终局联系起来，完成证明。",
        solutionOutline: "终局只剩一个数 $N$，此时「总和」就等于 $N$。由 a) 的不变量与 b) 的初值，$N\\equiv 1+2+\\cdots+2026\\equiv 1\\pmod 2$，故 $N$ 为奇数（从而 $N\\ge1$，不可能为 $0$）。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（不变量法示范）**\\n\\n**关键不变量：黑板上所有数之和的奇偶性。**\\n\\n考察任意一步：擦去 $a,b$，写上 $|a-b|$。总和的改变量为\\n$$|a-b|-(a+b)=-2\\min(a,b),$$\\n这是偶数，所以每一步都不改变总和 $S$ 的奇偶性——即 $S\\bmod 2$ 是一个不变量。（等价说法：$|a-b|\\equiv a+b\\pmod2$。）\\n\\n初始总和\\n$$1+2+\\cdots+2026=\\frac{2026\\cdot2027}{2}=1013\\cdot2027=2053351,$$\\n为两个奇数之积，故为奇数。\\n\\n经过 $2025$ 步后只剩一个数 $N$，此刻黑板上的总和恰为 $N$。由于总和的奇偶性自始至终不变，\\n$$N\\equiv 2053351\\equiv 1\\pmod 2,$$\\n故 $N$ 为奇数。特别地 $N\\ge 1$，不可能等于 $0$。$\\blacksquare$\\n\\n---\\n**方法要点（BMO1 通用武器）**：当一个过程「反复操作、问终态」时，先找**不变量**（invariant）或**单调量**（monovariant）。奇偶性是最常用的不变量——因为绝对差 $|a-b|$ 与和 $a+b$ 同奇偶，这类「取差」过程几乎总能用和的奇偶性破解。BMO 评分里，**明确指出并证明不变量**往往是拿分关键，只报答案不得分。\\n\\n**延伸思考**：若把 $2026$ 换成 $2027$，则初始和 $=\\dfrac{2027\\cdot2028}{2}=2027\\cdot1014$ 为偶数，于是终值必为**偶数**。（终值能否恰好为 $0$ 是更细的问题，需另行构造。）\\n\\n---\\n*原创题；对标 BMO1 第 1–2 题难度；初始和 $=2053351$ 及 $200$ 次随机全过程模拟（终值恒为奇）均已程序核对；请对照证明自评。*",
  },

  {
    id: "bmo1-nt-002",
    type: "long",
    testId: "bmo",
    topicId: "bmo-number",
    difficulty: 2,
    totalMarks: 10,
    context:
      "【BMO1 风格 · 完整证明题】Prove that for every positive integer $n$, the number $n(n+1)(n+2)(n+3)+1$ is a perfect square.（求证：对每个正整数 $n$，$n(n+1)(n+2)(n+3)+1$ 都是完全平方数。）真实 BMO1 中本题不设小问——下面的小问是引导脚手架。切忌硬把四项乘开，先想怎样**配对**。",
    parts: [
      { label: "a", marks: 3, question: "引导一（首尾配对）：不要直接展开四项乘积。把四个连续整数「首尾配对」，分别计算 $n(n+3)$ 与 $(n+1)(n+2)$，并指出这两个量的关系。",
        solutionOutline: "$n(n+3)=n^2+3n$，$(n+1)(n+2)=n^2+3n+2$。两者只相差 $2$，且都含公共部分 $n^2+3n$。" },
      { label: "b", marks: 4, question: "引导二（换元配方）：令 $x=n^2+3n$。用 $x$ 改写整个表达式 $n(n+1)(n+2)(n+3)+1$，然后配成完全平方。",
        solutionOutline: "原式 $=x(x+2)+1=x^2+2x+1=(x+1)^2$。" },
      { label: "c", marks: 3, question: "引导三（回代收尾）：把 $x$ 换回 $n$，明确写出它是哪个整数的平方，并说明为何结论对所有正整数 $n$ 成立。",
        solutionOutline: "$x+1=n^2+3n+1$。故 $n(n+1)(n+2)(n+3)+1=(n^2+3n+1)^2$。因 $n$ 为正整数，$n^2+3n+1$ 为正整数，故原式为完全平方数。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（连续整数配对 + 配方示范）**\\n\\n把四个连续整数**首尾配对**：\\n$$n(n+3)=n^2+3n,\\qquad (n+1)(n+2)=n^2+3n+2.$$\\n两式仅相差 $2$，都含公共块 $n^2+3n$。令 $x=n^2+3n$，则\\n$$n(n+1)(n+2)(n+3)+1=x(x+2)+1=x^2+2x+1=(x+1)^2.$$\\n回代 $x+1=n^2+3n+1$，得\\n$$n(n+1)(n+2)(n+3)+1=(n^2+3n+1)^2.$$\\n对每个正整数 $n$，$n^2+3n+1$ 是正整数，故右边是一个完全平方数，命题得证。$\\blacksquare$\\n\\n**数值核对**：$n=1$：$1\\cdot2\\cdot3\\cdot4+1=25=5^2$，而 $n^2+3n+1=5$ ✓；$n=2$：$2\\cdot3\\cdot4\\cdot5+1=121=11^2$，$n^2+3n+1=11$ ✓。\\n\\n---\\n**方法要点（BMO1 通用武器）**：遇到「连续整数之积 $\\pm$ 常数」先别展开——**首尾配对**制造重复结构、**换元 $x$** 降次、再**配方** $x^2+2x+1=(x+1)^2$，是恒等式型证明题的标准三连。注意本题恒等式对一切整数 $n$（甚至一切实数）都成立，正整数只是题目设定。\\n\\n**延伸练习**：仿此可证 $n(n+1)(n+2)(n+3)$ 永不为完全平方（它夹在相邻两平方数 $(x)^2$ 与 $(x+1)^2$ 之间：$x^2<x^2+2x<(x+1)^2$，$n\\ge1$）。\\n\\n---\\n*原创题；对标 BMO1 第 1 题难度；恒等式 $=(n^2+3n+1)^2$ 已由符号计算（差为 $0$、因式分解）与 $n=0\\dots49$ 数值核对确认；请对照证明自评。*",
  },

  {
    id: "bmo1-in-001",
    type: "long",
    testId: "bmo",
    topicId: "bmo-algebra",
    difficulty: 2,
    totalMarks: 10,
    context:
      "【BMO1 风格 · 完整证明题】Let $a,b,c$ be positive real numbers with $a+b+c=3$. Prove that $a^2+b^2+c^2\\ge 3$, and determine when equality holds.（设正实数 $a,b,c$ 满足 $a+b+c=3$，求证 $a^2+b^2+c^2\\ge3$，并说明等号成立的条件。）真实 BMO1 中本题不设小问——下面的小问是引导脚手架。BMO 评分里，**等号条件**与不等式本身同等重要。",
    parts: [
      { label: "a", marks: 3, question: "引导一（先立一个无约束的不等式）：证明对任意实数 $a,b,c$ 都有 $3(a^2+b^2+c^2)\\ge(a+b+c)^2$。（提示：把差 $3(a^2+b^2+c^2)-(a+b+c)^2$ 写成若干平方之和。）",
        solutionOutline: "$3(a^2+b^2+c^2)-(a+b+c)^2=2(a^2+b^2+c^2)-2(ab+bc+ca)=(a-b)^2+(b-c)^2+(c-a)^2\\ge0$。这正是 QM–AM（或 Cauchy–Schwarz）的实质。" },
      { label: "b", marks: 4, question: "引导二（代入约束）：利用 $a+b+c=3$，从 a) 的不等式推出 $a^2+b^2+c^2$ 的下界。",
        solutionOutline: "代入得 $3(a^2+b^2+c^2)\\ge 3^2=9$，故 $a^2+b^2+c^2\\ge3$。" },
      { label: "c", marks: 3, question: "引导三（等号条件）：确定等号何时成立，并验证。",
        solutionOutline: "等号 $\\iff (a-b)^2+(b-c)^2+(c-a)^2=0\\iff a=b=c$；结合 $a+b+c=3$ 得 $a=b=c=1$，此时 $a^2+b^2+c^2=3$，等号确实成立。" },
    ],
    fullSolution:
      "**完整证明（QM–AM / 平方和示范）**\\n\\n**第一步：一个恒成立的不等式。** 对任意实数 $a,b,c$，\\n$$3(a^2+b^2+c^2)-(a+b+c)^2=(a-b)^2+(b-c)^2+(c-a)^2\\ge0,$$\\n故 $3(a^2+b^2+c^2)\\ge(a+b+c)^2$。（这正是二次平均不小于算术平均，即 QM $\\ge$ AM；也可由 Cauchy–Schwarz $(1^2+1^2+1^2)(a^2+b^2+c^2)\\ge(a+b+c)^2$ 立得。）\\n\\n**第二步：代入约束。** 由 $a+b+c=3$，\\n$$3(a^2+b^2+c^2)\\ge 3^2=9\\ \\Longrightarrow\\ a^2+b^2+c^2\\ge 3.$$\\n\\n**第三步：等号条件。** 等号成立当且仅当 $(a-b)^2+(b-c)^2+(c-a)^2=0$，即 $a=b=c$；再由 $a+b+c=3$ 得 $a=b=c=1$。此时 $a^2+b^2+c^2=1+1+1=3$，等号确实取到。$\\blacksquare$\\n\\n---\\n**更快的写法（可作满分范例）**：直接由 $\\sum (a-1)^2\\ge0$ 展开：$a^2+b^2+c^2-2(a+b+c)+3\\ge0$，代入 $a+b+c=3$ 即得 $a^2+b^2+c^2\\ge3$，等号同样在 $a=b=c=1$。此法连正性都不需要，对一切实数成立。\\n\\n**方法要点（BMO1 通用武器）**：对称约束不等式，先想 **QM–AM / Cauchy–Schwarz** 或**配方成平方和**；务必**单独论证等号条件**——BMO 里漏掉等号分析常被扣分。\\n\\n**延伸练习**：一般地，若 $a+b+c=s$，同法可得 $a^2+b^2+c^2\\ge \\dfrac{s^2}{3}$，等号在 $a=b=c=\\dfrac{s}{3}$。\\n\\n---\\n*原创题；对标 BMO1 第 1–2 题难度；下界 $3$ 及等号点 $(1,1,1)$ 已由约束平面上 $3\\times10^5$ 次随机取样（最小值 $\\to3$）核对；请对照证明自评（等号分析单独占分）。*",
  },

  {
    id: "bmo1-nt-003",
    type: "long",
    testId: "bmo",
    topicId: "bmo-number",
    difficulty: 2,
    totalMarks: 10,
    context:
      "【BMO1 风格 · 完整证明题】Prove that $7$ never divides $2^n+1$ for any positive integer $n$.（求证：对任何正整数 $n$，$7$ 都不整除 $2^n+1$。）真实 BMO1 中本题不设小问——引导小问示范「模运算 + 周期」的标准打法。",
    parts: [
      { label: "a", marks: 3, question: "引导一（找周期）：计算 $2^n\\bmod 7$ 对 $n=1,2,3,4,\\dots$ 的值，指出它是周期性的并写出周期与一个周期内的取值。",
        solutionOutline: "$2^1\\equiv2,\\ 2^2\\equiv4,\\ 2^3\\equiv1\\pmod7$，之后循环，周期为 $3$，取值集合 $\\{2,4,1\\}$。" },
      { label: "b", marks: 4, question: "引导二（推余数）：由 a) 求出 $2^n+1\\bmod 7$ 的所有可能取值。",
        solutionOutline: "$2^n\\equiv2,4,1\\pmod7$ 之一，故 $2^n+1\\equiv3,5,2\\pmod7$ 之一。" },
      { label: "c", marks: 3, question: "引导三（收尾）：说明为什么这就证明了 $7\\nmid 2^n+1$。",
        solutionOutline: "$2^n+1\\bmod7\\in\\{3,5,2\\}$，永远不等于 $0$，故 $7$ 永不整除 $2^n+1$。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（模运算 + 周期）**\\n\\n在模 $7$ 下计算 $2$ 的幂：\\n$$2^1\\equiv2,\\quad 2^2\\equiv4,\\quad 2^3\\equiv8\\equiv1\\pmod7.$$\\n由 $2^3\\equiv1$ 知此后每 $3$ 步循环一次：$2^n\\bmod7$ 只随 $n\\bmod3$ 变化，取值为\\n$$2^n\\equiv\\begin{cases}2,&n\\equiv1\\\\4,&n\\equiv2\\\\1,&n\\equiv0\\end{cases}\\pmod 7\\quad(\\text{即取值集合 }\\{2,4,1\\}).$$\\n于是\\n$$2^n+1\\equiv 3,\\ 5,\\ \\text{或}\\ 2\\pmod 7,$$\\n三者都不是 $0$。因此对任何正整数 $n$，$2^n+1$ 除以 $7$ 的余数恒非零，$7\\nmid 2^n+1$。$\\blacksquare$\\n\\n---\\n**方法要点（BMO1 通用武器）**：证明「某数永不被 $m$ 整除」的标准武器是**取模 + 找周期**。指数型 $a^n\\bmod m$ 必然进入循环（鸽巢：余数只有有限种），先定出周期，再逐一检查一个周期内的余数即可穷尽全部情形。\\n\\n**延伸练习**：同法可证 $7\\mid 2^n-1 \\iff 3\\mid n$；以及 $2^n+1$ 何时被 $3$ 整除（$n$ 为奇数时）。\\n\\n---\\n*原创题；对标 BMO1 第 1 题难度；$2^n\\bmod7$ 周期与 $2^n+1\\bmod7\\in\\{3,5,2\\}$ 已对 $n=1\\dots2000$ 程序核对；请对照证明自评。*",
  },

  {
    id: "bmo1-nt-004",
    type: "long",
    testId: "bmo",
    topicId: "bmo-number",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO1 风格 · 完整证明题】Determine, with proof, all prime numbers $p$ for which $p^2+2$ is also prime.（确定并证明：使 $p^2+2$ 也是素数的所有素数 $p$。）真实 BMO1 中本题不设小问——引导小问示范「先试小情形、再用模 $3$ 一网打尽」。",
    parts: [
      { label: "a", marks: 2, question: "引导一（试小情形）：分别检验 $p=2,3,5$，看 $p^2+2$ 是否为素数。",
        solutionOutline: "$p=2$：$6$ 非素；$p=3$：$11$ 素 ✓；$p=5$：$27=3^3$ 非素。猜测唯一答案 $p=3$。" },
      { label: "b", marks: 5, question: "引导二（模 $3$ 分析）：设 $p$ 是不等于 $3$ 的素数。证明 $p^2\\equiv1\\pmod 3$，进而说明 $3\\mid p^2+2$。",
        solutionOutline: "$p\\ne3$ 且为素数 $\\Rightarrow 3\\nmid p\\Rightarrow p\\equiv\\pm1\\pmod3\\Rightarrow p^2\\equiv1\\pmod3$。故 $p^2+2\\equiv1+2\\equiv0\\pmod3$，即 $3\\mid p^2+2$。" },
      { label: "c", marks: 3, question: "引导三（收尾）：结合 $p^2+2>3$ 说明为何 $p\\ne3$ 时 $p^2+2$ 必为合数，给出最终结论。",
        solutionOutline: "$p\\ne3$ 时 $3\\mid p^2+2$ 且 $p^2+2\\ge 2^2+2=6>3$，故 $p^2+2$ 是大于 $3$ 的 $3$ 的倍数，必为合数。唯一使 $p^2+2$ 为素数的素数是 $p=3$。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（小情形 + 模 $3$ 一网打尽）**\\n\\n先试小素数：$p=3$ 时 $p^2+2=11$ 为素数，成立。\\n\\n现设 $p$ 为素数且 $p\\ne3$。则 $3\\nmid p$，于是 $p\\equiv1$ 或 $p\\equiv2\\pmod3$，两种情形都有\\n$$p^2\\equiv1\\pmod3.$$\\n因此\\n$$p^2+2\\equiv1+2\\equiv0\\pmod3,$$\\n即 $3\\mid p^2+2$。又 $p\\ge2$ 给出 $p^2+2\\ge6>3$，所以 $p^2+2$ 是一个大于 $3$ 而被 $3$ 整除的数，必为合数。\\n\\n故当 $p\\ne3$ 时 $p^2+2$ 一定不是素数。**结论：唯一使 $p^2+2$ 为素数的素数是 $p=3$。** $\\blacksquare$\\n\\n---\\n**方法要点（BMO1 通用武器）**：涉及「素数 + 平方」的题，**模 $3$**（或模 $4$、模 $6$）极其好用——任何非 $3$ 的整数其平方都 $\\equiv1\\pmod3$，这一条常常一步把无穷多情形压成一个同余矛盾。先手算几个小情形定出候选答案，再用同余排除其余，是「determine all」型题的标准结构。\\n\\n**延伸练习**：同法可证「孪生素数三元组 $p,p+2,p+4$ 中必有一个被 $3$ 整除」，故唯一的这种三元组是 $3,5,7$。\\n\\n---\\n*原创题；对标 BMO1 第 2 题难度；$p^2+2$ 为素数仅在 $p=3$（已对 $10^5$ 内全部素数程序核对），及「$p\\ne3$ 素数 $\\Rightarrow p^2\\equiv1\\pmod3$」均已核对；请对照证明自评。*",
  },

  {
    id: "bmo1-in-002",
    type: "long",
    testId: "bmo",
    topicId: "bmo-algebra",
    difficulty: 2,
    totalMarks: 10,
    context:
      "【BMO1 风格 · 完整证明题】Let $a,b,c$ be positive real numbers. Prove that $(a+b)(b+c)(c+a)\\ge 8abc$, and determine when equality holds.（设正实数 $a,b,c$，求证 $(a+b)(b+c)(c+a)\\ge8abc$，并说明等号条件。）真实 BMO1 中本题不设小问——引导小问示范 AM–GM 的「分块相乘」用法。",
    parts: [
      { label: "a", marks: 4, question: "引导一（对每个括号用 AM–GM）：对正实数用二元 AM–GM，分别给出 $a+b$、$b+c$、$c+a$ 的下界。",
        solutionOutline: "由 AM–GM：$a+b\\ge2\\sqrt{ab}$，$b+c\\ge2\\sqrt{bc}$，$c+a\\ge2\\sqrt{ca}$（三者皆因两正数算术平均$\\ge$几何平均）。" },
      { label: "b", marks: 3, question: "引导二（相乘）：把 a) 的三条不等式相乘，化简右边。",
        solutionOutline: "三式相乘：$(a+b)(b+c)(c+a)\\ge 8\\sqrt{ab}\\sqrt{bc}\\sqrt{ca}=8\\sqrt{a^2b^2c^2}=8abc$（$a,b,c>0$）。" },
      { label: "c", marks: 3, question: "引导三（等号条件）：确定等号何时成立并验证。",
        solutionOutline: "每个 AM–GM 等号需 $a=b$、$b=c$、$c=a$ 同时成立，即 $a=b=c$。此时两边同为 $8a^3$，等号成立。" },
    ],
    fullSolution:
      "**完整证明（AM–GM 分块相乘）**\\n\\n对正实数用二元算术–几何平均不等式（AM–GM）：\\n$$a+b\\ge2\\sqrt{ab},\\quad b+c\\ge2\\sqrt{bc},\\quad c+a\\ge2\\sqrt{ca}.$$\\n三式左右皆为正，可以相乘：\\n$$(a+b)(b+c)(c+a)\\ge 2\\sqrt{ab}\\cdot2\\sqrt{bc}\\cdot2\\sqrt{ca}=8\\sqrt{a^2b^2c^2}=8abc,$$\\n最后一步用了 $a,b,c>0$ 故 $\\sqrt{a^2b^2c^2}=abc$。\\n\\n**等号条件**：三处 AM–GM 分别在 $a=b$、$b=c$、$c=a$ 时取等，要同时成立即 $a=b=c$。此时 $(a+b)(b+c)(c+a)=(2a)^3=8a^3=8abc$，等号确实成立。$\\blacksquare$\\n\\n---\\n**方法要点（BMO1 通用武器）**：多因子乘积型不等式，常把式子**拆成若干块、每块各用一次 AM–GM，再相乘**。相乘时务必确认各不等式两边为正（否则不能直接相乘）。等号要**所有分块同时取等**，这才是完整的等号分析。\\n\\n**延伸练习**：同法可证 $(a+b+c)\\left(\\frac1a+\\frac1b+\\frac1c\\right)\\ge9$（对每组配对用 AM–GM 或直接展开）。\\n\\n---\\n*原创题；对标 BMO1 第 1–2 题难度；比值 $(a+b)(b+c)(c+a)/(8abc)$ 的最小值 $\\to1$（等号在 $a=b=c$）已由 $3\\times10^5$ 次随机取样核对；请对照证明自评。*",
  },

  {
    id: "bmo1-al-001",
    type: "long",
    testId: "bmo",
    topicId: "bmo-algebra",
    difficulty: 2,
    totalMarks: 10,
    context:
      "【BMO1 风格 · 完整证明题】Prove that for every positive integer $n$,\\n$$\\frac{1}{1\\cdot2}+\\frac{1}{2\\cdot3}+\\cdots+\\frac{1}{n(n+1)}=\\frac{n}{n+1}.$$（求证：对每个正整数 $n$，上述求和等于 $\\dfrac{n}{n+1}$。）真实 BMO1 中本题不设小问——引导小问示范「裂项 + 望远镜求和」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（裂项）：把一般项 $\\dfrac{1}{k(k+1)}$ 写成两个分式之差。",
        solutionOutline: "$\\dfrac{1}{k(k+1)}=\\dfrac1k-\\dfrac1{k+1}$（通分验证：$\\dfrac1k-\\dfrac1{k+1}=\\dfrac{(k+1)-k}{k(k+1)}=\\dfrac1{k(k+1)}$）。" },
      { label: "b", marks: 4, question: "引导二（望远镜相消）：把整串和用 a) 的裂项写出，观察中间项如何两两相消。",
        solutionOutline: "$\\sum_{k=1}^{n}\\left(\\dfrac1k-\\dfrac1{k+1}\\right)=\\left(1-\\dfrac12\\right)+\\left(\\dfrac12-\\dfrac13\\right)+\\cdots+\\left(\\dfrac1n-\\dfrac1{n+1}\\right)$，除首项 $1$ 与末项 $-\\dfrac1{n+1}$ 外全部抵消。" },
      { label: "c", marks: 3, question: "引导三（收尾）：算出化简结果，并说明这对所有正整数 $n$ 成立（可点明数学归纳法作为备选）。",
        solutionOutline: "结果 $=1-\\dfrac1{n+1}=\\dfrac{n}{n+1}$。望远镜相消对任意 $n$ 成立；亦可用数学归纳法：$n=1$ 时两边 $=\\dfrac12$，且 $\\dfrac{n}{n+1}+\\dfrac1{(n+1)(n+2)}=\\dfrac{n+1}{n+2}$。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（裂项 + 望远镜求和）**\\n\\n**裂项**：对每个 $k\\ge1$，\\n$$\\frac{1}{k(k+1)}=\\frac1k-\\frac1{k+1},$$\\n因为 $\\dfrac1k-\\dfrac1{k+1}=\\dfrac{(k+1)-k}{k(k+1)}=\\dfrac1{k(k+1)}$。\\n\\n**求和**：\\n$$\\sum_{k=1}^{n}\\frac{1}{k(k+1)}=\\sum_{k=1}^{n}\\left(\\frac1k-\\frac1{k+1}\\right)=\\left(1-\\tfrac12\\right)+\\left(\\tfrac12-\\tfrac13\\right)+\\cdots+\\left(\\tfrac1n-\\tfrac1{n+1}\\right).$$\\n相邻括号首尾相消（望远镜），只剩下最前的 $1$ 与最后的 $-\\dfrac1{n+1}$：\\n$$=1-\\frac1{n+1}=\\frac{n}{n+1}.$$\\n此相消对任意正整数 $n$ 都成立，命题得证。$\\blacksquare$\\n\\n**备选证法（数学归纳法）**：$n=1$ 时左边 $=\\dfrac1{1\\cdot2}=\\dfrac12=\\dfrac{1}{2}$，成立。设对 $n$ 成立，则\\n$$\\sum_{k=1}^{n+1}=\\frac{n}{n+1}+\\frac{1}{(n+1)(n+2)}=\\frac{n(n+2)+1}{(n+1)(n+2)}=\\frac{(n+1)^2}{(n+1)(n+2)}=\\frac{n+1}{n+2},$$\\n故对 $n+1$ 也成立。\\n\\n---\\n**方法要点（BMO1 通用武器）**：形如 $\\dfrac{1}{k(k+1)}$、$\\dfrac{1}{k(k+2)}$ 的求和，先**裂项**成差再**望远镜相消**；很多离散求和/证明题都能这样闭合。归纳法则是通用的兜底工具。\\n\\n---\\n*原创题；对标 BMO1 第 1 题难度；等式对 $n=1\\dots200$ 已用精确有理数程序核对；请对照证明自评。*",
  },

  {
    id: "bmo1-al-002",
    type: "long",
    testId: "bmo",
    topicId: "bmo-algebra",
    difficulty: 2,
    totalMarks: 10,
    context:
      "【BMO1 风格 · 完整证明题】Prove that $x^2+y^2+1\\ge xy+x+y$ for all real numbers $x,y$, and determine when equality holds.（求证：对一切实数 $x,y$ 有 $x^2+y^2+1\\ge xy+x+y$，并说明等号条件。）真实 BMO1 中本题不设小问——引导小问示范「乘 $2$ 后配成平方和（SOS）」。",
    parts: [
      { label: "a", marks: 4, question: "引导一（乘 $2$ 配方）：考虑 $2\\big(x^2+y^2+1-xy-x-y\\big)$，尝试把它写成三个完全平方之和。",
        solutionOutline: "$2(x^2+y^2+1-xy-x-y)=(x-y)^2+(x-1)^2+(y-1)^2$（展开右边即得左边）。" },
      { label: "b", marks: 3, question: "引导二（得出不等式）：由 a) 说明原不等式成立。",
        solutionOutline: "右边为平方和 $\\ge0$，故 $2(x^2+y^2+1-xy-x-y)\\ge0$，即 $x^2+y^2+1\\ge xy+x+y$。" },
      { label: "c", marks: 3, question: "引导三（等号条件）：确定等号何时成立并验证。",
        solutionOutline: "等号 $\\iff (x-y)^2+(x-1)^2+(y-1)^2=0\\iff x=y,\\,x=1,\\,y=1$，即 $x=y=1$。此时两边同为 $3$。" },
    ],
    fullSolution:
      "**完整证明（乘 $2$ 配成平方和）**\\n\\n考虑差乘以 $2$：\\n$$2\\big(x^2+y^2+1-xy-x-y\\big)=(x-y)^2+(x-1)^2+(y-1)^2.$$\\n（右边展开：$(x^2-2xy+y^2)+(x^2-2x+1)+(y^2-2y+1)=2x^2+2y^2+2-2xy-2x-2y$，恰为左边。）\\n\\n右边是三个实数平方之和，恒 $\\ge0$，故\\n$$2\\big(x^2+y^2+1-xy-x-y\\big)\\ge0\\ \\Longrightarrow\\ x^2+y^2+1\\ge xy+x+y.$$\\n\\n**等号条件**：等号成立当且仅当 $(x-y)^2+(x-1)^2+(y-1)^2=0$，即 $x-y=0$、$x-1=0$、$y-1=0$ 同时成立，也就是 $x=y=1$。此时左右两边都等于 $3$。$\\blacksquare$\\n\\n---\\n**方法要点（BMO1 通用武器）**：二次型不等式的万能起手式是 **SOS（sum of squares，配成平方和）**。若直接配方分母出现，先**整体乘一个正常数**（这里乘 $2$）把交叉项 $-2xy,-2x,-2y$ 凑成 $(x-y)^2,(x-1)^2,(y-1)^2$。平方和 $\\ge0$ 立刻给出不等式，且每个平方为 $0$ 的条件合起来就是等号条件。\\n\\n**延伸练习**：同法可证 $x^2+y^2+z^2\\ge xy+yz+zx$（乘 $2$ 得 $(x-y)^2+(y-z)^2+(z-x)^2\\ge0$）。\\n\\n---\\n*原创题；对标 BMO1 第 1–2 题难度；SOS 恒等式已符号核对（差为 $0$），最小值 $0$ 在 $(1,1)$ 处由 $2\\times10^5$ 次随机取样核对；请对照证明自评。*",
  },

  {
    id: "bmo1-ge-001",
    type: "long",
    testId: "bmo",
    topicId: "bmo-geometry",
    difficulty: 2,
    totalMarks: 10,
    context:
      "【BMO1 风格 · 完整证明题】In triangle $ABC$ the angle at $A$ is a right angle, and $M$ is the midpoint of the hypotenuse $BC$. Prove that $AM=\\tfrac12 BC$ (equivalently, $M$ is equidistant from all three vertices).（在直角三角形 $ABC$ 中 $\\angle A=90^\\circ$，$M$ 为斜边 $BC$ 中点。求证 $AM=\\tfrac12BC$，即 $M$ 到三顶点等距。）真实 BMO1 中本题不设小问——引导小问示范「圆 / 坐标」两条路。",
    parts: [
      { label: "a", marks: 4, question: "引导一（圆的视角）：以 $BC$ 为直径作圆。用「直径所对的圆周角为直角」的逆命题，说明点 $A$ 在这个圆上。",
        solutionOutline: "$\\angle BAC=90^\\circ$，由 Thales 定理之逆，$A$ 落在以 $BC$ 为直径的圆上（因为张直径成直角的点恰在该圆上）。" },
      { label: "b", marks: 3, question: "引导二（半径相等）：指出这个圆的圆心与半径，从而得到 $AM$ 与 $BC$ 的关系。",
        solutionOutline: "以 $BC$ 为直径的圆，圆心是 $BC$ 中点 $M$，半径 $=\\tfrac12BC$。$A$ 在圆上，故 $AM=$ 半径 $=\\tfrac12BC$。" },
      { label: "c", marks: 3, question: "引导三（坐标法验证/替代证明）：设 $A=(0,0),B=(b,0),C=(0,c)$，直接算 $AM$ 与 $\\tfrac12BC$，核对相等。",
        solutionOutline: "$M=\\left(\\tfrac b2,\\tfrac c2\\right)$，$AM=\\tfrac12\\sqrt{b^2+c^2}$；$BC=\\sqrt{b^2+c^2}$，故 $AM=\\tfrac12BC$。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（圆的视角，附坐标验证）**\\n\\n**证法一（Thales 逆定理）**：以斜边 $BC$ 为直径作圆 $\\omega$，其圆心为 $BC$ 的中点 $M$，半径为 $\\tfrac12BC$。因为 $\\angle BAC=90^\\circ$，而「张某线段成直角的点都落在以该线段为直径的圆上」（圆周角定理在直径情形的逆命题），所以 $A\\in\\omega$。于是 $A$ 到圆心 $M$ 的距离等于半径：\\n$$AM=\\tfrac12BC.$$\\n特别地 $MA=MB=MC$，即 $M$ 到三顶点等距。$\\blacksquare$\\n\\n**证法二（坐标法，同时用作数值验证）**：把直角顶点放在原点，$A=(0,0)$，$B=(b,0)$，$C=(0,c)$（$b,c>0$）。则 $M=\\left(\\tfrac b2,\\tfrac c2\\right)$，\\n$$AM=\\sqrt{\\left(\\tfrac b2\\right)^2+\\left(\\tfrac c2\\right)^2}=\\tfrac12\\sqrt{b^2+c^2},\\qquad BC=\\sqrt{b^2+c^2},$$\\n故 $AM=\\tfrac12BC$。\\n\\n---\\n**方法要点（BMO1 通用武器）**：见到**直角**就想**以斜边为直径的圆**（Thales）；见到**中点/等距**就想**圆心**。几何证明题在 BMO 里两条常备路线：纯几何（圆、相似、角度追逐）与解析几何（设坐标硬算）——后者虽笨但稳，考场上算不清综合法时是可靠的兜底。\\n\\n**延伸**：本结论反过来也成立——若三角形一条中线等于其对应边的一半，则该边所对的角为直角（同一圆的刻画）。\\n\\n---\\n*原创题；对标 BMO1 第 1 题难度；$AM=\\tfrac12BC$ 已在 $2\\times10^4$ 组随机直角三角形上用坐标法核对；请对照证明自评。*",
  },

  {
    id: "bmo1-ge-002",
    type: "long",
    testId: "bmo",
    topicId: "bmo-geometry",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO1 风格 · 完整证明题】In triangle $ABC$, the internal bisector of $\\angle A$ meets $BC$ at $D$. Prove the Angle Bisector Theorem: $\\dfrac{BD}{DC}=\\dfrac{AB}{AC}$.（在三角形 $ABC$ 中，$\\angle A$ 的内角平分线交 $BC$ 于 $D$。求证角平分线定理 $\\dfrac{BD}{DC}=\\dfrac{AB}{AC}$。）真实 BMO1 中本题不设小问——引导小问示范「面积法」这一利器。",
    parts: [
      { label: "a", marks: 3, question: "引导一（同高之比）：$\\triangle ABD$ 与 $\\triangle ACD$ 从顶点 $A$ 到底边 $BC$ 的高相同。用面积比表示 $\\dfrac{BD}{DC}$。",
        solutionOutline: "两三角形以 $A$ 为公共顶点、底 $BD,DC$ 在同一直线 $BC$ 上，故高相同，$\\dfrac{[ABD]}{[ACD]}=\\dfrac{BD}{DC}$。" },
      { label: "b", marks: 4, question: "引导二（用夹角面积公式）：用 $[\\,\\cdot\\,]=\\tfrac12\\cdot(\\text{两边})\\cdot\\sin(\\text{夹角})$ 分别写出 $[ABD]$ 与 $[ACD]$，注意 $AD$ 是公共边、$\\angle BAD=\\angle CAD$。",
        solutionOutline: "$[ABD]=\\tfrac12\\cdot AB\\cdot AD\\cdot\\sin\\angle BAD$，$[ACD]=\\tfrac12\\cdot AC\\cdot AD\\cdot\\sin\\angle CAD$。因 $AD$ 平分 $\\angle A$，$\\angle BAD=\\angle CAD$，两 $\\sin$ 相等。" },
      { label: "c", marks: 3, question: "引导三（相除收尾）：把 a)、b) 两个面积比联立，约去公共因子，得出结论。",
        solutionOutline: "$\\dfrac{[ABD]}{[ACD]}=\\dfrac{AB\\cdot AD\\sin\\angle BAD}{AC\\cdot AD\\sin\\angle CAD}=\\dfrac{AB}{AC}$；又等于 $\\dfrac{BD}{DC}$，故 $\\dfrac{BD}{DC}=\\dfrac{AB}{AC}$。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（面积法）**\\n\\n设 $[XYZ]$ 表示三角形 $XYZ$ 的面积。\\n\\n**第一个比值（同高）**：$\\triangle ABD$ 与 $\\triangle ACD$ 有公共顶点 $A$，底边 $BD$ 与 $DC$ 落在同一条直线 $BC$ 上，因此从 $A$ 引出的高相同。面积正比于底：\\n$$\\frac{[ABD]}{[ACD]}=\\frac{BD}{DC}. \\quad(\\ast)$$\\n\\n**第二个比值（夹角面积公式）**：用 $[\\,\\cdot\\,]=\\tfrac12\\cdot(\\text{两邻边})\\cdot\\sin(\\text{夹角})$，以 $AD$ 为公共邻边：\\n$$[ABD]=\\tfrac12\\,AB\\cdot AD\\,\\sin\\angle BAD,\\qquad [ACD]=\\tfrac12\\,AC\\cdot AD\\,\\sin\\angle CAD.$$\\n因为 $AD$ 平分 $\\angle A$，有 $\\angle BAD=\\angle CAD$，故 $\\sin\\angle BAD=\\sin\\angle CAD$。相除，$AD$ 与 $\\sin$ 都约去：\\n$$\\frac{[ABD]}{[ACD]}=\\frac{AB}{AC}. \\quad(\\ast\\ast)$$\\n\\n**合并**：由 $(\\ast)$ 与 $(\\ast\\ast)$，\\n$$\\frac{BD}{DC}=\\frac{AB}{AC}. \\qquad\\blacksquare$$\\n\\n---\\n**方法要点（BMO1 通用武器）**：**面积法**是几何证比例/共点的利器——「同高时面积比 = 底之比」与「夹角面积公式 $\\tfrac12 ab\\sin C$」两把钥匙，配合角平分带来的等角，往往几行就锁定比例。此定理本身（角平分线定理）也是后续许多几何题的常用引理。\\n\\n**延伸**：外角平分线交 $BC$ 延长线于 $D'$ 时有 $\\dfrac{BD'}{D'C}=\\dfrac{AB}{AC}$（同法，注意方向），$D,D'$ 与 $B,C$ 构成调和点列。\\n\\n---\\n*原创题；对标 BMO1 第 2–3 题难度；$\\dfrac{BD}{DC}=\\dfrac{AB}{AC}$ 及「$AD$ 确为角平分线」已在 $2\\times10^4$ 组随机三角形上用坐标法核对；请对照证明自评。*",
  },

  {
    id: "bmo1-ge-003",
    type: "long",
    testId: "bmo",
    topicId: "bmo-geometry",
    difficulty: 2,
    totalMarks: 10,
    context:
      "【BMO1 风格 · 完整证明题】$ABCD$ is a cyclic quadrilateral (its four vertices lie on a circle, in this order). Prove that its opposite angles are supplementary: $\\angle ABC+\\angle ADC=180^\\circ$.（$ABCD$ 是圆内接四边形（四顶点按此顺序在一个圆上）。求证对角互补：$\\angle ABC+\\angle ADC=180^\\circ$。）真实 BMO1 中本题不设小问——引导小问示范「圆周角定理」的直接应用。",
    parts: [
      { label: "a", marks: 4, question: "引导一（圆周角定理）：叙述圆周角定理——同一段弧所对的圆周角是它所对**圆心角**的一半。指出 $\\angle ABC$ 与 $\\angle ADC$ 各自所对的弧。",
        solutionOutline: "圆周角 = 所对圆心角的一半。顶点 $B$ 处的 $\\angle ABC$ 所对的是不含 $B$ 的弧 $ADC$；顶点 $D$ 处的 $\\angle ADC$ 所对的是不含 $D$ 的弧 $ABC$。" },
      { label: "b", marks: 3, question: "引导二（两弧拼成整圆）：说明这两段弧 $ADC$ 与 $ABC$ 合起来恰好是整个圆，对应的圆心角之和为 $360^\\circ$。",
        solutionOutline: "弧 $ADC$（不含 $B$）与弧 $ABC$（不含 $D$）互补拼成整圆，二者对应的圆心角之和 $=360^\\circ$。" },
      { label: "c", marks: 3, question: "引导三（取半收尾）：把两个圆周角相加，利用「各为对应圆心角的一半」，得出结论。",
        solutionOutline: "$\\angle ABC+\\angle ADC=\\tfrac12(\\text{弧}ADC\\text{的圆心角})+\\tfrac12(\\text{弧}ABC\\text{的圆心角})=\\tfrac12\\cdot360^\\circ=180^\\circ$。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（圆周角定理）**\\n\\n设四点 $A,B,C,D$ 依次在圆 $\\omega$ 上。用圆周角定理：一个圆周角等于它所对弧对应的**圆心角**的一半。\\n\\n- 顶点在 $B$ 的角 $\\angle ABC$ 张的是**不含 $B$** 的那段弧 $ADC$，故 $\\angle ABC=\\tfrac12\\,\\alpha$，其中 $\\alpha$ 为弧 $ADC$ 所对的圆心角。\\n- 顶点在 $D$ 的角 $\\angle ADC$ 张的是**不含 $D$** 的那段弧 $ABC$，故 $\\angle ADC=\\tfrac12\\,\\beta$，其中 $\\beta$ 为弧 $ABC$ 所对的圆心角。\\n\\n弧 $ADC$ 与弧 $ABC$ 恰好把整个圆分成互补的两段，它们对应的圆心角之和是一整圈：\\n$$\\alpha+\\beta=360^\\circ.$$\\n于是\\n$$\\angle ABC+\\angle ADC=\\tfrac12\\alpha+\\tfrac12\\beta=\\tfrac12(\\alpha+\\beta)=\\tfrac12\\cdot360^\\circ=180^\\circ. \\qquad\\blacksquare$$\\n\\n---\\n**方法要点（BMO1 通用武器）**：**圆周角定理**是圆相关题的核心——「同弧圆周角相等」「圆周角 = 半圆心角」「直径所对圆周角为 $90^\\circ$」三条要熟到条件反射。圆内接四边形对角互补是它的直接推论，反过来（对角互补 $\\Rightarrow$ 四点共圆）也常用来证共圆。\\n\\n**延伸练习**：由本结论可推出圆内接四边形的外角等于其内对角，这在角度追逐题里极常用。\\n\\n---\\n*原创题；对标 BMO1 第 1–2 题难度；$\\angle ABC+\\angle ADC=180^\\circ$ 已在 $2\\times10^4$ 组圆上随机四点（依序）用坐标法核对；请对照证明自评。*",
  },

  {
    id: "bmo1-ge-004",
    type: "long",
    testId: "bmo",
    topicId: "bmo-geometry",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO1 风格 · 完整证明题】$ABC$ is an equilateral triangle and $P$ is a point on the arc $BC$ of its circumcircle not containing $A$. Prove that $PA=PB+PC$.（$ABC$ 为等边三角形，$P$ 是其外接圆上不含 $A$ 的弧 $BC$ 上一点。求证 $PA=PB+PC$。）真实 BMO1 中本题不设小问——引导小问示范托勒密定理（Ptolemy）这一强力工具。",
    parts: [
      { label: "a", marks: 3, question: "引导一（托勒密定理）：叙述圆内接四边形的托勒密定理：对角线之积等于两组对边之积之和。指出四边形 $ABPC$ 中哪两条是对角线。",
        solutionOutline: "圆内接四边形托勒密：对角线乘积 = 两组对边乘积之和。$P$ 在弧 $BC$ 上（不含 $A$），四点绕圆的顺序为 $A,B,P,C$，故对角线是 $AP$ 与 $BC$。" },
      { label: "b", marks: 4, question: "引导二（写出托勒密等式）：对圆内接四边形 $ABPC$ 写出托勒密恒等式（对角线 $AP,BC$；对边 $AB\\&PC$、$BP\\&AC$）。",
        solutionOutline: "$AP\\cdot BC=AB\\cdot PC+BP\\cdot AC$。" },
      { label: "c", marks: 3, question: "引导三（用等边收尾）：代入 $AB=BC=CA$，化简得结论。",
        solutionOutline: "设边长 $AB=BC=CA=s$。代入：$AP\\cdot s=s\\cdot PC+BP\\cdot s$，两边除以 $s>0$ 得 $AP=PC+BP$，即 $PA=PB+PC$。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（托勒密定理）**\\n\\n因为 $P$ 在外接圆上不含 $A$ 的弧 $BC$ 上，四点绕圆的顺序为 $A,B,P,C$，故 $ABPC$ 是一个圆内接（凸）四边形，其对角线为 $AP$ 与 $BC$。\\n\\n对圆内接四边形应用**托勒密定理**（对角线之积 = 两组对边之积之和）：\\n$$AP\\cdot BC=AB\\cdot PC+BP\\cdot AC.$$\\n\\n由于 $ABC$ 为等边三角形，$AB=BC=CA=s$。代入上式：\\n$$AP\\cdot s=s\\cdot PC+BP\\cdot s.$$\\n两边同除以 $s>0$：\\n$$AP=PC+BP,\\qquad\\text{即}\\qquad PA=PB+PC. \\qquad\\blacksquare$$\\n\\n---\\n**方法要点（BMO1 通用武器）**：**托勒密定理**是处理「圆内接四边形边与对角线关系」的利器；一旦图形里出现共圆四点且要证边长的和/积关系，先试托勒密。等边（或正多边形）常让各边相等，从而把托勒密等式塌缩成漂亮的线性关系——本题正是这种「托勒密 + 对称」的经典配合（此结论即 Van Schooten 定理）。\\n\\n**延伸练习**：若 $ABC$ 不是等边而是等腰，或 $P$ 在其它弧上，托勒密同样给出对应的线性关系，可自行推导。\\n\\n---\\n*原创题；对标 BMO1 第 2–3 题难度；$PA=PB+PC$ 已在弧 $BC$ 上 $2\\times10^4$ 个随机点 $P$ 用坐标法核对；请对照证明自评。*",
  },

  {
    id: "bmo1-co-002",
    type: "long",
    testId: "bmo",
    topicId: "bmo-combinatorics",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO1 风格 · 完整证明题】Prove that if any $n+1$ numbers are chosen from $\\{1,2,\\dots,2n\\}$, then two of the chosen numbers are coprime.（求证：从 $\\{1,2,\\dots,2n\\}$ 中任取 $n+1$ 个数，其中必有两个互素。）真实 BMO1 中本题不设小问——引导小问示范鸽巢原理，并请思考 $n+1$ 是否可减小。",
    parts: [
      { label: "a", marks: 3, question: "引导一（关键引理）：证明相邻两个整数 $k$ 与 $k+1$ 必互素。",
        solutionOutline: "设 $d\\mid k$ 且 $d\\mid k+1$，则 $d\\mid (k+1)-k=1$，故 $d=1$，即 $\\gcd(k,k+1)=1$。" },
      { label: "b", marks: 4, question: "引导二（造鸽巢）：把 $\\{1,2,\\dots,2n\\}$ 分成 $n$ 个「相邻对」抽屉。写出这个分法，并说明每个抽屉里的两数相邻。",
        solutionOutline: "分成 $\\{1,2\\},\\{3,4\\},\\dots,\\{2n-1,2n\\}$ 共 $n$ 个抽屉，每个抽屉内是相邻整数 $2j-1,2j$。" },
      { label: "c", marks: 3, question: "引导三（鸽巢 + 收尾）：用鸽巢原理完成证明；再说明为什么 $n+1$ 不能换成更小（构造一个 $n$ 元、无两数互素的选法）。",
        solutionOutline: "取 $n+1$ 个数放进 $n$ 个抽屉，必有两个落在同一抽屉 → 它们相邻 → 互素。$n$ 不够：取全体偶数 $\\{2,4,\\dots,2n\\}$ 共 $n$ 个，两两公因数 $\\ge2$，无一对互素，故 $n+1$ 为最小值。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（鸽巢原理）**\\n\\n**引理（相邻数互素）**：对任意整数 $k$，$\\gcd(k,k+1)=1$。因为若 $d$ 同时整除 $k$ 与 $k+1$，则 $d$ 整除它们的差 $(k+1)-k=1$，故 $d=1$。\\n\\n**造抽屉**：把 $\\{1,2,\\dots,2n\\}$ 划分成 $n$ 个「相邻对」：\\n$$\\{1,2\\},\\ \\{3,4\\},\\ \\dots,\\ \\{2n-1,2n\\}.$$\\n每个抽屉里的两个数是相邻整数。\\n\\n**鸽巢**：现在选出 $n+1$ 个数放入这 $n$ 个抽屉。由鸽巢原理，必有两个被选的数落在**同一个抽屉**里；它们是相邻整数，由引理互素。这就证明了所选数中必有两个互素。$\\blacksquare$\\n\\n**$n+1$ 是最少的（紧性）**：只取 $n$ 个数时可能没有互素对——例如取全体偶数 $\\{2,4,6,\\dots,2n\\}$（恰 $n$ 个），任意两数都有公因数 $2$，故没有一对互素。因此「$n+1$」不能再减小。\\n\\n---\\n**方法要点（BMO1 通用武器）**：**鸽巢原理**的关键是**设计抽屉**——本题把「要证的性质（互素）」编码进抽屉（相邻对），使「同抽屉」自动蕴含「互素」。证「最少需要多少个」这类题，还要补上**紧性构造**（给出一个差一点点就失败的例子），这一半同样占分。\\n\\n**延伸练习**：同样把 $\\{1,\\dots,2n\\}$ 按「最大奇因子」分类，可证任取 $n+1$ 个数必有一个整除另一个。\\n\\n---\\n*原创题；对标 BMO1 第 2–3 题难度；「每个 $(n+1)$ 元子集含互素对」及「全偶数 $n$ 元子集无互素对」已对 $n\\le8$ 穷举核对；请对照证明自评。*",
  },

  {
    id: "bmo1-co-003",
    type: "long",
    testId: "bmo",
    topicId: "bmo-combinatorics",
    difficulty: 2,
    totalMarks: 10,
    context:
      "【BMO1 风格 · 完整证明题】An $8\\times8$ chessboard has two opposite corner squares removed (leaving $62$ squares). Prove that the remaining board cannot be tiled by $31$ dominoes, each covering two adjacent squares.（从 $8\\times8$ 棋盘中去掉两个相对的角格（剩 $62$ 格）。求证：剩下的棋盘无法用 $31$ 个多米诺骨牌（每张盖相邻两格）铺满。）真实 BMO1 中本题不设小问——引导小问示范「染色不变量」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（染色）：给棋盘黑白相间染色。说明每张多米诺无论横放竖放，都恰好盖住一个黑格和一个白格。",
        solutionOutline: "国际象棋式黑白染色下，相邻两格颜色必不同；多米诺盖相邻两格，故恒盖一黑一白。" },
      { label: "b", marks: 4, question: "引导二（数颜色）：说明两个相对的角格同色，从而去掉它们后黑、白格数不再相等，算出各是多少。",
        solutionOutline: "相对两角同色（棋盘对角同色）。原本黑白各 $32$；去掉两个同色角（设为黑），剩黑 $30$、白 $32$，相差 $2$。" },
      { label: "c", marks: 3, question: "引导三（收尾）：用 a)、b) 导出矛盾，完成证明。",
        solutionOutline: "$31$ 张多米诺须盖 $31$ 黑 $+31$ 白；但剩下黑 $30\\ne32$ 白，颜色数不等，无法配对，故不可铺满。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（染色不变量）**\\n\\n给 $8\\times8$ 棋盘作标准黑白相间染色（相邻格异色），黑、白格各 $32$ 个。\\n\\n**每张多米诺盖一黑一白**：多米诺覆盖的两格必相邻，而相邻格颜色相反，所以每张多米诺恰好盖 $1$ 个黑格与 $1$ 个白格。若能用 $31$ 张多米诺铺满 $62$ 格，则被盖的黑格数与白格数必**相等**（各 $31$）。\\n\\n**相对角同色**：棋盘上两个相对的角格颜色相同（对角线方向颜色不变）。不妨设它们都是黑色。去掉这两个黑角后，剩下\\n$$\\text{黑格 }32-2=30,\\qquad \\text{白格 }32.$$\\n黑白数目相差 $2$，并不相等。\\n\\n**矛盾**：一方面铺满要求黑白各 $31$、即数目相等；另一方面剩余棋盘黑 $30$、白 $32$ 不相等。二者矛盾，故这块去掉相对两角的棋盘**无法**被 $31$ 张多米诺铺满。$\\blacksquare$\\n\\n---\\n**方法要点（BMO1 通用武器）**：**染色**是「能否铺砖 / 覆盖」类问题的头号武器——找一种染色，使每块砖对各色的覆盖数固定（本题每砖恰 $1$ 黑 $1$ 白），于是「各色总数」成了铺法的**不变量**；只要目标区域破坏了这个平衡（黑白不等），就立即不可行。这与组合题里的奇偶/不变量思想一脉相承。\\n\\n**延伸**：一般 $2n\\times2n$ 棋盘去掉相对两角同样不可铺（同色角，黑白差 $2$）；但去掉**异色**两格则往往可铺（Gomory 定理）。\\n\\n---\\n*原创题；对标 BMO1 第 1–2 题难度；「相对角同色、去后黑白差 $2$」已对 $2n\\times2n$（$n=1\\dots29$）程序核对；请对照证明自评。*",
  },

  {
    id: "bmo1-co-004",
    type: "long",
    testId: "bmo",
    topicId: "bmo-combinatorics",
    difficulty: 2,
    totalMarks: 10,
    context:
      "【BMO1 风格 · 完整证明题】At a party, some pairs of people shake hands. Prove that the number of people who shake hands an odd number of times is even.（在一个聚会上，某些人两两握手。求证：握手次数为奇数的人数是偶数。）（这就是「握手引理」。）真实 BMO1 中本题不设小问——引导小问示范「双重计数 + 奇偶」。",
    parts: [
      { label: "a", marks: 4, question: "引导一（双重计数）：设每人握手次数为其「度数」。证明所有人的度数之和等于握手总次数的 $2$ 倍，因而是偶数。",
        solutionOutline: "每次握手涉及 $2$ 个人，给这 $2$ 人各贡献 $1$ 次度数。故 $\\sum(\\text{度数})=2\\times(\\text{握手总次数})$，为偶数。" },
      { label: "b", marks: 3, question: "引导二（拆成两部分）：把所有人分成「度数为偶」与「度数为奇」两组，说明偶度数那组的度数之和为偶数。",
        solutionOutline: "偶数之和仍为偶数，故所有偶度数者的度数总和为偶数。" },
      { label: "c", marks: 3, question: "引导三（收尾）：由 a) 总和为偶、b) 偶组之和为偶，推出奇组之和为偶，从而奇度数的人数为偶。",
        solutionOutline: "奇组度数和 = 总和 − 偶组度数和 = 偶 − 偶 = 偶。而奇组每人度数为奇，若干个奇数之和为偶 $\\Rightarrow$ 奇数的个数为偶。故奇度数的人数为偶。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（双重计数 + 奇偶）**\\n\\n把每个人握手的次数称为他的**度数**。\\n\\n**第一步（度数总和为偶）**：每一次握手恰好涉及 $2$ 个人，对这 $2$ 人的度数各贡献 $1$。因此把所有人的度数加起来，等于把每次握手数了两遍：\\n$$\\sum_{\\text{每个人}}(\\text{度数})=2\\times(\\text{握手总次数}),$$\\n这是一个偶数。\\n\\n**第二步（分成奇偶两组）**：把众人分成两组——度数为偶的人 $E$ 与度数为奇的人 $O$。$E$ 组每人度数为偶，其度数之和当然是偶数。\\n\\n**第三步（推出结论）**：\\n$$\\underbrace{\\sum_{O}(\\text{度数})}_{?}=\\underbrace{\\sum_{\\text{所有人}}(\\text{度数})}_{\\text{偶}}-\\underbrace{\\sum_{E}(\\text{度数})}_{\\text{偶}}=\\text{偶}.$$\\n所以 $O$ 组的度数之和是偶数。但 $O$ 组里每个人的度数都是**奇数**；若干个奇数之和为偶数，当且仅当奇数的**个数为偶**。因此度数为奇的人数 $|O|$ 是偶数。$\\blacksquare$\\n\\n---\\n**方法要点（BMO1 通用武器）**：**双重计数**（同一个量用两种方式数，得到等式）是组合证明的支柱；配合**奇偶分析**，「奇数之和的奇偶性由奇数个数决定」这一句常是收口的关键。用图论语言说：任何图中奇度顶点的个数为偶——这就是握手引理。\\n\\n**延伸练习**：由此可知「不可能有 $n$ 个人每人都恰好与其他人中奇数个握手，若 $n$ 为奇数且要求人人度数相同为奇」——把握手引理套到具体约束上是常见考法。\\n\\n---\\n*原创题；对标 BMO1 第 1–2 题难度；「奇度数顶点个数恒为偶」已在 $5000$ 个随机图上程序核对；请对照证明自评。*",
  },
];
