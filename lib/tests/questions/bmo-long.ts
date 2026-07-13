// BMO1 风格证明长题（4 道）。原创；对标 BMO1 Q1–3 难度与 "Prove that / Determine, with proof" 句式；
// 作者锁定；每题数值事实均由 sympy/程序断言核对（见交接包 manifest 与 gen 脚本）。
// 题型配比：数论 2（nt-001 平方差、nt-002 连续四数配方）/ 组合不变量 1（co-001）/ 不等式 1（in-001）。
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
];
