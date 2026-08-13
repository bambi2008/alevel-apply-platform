// BPhO Round 2 风格原创长题第四批：五条主线各一题。
// 数值均用独立计算脚本核对；长题按推导、计算与物理解释逐层给分。
import type { LongQuestion } from "./types";

const SELF_ASSESSMENT_NOTE =
  "\n\n---\n*原创阶梯长题；数值已独立核对；长题不自动判分，请按各小问评分要点自评。*";

export const BPHO4_LONG_SAMPLE: LongQuestion[] = [
  {
    id: "bpho4-rotating-habitat-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-mechanics",
    difficulty: 3,
    totalMarks: 25,
    context:
      "【Round 2 风格 · 旋转参考系】一座环形空间站半径 $R=120\\ \\mathrm m$，绕对称轴匀速转动，使舱壁处产生类似重力的效果。取 $g=9.81\\ \\mathrm{m\\,s^{-2}}$。空间站主体可近似为质量 $M=2.00\\times10^5\\ \\mathrm{kg}$ 的薄环；另有质量 $m=1.00\\times10^3\\ \\mathrm{kg}$ 的设备可沿辐条移动。",
    parts: [
      {
        label: "a",
        marks: 4,
        question:
          "从圆周运动所需向心加速度出发，求舱壁处等效重力为 $g$ 时的角速度 $\\omega$、周期 $T$ 与每分钟转数。",
        solutionOutline:
          "$\\omega^2R=g$，故 $\\omega=0.286\\ \\mathrm{rad\\,s^{-1}}$；$T=2\\pi/\\omega=22.0\\ \\mathrm s$，转速 $60/T=2.73\\ \\mathrm{rpm}$。",
      },
      {
        label: "b",
        marks: 4,
        question:
          "一名身高 $h=1.80\\ \\mathrm m$ 的宇航员站在舱壁上，脚在 $r=R$、头在 $r=R-h$。求头脚处等效重力之差及其占脚部等效重力的百分比。",
        solutionOutline:
          "$g_{\\rm foot}-g_{\\rm head}=\\omega^2h=0.147\\ \\mathrm{m\\,s^{-2}}$，比例 $h/R=1.50\\%$；头部感觉的等效重力略小。",
      },
      {
        label: "c",
        marks: 5,
        question:
          "宇航员以相对空间站 $u=2.00\\ \\mathrm{m\\,s^{-1}}$ 的速度沿辐条向轴心攀爬。写出科里奥利加速度的大小并计算数值，指出其方向与 $\\boldsymbol\\omega$、$\\mathbf u$ 的关系。",
        solutionOutline:
          "旋转系中 $\\mathbf a_C=-2\\boldsymbol\\omega\\times\\mathbf u$。因径向速度与转轴垂直，$a_C=2\\omega u=1.14\\ \\mathrm{m\\,s^{-2}}$，方向沿切向，符号由叉积决定。",
      },
      {
        label: "d",
        marks: 6,
        question:
          "设备最初位于转轴附近，随后在无外力矩条件下移到环上。忽略设备初始转动惯量，利用角动量守恒求新的角速度 $\\omega'$，以及新舱壁等效重力与原值之比。",
        solutionOutline:
          "$I_i=MR^2$，$I_f=(M+m)R^2$。故 $\\omega'=M\\omega/(M+m)=0.9950\\omega=0.284\\ \\mathrm{rad\\,s^{-1}}$；$g'/g=(\\omega'/\\omega)^2=[M/(M+m)]^2=0.990$。",
      },
      {
        label: "e",
        marks: 6,
        question:
          "解释设备外移时空间站为何减速。求系统转动动能 $K=L^2/(2I)$ 的相对变化 $K_f/K_i$，并说明减少的机械能去了哪里。",
        solutionOutline:
          "外移使转动惯量增大；外力矩为零，角动量不变，所以角速度下降。$K_f/K_i=I_i/I_f=M/(M+m)=0.9950$，转动能减少约 $0.50\\%$。搬运机构若缓慢制动，可把这部分能量转为电能；否则最终成为内能。",
      },
    ],
    fullSolution:
      "**a)** $\\omega=\\sqrt{g/R}=0.286\\ \\mathrm{rad\\,s^{-1}}$，$T=22.0\\ \\mathrm s$，即 $2.73\\ \\mathrm{rpm}$。\n\n**b)** 差值为 $\\omega^2h=0.147\\ \\mathrm{m\\,s^{-2}}$，占 $1.50\\%$。\n\n**c)** $\\mathbf a_C=-2\\boldsymbol\\omega\\times\\mathbf u$，大小 $1.14\\ \\mathrm{m\\,s^{-2}}$，沿切向。\n\n**d)** $MR^2\\omega=(M+m)R^2\\omega'$，故 $\\omega'=0.9950\\omega$，而 $g'/g=0.990$。\n\n**e)** 因 $K=L^2/(2I)$，$K_f/K_i=M/(M+m)=0.9950$；损失的转动能由搬运/制动系统带走并最终转化。" +
      SELF_ASSESSMENT_NOTE,
  },
  {
    id: "bpho4-resonance-tube-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-waves",
    difficulty: 3,
    totalMarks: 25,
    context:
      "【Round 2 风格 · 声学共振】一根一端封闭、一端开口的圆柱形空气柱，几何长度 $L=0.850\\ \\mathrm m$，半径 $r=2.50\\ \\mathrm{cm}$。室温 $20.0^\\circ\\mathrm C$ 时声速可取 $v=343\\ \\mathrm{m\\,s^{-1}}$；开口端修正可近似为 $0.60r$。",
    parts: [
      {
        label: "a",
        marks: 4,
        question:
          "忽略端修正，写出封闭端与开口端的位移边界条件，并推导允许频率 $f_n=(2n-1)v/(4L)$。",
        solutionOutline:
          "封闭端是位移节点，开口端近似位移腹。管长容纳奇数个四分之一波长：$L=(2n-1)\\lambda_n/4$，故得所给频率。",
      },
      {
        label: "b",
        marks: 4,
        question: "忽略端修正，计算基频与接下来的两个共振频率。",
        solutionOutline:
          "$f_1=v/(4L)=100.9\\ \\mathrm{Hz}$；只有奇次谐波，故 $f_2=302.6\\ \\mathrm{Hz}$、$f_3=504.4\\ \\mathrm{Hz}$。",
      },
      {
        label: "c",
        marks: 5,
        question:
          "加入端修正，把有效长度写成 $L_{\\rm eff}=L+0.60r$，重新计算基频。若用 $100.0\\ \\mathrm{Hz}$ 音叉激励，求拍频。",
        solutionOutline:
          "$L_{\\rm eff}=0.865\\ \\mathrm m$，$f_1=343/(4\\times0.865)=99.13\\ \\mathrm{Hz}$。拍频为 $|100.0-99.13|=0.87\\ \\mathrm{Hz}$。",
      },
      {
        label: "d",
        marks: 4,
        question:
          "声速近似满足 $v=331+0.60\\theta$（$\\theta$ 以摄氏度计）。若温度升到 $35.0^\\circ\\mathrm C$，管长不变，求含端修正的基频，并解释频率变化。",
        solutionOutline:
          "$v=352\\ \\mathrm{m\\,s^{-1}}$，故 $f_1=352/(4\\times0.865)=101.7\\ \\mathrm{Hz}$。温度升高使声速增大，而允许波长由边界几何固定，因此频率升高。",
      },
      {
        label: "e",
        marks: 4,
        question:
          "在 $20.0^\\circ\\mathrm C$ 时测得基频共振的品质因数 $Q=80$。求半功率带宽 $\\Delta f=f_1/Q$，并说明较大的 $Q$ 对选频性意味着什么。",
        solutionOutline:
          "$\\Delta f=99.13/80=1.24\\ \\mathrm{Hz}$。$Q$ 越大，带宽越窄、共振峰越尖，对邻近频率的区分能力越强。",
      },
      {
        label: "f",
        marks: 4,
        question:
          "弱阻尼振幅包络写成 $A=A_0e^{-t/\\tau}$，并有 $Q=\\pi f_1\\tau$。求振幅衰减到 $1/e$ 所需时间，并讨论能量衰减时间为何是它的一半。",
        solutionOutline:
          "$\\tau=Q/(\\pi f_1)=0.257\\ \\mathrm s$。振动能量正比于振幅平方，故 $E\\propto e^{-2t/\\tau}$，能量的 $1/e$ 时间为 $\\tau/2$。",
      },
    ],
    fullSolution:
      "**a)** 节点—腹边界给 $L=(2n-1)\\lambda/4$，所以 $f_n=(2n-1)v/(4L)$。\n\n**b)** 前三项为 $100.9$、$302.6$、$504.4\\ \\mathrm{Hz}$。\n\n**c)** $L_{\\rm eff}=0.865\\ \\mathrm m$，基频 $99.13\\ \\mathrm{Hz}$，拍频 $0.87\\ \\mathrm{Hz}$。\n\n**d)** $35^\\circ\\mathrm C$ 时 $v=352\\ \\mathrm{m\\,s^{-1}}$，基频 $101.7\\ \\mathrm{Hz}$。\n\n**e)** 半功率带宽 $1.24\\ \\mathrm{Hz}$；高 $Q$ 对应窄而尖的共振。\n\n**f)** $\\tau=0.257\\ \\mathrm s$；能量因正比于 $A^2$ 而以两倍指数率衰减。" +
      SELF_ASSESSMENT_NOTE,
  },
  {
    id: "bpho4-rl-transient-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-em",
    difficulty: 3,
    totalMarks: 25,
    context:
      "【Round 2 风格 · 暂态电路】电动势 $\\mathcal E=12.0\\ \\mathrm V$ 的理想电源与电阻 $R=6.00\\ \\Omega$、理想电感 $L=0.300\\ \\mathrm H$ 串联。$t=0$ 时接通，初始电流为零。",
    parts: [
      {
        label: "a",
        marks: 4,
        question:
          "由基尔霍夫定律写出电流满足的微分方程，并说明刚接通瞬间及很久以后的电感电压。",
        solutionOutline:
          "$L\\,dI/dt+RI=\\mathcal E$。$t=0^+$ 时 $I=0$，全部电压落在电感上；稳态 $dI/dt=0$，理想电感电压为零。",
      },
      {
        label: "b",
        marks: 5,
        question:
          "验证 $I(t)=I_\\infty(1-e^{-t/\\tau})$ 是方程的解，并给出 $I_\\infty$ 与时间常数 $\\tau$。",
        solutionOutline:
          "代入可得 $I_\\infty=\\mathcal E/R=2.00\\ \\mathrm A$，$\\tau=L/R=0.0500\\ \\mathrm s$；该解也满足 $I(0)=0$。",
      },
      {
        label: "c",
        marks: 4,
        question:
          "求 $t=0.100\\ \\mathrm s$ 时的电流、电阻电压与电感电压，并检验电压定律。",
        solutionOutline:
          "$t=2\\tau$，$I=2(1-e^{-2})=1.73\\ \\mathrm A$；$V_R=10.38\\ \\mathrm V$，$V_L=\\mathcal Ee^{-2}=1.62\\ \\mathrm V$，两者之和为 $12.0\\ \\mathrm V$。",
      },
      {
        label: "d",
        marks: 4,
        question:
          "求此时电感储能，并与最终稳态储能比较。",
        solutionOutline:
          "$U_L=\\tfrac12LI^2=0.448\\ \\mathrm J$；稳态 $U_\\infty=\\tfrac12L(2.00)^2=0.600\\ \\mathrm J$，前者约为后者的 $74.8\\%$。",
      },
      {
        label: "e",
        marks: 5,
        question:
          "在 $t=0.100\\ \\mathrm s$ 时断开电源，但保持 $R$ 与 $L$ 构成闭合回路。写出随后电流并求电流降至 $0.100\\ \\mathrm A$ 所需时间。",
        solutionOutline:
          "以断开瞬间为 $t'=0$，$I=I_0e^{-t'/\\tau}$，其中 $I_0=1.729\\ \\mathrm A$。$t'=\\tau\\ln(I_0/0.100)=0.142\\ \\mathrm s$。",
      },
      {
        label: "f",
        marks: 3,
        question:
          "证明放电过程中电阻产生的总热量等于断开瞬间的电感储能，并说明电流为何不能突变。",
        solutionOutline:
          "$Q=\\int_0^\\infty I_0^2e^{-2t/\\tau}Rdt=I_0^2R\\tau/2=LI_0^2/2$。若电流突变，则 $dI/dt$ 无穷大，需无穷大的感应电动势，故实际电流连续。",
      },
    ],
    fullSolution:
      "**a)** $L\\dot I+RI=\\mathcal E$；初始电感承担全部电压，稳态承担零电压。\n\n**b)** $I_\\infty=2.00\\ \\mathrm A$，$\\tau=0.0500\\ \\mathrm s$。\n\n**c)** 在 $2\\tau$ 时 $I=1.73\\ \\mathrm A$，$V_R=10.38\\ \\mathrm V$，$V_L=1.62\\ \\mathrm V$。\n\n**d)** 此时 $U_L=0.448\\ \\mathrm J$，稳态为 $0.600\\ \\mathrm J$。\n\n**e)** 放电电流为 $I_0e^{-t'/\\tau}$，降到 $0.100\\ \\mathrm A$ 需 $0.142\\ \\mathrm s$。\n\n**f)** 积分焦耳功率得到 $Q=LI_0^2/2$，恰等于初始磁场能。" +
      SELF_ASSESSMENT_NOTE,
  },
  {
    id: "bpho4-planet-climate-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-thermal",
    difficulty: 3,
    totalMarks: 25,
    context:
      "【Round 2 风格 · 行星能量平衡】某行星半径为 $R$，轨道处恒星辐照度 $S=1360\\ \\mathrm{W\\,m^{-2}}$，反照率 $A=0.300$。把行星看成黑体，斯特藩常量 $\\sigma=5.67\\times10^{-8}\\ \\mathrm{W\\,m^{-2}K^{-4}}$。",
    parts: [
      {
        label: "a",
        marks: 4,
        question:
          "解释吸收功率为何是 $(1-A)S\\pi R^2$，而向外辐射功率是 $4\\pi R^2\\sigma T^4$。",
        solutionOutline:
          "恒星光截面积是圆盘 $\\pi R^2$，且仅吸收比例 $1-A$；热辐射来自近似整个球面 $4\\pi R^2$。",
      },
      {
        label: "b",
        marks: 5,
        question:
          "令吸收与辐射平衡，推导有效温度并计算数值。",
        solutionOutline:
          "$T_e=[(1-A)S/(4\\sigma)]^{1/4}=255\\ \\mathrm K$。半径约去，说明同样辐照度和反照率下结果与行星大小无关。",
      },
      {
        label: "c",
        marks: 5,
        question:
          "一个极简温室模型中，大气对恒星短波透明，却完全吸收地面长波；大气上下两面各以同一温度辐射。证明地面温度 $T_s=2^{1/4}T_e$ 并计算。",
        solutionOutline:
          "大气平衡给 $\\sigma T_s^4=2\\sigma T_a^4$；行星向太空仅由大气辐射，故 $\\sigma T_a^4=\\sigma T_e^4$。于是 $T_s^4=2T_e^4$，$T_s=303\\ \\mathrm K$。",
      },
      {
        label: "d",
        marks: 4,
        question:
          "恒星光度固定且辐照度满足 $S\\propto r^{-2}$。推导 $T_e$ 对轨道半径的标度，并估算在 $1.52$ 倍当前轨道半径处的有效温度。",
        solutionOutline:
          "$T_e\\propto S^{1/4}\\propto r^{-1/2}$，所以 $T'=255/\\sqrt{1.52}=207\\ \\mathrm K$。",
      },
      {
        label: "e",
        marks: 3,
        question:
          "用对数微分估算反照率由 $0.300$ 增至 $0.320$ 时有效温度的变化。",
        solutionOutline:
          "$dT/T=-dA/[4(1-A)]$。代入 $dA=0.020$ 得 $dT=-1.82\\ \\mathrm K$，即温度约降至 $253\\ \\mathrm K$。",
      },
      {
        label: "f",
        marks: 4,
        question:
          "海洋混合层单位面积热容取 $C=4.2\\times10^8\\ \\mathrm{J\\,m^{-2}K^{-1}}$。将净辐射线性化为 $4\\sigma T_e^3\\Delta T$，估算气候弛豫时间 $\\tau=C/(4\\sigma T_e^3)$。",
        solutionOutline:
          "$4\\sigma T_e^3=3.76\\ \\mathrm{W\\,m^{-2}K^{-1}}$，故 $\\tau=1.12\\times10^8\\ \\mathrm s=3.54$ 年。真实反馈与海洋深层交换会改变此值。",
      },
    ],
    fullSolution:
      "**a)** 吸收取迎光圆盘面积，辐射取整个球面面积。\n\n**b)** $T_e=[(1-A)S/(4\\sigma)]^{1/4}=255\\ \\mathrm K$。\n\n**c)** 单层全吸收温室给 $T_s=2^{1/4}T_e=303\\ \\mathrm K$。\n\n**d)** $T_e\\propto r^{-1/2}$，在 $1.52r$ 处约 $207\\ \\mathrm K$。\n\n**e)** 反照率增加 $0.020$ 使温度约下降 $1.82\\ \\mathrm K$。\n\n**f)** 线性化后的弛豫时间约 $1.12\\times10^8\\ \\mathrm s=3.54$ 年。" +
      SELF_ASSESSMENT_NOTE,
  },
  {
    id: "bpho4-cosmic-muons-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-modern",
    difficulty: 3,
    totalMarks: 25,
    context:
      "【Round 2 风格 · 相对论 μ 子】宇宙线在距地面 $H=15.0\\ \\mathrm{km}$ 的高空产生 μ 子。其固有平均寿命 $\\tau_0=2.20\\ \\mu\\mathrm s$，速度 $v=0.998c$。取 $c=3.00\\times10^8\\ \\mathrm{m\\,s^{-1}}$，μ 子静能 $m_\\mu c^2=105.7\\ \\mathrm{MeV}$。",
    parts: [
      {
        label: "a",
        marks: 4,
        question:
          "若忽略相对论，计算 μ 子一个平均寿命内行进的距离，以及从产生点存活到地面的比例 $e^{-t/\\tau_0}$。",
        solutionOutline:
          "$v\\tau_0=659\\ \\mathrm m$；飞行时间约 $50.1\\ \\mu\\mathrm s$，存活比例 $e^{-50.1/2.20}=1.29\\times10^{-10}$。",
      },
      {
        label: "b",
        marks: 4,
        question:
          "计算洛伦兹因子 $\\gamma$ 与地面参考系测得的平均寿命。",
        solutionOutline:
          "$\\gamma=1/\\sqrt{1-0.998^2}=15.82$，故 $\\tau=\\gamma\\tau_0=34.8\\ \\mu\\mathrm s$。",
      },
      {
        label: "c",
        marks: 4,
        question:
          "在地面参考系中重新计算到达地面的存活比例。",
        solutionOutline:
          "平均衰变长度 $\\gamma v\\tau_0=10.4\\ \\mathrm{km}$，所以存活比例 $e^{-15.0/10.4}=0.237$，远大于经典预测。",
      },
      {
        label: "d",
        marks: 4,
        question:
          "改在 μ 子自身参考系解释同一结果：求大气层收缩后的厚度与穿越该厚度的固有时间。",
        solutionOutline:
          "$H'=H/\\gamma=948\\ \\mathrm m$；穿越时间 $H'/v=3.17\\ \\mu\\mathrm s$，存活比例 $e^{-3.17/2.20}=0.237$，与地面系一致。",
      },
      {
        label: "e",
        marks: 4,
        question:
          "求 μ 子的总能量与动能。",
        solutionOutline:
          "$E=\\gamma m_\\mu c^2=1.67\\ \\mathrm{GeV}$；$K=(\\gamma-1)m_\\mu c^2=1.57\\ \\mathrm{GeV}$。",
      },
      {
        label: "f",
        marks: 5,
        question:
          "要使从 $15.0\\ \\mathrm{km}$ 高处产生的 μ 子至少有 $10.0\\%$ 到达地面，推导对 $\\gamma\\beta$ 的要求并求最低速度，其中 $\\beta=v/c$。",
        solutionOutline:
          "$0.1=e^{-H/(\\gamma\\beta c\\tau_0)}$，故 $\\gamma\\beta=H/(c\\tau_0\\ln10)=9.87$。利用 $\\gamma^2-(\\gamma\\beta)^2=1$ 得 $\\gamma=9.92$、$\\beta=0.9949$，最低速度约 $0.995c$。",
      },
    ],
    fullSolution:
      "**a)** 经典衰变长度仅 $659\\ \\mathrm m$，存活比例 $1.29\\times10^{-10}$。\n\n**b)** $\\gamma=15.82$，地面系寿命 $34.8\\ \\mu\\mathrm s$。\n\n**c)** 相对论衰变长度 $10.4\\ \\mathrm{km}$，存活比例 $0.237$。\n\n**d)** μ 子系看到厚度 $948\\ \\mathrm m$，固有飞行时间 $3.17\\ \\mu\\mathrm s$，得到同一存活率。\n\n**e)** 总能量 $1.67\\ \\mathrm{GeV}$，动能 $1.57\\ \\mathrm{GeV}$。\n\n**f)** $\\gamma\\beta\\ge9.87$，所以 $\\beta_{\\min}=0.9949$，约为 $0.995c$。" +
      SELF_ASSESSMENT_NOTE,
  },
];
