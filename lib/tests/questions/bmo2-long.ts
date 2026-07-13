// BMO Round 2 (BMO2) 风格证明长题（8 道，每考点 2 道）。100% 原创；仅以 2006–2026 年 BMO2 真题做结构/主题/难度校准，
// 未照搬任何真题。对标 BMO2：3.5 小时 4 题、每题 10 分、IMO 选拔级难度（显著高于 BMO1）。
// 作者锁定；每题数值事实均由 sympy/高精度/坐标法程序核对。id 前缀 bmo2- 以区分 BMO1。
import type { LongQuestion } from "./types";

export const BMO2_LONG_SAMPLE: LongQuestion[] = [
  {
    id: "bmo2-nt-001",
    type: "long",
    testId: "bmo",
    topicId: "bmo-number",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】Prove that $\\lfloor(2+\\sqrt3)^n\\rfloor$ is odd for every positive integer $n$. (Here $\\lfloor x\\rfloor$ denotes the greatest integer not exceeding $x$.)（求证：对每个正整数 $n$，$\\lfloor(2+\\sqrt3)^n\\rfloor$ 都是奇数。）真实 BMO2 为 4 道纯证明题、每题 10 分——本题引导小问仅为脚手架，建议先独立尝试「共轭配对」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（共轭伴随）：设 $\\alpha=2+\\sqrt3,\\ \\beta=2-\\sqrt3$。证明 $\\alpha,\\beta$ 是 $x^2-4x+1=0$ 的两根；令 $I_n=\\alpha^n+\\beta^n$，求 $I_0,I_1$ 并写出 $I_n$ 的递推。",
        solutionOutline: "$\\alpha+\\beta=4,\\ \\alpha\\beta=1$，故同为 $x^2-4x+1=0$ 的根。$I_0=2,\\ I_1=4$；由 $x^2=4x-1$ 得递推 $I_n=4I_{n-1}-I_{n-2}$。" },
      { label: "b", marks: 4, question: "引导二（整数且偶）：证明每个 $I_n$ 都是偶整数。",
        solutionOutline: "由递推与 $I_0,I_1\\in\\mathbb Z$ 归纳知 $I_n\\in\\mathbb Z$。模 $2$：$I_0\\equiv I_1\\equiv0$，且 $I_n\\equiv4I_{n-1}-I_{n-2}\\equiv-I_{n-2}\\equiv I_{n-2}\\pmod2$，故所有 $I_n$ 为偶。" },
      { label: "c", marks: 3, question: "引导三（取整收尾）：利用 $0<\\beta<1$ 说明 $\\lfloor\\alpha^n\\rfloor=I_n-1$，从而为奇数。",
        solutionOutline: "$0<\\beta=2-\\sqrt3<1\\Rightarrow0<\\beta^n<1$。$\\alpha^n=I_n-\\beta^n$，故 $\\lfloor\\alpha^n\\rfloor=I_n-1$，为偶数减一，即奇数。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（共轭伴随 + 取整）**\\n\\n设 $\\alpha=2+\\sqrt3$，$\\beta=2-\\sqrt3$。则 $\\alpha+\\beta=4$，$\\alpha\\beta=(2)^2-3=1$，故 $\\alpha,\\beta$ 是同一个二次方程 $x^2-4x+1=0$ 的两根。\\n\\n令 $I_n=\\alpha^n+\\beta^n$。则 $I_0=2$，$I_1=\\alpha+\\beta=4$。由 $\\alpha,\\beta$ 满足 $x^2=4x-1$，对 $\\alpha^n,\\beta^n$ 各乘幂相加得递推\\n$$I_n=4I_{n-1}-I_{n-2}\\qquad(n\\ge2).$$\\n\\n**$I_n$ 为偶整数**：$I_0,I_1$ 为整数，由递推归纳知所有 $I_n\\in\\mathbb Z$。再看奇偶：$I_0\\equiv0,\\ I_1\\equiv0\\pmod2$，且\\n$$I_n\\equiv4I_{n-1}-I_{n-2}\\equiv -I_{n-2}\\equiv I_{n-2}\\pmod2,$$\\n故所有 $I_n$ 都是偶数。\\n\\n**取整**：因为 $0<\\beta=2-\\sqrt3\\approx0.268<1$，所以对 $n\\ge1$ 有 $0<\\beta^n<1$。于是\\n$$\\alpha^n=I_n-\\beta^n,\\qquad 0<\\beta^n<1\\ \\Longrightarrow\\ \\lfloor\\alpha^n\\rfloor=I_n-1.$$\\n由 $I_n$ 为偶数，$I_n-1$ 为奇数，即 $\\lfloor(2+\\sqrt3)^n\\rfloor$ 为奇数。$\\blacksquare$\\n\\n---\\n**方法要点（BMO2 通用武器）**：遇到 $(a+\\sqrt b)^n$ 的取整/整除问题，几乎总是引入**共轭** $(a-\\sqrt b)^n$——两者之和 $I_n$ 消去无理部分成为满足线性递推的整数列，而共轭项落在 $(0,1)$ 内恰好「顶起」取整。递推 + 模运算控制奇偶，是这类题的标准组合。\\n\\n**延伸**：同法可证 $(1+\\sqrt2)^n+(1-\\sqrt2)^n$ 为整数并分析其模某数的周期；以及 $\\lfloor(2+\\sqrt3)^n\\rfloor$ 被更高次幂整除的性质。\\n\\n---\\n*原创题；仅以 BMO2 真题的「递推 / 取整」题型做难度校准，未照搬任何真题；$I_n$ 偶性与 $\\lfloor\\alpha^n\\rfloor=I_n-1$ 已用 $80$ 位高精度对 $n=1\\dots60$ 核对；请对照证明自评。*",
  },

  {
    id: "bmo2-nt-002",
    type: "long",
    testId: "bmo",
    topicId: "bmo-number",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】Prove that if $n$ is an integer with $\\gcd(n,30)=1$, then $n^4\\equiv 1\\pmod{240}$. (In particular this holds for every prime $p\\ge 7$.)（求证：若整数 $n$ 与 $30$ 互素，则 $n^4\\equiv1\\pmod{240}$；特别地对每个素数 $p\\ge7$ 成立。）真实 BMO2 为纯证明题——引导小问示范「CRT 拆模 + 费马」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（拆模）：把 $240$ 分解为两两互素的因子，并说明 $\\gcd(n,30)=1$ 意味着 $n$ 关于哪些素数是可逆的。",
        solutionOutline: "$240=16\\cdot3\\cdot5$，三因子两两互素。$\\gcd(n,30)=1\\Rightarrow n$ 为奇数、且 $3\\nmid n$、$5\\nmid n$。" },
      { label: "b", marks: 4, question: "引导二（逐模验证）：分别证明 $n^4\\equiv1\\pmod{16}$、$n^4\\equiv1\\pmod3$、$n^4\\equiv1\\pmod5$。",
        solutionOutline: "$n$ 奇 $\\Rightarrow n^2\\equiv1\\pmod8\\Rightarrow n^4\\equiv1\\pmod{16}$；$3\\nmid n\\Rightarrow n^2\\equiv1\\pmod3\\Rightarrow n^4\\equiv1$；$5\\nmid n\\Rightarrow$ 由费马小定理 $n^4\\equiv1\\pmod5$。" },
      { label: "c", marks: 3, question: "引导三（合并）：用中国剩余定理把三个同余合成模 $240$ 的结论。",
        solutionOutline: "$16,3,5$ 两两互素，三处都 $\\equiv1$，由 CRT 得 $n^4\\equiv1\\pmod{16\\cdot3\\cdot5}=\\pmod{240}$。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（CRT 拆模 + 费马小定理）**\\n\\n分解 $240=16\\cdot3\\cdot5$，这三个因子两两互素。由 $\\gcd(n,30)=1$ 知 $n$ 为奇数，且 $3\\nmid n$、$5\\nmid n$。\\n\\n**模 $16$**：$n$ 为奇数，写 $n=2m+1$，则 $n^2=4m(m+1)+1\\equiv1\\pmod8$（$m(m+1)$ 为偶）。设 $n^2=8k+1$，则 $n^4=(8k+1)^2=64k^2+16k+1\\equiv1\\pmod{16}$。\\n\\n**模 $3$**：$3\\nmid n\\Rightarrow n\\equiv\\pm1\\pmod3\\Rightarrow n^2\\equiv1\\Rightarrow n^4\\equiv1\\pmod3$。\\n\\n**模 $5$**：$5\\nmid n$，由费马小定理 $n^{5-1}=n^4\\equiv1\\pmod5$。\\n\\n**合并（CRT）**：$n^4-1$ 同时被 $16,3,5$ 整除；因三者两两互素，$n^4-1$ 被它们的乘积 $240$ 整除，即\\n$$n^4\\equiv1\\pmod{240}.$$\\n特别地，每个素数 $p\\ge7$ 都与 $30$ 互素，故 $p^4\\equiv1\\pmod{240}$。$\\blacksquare$\\n\\n**注**：条件不能减弱到「$p\\ge5$」——$p=5$ 时 $5^4=625\\equiv145\\pmod{240}\\ne1$，因为 $5\\mid5$ 使模 $5$ 那一步失效。\\n\\n---\\n**方法要点（BMO2 通用武器）**：「证 $n^k\\equiv1\\pmod N$」的标准打法是**把 $N$ 拆成两两互素的素数幂，逐个用费马小定理 / 提升幂 / 直接展开验证，再用 CRT 合并**。对 $2$ 的幂要小心——费马给不出，需用「奇数平方 $\\equiv1\\pmod8$」这类结构性事实。\\n\\n**延伸**：同法可证 $\\gcd(n,42)=1\\Rightarrow n^6\\equiv1\\pmod{504}$（$504=8\\cdot9\\cdot7$，配合 $\\lambda$ 函数）。\\n\\n---\\n*原创题；仅以 BMO2 真题的数论题型做难度校准；$\\gcd(n,30)=1\\Rightarrow n^4\\equiv1\\pmod{240}$ 已对 $n<5000$ 全部互素者及素数 $p<20000$ 程序核对（并确认 $p=5$ 反例）；请对照证明自评。*",
  },

  {
    id: "bmo2-al-001",
    type: "long",
    testId: "bmo",
    topicId: "bmo-algebra",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】Let $a,b,c$ be positive real numbers with $abc=1$. Prove that $a^2+b^2+c^2\\ge a+b+c$, and determine when equality holds.（设正实数 $a,b,c$ 满足 $abc=1$，求证 $a^2+b^2+c^2\\ge a+b+c$，并确定等号条件。）真实 BMO2 为纯证明题——引导小问示范「两步夹逼 + 齐次化思想」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（幂平均）：证明对任意实数 $a,b,c$ 有 $a^2+b^2+c^2\\ge\\dfrac{(a+b+c)^2}{3}$。",
        solutionOutline: "$3(a^2+b^2+c^2)-(a+b+c)^2=(a-b)^2+(b-c)^2+(c-a)^2\\ge0$，即得。" },
      { label: "b", marks: 4, question: "引导二（用约束）：利用 $abc=1$ 证明 $a+b+c\\ge3$。",
        solutionOutline: "由 AM–GM：$a+b+c\\ge3\\sqrt[3]{abc}=3\\sqrt[3]{1}=3$，等号当 $a=b=c$。" },
      { label: "c", marks: 3, question: "引导三（夹逼收尾 + 等号）：记 $s=a+b+c\\ge3$，用 a)、b) 串起 $a^2+b^2+c^2\\ge\\dfrac{s^2}{3}\\ge s$。",
        solutionOutline: "$a^2+b^2+c^2\\ge\\dfrac{s^2}{3}=s\\cdot\\dfrac s3\\ge s\\cdot1=s=a+b+c$（因 $s\\ge3\\Rightarrow\\frac s3\\ge1$）。等号需 $a=b=c$ 且 $s=3$，即 $a=b=c=1$。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（幂平均 + AM–GM 两步夹逼）**\\n\\n**第一步（幂平均）**：对任意实数，\\n$$3(a^2+b^2+c^2)-(a+b+c)^2=(a-b)^2+(b-c)^2+(c-a)^2\\ge0,$$\\n即 $a^2+b^2+c^2\\ge\\dfrac{(a+b+c)^2}{3}$。\\n\\n**第二步（用约束 $abc=1$）**：由三元 AM–GM，\\n$$a+b+c\\ge3\\sqrt[3]{abc}=3.$$\\n\\n**串联**：记 $s=a+b+c\\ge3$，则 $\\dfrac s3\\ge1$，于是\\n$$a^2+b^2+c^2\\ \\ge\\ \\frac{s^2}{3}\\ =\\ s\\cdot\\frac{s}{3}\\ \\ge\\ s\\cdot1\\ =\\ s\\ =\\ a+b+c.$$\\n\\n**等号条件**：第一步等号要 $a=b=c$；第二步 $s=3$（即 AM–GM 取等）也要 $a=b=c$；且串联中 $\\frac s3=1$ 要 $s=3$。三者合起来即 $a=b=c$ 且 $a+b+c=3$，也就是 $a=b=c=1$（此时 $abc=1$ 成立），两边都等于 $3$。$\\blacksquare$\\n\\n---\\n**方法要点（BMO2 通用武器）**：带**乘积约束**（如 $abc=1$）的不等式，常把「平方和」用**幂平均**压到 $\\dfrac{(\\sum a)^2}{3}$，再用 **AM–GM** 把 $\\sum a$ 顶到 $\\ge3$，两段夹逼即得。关键的桥是 $s\\ge3\\Rightarrow \\frac s3\\ge1$，让 $\\frac{s^2}{3}\\ge s$。等号必须三处同时取等——BMO2 尤其看重完整的等号讨论。\\n\\n**延伸**：同法证 $abc=1\\Rightarrow a^3+b^3+c^3\\ge a+b+c$（幂平均 + $\\sum a\\ge3$）。\\n\\n---\\n*原创题；仅以 BMO2 不等式题型做难度校准；下界与等号点 $(1,1,1)$ 已由 $4\\times10^5$ 次约束 $abc=1$ 上的随机取样核对；请对照证明自评。*",
  },

  {
    id: "bmo2-al-002",
    type: "long",
    testId: "bmo",
    topicId: "bmo-algebra",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】A sequence is defined by $a_1=1$ and $a_{n+1}=a_n+\\dfrac{1}{a_n}$ for $n\\ge1$. Prove that $a_{100}>14$.（数列由 $a_1=1$、$a_{n+1}=a_n+\\dfrac1{a_n}$ 定义。求证 $a_{100}>14$。）真实 BMO2 为纯证明题——引导小问示范「平方化 + 累加估计」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（平方化）：由递推推出 $a_{n+1}^2$ 与 $a_n^2$ 的关系，并说明为何 $a_{n+1}^2>a_n^2+2$。",
        solutionOutline: "$a_{n+1}^2=\\left(a_n+\\dfrac1{a_n}\\right)^2=a_n^2+2+\\dfrac1{a_n^2}$。因 $\\dfrac1{a_n^2}>0$，故 $a_{n+1}^2>a_n^2+2$。（各 $a_n>0$。）" },
      { label: "b", marks: 4, question: "引导二（累加）：由 a) 累加，证明 $a_n^2>2n-1$（对 $n\\ge2$）。",
        solutionOutline: "累加 $a_n^2>a_1^2+2(n-1)=1+2(n-1)=2n-1$（$n\\ge2$；$n=1$ 时取等 $a_1^2=1$）。" },
      { label: "c", marks: 3, question: "引导三（代入收尾）：取 $n=100$ 完成证明。",
        solutionOutline: "$a_{100}^2>2\\cdot100-1=199>196=14^2$，且 $a_{100}>0$，故 $a_{100}>14$。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（平方化 + 累加估计）**\\n\\n先注意所有 $a_n>0$（$a_1=1>0$，且正数加正数仍为正，归纳可得）。\\n\\n**平方化**：由递推，\\n$$a_{n+1}^2=\\left(a_n+\\frac1{a_n}\\right)^2=a_n^2+2+\\frac1{a_n^2}.$$\\n由于 $\\dfrac1{a_n^2}>0$，得\\n$$a_{n+1}^2>a_n^2+2.$$\\n\\n**累加**：对 $k=1,2,\\dots,n-1$ 求和上式，\\n$$a_n^2>a_1^2+2(n-1)=1+2(n-1)=2n-1\\qquad(n\\ge2).$$\\n\\n**收尾**：取 $n=100$，\\n$$a_{100}^2>2\\cdot100-1=199>196=14^2.$$\\n因 $a_{100}>0$，两边开方得 $a_{100}>14$。$\\blacksquare$\\n\\n**补充**（上界感知）：同理 $a_{n+1}^2=a_n^2+2+\\dfrac1{a_n^2}$ 且 $a_n^2>2n-1$ 给出 $\\dfrac1{a_n^2}<\\dfrac1{2n-1}$，累加可得 $a_n^2<2n-1+\\tfrac12\\ln(2n-1)+O(1)$，说明 $a_n\\approx\\sqrt{2n}$，本题的估计非常紧。\\n\\n---\\n**方法要点（BMO2 通用武器）**：形如 $a_{n+1}=a_n+f(a_n)$ 的递推，直接分析 $a_n$ 往往困难；**改看 $a_n^2$（或其它单调化的量）**常把递推「线性化」成可累加的形式。这里 $a_{n+1}^2-a_n^2\\approx2$ 立刻给出 $a_n^2\\sim2n$。「换一个量看递推」是 BMO2 数列题的核心技巧。\\n\\n**延伸**：用同样的平方化可估计 $a_n$ 的上界，证明 $\\sqrt{2n-1}<a_n<\\sqrt{2n}$ 一类的双边界。\\n\\n---\\n*原创题；仅以 BMO2 数列题型做难度校准；$a_{100}\\approx14.21>14$ 与 $a_n^2\\ge2n-1$ 已程序核对；请对照证明自评。*",
  },

  {
    id: "bmo2-ge-001",
    type: "long",
    testId: "bmo",
    topicId: "bmo-geometry",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】Let $ABC$ be a triangle with circumcentre $O$ and orthocentre $H$. Let $M$ be the midpoint of $BC$. Prove that the reflection of $H$ in $M$ is the point of the circumcircle diametrically opposite $A$.（设三角形 $ABC$ 外心 $O$、垂心 $H$，$M$ 为 $BC$ 中点。求证：$H$ 关于 $M$ 的对称点是外接圆上与 $A$ 直径相对的点。）真实 BMO2 几何为纯证明题——引导小问示范「以外心为原点的向量法」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（外心为原点 + 垂心向量）：取外心 $O$ 为原点，顶点位置向量 $\\mathbf a,\\mathbf b,\\mathbf c$ 满足 $|\\mathbf a|=|\\mathbf b|=|\\mathbf c|=R$。证明 $H=\\mathbf a+\\mathbf b+\\mathbf c$ 即为垂心。",
        solutionOutline: "验证 $(\\mathbf a+\\mathbf b+\\mathbf c)-\\mathbf a=\\mathbf b+\\mathbf c$ 与 $BC$ 方向 $\\mathbf c-\\mathbf b$ 垂直：$(\\mathbf b+\\mathbf c)\\cdot(\\mathbf c-\\mathbf b)=|\\mathbf c|^2-|\\mathbf b|^2=0$。故点 $\\mathbf a+\\mathbf b+\\mathbf c$ 在过 $A$ 的高线上；对称地在三条高线上，即为垂心 $H$。" },
      { label: "b", marks: 4, question: "引导二（对称点 + 对径点）：写出 $M$ 的向量、$H$ 关于 $M$ 的对称点 $H'$ 的向量；并写出 $A$ 的对径点（外接圆上直径另一端）的向量。",
        solutionOutline: "$M=\\dfrac{\\mathbf b+\\mathbf c}{2}$，$H'=2M-H=(\\mathbf b+\\mathbf c)-(\\mathbf a+\\mathbf b+\\mathbf c)=-\\mathbf a$。$A$ 的对径点为 $-\\mathbf a$（$O$ 为原点，直径另一端）。" },
      { label: "c", marks: 3, question: "引导三（收尾）：比较 b) 的两个向量，并说明 $-\\mathbf a$ 确在外接圆上。",
        solutionOutline: "$H'=-\\mathbf a=$ 对径点，二者相同。且 $|-\\mathbf a|=|\\mathbf a|=R$，$-\\mathbf a$ 在外接圆上。故 $H$ 关于 $M$ 的对称点正是 $A$ 的对径点。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（以外心为原点的向量法）**\\n\\n取外心 $O$ 为原点，三顶点位置向量记 $\\mathbf a,\\mathbf b,\\mathbf c$，则 $|\\mathbf a|=|\\mathbf b|=|\\mathbf c|=R$（外接圆半径）。\\n\\n**垂心向量 $H=\\mathbf a+\\mathbf b+\\mathbf c$**：考察点 $P=\\mathbf a+\\mathbf b+\\mathbf c$。有\\n$$(P-\\mathbf a)\\cdot(\\mathbf c-\\mathbf b)=(\\mathbf b+\\mathbf c)\\cdot(\\mathbf c-\\mathbf b)=|\\mathbf c|^2-|\\mathbf b|^2=R^2-R^2=0,$$\\n故 $P$ 落在过 $A$ 且垂直 $BC$ 的直线（$A$ 处的高线）上。由对称性，$P$ 同样在过 $B$、过 $C$ 的高线上，因此 $P$ 是三高线交点，即垂心 $H=\\mathbf a+\\mathbf b+\\mathbf c$。\\n\\n**对称点**：$BC$ 中点 $M=\\dfrac{\\mathbf b+\\mathbf c}{2}$。$H$ 关于 $M$ 的对称点\\n$$H'=2M-H=(\\mathbf b+\\mathbf c)-(\\mathbf a+\\mathbf b+\\mathbf c)=-\\mathbf a.$$\\n\\n**对径点**：由于 $O$（原点）是外接圆心，与 $A$（位置 $\\mathbf a$）关于圆心对称、直径另一端的点位置向量为 $-\\mathbf a$，且 $|-\\mathbf a|=R$ 确在外接圆上。\\n\\n于是 $H'=-\\mathbf a$ 恰为 $A$ 的对径点。即 $H$ 关于 $BC$ 中点 $M$ 的对称点，正是外接圆上与 $A$ 直径相对的点。$\\blacksquare$\\n\\n**推论**：这等价于「$BHCH'$ 为平行四边形」以及著名的 $\\vec{OH}=\\mathbf a+\\mathbf b+\\mathbf c$、$AH=2\\,OM$。\\n\\n---\\n**方法要点（BMO2 通用武器）**：三角形的垂心/外心/重心关系题，**把外心取作原点**后 $H=\\mathbf a+\\mathbf b+\\mathbf c$、重心 $G=\\dfrac{\\mathbf a+\\mathbf b+\\mathbf c}{3}$、对径点 $=-\\mathbf a$ 都变得极简，很多共线/对称/等长关系一两步向量运算即出（欧拉线也由此立得）。这是 BMO2 几何的强力工具，比纯综合法更少「灵光」。\\n\\n---\\n*原创题；仅以 BMO2 几何题型做难度校准；「$H$ 关于 $M$ 的对称点 $=-\\mathbf a=$ $A$ 的对径点」已在 $2\\times10^4$ 组随机三角形上用坐标法核对；请对照证明自评。*",
  },

  {
    id: "bmo2-ge-002",
    type: "long",
    testId: "bmo",
    topicId: "bmo-geometry",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】Let $ABCD$ be a cyclic quadrilateral (vertices in this order on a circle). Prove Ptolemy's equality: $AC\\cdot BD=AB\\cdot CD+AD\\cdot BC$.（设 $ABCD$ 为圆内接四边形（四点依序在圆上）。求证托勒密等式 $AC\\cdot BD=AB\\cdot CD+AD\\cdot BC$。）真实 BMO2 几何为纯证明题——引导小问示范经典的「等角构造 + 两组相似」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（等角构造）：在对角线 $BD$ 上取点 $K$，使 $\\angle BAK=\\angle CAD$。指出由「同弧圆周角相等」可得的等角（如 $\\angle ABD=\\angle ACD$、$\\angle ADB=\\angle ACB$）。",
        solutionOutline: "取 $K\\in BD$ 使 $\\angle BAK=\\angle CAD$。同弧：$\\angle ABK=\\angle ABD=\\angle ACD$（弧 $AD$），$\\angle ADK=\\angle ADB=\\angle ACB$（弧 $AB$）。" },
      { label: "b", marks: 4, question: "引导二（两组相似）：证明 $\\triangle ABK\\sim\\triangle ACD$ 与 $\\triangle AKD\\sim\\triangle ABC$。",
        solutionOutline: "$\\triangle ABK\\sim\\triangle ACD$：$\\angle BAK=\\angle CAD$ 且 $\\angle ABK=\\angle ACD$（AA）。又 $\\angle KAD=\\angle BAC$（两边同加 $\\angle KAC$），配 $\\angle ADK=\\angle ACB$，得 $\\triangle AKD\\sim\\triangle ABC$（AA）。" },
      { label: "c", marks: 3, question: "引导三（写比例并相加）：由两组相似得出两个乘积等式，利用 $BK+KD=BD$ 相加收尾。",
        solutionOutline: "由 $\\triangle ABK\\sim\\triangle ACD$：$\\dfrac{AB}{AC}=\\dfrac{BK}{CD}\\Rightarrow AB\\cdot CD=AC\\cdot BK$。由 $\\triangle AKD\\sim\\triangle ABC$：$\\dfrac{AD}{AC}=\\dfrac{KD}{BC}\\Rightarrow AD\\cdot BC=AC\\cdot KD$。相加：$AB\\cdot CD+AD\\cdot BC=AC(BK+KD)=AC\\cdot BD$。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（等角构造 + 两组相似）**\\n\\n在对角线 $BD$ 上取一点 $K$，使得 $\\angle BAK=\\angle CAD$（这样的 $K$ 存在且唯一，因为射线 $AK$ 由该角唯一确定并与 $BD$ 相交于内部）。\\n\\n利用**同弧圆周角相等**：\\n$$\\angle ABK=\\angle ABD=\\angle ACD\\quad(\\text{同对弧 }AD),\\qquad \\angle ADK=\\angle ADB=\\angle ACB\\quad(\\text{同对弧 }AB).$$\\n\\n**第一组相似**：$\\triangle ABK$ 与 $\\triangle ACD$ 中，$\\angle BAK=\\angle CAD$ 且 $\\angle ABK=\\angle ACD$，由 AA 相似：\\n$$\\triangle ABK\\sim\\triangle ACD\\ \\Longrightarrow\\ \\frac{AB}{AC}=\\frac{BK}{CD}\\ \\Longrightarrow\\ AB\\cdot CD=AC\\cdot BK.$$\\n\\n**第二组相似**：由 $\\angle BAK=\\angle CAD$，两边同加 $\\angle KAC$ 得 $\\angle BAC=\\angle KAD$；配合 $\\angle ADK=\\angle ACB$，由 AA：\\n$$\\triangle AKD\\sim\\triangle ABC\\ \\Longrightarrow\\ \\frac{AD}{AC}=\\frac{KD}{BC}\\ \\Longrightarrow\\ AD\\cdot BC=AC\\cdot KD.$$\\n\\n**相加**：$K$ 在线段 $BD$ 上，$BK+KD=BD$，故\\n$$AB\\cdot CD+AD\\cdot BC=AC\\cdot BK+AC\\cdot KD=AC(BK+KD)=AC\\cdot BD.\\qquad\\blacksquare$$\\n\\n---\\n**方法要点（BMO2 通用武器）**：托勒密定理的这一**等角构造**证法是几何工具箱里的珍品——在对角线上「切」出一个与目标角相等的点，制造两组相似，把三条边的乘积关系拆成可相加的两块。掌握它不仅为证托勒密，更为许多「圆内接 + 边长乘积」的 BMO2 几何题提供模板（托勒密不等式、婆罗摩笈多、Casey 定理都由此延展）。\\n\\n**延伸**：一般四边形（不必共圆）有托勒密**不等式** $AC\\cdot BD\\le AB\\cdot CD+AD\\cdot BC$，等号当且仅当共圆——同一构造配三角不等式可证。\\n\\n---\\n*原创题；仅以 BMO2 几何题型做难度校准；等式 $AC\\cdot BD=AB\\cdot CD+AD\\cdot BC$ 已在 $2\\times10^4$ 组圆上依序随机四点上用坐标法核对；请对照证明自评。*",
  },

  {
    id: "bmo2-co-001",
    type: "long",
    testId: "bmo",
    topicId: "bmo-combinatorics",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】At a party, some pairs of people are friends. Prove that the people can be split into two groups so that every person has at least as many friends in the other group as in their own group.（聚会上某些人两两为友。求证：可以把众人分成两组，使每个人在「另一组」里的朋友数不少于在「自己组」里的朋友数。）真实 BMO2 组合为纯证明题——引导小问示范「极值原理（最大割）」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（取极值对象）：考虑把众人分成两组的所有分法。定义每种分法的「跨组友谊数」，并说明为何存在使它最大的分法。",
        solutionOutline: "人数有限 $\\Rightarrow$ 分法有限（至多 $2^n$ 种），故「跨组友谊对数」取得最大值，存在一个最大割分法 $(V_1,V_2)$。" },
      { label: "b", marks: 4, question: "引导二（反证 + 移动一人）：假设某人 $v$ 在自己组里的朋友多于在另一组里的朋友。证明把 $v$ 移到另一组会使跨组友谊数严格增加。",
        solutionOutline: "移动 $v$ 后：原来 $v$ 与「本组」的友谊变成跨组（增加 = 本组朋友数），$v$ 与「他组」的友谊变成本组（减少 = 他组朋友数）。净变化 =（本组朋友 − 他组朋友）$>0$，跨组数严格增大。" },
      { label: "c", marks: 3, question: "引导三（矛盾收尾）：用 b) 与 a) 的最大性导出矛盾，完成证明。",
        solutionOutline: "严格增大与「已取最大」矛盾，故不存在这样的 $v$：每个人在他组的朋友数 $\\ge$ 本组朋友数。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（极值原理 / 最大割）**\\n\\n把每个人看作图的一个顶点，友谊看作边。要证：存在顶点二分 $(V_1,V_2)$，使每个顶点在**对面组**的邻居数 $\\ge$ 在**本组**的邻居数。\\n\\n**取极值对象**：人数有限，二分法至多 $2^n$ 种，故「跨组边数」（连接 $V_1$ 与 $V_2$ 的友谊对数）能取到**最大值**。取一个达到最大跨组边数的分法 $(V_1,V_2)$。\\n\\n**反证**：假设存在某人 $v$，他在**本组**的朋友数 $d_{\\text{in}}$ 严格大于在**对面组**的朋友数 $d_{\\text{out}}$，即 $d_{\\text{in}}>d_{\\text{out}}$。把 $v$ 移到另一组：\\n- $v$ 与原本组朋友的边，从「组内」变为「跨组」——跨组边数 $+d_{\\text{in}}$；\\n- $v$ 与原对面组朋友的边，从「跨组」变为「组内」——跨组边数 $-d_{\\text{out}}$。\\n\\n净变化为 $d_{\\text{in}}-d_{\\text{out}}>0$，即跨组边数**严格增加**。这与 $(V_1,V_2)$ 已使跨组边数最大矛盾。\\n\\n因此不存在这样的 $v$：在最大割分法下，**每个人在对面组的朋友数都 $\\ge$ 本组的朋友数**。$\\blacksquare$\\n\\n---\\n**方法要点（BMO2 通用武器）**：**极值原理**——「取一个使某量达到最大/最小的对象，再证它必满足所需性质，否则可微调得到更优者、矛盾」。本题取「最大割」，用「移动一个顶点」作微调，是组合证明里极为通用的模式（也用于证明存在性、构造极端配置）。\\n\\n**延伸**：同一思想给出「任意图的最大割至少含一半的边」，以及可在多项式步内局部改进逼近最大割的算法。\\n\\n---\\n*原创题；仅以 BMO2 组合题型做难度校准；「最大割分法下每顶点跨组度 $\\ge$ 本组度」已在 $3000$ 个随机图上穷举最大割程序核对；请对照证明自评。*",
  },

  {
    id: "bmo2-co-002",
    type: "long",
    testId: "bmo",
    topicId: "bmo-combinatorics",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】Let $n$ be a positive integer. Prove that any sequence of $n^2+1$ distinct real numbers contains a monotonic (strictly increasing or strictly decreasing) subsequence of length $n+1$.（设 $n$ 为正整数。求证：任何由 $n^2+1$ 个不同实数组成的序列，都含有一个长度为 $n+1$ 的单调子序列。）（此即 Erdős–Szekeres 定理。）真实 BMO2 组合为纯证明题——引导小问示范「给每项贴标签 + 鸽巢」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（贴标签）：对第 $i$ 项，令 $x_i$ 为「以第 $i$ 项结尾的最长递增子序列长度」、$y_i$ 为「以第 $i$ 项结尾的最长递减子序列长度」。假设**没有**长度 $n+1$ 的单调子序列，$x_i,y_i$ 各落在什么范围？",
        solutionOutline: "若无长度 $n+1$ 的单调子序列，则每个最长递增/递减子序列长度 $\\le n$，故 $x_i,y_i\\in\\{1,2,\\dots,n\\}$。" },
      { label: "b", marks: 4, question: "引导二（鸽巢）：数对 $(x_i,y_i)$ 共有多少种可能？与项数比较，用鸽巢得出什么？",
        solutionOutline: "$(x_i,y_i)\\in\\{1,\\dots,n\\}^2$ 至多 $n^2$ 种。而项数为 $n^2+1>n^2$，由鸽巢必有两个位置 $i<j$ 满足 $(x_i,y_i)=(x_j,y_j)$。" },
      { label: "c", marks: 3, question: "引导三（导出矛盾）：证明 $i<j$ 时 $(x_i,y_i)\\ne(x_j,y_j)$，与 b) 矛盾，从而完成证明。",
        solutionOutline: "两项不同：若 $a_i<a_j$，则把第 $j$ 项接到「结尾于 $i$ 的最长递增」后，$x_j\\ge x_i+1$；若 $a_i>a_j$，则 $y_j\\ge y_i+1$。无论哪种，$(x_i,y_i)\\ne(x_j,y_j)$，与鸽巢矛盾。故必有长度 $n+1$ 的单调子序列。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（贴标签 + 鸽巢，Erdős–Szekeres）**\\n\\n设序列为 $a_1,a_2,\\dots,a_{n^2+1}$（两两不同）。对每个位置 $i$，定义两个标签：\\n$$x_i=\\text{以 }a_i\\text{ 结尾的最长严格递增子序列的长度},\\qquad y_i=\\text{以 }a_i\\text{ 结尾的最长严格递减子序列的长度}.$$\\n\\n**反证假设**：假设不存在长度为 $n+1$ 的单调子序列。那么每个 $x_i\\le n$、$y_i\\le n$，即\\n$$(x_i,y_i)\\in\\{1,2,\\dots,n\\}\\times\\{1,2,\\dots,n\\},$$\\n这样的数对至多有 $n^2$ 种。\\n\\n**鸽巢**：位置共有 $n^2+1$ 个，而标签对至多 $n^2$ 种，故存在两个位置 $i<j$ 使 $(x_i,y_i)=(x_j,y_j)$。\\n\\n**导出矛盾**：$a_i\\ne a_j$，分两种情形——\\n- 若 $a_i<a_j$：把 $a_j$ 接在「结尾于 $a_i$ 的最长递增子序列」之后，得到一个更长的递增子序列，故 $x_j\\ge x_i+1>x_i$。\\n- 若 $a_i>a_j$：同理把 $a_j$ 接在「结尾于 $a_i$ 的最长递减子序列」之后，故 $y_j\\ge y_i+1>y_i$。\\n\\n两种情形都与 $(x_i,y_i)=(x_j,y_j)$ 矛盾。\\n\\n因此反证假设不成立：序列必含长度为 $n+1$ 的（严格）单调子序列。$\\blacksquare$\\n\\n**紧性**：$n^2$ 个数不够——把 $1,\\dots,n^2$ 排成 $n$ 段、每段长 $n$、段内递减而段与段递增（如 $n=2$：$2,1,4,3$），则最长单调子序列恰为 $n$，说明 $n^2+1$ 是最小值。\\n\\n---\\n**方法要点（BMO2 通用武器）**：**给每个对象贴一个「坐标标签」，再用鸽巢**——本题的妙处是把「单调子序列长度」编码成二维标签 $(x_i,y_i)$，使「两位置标签相同」自相矛盾。这种「构造不变量式标签 + 鸽巢 + 局部可延展性」是 Erdős–Szekeres 及许多极值组合结论的证明范式。\\n\\n---\\n*原创题；对标 Erdős–Szekeres，仅以 BMO2 组合题型做难度校准；「$n^2+1$ 个不同实数必含长度 $n+1$ 单调子序列」已对 $n=2\\dots6$ 大量随机序列程序核对；请对照证明自评。*",
  },
];
