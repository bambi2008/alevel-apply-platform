import type { LongQuestion, QuestionDifficulty } from "./types";

interface ShortProofSpec {
  id: string;
  topicId: "bmo-number" | "bmo-geometry";
  difficulty: QuestionDifficulty;
  marks: 4 | 5 | 6;
  prompt: string;
  outline: string;
  solution: string;
}

function shortProof(spec: ShortProofSpec): LongQuestion {
  return {
    id: spec.id,
    type: "long",
    testId: "bmo",
    topicId: spec.topicId,
    difficulty: spec.difficulty,
    totalMarks: spec.marks,
    context: `【BMO 短证明 · ${spec.marks} 分】${spec.prompt}`,
    parts: [{
      label: "证明",
      marks: spec.marks,
      question: "写出关键依据与完整推理；只写结论不能获得满分。",
      solutionOutline: spec.outline,
    }],
    fullSolution: `${spec.solution}\n\n*原创短证明题；用于衔接选择题与 BMO 完整证明题。*`,
  };
}

const NUMBER_SHORT_PROOFS: ShortProofSpec[] = [
  {
    id: "bmo-sp-nt-001", topicId: "bmo-number", difficulty: 1, marks: 4,
    prompt: "证明：对每个整数 $n$，$n^3-n$ 都能被 $6$ 整除。",
    outline: "因式分解为三个连续整数 $(n-1)n(n+1)$；其中必有一个偶数、一个 $3$ 的倍数，所以乘积被 $2\cdot3=6$ 整除。",
    solution: "有 $n^3-n=n(n-1)(n+1)$，这是三个连续整数的乘积。三个连续整数中必有一个是偶数，故乘积被 $2$ 整除；也必有一个是 $3$ 的倍数，故乘积被 $3$ 整除。由于 $\gcd(2,3)=1$，该乘积被 $6$ 整除。$\blacksquare$",
  },
  {
    id: "bmo-sp-nt-002", topicId: "bmo-number", difficulty: 1, marks: 4,
    prompt: "证明：任意两个相邻正整数互质。",
    outline: "设公因数 $d$ 同时整除 $n$ 和 $n+1$；则 $d$ 整除两者之差 $1$，所以 $d=1$。",
    solution: "设 $d$ 是 $n$ 与 $n+1$ 的任一正公因数。由 $d\mid n$ 且 $d\mid(n+1)$，可得 $d\mid((n+1)-n)=1$。正整数中只有 $1$ 整除 $1$，故所有公因数只有 $1$，即 $\gcd(n,n+1)=1$。$\blacksquare$",
  },
  {
    id: "bmo-sp-nt-003", topicId: "bmo-number", difficulty: 1, marks: 4,
    prompt: "证明：任意整数的平方除以 $4$，余数只能是 $0$ 或 $1$。由此说明不存在整数 $x$ 使 $x^2\equiv2\pmod4$。",
    outline: "按 $x$ 的奇偶分类：$x=2k$ 时平方为 $4k^2$；$x=2k+1$ 时平方为 $4k(k+1)+1$。",
    solution: "若 $x=2k$ 为偶数，则 $x^2=4k^2\equiv0\pmod4$。若 $x=2k+1$ 为奇数，则 $x^2=4k^2+4k+1=4k(k+1)+1\equiv1\pmod4$。整数非奇即偶，所以平方模 $4$ 只有 $0,1$ 两种余数，因而不可能同余于 $2$。$\blacksquare$",
  },
  {
    id: "bmo-sp-nt-004", topicId: "bmo-number", difficulty: 1, marks: 4,
    prompt: "证明：对每个正整数 $n$，$\gcd(n,2n+1)=1$。",
    outline: "若 $d$ 同时整除 $n$ 与 $2n+1$，则 $d$ 整除 $(2n+1)-2n=1$。",
    solution: "设 $d$ 为 $n$ 与 $2n+1$ 的正公因数。因为 $d\mid n$，所以 $d\mid2n$；又 $d\mid(2n+1)$，故 $d\mid((2n+1)-2n)=1$。于是 $d=1$，所以 $\gcd(n,2n+1)=1$。$\blacksquare$",
  },
  {
    id: "bmo-sp-nt-005", topicId: "bmo-number", difficulty: 2, marks: 5,
    prompt: "证明：每个奇整数 $n$ 都满足 $n^2\equiv1\pmod8$。",
    outline: "写成 $n=2k+1$，则 $n^2-1=4k(k+1)$；相邻整数 $k,k+1$ 中必有一个偶数。",
    solution: "令 $n=2k+1$。则 $n^2-1=4k^2+4k=4k(k+1)$。由于 $k$ 与 $k+1$ 相邻，其中必有一个偶数，所以 $k(k+1)$ 被 $2$ 整除，从而 $4k(k+1)$ 被 $8$ 整除。因此 $8\mid(n^2-1)$，即 $n^2\equiv1\pmod8$。$\blacksquare$",
  },
  {
    id: "bmo-sp-nt-006", topicId: "bmo-number", difficulty: 2, marks: 5,
    prompt: "确定所有正整数 $n$，使 $n+3$ 整除 $n^2+5$，并证明答案完整。",
    outline: "模 $n+3$ 有 $n\equiv-3$，故 $n^2+5\equiv14$。于是 $n+3$ 是 $14$ 的大于 $3$ 的正因数。",
    solution: "因为 $n\equiv-3\pmod{n+3}$，所以 $n^2+5\equiv9+5=14\pmod{n+3}$。故条件等价于 $n+3\mid14$。又 $n$ 为正整数，$n+3\ge4$，所以 $n+3$ 只能是 $7$ 或 $14$，得到 $n=4$ 或 $n=11$。反代：$7\mid21$，$14\mid126$，两者均成立。故全部解为 $n=4,11$。$\blacksquare$",
  },
  {
    id: "bmo-sp-nt-007", topicId: "bmo-number", difficulty: 2, marks: 5,
    prompt: "设 $p$ 为正整数。证明：若 $2^p-1$ 是素数，则 $p$ 必为素数。",
    outline: "证逆否命题。若 $p=ab$ 且 $a,b>1$，令 $x=2^a$，利用 $x^b-1=(x-1)(x^{b-1}+\cdots+1)$。",
    solution: "证明逆否命题。若 $p$ 不是素数，则可写成 $p=ab$，其中 $a,b>1$。于是\n$$2^p-1=(2^a)^b-1=(2^a-1)\bigl(2^{a(b-1)}+2^{a(b-2)}+\cdots+1\bigr).$$\n两个因数都大于 $1$，所以 $2^p-1$ 为合数。因此若 $2^p-1$ 为素数，$p$ 必为素数。$\blacksquare$",
  },
  {
    id: "bmo-sp-nt-008", topicId: "bmo-number", difficulty: 2, marks: 6,
    prompt: "确定所有正整数对 $(x,y)$，使 $\dfrac1x+\dfrac1y=\dfrac14$。",
    outline: "整理并配成 $(x-4)(y-4)=16$。因 $x,y>4$，枚举 $16$ 的全部正因数对。",
    solution: "原式等价于 $4x+4y=xy$，即\n$$xy-4x-4y=0\iff(x-4)(y-4)=16.$$\n由原式可知 $x,y>4$，故 $x-4,y-4$ 均为正整数。$16$ 的有序正因数对为 $(1,16),(2,8),(4,4),(8,2),(16,1)$。因此\n$$(x,y)=(5,20),(6,12),(8,8),(12,6),(20,5).$$\n这些数对反代均成立，故答案完整。$\blacksquare$",
  },
  {
    id: "bmo-sp-nt-009", topicId: "bmo-number", difficulty: 1, marks: 4,
    prompt: "证明：十进制整数的完全平方数不可能以 $2,3,7$ 或 $8$ 结尾。",
    outline: "末位只由原数末位决定；枚举 $0,1,\ldots,9$ 的平方模 $10$，所得余数集合为 $\{0,1,4,5,6,9\}$。",
    solution: "任意整数模 $10$ 同余于 $0,1,\ldots,9$ 之一。逐一平方得到末位\n$$0,1,4,9,6,5,6,9,4,1,$$\n所以平方数模 $10$ 只能是 $0,1,4,5,6,9$。其中没有 $2,3,7,8$，故完全平方数不可能以这些数字结尾。$\blacksquare$",
  },
  {
    id: "bmo-sp-nt-010", topicId: "bmo-number", difficulty: 2, marks: 5,
    prompt: "确定所有素数 $p$，使 $p,p+10,p+14$ 都是素数。",
    outline: "三个数模 $3$ 分别为 $p,p+1,p+2$，恰覆盖全部余数，所以其中一个被 $3$ 整除；若三个都是素数，该数只能等于 $3$。",
    solution: "因为 $10\equiv1$、$14\equiv2\pmod3$，三个数 $p,p+10,p+14$ 的模 $3$ 余数恰为连续的三类，因此其中恰有一个被 $3$ 整除。若三者都是素数，这个被 $3$ 整除的数只能等于 $3$。又 $p$ 是三者中最小者，所以只能有 $p=3$。此时三数为 $3,13,17$，确实都是素数。故唯一解是 $p=3$。$\blacksquare$",
  },
  {
    id: "bmo-sp-nt-011", topicId: "bmo-number", difficulty: 3, marks: 6,
    prompt: "设 $a,b$ 为正整数。证明：若 $a^2\mid b^2$，则 $a\mid b$。",
    outline: "对任意素数 $q$ 比较指数：$2v_q(a)\le2v_q(b)$，所以 $v_q(a)\le v_q(b)$。",
    solution: "对任意素数 $q$，记 $v_q(m)$ 为 $q$ 在 $m$ 的标准分解中出现的指数。由 $a^2\mid b^2$，对每个 $q$ 都有\n$$v_q(a^2)\le v_q(b^2),$$\n即 $2v_q(a)\le2v_q(b)$，从而 $v_q(a)\le v_q(b)$。因此 $a$ 的每个素因子在 $b$ 中至少以同样高的指数出现，故 $a\mid b$。$\blacksquare$",
  },
  {
    id: "bmo-sp-nt-012", topicId: "bmo-number", difficulty: 3, marks: 6,
    prompt: "证明：存在无穷多个形如 $4k+3$ 的素数。",
    outline: "反设只有 $p_1,\ldots,p_r$，考虑 $N=4p_1\cdots p_r-1$。$N\equiv3\pmod4$，其素因子中至少一个也为 $3\pmod4$，且不在原列表。",
    solution: "反设所有模 $4$ 余 $3$ 的素数只有 $p_1,\ldots,p_r$。令\n$$N=4p_1p_2\cdots p_r-1.$$\n则 $N\equiv3\pmod4$，且对每个 $i$ 有 $N\equiv-1\pmod{p_i}$，所以没有 $p_i$ 整除 $N$。把 $N$ 分解为素因数。若其中每个奇素因数都模 $4$ 余 $1$，它们的乘积也模 $4$ 余 $1$，与 $N\equiv3\pmod4$ 矛盾。因此 $N$ 有一个模 $4$ 余 $3$ 的素因子，但它不在列表中，矛盾。故此类素数有无穷多个。$\blacksquare$",
  },
];

