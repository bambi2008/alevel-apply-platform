import type { TopicKnowledge } from "./esat";

export const CAIE9709_KNOWLEDGE: TopicKnowledge[] = [
  {
    topicId: "caie9709-algebra",
    overview: "P3 代数题常把二项展开、部分分式、因式与余式藏在参数条件中。先确认目标系数或恒等式，再决定展开到哪一项。",
    concepts: [{
      name: "广义二项式与代数约束",
      body: "$$(1+x)^n=1+nx+\frac{n(n-1)}{2!}x^2+\cdots$$\n当 $n$ 不是正整数时，展开通常只在 $|x|<1$ 有效。若表达式先有常数倍或线性换元，要同时调整系数与收敛范围。",
      keyPoints: ["只展开到题目所需阶数", "把参数条件翻译成系数方程", "最后写出有效范围"],
    }],
    workedExamples: [{
      title: "系数反求参数",
      question: "$(1+kx)^{-1/2}$ 中 $x^2$ 的系数为 $3/2$，且 $k>0$，求 $k$。",
      solution: "$x^2$ 系数是 $\frac{(-1/2)(-3/2)}{2}k^2=\frac38k^2$，故 $k^2=4$。由 $k>0$，得 $k=2$。",
      tip: "正负限制往往是最后一分。",
    }],
  },
  {
    topicId: "caie9709-log-exp",
    overview: "指数与对数题的关键不是计算，而是先看出可用同一底数、换元或取对数把非线性结构降阶。",
    concepts: [{
      name: "指数换元与解的筛选",
      body: "若同时出现 $a^x$、$a^{-x}$ 或 $a^{2x}$，令 $u=a^x$，并记录 $u>0$。解出关于 $u$ 的方程后再换回 $x$，负的 $u$ 必须舍去。",
      keyPoints: ["写明换元变量为正", "对数真数必须为正", "数值解按要求取有效数字"],
    }],
    workedExamples: [{
      title: "双向指数",
      question: "解 $2^{x+1}+8\cdot2^{-x}=10$。",
      solution: "令 $u=2^x>0$，乘以 $u$ 得 $2u^2-10u+8=0$，所以 $u=1$ 或 $4$，故 $x=0$ 或 $2$。",
    }],
  },
  {
    topicId: "caie9709-trig",
    overview: "P3 三角题常要求在恒等变形、象限判断和规定区间之间来回切换。先统一函数或角，再处理解集。",
    concepts: [{
      name: "恒等式与区间解",
      body: "常用工具包括积化和差、倍角公式与 $R\cos(x-\alpha)$。解方程后必须根据题目区间列全解，并检查原式中的分母限制。",
      keyPoints: ["先标出角度单位", "反三角函数只给主值", "用象限补齐解而不是盲按计算器"],
    }],
    workedExamples: [{
      title: "积化和差",
      question: "求 $\int_0^{\pi/6}4\cos x\cos2x\,dx$。",
      solution: "$4\cos x\cos2x=2(\cos3x+\cos x)$，积分得 $[\frac23\sin3x+2\sin x]_0^{\pi/6}=\frac53$。",
    }],
  },
  {
    topicId: "caie9709-differentiation",
    overview: "微分高频失分来自没有先判断函数形式。隐函数、参数方程和切线角度都要先求正确的斜率表达式，再代点。",
    concepts: [{
      name: "隐函数与切线夹角",
      body: "隐函数两边对 $x$ 求导时，每个含 $y$ 的项都带 $dy/dx$。两直线斜率为 $m_1,m_2$ 时，夹角满足 $$\tan\theta=\left|\frac{m_2-m_1}{1+m_1m_2}\right|.$$",
      keyPoints: ["先求导再代坐标", "乘积中的 $y$ 要用乘积法则", "夹角取锐角并检查垂直情形"],
    }],
    workedExamples: [{
      title: "隐函数斜率",
      question: "若 $x^2+xy+y^2=7$，求点 $(1,2)$ 处的斜率。",
      solution: "$2x+y+x\frac{dy}{dx}+2y\frac{dy}{dx}=0$，所以 $dy/dx=-(2x+y)/(x+2y)$。代入得 $-4/5$。",
    }],
  },
  {
    topicId: "caie9709-integration",
    overview: "积分题最常见的陌生感来自方法没有被明说。先观察导数配对、次数差、根式和可拆分结构，再在换元、分部积分、恒等变形中选择。",
    concepts: [{
      name: "先识别，再积分",
      body: "看到 $f'(x)/f(x)$ 考虑对数；多项式乘指数或三角函数考虑分部积分；$a^2+x^2$ 与根式常提示三角换元。定积分换元时必须同时换上下限。",
      keyPoints: ["写清换元与微分", "分部积分选择会影响计算长度", "定积分最终不保留原变量"],
    }],
    workedExamples: [{
      title: "隐藏的对数型",
      question: "求 $\int \frac{2x+1}{x^2+x+3}\,dx$。",
      solution: "分母导数恰为 $2x+1$，因此结果为 $\ln(x^2+x+3)+C$。",
      tip: "先看分母导数，能省下一整页运算。",
    }],
  },
  {
    topicId: "caie9709-numerical",
    overview: "数值方法不仅要给近似值，还要证明根的位置、迭代是否合理，并按题目指定精度记录过程。",
    concepts: [{
      name: "夹根与迭代",
      body: "连续函数若 $f(a)f(b)<0$，则 $(a,b)$ 内至少有一根。唯一性通常由 $f'$ 在区间内恒同号证明。固定点迭代写成 $x_{n+1}=g(x_n)$，并保留足够位数到最后。",
      keyPoints: ["先说明连续", "唯一性与存在性是两件事", "列表展示每次迭代值"],
    }],
    workedExamples: [{
      title: "证明唯一根",
      question: "说明 $x+\ln x=3$ 在 $(2,3)$ 内有唯一根。",
      solution: "$f(2)<0<f(3)$ 且 $f$ 连续，故有根；又 $f'(x)=1+1/x>0$，故严格递增，根唯一。",
    }],
  },
  {
    topicId: "caie9709-vectors",
    overview: "向量长题往往把相交、垂直、距离和位置限制叠在一起。每个文字条件都应转换成一个独立方程。",
    concepts: [{
      name: "直线关系与距离",
      body: "直线写成 $\mathbf r=\mathbf a+\lambda\mathbf d$。相交令三个坐标对应相等；垂直用点积为零；点到直线的最短向量与方向向量垂直。",
      keyPoints: ["参数不要混用", "三个坐标方程要相容", "距离必须取向量模"],
    }],
    workedExamples: [{
      title: "垂足参数",
      question: "点 $P$ 到直线 $\mathbf r=\mathbf a+\lambda\mathbf d$ 的垂足参数是什么？",
      solution: "垂足 $H=\mathbf a+\lambda\mathbf d$ 满足 $(P-H)\cdot\mathbf d=0$，故 $\lambda=((P-\mathbf a)\cdot\mathbf d)/(\mathbf d\cdot\mathbf d)$。",
    }],
  },
  {
    topicId: "caie9709-de",
    overview: "微分方程题先分清可分离变量还是线性形式，再处理初值、定义域和长期行为。真正刁钻的地方常在分式拆分。",
    concepts: [{
      name: "可分离变量",
      body: "若 $dy/dx=f(x)g(y)$，则 $dy/g(y)=f(x)dx$。积分后再代初值求常数。遇到 $y/(y+a)$ 一类结构，可先改写或做部分分式。",
      keyPoints: ["分离时不要丢失平衡解", "代初值前保留积分常数", "检查对数真数与模型范围"],
    }],
    workedExamples: [{
      title: "部分分式后分离",
      question: "解 $dy/dx=x(y+1)/y$。",
      solution: "$y/(y+1)\,dy=x\,dx$，而 $y/(y+1)=1-1/(y+1)$，故 $y-\ln|y+1|=x^2/2+C$。",
    }],
  },
  {
    topicId: "caie9709-complex",
    overview: "复数题要在代数式、模辐角和几何轨迹之间切换。每次变换都同时追踪中心、半径、方向和边界条件。",
    concepts: [{
      name: "共轭、模与轨迹",
      body: "$z^*$ 将点关于实轴反射；加常数表示平移；乘复数表示缩放与旋转。$|z-a|=r$ 是以 $a$ 为圆心、半径 $r$ 的圆。",
      keyPoints: ["辐角需结合象限", "共轭使辐角变号", "不等式决定圆弧或半平面取哪一侧"],
    }],
    workedExamples: [{
      title: "轨迹变换",
      question: "$|z-2i|=3$ 经 $w=z^*-1$ 后的圆心和半径是什么？",
      solution: "先关于实轴反射，圆心由 $2i$ 变为 $-2i$；再左移 1，圆心为 $-1-2i$，半径仍为 3。",
    }],
  },
];
