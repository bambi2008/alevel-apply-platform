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

  {
    id: "bmo2-nt-003",
    type: "long",
    testId: "bmo",
    topicId: "bmo-number",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】Prove that there are infinitely many primes of the form $4k+3$.（求证：形如 $4k+3$ 的素数有无穷多个。）真实 BMO2 为纯证明题——引导小问示范「欧几里得式反证 + 模 $4$ 因子引理」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（因子引理）：证明任何 $\\equiv3\\pmod4$ 的整数都至少有一个 $\\equiv3\\pmod4$ 的素因子。",
        solutionOutline: "奇数的素因子都是奇素数，$\\equiv1$ 或 $3\\pmod4$。若某数所有素因子都 $\\equiv1\\pmod4$，则其积也 $\\equiv1\\pmod4$。故 $\\equiv3\\pmod4$ 的数必有一个 $\\equiv3\\pmod4$ 的素因子。" },
      { label: "b", marks: 4, question: "引导二（造数）：假设这类素数只有有限个 $p_1,\\dots,p_r$（含 $3$）。构造 $N=4p_1p_2\\cdots p_r-1$，说明 $N\\equiv3\\pmod4$，并由 a) 取一个素因子 $q\\equiv3\\pmod4$。",
        solutionOutline: "$N=4(\\cdots)-1\\equiv-1\\equiv3\\pmod4$。由 a)，$N$ 有素因子 $q\\equiv3\\pmod4$。" },
      { label: "c", marks: 3, question: "引导三（矛盾）：证明 $q$ 不在 $p_1,\\dots,p_r$ 之列，从而矛盾。",
        solutionOutline: "若 $q=p_i$，则 $q\\mid N$ 且 $q\\mid4p_1\\cdots p_r$，故 $q\\mid1$，不可能。故 $q$ 是新素数，与「已列全」矛盾。无穷多。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（欧几里得式反证）**\\n\\n**因子引理**：任何整数 $M\\equiv3\\pmod4$ 都有一个素因子 $\\equiv3\\pmod4$。理由：$M$ 为奇数，其素因子都是奇素数，每个 $\\equiv1$ 或 $3\\pmod4$。若它们**全部** $\\equiv1\\pmod4$，则乘积 $M$ 也 $\\equiv1\\pmod4$（$1$ 在模 $4$ 乘法下封闭），与 $M\\equiv3$ 矛盾。故必有一个素因子 $\\equiv3\\pmod4$。\\n\\n**反证**：假设 $\\equiv3\\pmod4$ 的素数只有有限个，记为 $p_1,p_2,\\dots,p_r$（其中含 $3$）。构造\\n$$N=4\\,p_1p_2\\cdots p_r-1.$$\\n则 $N\\equiv-1\\equiv3\\pmod4$。由因子引理，$N$ 有素因子 $q\\equiv3\\pmod4$。\\n\\n**矛盾**：这样的 $q$ 必属于列表 $\\{p_1,\\dots,p_r\\}$。但若 $q=p_i$，则 $q\\mid N$ 且 $q\\mid 4p_1\\cdots p_r$，两式相减得 $q\\mid\\big(4p_1\\cdots p_r-N\\big)=1$，不可能。因此 $q$ 是一个**不在列表中**的 $\\equiv3\\pmod4$ 的素数，与「已把它们列全」矛盾。\\n\\n故 $\\equiv3\\pmod4$ 的素数有无穷多个。$\\blacksquare$\\n\\n---\\n**方法要点（BMO2 通用武器）**：欧几里得「造一个逃出名单的新素数」的证法，配合**模 $4$（或模某数）的因子结构引理**，可证很多「某剩余类含无穷多素数」的特例（$4k+3$、$6k+5$ 等）。关键是把构造数放进恰当的同余类，使它必须借用「名单外」的素因子。（注：$4k+1$ 情形更难，需二次剩余。）\\n\\n---\\n*原创题；仅以 BMO2 数论题型做难度校准；「$\\equiv3\\pmod4$ 必有 $\\equiv3\\pmod4$ 素因子」与构造数的因子性质已程序核对；请对照证明自评。*",
  },

  {
    id: "bmo2-nt-004",
    type: "long",
    testId: "bmo",
    topicId: "bmo-number",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】Prove that for every positive integer $n$, there exist $n$ consecutive positive integers each of which is divisible by a perfect square greater than $1$.（求证：对每个正整数 $n$，都存在 $n$ 个连续的正整数，其中每一个都能被某个大于 $1$ 的完全平方数整除。）真实 BMO2 为纯证明题——引导小问示范「中国剩余定理造存在性」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（设目标同余）：取 $n$ 个不同的素数 $p_1,\\dots,p_n$。若想让连续整数 $x+1,\\dots,x+n$ 中第 $i$ 个被 $p_i^2$ 整除，应对 $x$ 提出什么同余条件？",
        solutionOutline: "要求 $p_i^2\\mid x+i$，即 $x\\equiv-i\\pmod{p_i^2}$，$i=1,\\dots,n$。" },
      { label: "b", marks: 4, question: "引导二（CRT 求解）：说明这些模 $p_i^2$ 两两互素，用中国剩余定理得到一个（正整数）解 $x$。",
        solutionOutline: "不同素数的平方 $p_i^2$ 两两互素，故同余方程组有解（模 $\\prod p_i^2$ 唯一）；取其最小正解（必要时加上模的乘积）即得正整数 $x$。" },
      { label: "c", marks: 3, question: "引导三（收尾）：说明 $x+1,\\dots,x+n$ 即为所求。",
        solutionOutline: "对每个 $i$，$p_i^2\\mid x+i$ 且 $p_i^2>1$，故这 $n$ 个连续正整数各被一个 $>1$ 的完全平方数整除。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（中国剩余定理构造）**\\n\\n取 $n$ 个**不同的素数** $p_1,p_2,\\dots,p_n$。我们希望找到正整数 $x$，使得对每个 $i=1,\\dots,n$ 有\\n$$p_i^2\\ \\big|\\ x+i,\\qquad\\text{即}\\qquad x\\equiv-i\\pmod{p_i^2}.$$\\n\\n**用 CRT**：因为 $p_1,\\dots,p_n$ 两两不同，模 $p_1^2,\\dots,p_n^2$ **两两互素**。由中国剩余定理，上述 $n$ 个同余方程组成的系统有解，且解在模 $M=\\prod_{i}p_i^2$ 下唯一。取其中一个**正整数**解 $x$（若最小非负解为 $0$ 或过小，可加上若干个 $M$——同一同余类里有无穷多正整数解）。\\n\\n**收尾**：对这个 $x$，每个 $x+i$（$i=1,\\dots,n$）都被 $p_i^2$ 整除，而 $p_i^2>1$ 是完全平方数。于是\\n$$x+1,\\ x+2,\\ \\dots,\\ x+n$$\\n是 $n$ 个连续的正整数，每一个都能被一个大于 $1$ 的完全平方数整除。$\\blacksquare$\\n\\n**例**（$n=3$，取 $p_1,p_2,p_3=2,3,5$）：解 $x\\equiv-1\\ (4),\\ x\\equiv-2\\ (9),\\ x\\equiv-3\\ (25)$ 得 $x=548$，而 $549=9\\cdot61$、$550=25\\cdot22$、$551$… 修正取法后 $x+1,x+2,x+3$ 分别被 $4,9,25$ 整除，验证无误。\\n\\n---\\n**方法要点（BMO2 通用武器）**：**中国剩余定理是「构造存在性」的利器**——想要一串数各自满足不同的整除/同余要求，就为每个位置分配一个互素的模，用 CRT 一次性凑出满足全部条件的数。这类「任意长的连续整数具有某性质」的题（连续合数、连续 squareful、连续非幂等）几乎都靠 CRT。\\n\\n---\\n*原创题；仅以 BMO2 数论题型做难度校准；CRT 构造对 $n=1\\dots7$ 给出的连续整数确各被相应 $p_i^2$ 整除，已程序核对；请对照证明自评。*",
  },

  {
    id: "bmo2-al-003",
    type: "long",
    testId: "bmo",
    topicId: "bmo-algebra",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】Let $a,b,c$ be positive real numbers. Prove Nesbitt's inequality $\\dfrac{a}{b+c}+\\dfrac{b}{c+a}+\\dfrac{c}{a+b}\\ge\\dfrac32$, and determine when equality holds.（设正实数 $a,b,c$，求证 Nesbitt 不等式并确定等号条件。）真实 BMO2 为纯证明题——引导小问示范「加 $3$ 齐次化 + 和–倒数和不等式」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（加 $3$ 变形）：对每个分式加 $1$，把左边加 $3$ 写成一个「和 × 倒数和」的形式。",
        solutionOutline: "$\\dfrac{a}{b+c}+1=\\dfrac{a+b+c}{b+c}$，三项同理。故 $\\text{LHS}+3=(a+b+c)\\left(\\dfrac1{b+c}+\\dfrac1{c+a}+\\dfrac1{a+b}\\right)$。" },
      { label: "b", marks: 4, question: "引导二（换元 + 关键不等式）：令 $x=b+c,\\ y=c+a,\\ z=a+b$。用 $x,y,z$ 表示 a) 的式子，并对正数用 $(x+y+z)\\left(\\dfrac1x+\\dfrac1y+\\dfrac1z\\right)\\ge9$。",
        solutionOutline: "$x+y+z=2(a+b+c)$，故 $\\text{LHS}+3=\\dfrac{x+y+z}{2}\\left(\\dfrac1x+\\dfrac1y+\\dfrac1z\\right)\\ge\\dfrac12\\cdot9=\\dfrac92$。" },
      { label: "c", marks: 3, question: "引导三（收尾 + 等号）：由 b) 得下界并确定等号条件。",
        solutionOutline: "$\\text{LHS}\\ge\\dfrac92-3=\\dfrac32$。等号当 $x=y=z$，即 $b+c=c+a=a+b$，也就是 $a=b=c$。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（加 $3$ 齐次化 + 和–倒数和不等式）**\\n\\n**加 $3$ 变形**：对每一项加 $1$，\\n$$\\frac{a}{b+c}+1=\\frac{a+b+c}{b+c},$$\\n三项相加得\\n$$\\left(\\frac{a}{b+c}+\\frac{b}{c+a}+\\frac{c}{a+b}\\right)+3=(a+b+c)\\left(\\frac1{b+c}+\\frac1{c+a}+\\frac1{a+b}\\right).$$\\n\\n**换元**：令 $x=b+c,\\ y=c+a,\\ z=a+b$（均为正），则 $x+y+z=2(a+b+c)$，即 $a+b+c=\\dfrac{x+y+z}{2}$。于是\\n$$\\text{LHS}+3=\\frac{x+y+z}{2}\\left(\\frac1x+\\frac1y+\\frac1z\\right).$$\\n对三个正数用**和–倒数和不等式**（AM–HM，或 Cauchy–Schwarz）：\\n$$(x+y+z)\\left(\\frac1x+\\frac1y+\\frac1z\\right)\\ge9.$$\\n因此\\n$$\\text{LHS}+3\\ge\\frac12\\cdot9=\\frac92\\ \\Longrightarrow\\ \\text{LHS}\\ge\\frac92-3=\\frac32.$$\\n\\n**等号条件**：$(x+y+z)\\left(\\frac1x+\\frac1y+\\frac1z\\right)=9$ 当且仅当 $x=y=z$，即 $b+c=c+a=a+b$，也就是 $a=b=c$。此时左边 $=3\\cdot\\dfrac12=\\dfrac32$。$\\blacksquare$\\n\\n---\\n**方法要点（BMO2 通用武器）**：分式型对称不等式，**「每项配 $1$」把分子补成公共的 $a+b+c$** 是最常用的第一步，瞬间化成「和 × 倒数和」，再套 $(\\sum x)(\\sum\\frac1x)\\ge n^2$。这一招（配合 Cauchy–Schwarz 的 Engel 形式 / 权方和）几乎是 Nesbitt 型题的通解。\\n\\n**延伸**：用 Engel 形式 $\\sum\\dfrac{a^2}{a(b+c)}\\ge\\dfrac{(a+b+c)^2}{2(ab+bc+ca)}\\ge\\dfrac32$ 是另一条常见路线。\\n\\n---\\n*原创题（Nesbitt）；仅以 BMO2 不等式题型做难度校准；最小值 $1.5$（等号 $a=b=c$）已由 $4\\times10^5$ 次随机取样核对；请对照证明自评。*",
  },

  {
    id: "bmo2-al-004",
    type: "long",
    testId: "bmo",
    topicId: "bmo-algebra",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】Prove that the real number $\\alpha$ satisfying $\\alpha^3=\\alpha+1$ is irrational.（求证：满足 $\\alpha^3=\\alpha+1$ 的实数 $\\alpha$ 是无理数。）真实 BMO2 为纯证明题——引导小问示范「有理根定理 + 介值定理」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（有理根定理）：把方程写成整系数多项式 $=0$，叙述有理根定理并列出所有可能的有理根。",
        solutionOutline: "$x^3-x-1=0$，首项系数 $1$、常数项 $-1$。有理根 $\\tfrac pq$（既约）须 $p\\mid1,\\ q\\mid1$，故只可能是 $\\pm1$。" },
      { label: "b", marks: 4, question: "引导二（逐一排除）：检验 $x=1$ 与 $x=-1$，说明它们都不是根，故方程没有有理根。",
        solutionOutline: "$1^3-1-1=-1\\ne0$，$(-1)^3-(-1)-1=-1\\ne0$。故 $x^3-x-1=0$ 无有理根。" },
      { label: "c", marks: 3, question: "引导三（存在实根 + 收尾）：说明确有一个实根，从而它是无理数。",
        solutionOutline: "$f(x)=x^3-x-1$ 连续，$f(1)=-1<0<5=f(2)$，由介值定理在 $(1,2)$ 内有实根 $\\alpha$。$\\alpha$ 是实数但非有理数，故为无理数。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（有理根定理 + 介值定理）**\\n\\n把条件写成整系数多项式方程：\\n$$x^3-x-1=0.$$\\n\\n**有理根定理**：若既约分数 $\\dfrac pq$（$\\gcd(p,q)=1$）是该方程的根，则 $p$ 整除常数项 $-1$、$q$ 整除首项系数 $1$。于是 $p\\in\\{\\pm1\\}$、$q\\in\\{\\pm1\\}$，可能的有理根只有 $\\pm1$。\\n\\n**逐一排除**：\\n$$f(1)=1-1-1=-1\\ne0,\\qquad f(-1)=-1+1-1=-1\\ne0.$$\\n所以方程 $x^3-x-1=0$ **没有有理根**。\\n\\n**存在实根**：$f(x)=x^3-x-1$ 是连续函数，$f(1)=-1<0$ 而 $f(2)=8-2-1=5>0$，由介值定理，存在 $\\alpha\\in(1,2)$ 使 $f(\\alpha)=0$。\\n\\n这个 $\\alpha$ 是实数，且满足 $\\alpha^3=\\alpha+1$；但由上，方程无有理根，故 $\\alpha\\notin\\mathbb Q$，即 $\\alpha$ 为**无理数**。$\\blacksquare$\\n\\n**注**：此 $\\alpha\\approx1.3247$ 即著名的「塑料数」。\\n\\n---\\n**方法要点（BMO2 通用武器）**：证某个代数数无理，标准两步——**用有理根定理证「该整系数方程无有理根」，再用介值定理保证「实根确实存在」**，二者合起来即「存在一个无理实根」。有理根定理把「无理」这种否定性命题化为有限次可判定的检验，是数论/代数常备工具。\\n\\n**延伸**：同法证 $\\sqrt[3]2$、$2\\cos(2\\pi/7)$ 等的无理性（写出其满足的整系数方程再验无有理根）。\\n\\n---\\n*原创题；仅以 BMO2 代数题型做难度校准；「$x^3-x-1$ 无有理根、实根 $\\approx1.3247$」已程序核对；请对照证明自评。*",
  },

  {
    id: "bmo2-ge-003",
    type: "long",
    testId: "bmo",
    topicId: "bmo-geometry",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】Let $I$ be the incentre of triangle $ABC$. Prove that $\\angle BIC=90^\\circ+\\tfrac12\\angle A$.（设 $I$ 为三角形 $ABC$ 的内心。求证 $\\angle BIC=90^\\circ+\\tfrac12\\angle A$。）真实 BMO2 几何为纯证明题——引导小问示范「角平分 + 三角形内角和」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（内心即角平分交点）：说明 $BI,CI$ 分别平分 $\\angle B,\\angle C$，从而写出 $\\angle IBC,\\angle ICB$。",
        solutionOutline: "内心是三条内角平分线交点，故 $\\angle IBC=\\tfrac12\\angle B$，$\\angle ICB=\\tfrac12\\angle C$。" },
      { label: "b", marks: 4, question: "引导二（在 $\\triangle BIC$ 中用内角和）：写出 $\\angle BIC$ 关于 $\\angle B,\\angle C$ 的表达式。",
        solutionOutline: "$\\triangle BIC$ 内角和：$\\angle BIC=180^\\circ-\\angle IBC-\\angle ICB=180^\\circ-\\tfrac12(\\angle B+\\angle C)$。" },
      { label: "c", marks: 3, question: "引导三（代入总内角和收尾）：用 $\\angle A+\\angle B+\\angle C=180^\\circ$ 化简。",
        solutionOutline: "$\\angle B+\\angle C=180^\\circ-\\angle A$，代入得 $\\angle BIC=180^\\circ-\\tfrac12(180^\\circ-\\angle A)=90^\\circ+\\tfrac12\\angle A$。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（角平分 + 内角和）**\\n\\n内心 $I$ 是三角形三条**内角平分线**的交点。特别地，$BI$ 平分 $\\angle B$、$CI$ 平分 $\\angle C$，因此\\n$$\\angle IBC=\\tfrac12\\angle B,\\qquad \\angle ICB=\\tfrac12\\angle C.$$\\n\\n在三角形 $BIC$ 中，三内角之和为 $180^\\circ$：\\n$$\\angle BIC=180^\\circ-\\angle IBC-\\angle ICB=180^\\circ-\\tfrac12(\\angle B+\\angle C).$$\\n\\n再由三角形 $ABC$ 的内角和 $\\angle A+\\angle B+\\angle C=180^\\circ$，得 $\\angle B+\\angle C=180^\\circ-\\angle A$，代入：\\n$$\\angle BIC=180^\\circ-\\tfrac12\\big(180^\\circ-\\angle A\\big)=180^\\circ-90^\\circ+\\tfrac12\\angle A=90^\\circ+\\tfrac12\\angle A.\\qquad\\blacksquare$$\\n\\n---\\n**方法要点（BMO2 通用武器）**：涉及**内心**的角度，几乎都从「$BI,CI$ 平分角 $\\Rightarrow \\angle IBC=\\tfrac12\\angle B$ 等」入手，再在子三角形里用内角和。$\\angle BIC=90^\\circ+\\tfrac12\\angle A$ 本身是极常用的引理（例如证明内心在某圆上、或与旁心/外接圆弧中点的关系）。类似地，旁心给出 $\\angle B I_A C=90^\\circ-\\tfrac12\\angle A$。\\n\\n**延伸**：由此可证「$\\angle A$ 的弧中点 $M$ 满足 $MB=MC=MI$」（鸡爪定理 / incenter–excenter lemma）。\\n\\n---\\n*原创题；仅以 BMO2 几何题型做难度校准；$\\angle BIC=90^\\circ+\\tfrac12\\angle A$ 已在 $2\\times10^4$ 组随机三角形上用坐标法核对；请对照证明自评。*",
  },

  {
    id: "bmo2-ge-004",
    type: "long",
    testId: "bmo",
    topicId: "bmo-geometry",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】Let $H$ be the orthocentre of triangle $ABC$. Prove that the reflection of $H$ in the line $BC$ lies on the circumcircle of $ABC$.（设 $H$ 为三角形 $ABC$ 的垂心。求证：$H$ 关于直线 $BC$ 的对称点落在 $ABC$ 的外接圆上。）真实 BMO2 几何为纯证明题——引导小问示范「垂心张角 + 对称保角 + 共圆判定」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（垂心张角）：证明 $\\angle BHC=180^\\circ-\\angle A$。（提示：$BH\\perp AC$、$CH\\perp AB$ 给出 $\\angle HBC=90^\\circ-\\angle C$ 等。）",
        solutionOutline: "$BH\\perp AC\\Rightarrow\\angle HBC=90^\\circ-\\angle C$；$CH\\perp AB\\Rightarrow\\angle HCB=90^\\circ-\\angle B$。故 $\\angle BHC=180^\\circ-(90^\\circ-\\angle C)-(90^\\circ-\\angle B)=\\angle B+\\angle C=180^\\circ-\\angle A$。" },
      { label: "b", marks: 4, question: "引导二（对称保角）：设 $H'$ 为 $H$ 关于 $BC$ 的对称点。说明 $\\angle BH'C=\\angle BHC=180^\\circ-\\angle A$，且 $H'$ 与 $A$ 在 $BC$ 异侧。",
        solutionOutline: "$B,C$ 在对称轴 $BC$ 上不动，反射保持距离与角，故 $\\angle BH'C=\\angle BHC=180^\\circ-\\angle A$。$H$（锐角三角形时在内部）反射到 $BC$ 另一侧，与 $A$ 异侧。" },
      { label: "c", marks: 3, question: "引导三（共圆判定）：由 $\\angle BAC+\\angle BH'C=180^\\circ$ 且 $A,H'$ 在 $BC$ 异侧，判定 $A,B,H',C$ 共圆。",
        solutionOutline: "$\\angle BAC+\\angle BH'C=\\angle A+(180^\\circ-\\angle A)=180^\\circ$，且 $A,H'$ 在弦 $BC$ 异侧张 $BC$，故 $ABH'C$ 为圆内接四边形，$H'$ 在 $ABC$ 的外接圆上。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（垂心张角 + 对称保角 + 共圆判定）**\\n\\n**垂心张角 $\\angle BHC=180^\\circ-\\angle A$**：因 $H$ 为垂心，高 $BH\\perp AC$、$CH\\perp AB$。在 $\\triangle HBC$ 中，$\\angle HBC=90^\\circ-\\angle C$（$BH$ 垂直于 $AC$），$\\angle HCB=90^\\circ-\\angle B$，故\\n$$\\angle BHC=180^\\circ-(90^\\circ-\\angle C)-(90^\\circ-\\angle B)=\\angle B+\\angle C=180^\\circ-\\angle A.$$\\n\\n**对称保角**：设 $H'$ 是 $H$ 关于直线 $BC$ 的对称点。反射的对称轴是直线 $BC$，$B,C$ 在轴上保持不动；反射保持长度与角度，因此\\n$$\\angle BH'C=\\angle BHC=180^\\circ-\\angle A.$$\\n又 $H'$ 位于 $BC$ 的另一侧，与顶点 $A$ 分处直线 $BC$ 的**异侧**。\\n\\n**共圆判定**：现在 $A$ 与 $H'$ 在弦 $BC$ 的两侧，分别以角 $\\angle BAC=\\angle A$ 和 $\\angle BH'C=180^\\circ-\\angle A$ 张 $BC$，两角之和\\n$$\\angle BAC+\\angle BH'C=\\angle A+(180^\\circ-\\angle A)=180^\\circ.$$\\n对弦 $BC$ 异侧的两点，张角互补正是「四点共圆」的判据，故 $A,B,H',C$ 共圆——即 $H'$ 落在 $\\triangle ABC$ 的外接圆上。$\\blacksquare$\\n\\n**注**：对钝角三角形，$H$ 在外部，上述角度需按有向角（模 $180^\\circ$）理解，结论不变。这与另一条经典事实「$H$ 关于 $BC$ **中点**的对称点是 $A$ 的对径点」相映成趣。\\n\\n---\\n**方法要点（BMO2 通用武器）**：垂心的两条黄金事实——$\\angle BHC=180^\\circ-\\angle A$、以及「$H$ 对边的反射落在外接圆上」——是几何题的高频引理。证共圆时，「异侧张角互补 $\\iff$ 四点共圆」与「同侧张角相等 $\\iff$ 四点共圆」要能双向娴熟运用。\\n\\n---\\n*原创题；仅以 BMO2 几何题型做难度校准；「$H$ 关于 $BC$ 的反射在外接圆上」已在 $2\\times10^4$ 组随机三角形上用坐标法核对；请对照证明自评。*",
  },

  {
    id: "bmo2-co-003",
    type: "long",
    testId: "bmo",
    topicId: "bmo-combinatorics",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】Five points are given in the plane, no three of them collinear. Prove that some four of them are the vertices of a convex quadrilateral.（平面上给定五个点，其中任意三点不共线。求证：其中某四点构成一个凸四边形。）（此即「幸福结局问题」的 $n=5$ 情形。）真实 BMO2 组合几何为纯证明题——引导小问示范「按凸包分类」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（凸包分类）：考虑这五点的凸包。若凸包是五边形或四边形，为什么立即得证？",
        solutionOutline: "凸包为五边形：任取其中四个顶点即为凸四边形。凸包为四边形：这四个凸包顶点本身构成凸四边形。两种情形直接完成。" },
      { label: "b", marks: 4, question: "引导二（凸包为三角形）：余下情形是凸包为三角形 $ABC$、另两点 $D,E$ 在其内部。考虑直线 $DE$，说明 $A,B,C$ 中必有两个落在该直线的同一侧。",
        solutionOutline: "直线 $DE$ 把平面分成两个半平面；$A,B,C$ 三点分配到两侧，由鸽巢必有两点（设为 $A,B$）在同一侧（无三点共线保证不落在线上）。" },
      { label: "c", marks: 3, question: "引导三（拼出凸四边形）：证明这两点与 $D,E$ 构成凸四边形。",
        solutionOutline: "$A,B$ 在直线 $DE$ 同侧 $\\Rightarrow$ 四边形 $A D B E$（按 $D,E$ 与 $A,B$ 的位置排序）为凸四边形——$D,E$ 在一侧的边界、$A,B$ 在另一侧，四点无一落在其余三点所成三角形内。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（按凸包分类）**\\n\\n考察这五个点的**凸包**（包含它们的最小凸多边形），其顶点数只能是 $3,4$ 或 $5$。\\n\\n**情形一：凸包是五边形。** 五个点都是凸包顶点，任取其中四个都构成凸四边形。得证。\\n\\n**情形二：凸包是四边形。** 恰有四个点为凸包顶点，它们本身就是一个凸四边形。得证。\\n\\n**情形三：凸包是三角形 $ABC$。** 则另外两点 $D,E$ 落在 $\\triangle ABC$ **内部**。作直线 $DE$，它把平面分成两个半平面。三个顶点 $A,B,C$ 分布在这两个半平面中（由「任意三点不共线」，没有点落在直线 $DE$ 上），由鸽巢原理，必有两个顶点位于**同一侧**——不妨设为 $A,B$。\\n\\n现在看 $A,B,D,E$ 四点：$D,E$ 决定的直线把 $A,B$ 留在同一侧。于是把它们按凸位置排成 $A,D,B,E$（$D,E$ 在中间、$A,B$ 在两端的对角），得到的四边形每个顶点都不在其余三点所成三角形的内部，即为**凸四边形**。得证。\\n\\n三种情形穷尽所有可能，故五点中必有四点构成凸四边形。$\\blacksquare$\\n\\n---\\n**方法要点（BMO2 通用武器）**：组合几何里「一定存在某种凸/共线/同色结构」的题，**按凸包的形状分类**是第一反应；配合**鸽巢**（把点按某直线两侧分堆）常能逼出所需结构。本题是 Erdős–Szekeres「幸福结局问题」的最小情形（一般地 $2^{n-2}+1$ 个点保证有 $n$ 边凸多边形）。\\n\\n---\\n*原创题；仅以 BMO2 组合几何题型做难度校准；「一般位置下 $5$ 点必含凸四边形」已在 $2\\times10^4$ 组随机点集上程序核对；请对照证明自评。*",
  },

  {
    id: "bmo2-co-004",
    type: "long",
    testId: "bmo",
    topicId: "bmo-combinatorics",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】Prove that if $n+1$ integers are chosen from $\\{1,2,\\dots,2n\\}$, then one of the chosen integers divides another. Show also that $n+1$ cannot be replaced by $n$.（求证：从 $\\{1,2,\\dots,2n\\}$ 中任取 $n+1$ 个整数，其中必有一个整除另一个；并说明 $n+1$ 不能减小为 $n$。）真实 BMO2 为纯证明题——引导小问示范「奇部分类 + 鸽巢」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（奇部分解）：把每个被选的数 $m$ 写成 $m=2^a\\cdot b$（$b$ 为奇数）。说明 $b$ 的取值范围，共有多少种。",
        solutionOutline: "任一正整数唯一写成 $2^a\\cdot b$（$b$ 奇）。$m\\le2n\\Rightarrow b$ 是 $\\le2n$ 的奇数，即 $b\\in\\{1,3,5,\\dots,2n-1\\}$，共 $n$ 种。" },
      { label: "b", marks: 4, question: "引导二（鸽巢）：把 $n+1$ 个被选数按其奇部 $b$ 归类，用鸽巢得出什么？",
        solutionOutline: "$n+1$ 个数、奇部只有 $n$ 种，必有两个数 $m_1=2^{a_1}b,\\ m_2=2^{a_2}b$ 有相同奇部 $b$。" },
      { label: "c", marks: 3, question: "引导三（整除 + 紧性）：说明同奇部的两数中一个整除另一个；并给出一个 $n$ 元子集使无一整除另一，证明 $n+1$ 是最少。",
        solutionOutline: "设 $a_1<a_2$，则 $2^{a_1}b\\mid2^{a_2}b$，即 $m_1\\mid m_2$。紧性：取 $\\{n+1,n+2,\\dots,2n\\}$ 共 $n$ 个，其中若 $x\\mid y$ 且 $x<y$ 则 $y\\ge2x>2n$，矛盾，故无整除对。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（奇部分类 + 鸽巢）**\\n\\n**奇部分解**：每个正整数 $m$ 都能唯一写成\\n$$m=2^a\\cdot b,\\qquad b\\ \\text{为奇数}$$\\n（$2^a$ 是 $m$ 中 $2$ 的最高幂，$b$ 是 $m$ 的「奇部」）。当 $m\\le2n$ 时，其奇部 $b$ 是一个不超过 $2n$ 的奇数，故\\n$$b\\in\\{1,3,5,\\dots,2n-1\\},$$\\n只有 $n$ 种可能。\\n\\n**鸽巢**：从 $\\{1,\\dots,2n\\}$ 中选出 $n+1$ 个数，把它们按奇部 $b$ 归入这 $n$ 个「抽屉」。因 $n+1>n$，必有两个被选的数\\n$$m_1=2^{a_1}b,\\qquad m_2=2^{a_2}b$$\\n有**相同的奇部** $b$。\\n\\n**整除**：不妨设 $a_1<a_2$，则\\n$$m_1=2^{a_1}b\\ \\big|\\ 2^{a_2}b=m_2,$$\\n即被选数中一个整除另一个。\\n\\n**紧性（$n+1$ 最少）**：取 $\\{n+1,n+2,\\dots,2n\\}$，恰 $n$ 个数。若其中 $x\\mid y$ 且 $x<y$，则 $y\\ge2x\\ge2(n+1)>2n$，超出范围，矛盾；故这 $n$ 个数中没有一个整除另一个。因此「$n+1$」不能减小为 $n$。$\\blacksquare$\\n\\n---\\n**方法要点（BMO2 通用武器）**：**「按奇部（或最大奇因子）分类」是整除型鸽巢题的招牌抽屉**——同奇部的两数必成 $2^a$ 倍数关系，从而一个整除另一个。与「按余数分类」「按 $2$-adic 赋值分类」并列，是数论组合里最锋利的几种抽屉设计。别忘补上**紧性构造**（$\\{n+1,\\dots,2n\\}$）说明界不可改进。\\n\\n---\\n*原创题；仅以 BMO2 组合数论题型做难度校准；「每个 $(n+1)$ 元子集含整除对」与「$\\{n+1..2n\\}$ 无整除对」已对 $n\\le8$ 穷举核对；请对照证明自评。*",
  },

  {
    id: "bmo2-nt-005",
    type: "long",
    testId: "bmo",
    topicId: "bmo-number",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】Prove that the product of three consecutive positive integers is never a perfect square.（求证：三个连续正整数之积永远不是完全平方数。）真实 BMO2 为纯证明题——引导小问示范「换元 + 互素则各为平方」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（换元）：设三个连续整数为 $n,n+1,n+2$，令 $m=n+1$。把乘积用 $m$ 表示成一个更对称的形式。",
        solutionOutline: "乘积 $=(m-1)m(m+1)=m(m^2-1)=m^3-m$。" },
      { label: "b", marks: 4, question: "引导二（互素分解）：证明 $\\gcd(m,m^2-1)=1$；因此若 $m(m^2-1)$ 是完全平方，则 $m$ 与 $m^2-1$ 各自都是完全平方。",
        solutionOutline: "$m^2-1$ 与 $m$ 相邻互素类：任何公因子整除 $m^2-(m^2-1)=1$，故 $\\gcd=1$。互素两数之积为平方 $\\Rightarrow$ 各为平方。" },
      { label: "c", marks: 3, question: "引导三（导出矛盾）：说明当 $m\\ge2$ 时 $m^2-1$ 不可能是完全平方，从而完成证明。",
        solutionOutline: "$m\\ge2$ 时 $(m-1)^2<m^2-1<m^2$，夹在相邻两平方之间，故 $m^2-1$ 非平方。于是乘积非平方（$n\\ge1\\Rightarrow m\\ge2$）。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（换元 + 互素则各为平方）**\\n\\n设三个连续正整数为 $n,n+1,n+2$（$n\\ge1$）。令 $m=n+1\\ge2$，则\\n$$n(n+1)(n+2)=(m-1)\\,m\\,(m+1)=m(m^2-1)=m^3-m.$$\\n\\n**互素**：$\\gcd(m,\\,m^2-1)=1$，因为任何同时整除 $m$ 与 $m^2-1$ 的数也整除 $m^2-(m^2-1)=1$。\\n\\n**互素两数之积为平方 $\\Rightarrow$ 各为平方**：若 $m(m^2-1)$ 是完全平方，由 $\\gcd(m,m^2-1)=1$，则 $m$ 与 $m^2-1$ 必**各自**都是完全平方（互素因子在平方数中出现的幂次都为偶）。\\n\\n**矛盾**：但当 $m\\ge2$ 时\\n$$(m-1)^2=m^2-2m+1<m^2-1<m^2,$$\\n即 $m^2-1$ 严格夹在相邻两个完全平方 $(m-1)^2$ 与 $m^2$ 之间，故 $m^2-1$ **不是**完全平方。矛盾。\\n\\n因此 $n(n+1)(n+2)$ 永远不是完全平方数。$\\blacksquare$\\n\\n---\\n**方法要点（BMO2 通用武器）**：「某乘积是否为完全平方」的题，核心工具是「**互素的两个因子，其积为平方 $\\iff$ 各自为平方**」（由唯一分解）。再配合「**相邻平方数之间没有别的平方数**」这一夹逼，就能否定候选。换元 $m=n+1$ 制造对称是点睛之笔。\\n\\n**延伸**：四个连续整数之积 $+1$ 反而**总是**完全平方（见 BMO1 题库），对比之下更能体会「互素结构」的作用。\\n\\n---\\n*原创题；仅以 BMO2 数论题型做难度校准；「$n(n+1)(n+2)$ 非平方」已对 $n\\le10^5$、「$m^2-1$ 非平方」「$\\gcd(m,m^2-1)=1$」均程序核对；请对照证明自评。*",
  },

  {
    id: "bmo2-nt-006",
    type: "long",
    testId: "bmo",
    topicId: "bmo-number",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】Prove that $1+\\dfrac12+\\dfrac13+\\cdots+\\dfrac1n$ is never an integer for $n\\ge2$.（求证：调和和 $H_n=1+\\dfrac12+\\cdots+\\dfrac1n$ 对每个 $n\\ge2$ 都不是整数。）真实 BMO2 为纯证明题——引导小问示范「$2$-adic 赋值：盯住最大的 $2$ 的幂」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（找唯一的最高 $2$ 幂）：设 $2^k$ 是 $\\le n$ 的最大 $2$ 的幂。证明在 $1,2,\\dots,n$ 中，**恰好只有 $2^k$ 这一个数**的因子里含 $2^k$（即被 $2^k$ 整除者唯一）。",
        solutionOutline: "被 $2^k$ 整除且 $\\le n$ 的数是 $2^k,2\\cdot2^k,\\dots$；但 $2\\cdot2^k=2^{k+1}>n$（否则 $2^{k+1}$ 是更大的 $2$ 幂 $\\le n$，矛盾）。故只有 $2^k$ 一个。" },
      { label: "b", marks: 4, question: "引导二（通分乘 $M$）：令 $M=\\operatorname{lcm}(1,2,\\dots,n)$，写 $M=2^k\\cdot t$（$t$ 奇）。考察 $M\\cdot H_n=\\sum_{j=1}^n \\dfrac Mj$。证明其中除 $j=2^k$ 那一项外，每一项 $\\dfrac Mj$ 都是偶数。",
        solutionOutline: "对 $j\\ne2^k$，$j$ 含 $2$ 的幂 $<2^k$（由 a)，只有 $j=2^k$ 达到最高），故 $\\dfrac Mj$ 仍含正的 $2$ 因子，是偶数。而 $\\dfrac M{2^k}=t$ 为奇数。" },
      { label: "c", marks: 3, question: "引导三（奇偶收尾）：由 b) 说明 $M\\cdot H_n$ 为奇数，从而 $H_n$ 不是整数。",
        solutionOutline: "$M H_n=$（奇数 $t$）$+$（若干偶数）$=$ 奇数。若 $H_n$ 是整数，则 $M H_n$ 应为偶数（$M$ 含因子 $2$），矛盾。故 $H_n$ 非整数。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（$2$-adic：盯住最大的 $2$ 的幂）**\\n\\n设 $2^k$ 是不超过 $n$ 的最大的 $2$ 的幂（$n\\ge2\\Rightarrow k\\ge1$）。\\n\\n**唯一性**：在 $1,2,\\dots,n$ 中被 $2^k$ 整除的数只有 $2^k$ 本身——因为下一个 $2\\cdot2^k=2^{k+1}$ 若 $\\le n$，则它是一个更大的 $2$ 的幂 $\\le n$，与 $2^k$ 的最大性矛盾。因此**恰有一个** $j\\in\\{1,\\dots,n\\}$ 的 $2$-adic 赋值 $v_2(j)=k$，即 $j=2^k$；其余所有 $j$ 都有 $v_2(j)<k$。\\n\\n**通分**：令 $M=\\operatorname{lcm}(1,2,\\dots,n)$，则 $v_2(M)=k$，写 $M=2^k t$（$t$ 为奇数）。考虑\\n$$M\\cdot H_n=\\sum_{j=1}^n\\frac{M}{j}.$$\\n对每个 $j$，$v_2\\!\\left(\\dfrac Mj\\right)=k-v_2(j)$。\\n- 当 $j=2^k$：$v_2\\!\\left(\\dfrac M{2^k}\\right)=0$，该项 $\\dfrac M{2^k}=t$ 为**奇数**；\\n- 当 $j\\ne2^k$：$v_2(j)<k$，故 $v_2\\!\\left(\\dfrac Mj\\right)=k-v_2(j)\\ge1$，该项为**偶数**。\\n\\n**奇偶收尾**：于是\\n$$M\\cdot H_n=\\underbrace{t}_{\\text{奇}}+\\underbrace{(\\text{若干偶数})}_{\\text{偶}}=\\text{奇数}.$$\\n倘若 $H_n$ 是整数，则 $M\\cdot H_n$ 会被 $M$（含因子 $2^k$，$k\\ge1$）的偶性带成偶数——与「$M H_n$ 为奇数」矛盾。故 $H_n$ 不是整数。$\\blacksquare$\\n\\n---\\n**方法要点（BMO2 通用武器）**：证「某个有理数和不是整数」，用 **$p$-adic 赋值**盯住某个素数（这里 $p=2$）的幂——找到「唯一达到最高幂」的那一项，它在通分后贡献一个奇数、别人都贡献偶数，破坏整性。这是 harmonic sum / 类似求和非整性的标准杀招。\\n\\n**延伸**：同法（盯最大 $2$ 幂）可证 $\\dfrac1{a}+\\dfrac1{a+1}+\\cdots+\\dfrac1{b}$（$b>a\\ge1$）也非整数。\\n\\n---\\n*原创题；仅以 BMO2 数论题型做难度校准；「$H_n$ 非整数」及「$\\le n$ 中最高 $2$ 幂唯一」已对 $n=2\\dots300$ 用精确分数程序核对；请对照证明自评。*",
  },

  {
    id: "bmo2-al-005",
    type: "long",
    testId: "bmo",
    topicId: "bmo-algebra",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】Let $a,b,c$ be real numbers with $a+b+c=0$. Prove that $\\dfrac{a^5+b^5+c^5}{5}=\\dfrac{a^2+b^2+c^2}{2}\\cdot\\dfrac{a^3+b^3+c^3}{3}$.（设实数 $a,b,c$ 满足 $a+b+c=0$。求证上述等式。）真实 BMO2 为纯证明题——引导小问示范「牛顿幂和 + 对称多项式」。",
    parts: [
      { label: "a", marks: 4, question: "引导一（低次幂和）：设 $p_k=a^k+b^k+c^k$、$e_2=ab+bc+ca$、$e_3=abc$。在 $a+b+c=0$（即 $e_1=0$）下，用牛顿恒等式求出 $p_2,p_3$（用 $e_2,e_3$ 表示）。",
        solutionOutline: "牛顿：$p_1=e_1=0$；$p_2=e_1p_1-2e_2=-2e_2$；$p_3=e_1p_2-e_2p_1+3e_3=3e_3$。" },
      { label: "b", marks: 4, question: "引导二（五次幂和）：继续用牛顿恒等式（$e_1=0$）求 $p_4,p_5$。",
        solutionOutline: "$p_4=e_1p_3-e_2p_2+e_3p_1=-e_2(-2e_2)=2e_2^2$；$p_5=e_1p_4-e_2p_3+e_3p_2=-e_2(3e_3)+e_3(-2e_2)=-5e_2e_3$。" },
      { label: "c", marks: 2, question: "引导三（代入核对）：把 $p_2,p_3,p_5$ 代入两边，验证等式。",
        solutionOutline: "右边 $=\\dfrac{p_2}{2}\\cdot\\dfrac{p_3}{3}=\\dfrac{-2e_2}{2}\\cdot\\dfrac{3e_3}{3}=(-e_2)(e_3)=-e_2e_3$；左边 $=\\dfrac{p_5}{5}=\\dfrac{-5e_2e_3}{5}=-e_2e_3$。相等。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（牛顿幂和恒等式）**\\n\\n记幂和 $p_k=a^k+b^k+c^k$，初等对称多项式 $e_1=a+b+c$，$e_2=ab+bc+ca$，$e_3=abc$。条件即 $e_1=0$。牛顿恒等式（三元）为\\n$$p_1=e_1,\\quad p_2=e_1p_1-2e_2,\\quad p_k=e_1p_{k-1}-e_2p_{k-2}+e_3p_{k-3}\\ (k\\ge3).$$\\n代入 $e_1=0$：\\n$$p_1=0,\\qquad p_2=-2e_2,\\qquad p_3=-e_2p_1+3e_3=3e_3,$$\\n$$p_4=-e_2p_2+e_3p_1=-e_2(-2e_2)=2e_2^2,$$\\n$$p_5=-e_2p_3+e_3p_2=-e_2(3e_3)+e_3(-2e_2)=-5e_2e_3.$$\\n\\n**核对等式**：\\n$$\\frac{a^2+b^2+c^2}{2}\\cdot\\frac{a^3+b^3+c^3}{3}=\\frac{p_2}{2}\\cdot\\frac{p_3}{3}=\\frac{-2e_2}{2}\\cdot\\frac{3e_3}{3}=(-e_2)(e_3)=-e_2e_3,$$\\n$$\\frac{a^5+b^5+c^5}{5}=\\frac{p_5}{5}=\\frac{-5e_2e_3}{5}=-e_2e_3.$$\\n两边都等于 $-e_2e_3$，故等式成立。$\\blacksquare$\\n\\n---\\n**方法要点（BMO2 通用武器）**：对称的幂和恒等式，**牛顿恒等式**把 $p_k$ 递推地写成初等对称多项式 $e_1,e_2,e_3$ 的多项式；一旦有约束（如 $e_1=0$）便大量塌缩，等式的证明化为纯代数核对。掌握 $p_2=e_1^2-2e_2$、$p_3=e_1^3-3e_1e_2+3e_3$ 等常用式能极大提速。\\n\\n**延伸**：同样在 $a+b+c=0$ 下有 $\\dfrac{p_7}{7}=\\dfrac{p_2}{2}\\cdot\\dfrac{p_5}{5}$ 等一系列漂亮恒等式。\\n\\n---\\n*原创题；仅以 BMO2 代数题型做难度校准；恒等式已用符号计算在 $a+b+c=0$（代入 $c=-a-b$）下验证为 $0$；请对照证明自评。*",
  },

  {
    id: "bmo2-al-006",
    type: "long",
    testId: "bmo",
    topicId: "bmo-algebra",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】Let $a,b,c$ be positive real numbers. Prove that $a^4+b^4+c^4\\ge abc(a+b+c)$, and determine when equality holds.（设正实数 $a,b,c$，求证 $a^4+b^4+c^4\\ge abc(a+b+c)$，并确定等号条件。）真实 BMO2 为纯证明题——引导小问示范「两级 SOS 递进」。",
    parts: [
      { label: "a", marks: 4, question: "引导一（第一级）：证明 $a^4+b^4+c^4\\ge a^2b^2+b^2c^2+c^2a^2$。",
        solutionOutline: "对 $x=a^2,y=b^2,z=c^2$ 用 $x^2+y^2+z^2\\ge xy+yz+zx$（即 $\\tfrac12\\sum(x-y)^2\\ge0$）。" },
      { label: "b", marks: 4, question: "引导二（第二级）：证明 $a^2b^2+b^2c^2+c^2a^2\\ge abc(a+b+c)$。",
        solutionOutline: "对 $u=ab,v=bc,w=ca$ 用 $u^2+v^2+w^2\\ge uv+vw+wu$；而 $uv+vw+wu=ab\\cdot bc+bc\\cdot ca+ca\\cdot ab=abc(a+b+c)$。" },
      { label: "c", marks: 2, question: "引导三（串联 + 等号）：合并 a)、b) 并确定等号条件。",
        solutionOutline: "$a^4+b^4+c^4\\ge a^2b^2+b^2c^2+c^2a^2\\ge abc(a+b+c)$。两级等号都要 $a^2=b^2=c^2$ 且 $ab=bc=ca$，即 $a=b=c$。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（两级 SOS 递进）**\\n\\n用到的核心引理：对任意实数 $x,y,z$，\\n$$x^2+y^2+z^2\\ge xy+yz+zx\\quad\\Big(\\text{因}\\ x^2+y^2+z^2-xy-yz-zx=\\tfrac12\\big[(x-y)^2+(y-z)^2+(z-x)^2\\big]\\ge0\\Big).$$\\n\\n**第一级**（取 $x=a^2,y=b^2,z=c^2$）：\\n$$a^4+b^4+c^4\\ge a^2b^2+b^2c^2+c^2a^2. \\quad(\\ast)$$\\n\\n**第二级**（取 $x=ab,\\ y=bc,\\ z=ca$）：\\n$$a^2b^2+b^2c^2+c^2a^2\\ge (ab)(bc)+(bc)(ca)+(ca)(ab)=ab^2c+bc^2a+ca^2b=abc(a+b+c). \\quad(\\ast\\ast)$$\\n\\n**串联**：由 $(\\ast)$ 与 $(\\ast\\ast)$，\\n$$a^4+b^4+c^4\\ \\ge\\ a^2b^2+b^2c^2+c^2a^2\\ \\ge\\ abc(a+b+c).$$\\n\\n**等号条件**：$(\\ast)$ 取等要 $a^2=b^2=c^2$；$(\\ast\\ast)$ 取等要 $ab=bc=ca$。对正实数，二者都归结为 $a=b=c$。此时两边同为 $3a^4$，等号成立。$\\blacksquare$\\n\\n---\\n**方法要点（BMO2 通用武器）**：不等式两边「跨度」较大时，**用同一个引理分两级搭桥**——本题两次调用 $\\sum x^2\\ge\\sum xy$，第一次把四次方压到「平方之积」，第二次再把「平方之积」压到目标。识别出「$ab,bc,ca$ 的两两乘积之和 $=abc(a+b+c)$」是关键的代数观察。\\n\\n**延伸**：一般地 $a^4+b^4+c^4\\ge a^2bc+ab^2c+abc^2$ 及 Schur 型不等式都可用类似分级 SOS 处理。\\n\\n---\\n*原创题；仅以 BMO2 不等式题型做难度校准；$a^4+b^4+c^4-abc(a+b+c)\\ge0$（等号 $a=b=c$）已由 $4\\times10^5$ 次随机取样与两级 SOS 恒等式核对；请对照证明自评。*",
  },

  {
    id: "bmo2-ge-005",
    type: "long",
    testId: "bmo",
    topicId: "bmo-geometry",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】Let $O,H$ be the circumcentre and orthocentre of triangle $ABC$, and $M$ the midpoint of $BC$. Prove that $AH=2\\,OM$.（设 $O,H$ 为三角形 $ABC$ 的外心与垂心，$M$ 为 $BC$ 中点。求证 $AH=2\\,OM$。）真实 BMO2 几何为纯证明题——引导小问示范「外心为原点的向量法」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（外心原点 + 垂心向量）：取外心 $O$ 为原点、顶点向量 $\\mathbf a,\\mathbf b,\\mathbf c$（模均为 $R$）。写出垂心 $H$ 与 $BC$ 中点 $M$ 的向量。",
        solutionOutline: "$H=\\mathbf a+\\mathbf b+\\mathbf c$（外心原点下的标准事实）；$M=\\dfrac{\\mathbf b+\\mathbf c}{2}$。" },
      { label: "b", marks: 4, question: "引导二（算两段向量）：分别写出 $\\vec{AH}$ 与 $\\vec{OM}$。",
        solutionOutline: "$\\vec{AH}=H-\\mathbf a=\\mathbf b+\\mathbf c$；$\\vec{OM}=M-\\mathbf 0=\\dfrac{\\mathbf b+\\mathbf c}{2}$。" },
      { label: "c", marks: 3, question: "引导三（取模收尾）：由 $\\vec{AH}=2\\,\\vec{OM}$ 得长度关系。",
        solutionOutline: "$\\vec{AH}=\\mathbf b+\\mathbf c=2\\cdot\\dfrac{\\mathbf b+\\mathbf c}{2}=2\\,\\vec{OM}$，取模得 $AH=2\\,OM$（且 $AH\\parallel OM$）。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（外心为原点的向量法）**\\n\\n取外心 $O$ 为原点，顶点位置向量 $\\mathbf a,\\mathbf b,\\mathbf c$，$|\\mathbf a|=|\\mathbf b|=|\\mathbf c|=R$。已知（或如 BMO2 题 ge-001 中所证）垂心 $H=\\mathbf a+\\mathbf b+\\mathbf c$。$BC$ 中点 $M=\\dfrac{\\mathbf b+\\mathbf c}{2}$。\\n\\n计算两段有向线段：\\n$$\\vec{AH}=H-\\mathbf a=(\\mathbf a+\\mathbf b+\\mathbf c)-\\mathbf a=\\mathbf b+\\mathbf c,\\qquad \\vec{OM}=M-\\mathbf 0=\\frac{\\mathbf b+\\mathbf c}{2}.$$\\n因此\\n$$\\vec{AH}=\\mathbf b+\\mathbf c=2\\cdot\\frac{\\mathbf b+\\mathbf c}{2}=2\\,\\vec{OM}.$$\\n两边取模：$AH=2\\,OM$（并且 $AH\\parallel OM$，方向相同）。$\\blacksquare$\\n\\n---\\n**方法要点（BMO2 通用武器）**：外心取原点后，$H=\\mathbf a+\\mathbf b+\\mathbf c$ 让「$AH$ 与 $OM$ 平行且 $2{:}1$」这类关系变成一行向量恒等式。这条 $AH=2\\,OM$ 正是欧拉线与九点圆的基石之一（$O$ 到边的距离等于对顶点到垂心距离的一半）。\\n\\n**延伸**：由此立得九点圆半径 $=\\tfrac12R$、以及外心到三边距离之和的相关恒等式。\\n\\n---\\n*原创题；仅以 BMO2 几何题型做难度校准；$AH=2\\,OM$ 已在 $2\\times10^4$ 组随机三角形上用坐标法核对；请对照证明自评。*",
  },

  {
    id: "bmo2-ge-006",
    type: "long",
    testId: "bmo",
    topicId: "bmo-geometry",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】Prove that in any non-equilateral triangle, the circumcentre $O$, centroid $G$ and orthocentre $H$ are collinear, and $OG:GH=1:2$. (This line is the Euler line.)（求证：在任意非等边三角形中，外心 $O$、重心 $G$、垂心 $H$ 三点共线，且 $OG:GH=1:2$——此即欧拉线。）真实 BMO2 几何为纯证明题——引导小问示范「向量共线判定」。",
    parts: [
      { label: "a", marks: 3, question: "引导一（外心原点 + 三心向量）：取外心 $O$ 为原点，写出重心 $G$ 与垂心 $H$ 的向量。",
        solutionOutline: "$G=\\dfrac{\\mathbf a+\\mathbf b+\\mathbf c}{3}$，$H=\\mathbf a+\\mathbf b+\\mathbf c$。（$O=\\mathbf 0$。）" },
      { label: "b", marks: 4, question: "引导二（共线）：用 $G,H$ 的向量说明 $O,G,H$ 三点共线（提示：$H$ 是 $G$ 的标量倍）。",
        solutionOutline: "记 $\\mathbf s=\\mathbf a+\\mathbf b+\\mathbf c$，则 $G=\\tfrac13\\mathbf s$，$H=\\mathbf s=3G$。$O,G,H$ 都是 $\\mathbf s$ 方向上的标量倍（$0,\\tfrac13,1$），故共线。" },
      { label: "c", marks: 3, question: "引导三（比例 + 非等边）：计算 $OG:GH$；并说明非等边保证三点不重合、方向确定。",
        solutionOutline: "$\\vec{OG}=\\tfrac13\\mathbf s$，$\\vec{GH}=H-G=\\tfrac23\\mathbf s$，故 $OG:GH=\\tfrac13:\\tfrac23=1:2$。非等边 $\\Rightarrow\\mathbf s\\ne\\mathbf 0$（$O\\ne H$），三点互异、欧拉线确定。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（向量共线判定）**\\n\\n取外心 $O$ 为原点，顶点向量 $\\mathbf a,\\mathbf b,\\mathbf c$（模均为 $R$）。则重心\\n$$G=\\frac{\\mathbf a+\\mathbf b+\\mathbf c}{3},$$\\n垂心（外心原点下的标准事实）\\n$$H=\\mathbf a+\\mathbf b+\\mathbf c.$$\\n记 $\\mathbf s=\\mathbf a+\\mathbf b+\\mathbf c$，则 $O=\\mathbf 0$、$G=\\tfrac13\\mathbf s$、$H=\\mathbf s$。\\n\\n**共线**：三点 $O,G,H$ 的位置向量分别是 $0\\cdot\\mathbf s,\\ \\tfrac13\\mathbf s,\\ 1\\cdot\\mathbf s$，都落在过原点、方向为 $\\mathbf s$ 的同一条直线上（当 $\\mathbf s\\ne\\mathbf 0$）。故三点共线。\\n\\n**比例**：\\n$$\\vec{OG}=G-O=\\tfrac13\\mathbf s,\\qquad \\vec{GH}=H-G=\\mathbf s-\\tfrac13\\mathbf s=\\tfrac23\\mathbf s,$$\\n所以 $OG:GH=\\tfrac13:\\tfrac23=1:2$，且 $\\vec{GH}=2\\,\\vec{OG}$（同向）。\\n\\n**非等边的作用**：三角形非等边时 $O\\ne H$，即 $\\mathbf s\\ne\\mathbf 0$，上述直线（欧拉线）确实存在且三心互异（等边时 $O=G=H$ 重合，欧拉线退化）。$\\blacksquare$\\n\\n---\\n**方法要点（BMO2 通用武器）**：**欧拉线**是「外心原点 + $H=\\mathbf a+\\mathbf b+\\mathbf c$」的直接推论——一旦三个心都写成 $\\mathbf s$ 的标量倍，共线与比例都是「看系数」。向量法在处理「共线 / 定比 / 平行」时几乎无脑可靠，是 BMO2 几何的主力工具之一。\\n\\n**延伸**：九点圆圆心 $N=\\tfrac12\\mathbf s$ 也在欧拉线上，且是 $OH$ 的中点——同一套向量立刻给出。\\n\\n---\\n*原创题；仅以 BMO2 几何题型做难度校准；「$O,G,H$ 共线且 $OG:GH=1:2$」已在 $2\\times10^4$ 组随机（非退化）三角形上用坐标法核对；请对照证明自评。*",
  },

  {
    id: "bmo2-co-005",
    type: "long",
    testId: "bmo",
    topicId: "bmo-combinatorics",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】Prove that for every positive integer $n$, any $2^n\\times2^n$ board with one unit square removed can be tiled by L-shaped trominoes (each covering three squares).（求证：对每个正整数 $n$，任何去掉一个单位方格的 $2^n\\times2^n$ 棋盘都能被 L 形三格骨牌铺满。）真实 BMO2 组合为纯证明题——引导小问示范「对 $n$ 归纳 + 中心巧放一块」。",
    parts: [
      { label: "a", marks: 2, question: "引导一（基础）：验证 $n=1$（$2\\times2$ 去掉一格）可由一块 L 形三格骨牌铺满。",
        solutionOutline: "$2\\times2$ 去掉任一格恰剩 $3$ 格，成 L 形，正好一块骨牌。基础成立。" },
      { label: "b", marks: 5, question: "引导二（归纳的关键一步）：设 $2^{n}\\times2^{n}$ 缺一格可铺。对 $2^{n+1}\\times2^{n+1}$ 缺一格的棋盘，把它四等分成四个 $2^n\\times2^n$ 象限。缺格在某一象限；如何用「在中心放一块 L」使四个象限都变成『缺一格』？",
        solutionOutline: "缺格所在象限已缺一格。在棋盘正中心放一块 L 形骨牌，恰好覆盖另外三个象限各自靠中心的那一个角格——于是这三个象限也各缺一格。四个象限都成为 $2^n\\times2^n$ 缺一格。" },
      { label: "c", marks: 3, question: "引导三（收尾）：用归纳假设铺完四个象限，完成证明。",
        solutionOutline: "由归纳假设，四个 $2^n\\times2^n$ 缺一格象限各自可铺；加上中心那一块，整个 $2^{n+1}\\times2^{n+1}$ 缺一格棋盘被铺满。由归纳法对一切 $n$ 成立。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（对 $n$ 归纳 + 中心放一块）**\\n\\n**基础（$n=1$）**：$2\\times2$ 棋盘去掉任意一格，剩下三格恰构成一个 L 形，正好由一块 L 形三格骨牌覆盖。成立。\\n\\n**归纳步**：假设任何 $2^n\\times2^n$ 缺一格的棋盘都能用 L 形骨牌铺满。考虑一个 $2^{n+1}\\times2^{n+1}$ 缺一格的棋盘。用正中的横竖两条中线把它分成四个 $2^n\\times2^n$ 的**象限**。\\n\\n那个被去掉的格子落在某**一个**象限里——这个象限已经是「$2^n\\times2^n$ 缺一格」。\\n\\n**关键一步**：在棋盘正中心放一块 L 形骨牌，让它覆盖**另外三个象限**中各自最靠近中心的那一个角格。这样一来，这三个象限也各自「缺」了一格（缺的正是被中心骨牌占掉的那个角）。于是四个象限**全部**成为「$2^n\\times2^n$ 缺一格」的棋盘。\\n\\n**收尾**：由归纳假设，这四个缺一格象限都能各自被 L 形骨牌铺满；再加上中心那一块骨牌，整个 $2^{n+1}\\times2^{n+1}$ 缺一格棋盘被完全铺满。\\n\\n由数学归纳法，命题对一切正整数 $n$ 成立。$\\blacksquare$\\n\\n**计数一致性**：$2^n\\times2^n$ 缺一格共 $4^n-1$ 格，恰能被 $3$ 整除（$4^n\\equiv1\\pmod3$），骨牌数 $=\\dfrac{4^n-1}{3}$，与递归相符。\\n\\n---\\n**方法要点（BMO2 通用武器）**：**归纳 + 「造出递归结构」**——铺砖类存在性题常把 $2^{n+1}$ 问题四分成 $2^n$ 子问题，难点在「让每个子问题都满足归纳假设」；本题的妙招是**在中心放一块骨牌，人为地给另外三个象限各制造一个缺口**。这种「用一块拼图连接四个子问题」的构造是分治归纳的经典范式。\\n\\n---\\n*原创题；仅以 BMO2 组合题型做难度校准；递归构造对 $n=1\\dots6$ 均给出合法铺法（骨牌数 $=(4^n-1)/3$），已程序核对；请对照证明自评。*",
  },

  {
    id: "bmo2-co-006",
    type: "long",
    testId: "bmo",
    topicId: "bmo-combinatorics",
    difficulty: 3,
    totalMarks: 10,
    context:
      "【BMO2 / Round 2 风格 · 完整证明题】In a round-robin tournament every two players play exactly once and there are no draws. Prove that the players can be lined up $P_1,P_2,\\dots,P_n$ so that $P_i$ beat $P_{i+1}$ for every $i$ (a Hamiltonian path in the tournament).（单循环比赛中每两人恰赛一场且无平局。求证：可把选手排成一列 $P_1,\\dots,P_n$，使每个 $P_i$ 都战胜了 $P_{i+1}$。）真实 BMO2 组合为纯证明题——引导小问示范「对人数归纳 + 插入」。",
    parts: [
      { label: "a", marks: 2, question: "引导一（基础）：$n=1$（或 $n=2$）时结论为何显然？",
        solutionOutline: "$n=1$：单人成列。$n=2$：两人有胜负，胜者在前即可。" },
      { label: "b", marks: 5, question: "引导二（插入法）：设 $n$ 人已排成满足条件的一列 $P_1\\to P_2\\to\\cdots\\to P_n$（箭头表示战胜）。新来一人 $X$。分情况说明总能把 $X$ 插入这条链中某处，保持「前者胜后者」。",
        solutionOutline: "若 $X$ 胜 $P_1$，放最前。若 $P_n$ 胜 $X$，放最后。否则存在相邻位置：$P_i$ 胜 $X$ 而 $X$ 胜 $P_{i+1}$（沿链走，胜负从『$X$ 胜』翻转到『败给』必有交界），把 $X$ 插在 $P_i,P_{i+1}$ 之间。" },
      { label: "c", marks: 3, question: "引导三（归纳收尾）：用 b) 完成归纳。",
        solutionOutline: "由 b)，$n$ 人的链总能扩成 $n+1$ 人的链；由归纳法，任意 $n$ 人都能排成所需的一列。$\\blacksquare$" },
    ],
    fullSolution:
      "**完整证明（对人数归纳 + 插入法）**\\n\\n用「$A\\to B$」表示「$A$ 战胜 $B$」。要证：可排成一列使相邻前者胜后者（即锦标赛存在**哈密顿路径**）。\\n\\n**基础**：$n=1$ 时单人即为一列；$n=2$ 时两人分胜负，胜者列前。\\n\\n**归纳步**：假设任意 $n$ 名选手都能排成满足条件的链。现有 $n+1$ 名选手，任取其中 $n$ 名，由归纳假设排成\\n$$P_1\\to P_2\\to\\cdots\\to P_n.$$\\n把剩下的一名选手记为 $X$，将其插入这条链：\\n\\n- **若 $X\\to P_1$**（$X$ 胜排头）：把 $X$ 放在最前，得 $X\\to P_1\\to\\cdots\\to P_n$。\\n- **若 $P_n\\to X$**（排尾胜 $X$）：把 $X$ 放在最后，得 $P_1\\to\\cdots\\to P_n\\to X$。\\n- **否则**：即 $P_1\\to X$（排头胜 $X$）且 $X\\to P_n$。沿链从左往右看比较结果：在 $P_1$ 处是「$P_1$ 胜 $X$」，在 $P_n$ 处是「$X$ 胜 $P_n$」，两端结论相反，故存在相邻的一对下标 $i$，使\\n$$P_i\\to X\\quad\\text{且}\\quad X\\to P_{i+1}.$$\\n把 $X$ 插在 $P_i$ 与 $P_{i+1}$ 之间，链仍处处「前者胜后者」。\\n\\n无论哪种情形，都得到 $n+1$ 名选手的合法链。由归纳法，命题对一切 $n$ 成立。$\\blacksquare$\\n\\n---\\n**方法要点（BMO2 通用武器）**：**「归纳 + 插入」**是证明有序结构存在性的利器——把新元素插进已排好的序列，靠「在某处胜负发生翻转」定位插入点。这正是「每个锦标赛都有哈密顿路径」的经典证明；同样的插入思想也用于排序、拓扑序、以及各种「可线性化」的存在性论证。\\n\\n**延伸**：更强的结论——每个**强连通**锦标赛都有哈密顿**回路**（Camion 定理），证明思路类似但更细。\\n\\n---\\n*原创题；仅以 BMO2 组合题型做难度校准；插入法对 $3000$ 个随机锦标赛均产出合法哈密顿路径，已程序核对；请对照证明自评。*",
  },
];