const GEOMETRY_SHORT_PROOFS: ShortProofSpec[] = [
  {
    id: "bmo-sp-ge-001", topicId: "bmo-geometry", difficulty: 1, marks: 4,
    prompt: "在三角形 $ABC$ 中，$D,E$ 分别为 $AB,AC$ 的中点。证明 $DE\parallel BC$ 且 $DE=\dfrac12BC$。",
    outline: "由 $AD/AB=AE/AC=1/2$ 且夹角 $A$ 公共，三角形 $ADE$ 与 $ABC$ 由 SAS 相似。",
    solution: "因为 $D,E$ 为中点，$AD/AB=AE/AC=1/2$，且 $\angle DAE=\angle BAC$。所以 $\triangle ADE\sim\triangle ABC$（SAS）。于是对应角 $\angle ADE=\angle ABC$，故 $DE\parallel BC$；对应边之比给出 $DE/BC=AD/AB=1/2$，即 $DE=BC/2$。$\blacksquare$",
  },
  {
    id: "bmo-sp-ge-002", topicId: "bmo-geometry", difficulty: 1, marks: 4,
    prompt: "在直角三角形 $ABC$ 中，$\angle A=90^\circ$，$M$ 是斜边 $BC$ 的中点。证明 $MA=MB=MC$。",
    outline: "取过 $M$ 平行于两直角边的直线，或把三角形补成矩形；$M$ 是矩形两条对角线的交点。",
    solution: "以 $AB,AC$ 为相邻边把三角形补成矩形 $ABDC$。矩形的两条对角线 $AD$ 与 $BC$ 相等且互相平分。因为 $M$ 是 $BC$ 的中点，它也是 $AD$ 的中点。因此 $MA=MD=BC/2$，同时 $MB=MC=BC/2$。故 $MA=MB=MC$。$\blacksquare$",
  },
  {
    id: "bmo-sp-ge-003", topicId: "bmo-geometry", difficulty: 1, marks: 4,
    prompt: "证明：平行四边形的两条对角线互相平分。",
    outline: "设对角线交于 $O$；利用两组平行线得到角相等，再由一组对边相等证明两三角形全等。",
    solution: "设平行四边形 $ABCD$ 的对角线 $AC,BD$ 交于 $O$。由 $AB\parallel CD$，有 $\angle ABO=\angle CDO$、$\angle BAO=\angle DCO$；又平行四边形对边 $AB=CD$。故 $\triangle AOB\cong\triangle COD$（ASA），从而 $AO=OC$ 且 $BO=OD$。所以两条对角线互相平分。$\blacksquare$",
  },
  {
    id: "bmo-sp-ge-004", topicId: "bmo-geometry", difficulty: 1, marks: 4,
    prompt: "在等腰三角形 $ABC$ 中，$AB=AC$，$D$ 为 $BC$ 中点。证明 $AD$ 同时是中线、高和顶角平分线。",
    outline: "比较 $\triangle ABD$ 与 $\triangle ACD$：$AB=AC$、$BD=DC$、$AD$ 公共，SSS 全等。",
    solution: "由 $AB=AC$、$BD=DC$ 且 $AD$ 为公共边，$\triangle ABD\cong\triangle ACD$（SSS）。所以 $\angle BAD=\angle DAC$，即 $AD$ 平分顶角；又 $\angle ADB=\angle ADC$，两角相邻且和为 $180^\circ$，故各为 $90^\circ$，即 $AD\perp BC$。而 $D$ 本来就是 $BC$ 中点，所以 $AD$ 也是中线。$\blacksquare$",
  },
  {
    id: "bmo-sp-ge-005", topicId: "bmo-geometry", difficulty: 2, marks: 5,
    prompt: "在三角形 $ABC$ 中，内角平分线 $AD$ 交 $BC$ 于 $D$。证明角平分线定理 $\dfrac{BD}{DC}=\dfrac{AB}{AC}$。",
    outline: "比较 $\triangle ABD$ 与 $\triangle ACD$ 的面积：同高给出面积比 $BD/DC$；用两边及夹角面积公式给出 $AB/AC$。",
    solution: "三角形 $ABD$ 与 $ACD$ 对直线 $BC$ 有相同的高，所以\n$$\frac{[ABD]}{[ACD]}=\frac{BD}{DC}.$$\n另一方面，用面积公式且 $\angle BAD=\angle DAC$：\n$$\frac{[ABD]}{[ACD]}=\frac{\tfrac12 AB\cdot AD\sin\angle BAD}{\tfrac12 AC\cdot AD\sin\angle DAC}=\frac{AB}{AC}.$$\n比较两式即得 $BD/DC=AB/AC$。$\blacksquare$",
  },
  {
    id: "bmo-sp-ge-006", topicId: "bmo-geometry", difficulty: 2, marks: 5,
    prompt: "圆内接四边形 $ABCD$ 的顶点依次位于同一圆上。证明 $\angle ABC+\angle ADC=180^\circ$。",
    outline: "两圆周角分别对不含自身顶点的弧 $ADC$ 与 $ABC$；两弧度数之和为 $360^\circ$，圆周角是所对弧的一半。",
    solution: "$\angle ABC$ 所对的是不含 $B$ 的弧 $ADC$，$\angle ADC$ 所对的是不含 $D$ 的弧 $ABC$。这两段弧合成整圆，度数和为 $360^\circ$。由圆周角定理，\n$$\angle ABC+\angle ADC=\frac12\bigl(\widehat{ADC}+\widehat{ABC}\bigr)=\frac12\cdot360^\circ=180^\circ.$$\n$\blacksquare$",
  },
  {
    id: "bmo-sp-ge-007", topicId: "bmo-geometry", difficulty: 2, marks: 5,
    prompt: "从圆外一点 $P$ 向同一圆作两条切线，切点为 $A,B$。证明 $PA=PB$。",
    outline: "连接圆心 $O$ 与切点。半径垂直切线，两个直角三角形有公共斜边 $OP$ 且 $OA=OB$。",
    solution: "连接 $OA,OB,OP$。半径垂直于切点处切线，所以 $\angle OAP=\angle OBP=90^\circ$。在直角三角形 $OAP$ 与 $OBP$ 中，$OP$ 是公共斜边，且 $OA=OB$ 为同圆半径。故两三角形由 RHS 全等，从而对应边 $PA=PB$。$\blacksquare$",
  },
  {
    id: "bmo-sp-ge-008", topicId: "bmo-geometry", difficulty: 2, marks: 5,
    prompt: "圆内两条弦 $AB,CD$ 交于点 $P$。证明 $PA\cdot PB=PC\cdot PD$。",
    outline: "连接 $AC,BD$。利用对顶角与同弧圆周角证明 $\triangle PAC\sim\triangle PDB$，再写对应边比例。",
    solution: "连接 $AC$ 与 $BD$。因为 $AB,CD$ 交于 $P$，$\angle APC=\angle DPB$。又 $P$ 在 $CD,AB$ 上，所以 $\angle ACP=\angle ACD$、$\angle DBP=\angle DBA$；后两角同对弧 $AD$，故相等。因此 $\triangle PAC\sim\triangle PDB$。于是\n$$\frac{PA}{PD}=\frac{PC}{PB},$$\n交叉相乘得 $PA\cdot PB=PC\cdot PD$。$\blacksquare$",
  },
  {
    id: "bmo-sp-ge-009", topicId: "bmo-geometry", difficulty: 1, marks: 4,
    prompt: "证明：同一圆中，相等的弦所对的圆心角相等。",
    outline: "连接圆心到两条弦的四个端点；比较两个三角形，三组对应边分别为半径、半径、相等弦。",
    solution: "设圆心为 $O$，弦 $AB=CD$。在 $\triangle AOB$ 与 $\triangle COD$ 中，$OA=OC$、$OB=OD$ 都是半径，且 $AB=CD$。故两三角形由 SSS 全等，所以对应的圆心角 $\angle AOB=\angle COD$。$\blacksquare$",
  },
  {
    id: "bmo-sp-ge-010", topicId: "bmo-geometry", difficulty: 2, marks: 5,
    prompt: "在三角形 $ABC$ 中，$M$ 是 $BC$ 中点。证明阿波罗尼斯定理：$AB^2+AC^2=2(AM^2+BM^2)$。",
    outline: "设向量 $\mathbf u=\overrightarrow{MA}$、$\mathbf v=\overrightarrow{MB}$，则 $\overrightarrow{MC}=-\mathbf v$；展开 $|\mathbf u\pm\mathbf v|^2$ 后相加。",
    solution: "令 $\mathbf u=\overrightarrow{MA}$、$\mathbf v=\overrightarrow{MB}$。因为 $M$ 是 $BC$ 中点，$\overrightarrow{MC}=-\mathbf v$。于是\n$$AB^2=|\mathbf v-\mathbf u|^2,\qquad AC^2=|-\mathbf v-\mathbf u|^2=|\mathbf u+\mathbf v|^2.$$\n两式相加，交叉项抵消：\n$$AB^2+AC^2=2|\mathbf u|^2+2|\mathbf v|^2=2(AM^2+BM^2).$$\n$\blacksquare$",
  },
  {
    id: "bmo-sp-ge-011", topicId: "bmo-geometry", difficulty: 2, marks: 5,
    prompt: "任意四边形 $ABCD$ 四边的中点依次为 $E,F,G,H$。证明 $EFGH$ 是平行四边形。",
    outline: "分别在三角形 $ABC,ADC,BCD,BAD$ 中使用中位线定理；两组对边都平行于相应对角线。",
    solution: "在 $\triangle ABC$ 中，$E,F$ 是两边中点，所以 $EF\parallel AC$；在 $\triangle ADC$ 中，$H,G$ 是两边中点，所以 $HG\parallel AC$。故 $EF\parallel HG$。同理，在 $\triangle BCD$ 与 $\triangle BAD$ 中，$FG\parallel BD$ 且 $EH\parallel BD$，故 $FG\parallel EH$。两组对边分别平行，所以 $EFGH$ 是平行四边形。$\blacksquare$",
  },
  {
    id: "bmo-sp-ge-012", topicId: "bmo-geometry", difficulty: 3, marks: 6,
    prompt: "三角形 $ABC$ 的三条中线交于点 $G$。证明每条中线都被 $G$ 按从顶点起 $2:1$ 的比例分割。",
    outline: "用位置向量。若顶点向量为 $\mathbf a,\mathbf b,\mathbf c$，令 $\mathbf g=(\mathbf a+\mathbf b+\mathbf c)/3$；证明它在每条中线上并计算比例。",
    solution: "取任意原点，记 $A,B,C$ 的位置向量为 $\mathbf a,\mathbf b,\mathbf c$，并令\n$$\mathbf g=\frac{\mathbf a+\mathbf b+\mathbf c}{3}.$$\n若 $M$ 是 $BC$ 中点，则 $\mathbf m=(\mathbf b+\mathbf c)/2$，且\n$$\mathbf g=\frac13\mathbf a+\frac23\mathbf m.$$\n所以 $G$ 在线段 $AM$ 上，并且 $AG:GM=2:1$。对另外两边中点作完全相同的计算，$G$ 同时在另外两条中线上，并均以 $2:1$ 分割。因此三条中线交于 $G$，且结论成立。$\blacksquare$",
  },
];

export const BMO_SHORT_PROOFS: LongQuestion[] = [
  ...NUMBER_SHORT_PROOFS.map(shortProof),
  ...GEOMETRY_SHORT_PROOFS.map(shortProof),
];
