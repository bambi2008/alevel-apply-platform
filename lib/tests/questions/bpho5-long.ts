// BPhO Round 2 风格原创长题第五批：五条主线各一题。
// 所有数值均由独立脚本复核；解答按建模、推导、计算和解释分层。
import type { LongQuestion } from "./types";

const NOTE =
  "\n\n---\n*原创阶梯长题；数值已独立复核；长题不自动判分，请按评分要点自评。*";

export const BPHO5_LONG_SAMPLE: LongQuestion[] = [
  {
    id: "bpho5-linear-drag-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-mechanics",
    difficulty: 3,
    totalMarks: 25,
    context:
      "【Round 2 风格 · 阻力落体】质量 $m=0.0200\\ \\mathrm{kg}$ 的小球从静止开始竖直下落。空气阻力大小与速率成正比，$F_d=bv$，方向与速度相反，其中 $b=0.0400\\ \\mathrm{kg\\,s^{-1}}$。取向下为正，$g=9.81\\ \\mathrm{m\\,s^{-2}}$。",
    parts: [
      {
        label: "a",
        marks: 4,
        question: "写出运动微分方程，并求终端速度 $v_t$ 与时间常数 $\\tau$。",
        solutionOutline:
          "$m\\,dv/dt=mg-bv$。终端时加速度为零，$v_t=mg/b=4.91\\ \\mathrm{m\\,s^{-1}}$；$\\tau=m/b=0.500\\ \\mathrm s$。",
      },
      {
        label: "b",
        marks: 5,
        question:
          "验证 $v(t)=v_t(1-e^{-t/\\tau})$ 满足微分方程和初始条件，并求 $t=1.00\\ \\mathrm s$ 时的速度。",
        solutionOutline:
          "求导后代入可得恒等式，且 $v(0)=0$。在 $t=2\\tau$ 时，$v=4.91(1-e^{-2})=4.24\\ \\mathrm{m\\,s^{-1}}$。",
      },
      {
        label: "c",
        marks: 5,
        question:
          "对速度积分，证明下落距离 $x=v_t[t-\\tau(1-e^{-t/\\tau})]$，并求第一秒内的下落距离。",
        solutionOutline:
          "由 $x(0)=0$ 直接积分得到所给式。在 $1.00\\ \\mathrm s$ 时，$x=4.905[1-0.5(1-e^{-2})]=2.78\\ \\mathrm m$。",
      },
      {
        label: "d",
        marks: 5,
        question:
          "求小球首次达到 $0.900v_t$ 的时间及此前下落距离。",
        solutionOutline:
          "$e^{-t/\\tau}=0.100$，故 $t=\\tau\\ln10=1.15\\ \\mathrm s$。此时 $x=v_t(t-0.9\\tau)=3.44\\ \\mathrm m$。",
      },
      {
        label: "e",
        marks: 6,
        question:
          "写出瞬时重力功率、阻力耗散功率与动能变化率，证明能量收支成立。再求终端状态下的耗散功率。",
        solutionOutline:
          "$P_g=mgv$，$P_d=bv^2$，$dK/dt=mv\\,dv/dt$。把运动方程乘以 $v$ 得 $dK/dt=P_g-P_d$。终端时二者相等，$P=mgv_t=bv_t^2=0.962\\ \\mathrm W$。",
      },
    ],
    fullSolution:
      "**a)** $m\\dot v=mg-bv$，$v_t=4.91\\ \\mathrm{m\\,s^{-1}}$，$\\tau=0.500\\ \\mathrm s$。\n\n**b)** 指数解满足方程和 $v(0)=0$；$1.00\\ \\mathrm s$ 时 $v=4.24\\ \\mathrm{m\\,s^{-1}}$。\n\n**c)** 积分得 $x=v_t[t-\\tau(1-e^{-t/\\tau})]$，第一秒下落 $2.78\\ \\mathrm m$。\n\n**d)** 达到 $0.900v_t$ 需 $1.15\\ \\mathrm s$，下落 $3.44\\ \\mathrm m$。\n\n**e)** $dK/dt=mgv-bv^2$；终端耗散功率为 $0.962\\ \\mathrm W$。" + NOTE,
  },
  {
    id: "bpho5-michelson-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-waves",
    difficulty: 3,
    totalMarks: 25,
    context:
      "【Round 2 风格 · 光学测量】迈克耳孙干涉仪使用真空波长 $\\lambda=632.8\\ \\mathrm{nm}$ 的激光。一束光被分成相互垂直的两臂，分别往返后叠加。",
    parts: [
      {
        label: "a",
        marks: 4,
        question:
          "说明一面反射镜沿光路移动距离 $d$ 时，光程差为何改变 $2d$，并写出移过的条纹数 $N$。",
        solutionOutline:
          "光在该臂往返，去程和回程各改变 $d$，故 $\\Delta(\\mathrm{OPD})=2d$；每改变一个波长移过一条条纹，所以 $N=2d/\\lambda$。",
      },
      {
        label: "b",
        marks: 4,
        question: "反射镜移动 $0.250\\ \\mathrm{mm}$，计算经过视场中心的完整条纹数。",
        solutionOutline:
          "$N=2(0.250\\times10^{-3})/(632.8\\times10^{-9})=790.1$，因此经过 $790$ 条完整条纹，并余下约 $0.1$ 个周期。",
      },
      {
        label: "c",
        marks: 5,
        question:
          "在一条臂中插入长度 $L=5.00\\ \\mathrm{cm}$ 的气室。抽真空后缓慢充气，观察到 $40.0$ 条条纹移过。考虑往返光程，求气体折射率 $n$。",
        solutionOutline:
          "气体引起光程差 $2L(n-1)=N\\lambda$，故 $n=1+N\\lambda/(2L)=1.000253$。",
      },
      {
        label: "d",
        marks: 5,
        question:
          "若两臂初始等长，移动镜面直到 $d=0.150\\ \\mathrm{mm}$ 时条纹可见度消失，估计光源相干长度 $L_c$。",
        solutionOutline:
          "可见度消失时光程差约等于相干长度。因往返，$L_c\\approx2d=0.300\\ \\mathrm{mm}$。这是数量级估计，阈值取决于光谱线形。",
      },
      {
        label: "e",
        marks: 7,
        question:
          "用 $L_c\\approx\\lambda^2/\\Delta\\lambda$ 估算光源谱线宽度。再说明为何单色性越高，能观察干涉的臂长差越大。",
        solutionOutline:
          "$\\Delta\\lambda\\approx\\lambda^2/L_c=(632.8\\ \\mathrm{nm})^2/(0.300\\ \\mathrm{mm})=1.33\\ \\mathrm{nm}$。谱宽越窄，不同频率分量彼此失相的速度越慢，因此相干长度越长。",
      },
    ],
    fullSolution:
      "**a)** 镜面移动使往返光程差改变 $2d$，故 $N=2d/\\lambda$。\n\n**b)** $N=790.1$，即 $790$ 条完整条纹。\n\n**c)** $2L(n-1)=N\\lambda$，得 $n=1.000253$。\n\n**d)** $L_c\\approx2d=0.300\\ \\mathrm{mm}$。\n\n**e)** $\\Delta\\lambda\\approx\\lambda^2/L_c=1.33\\ \\mathrm{nm}$；谱宽越窄，相干长度越长。" + NOTE,
  },
  {
    id: "bpho5-cyclotron-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-em",
    difficulty: 3,
    totalMarks: 25,
    context:
      "【Round 2 风格 · 回旋加速器】质子在均匀磁场 $B=0.800\\ \\mathrm T$ 中运动。两 D 形电极间的峰值加速电压为 $V=20.0\\ \\mathrm{kV}$。取 $q=1.602\\times10^{-19}\\ \\mathrm C$，$m_p=1.673\\times10^{-27}\\ \\mathrm{kg}$。",
    parts: [
      {
        label: "a",
        marks: 5,
        question:
          "由洛伦兹力提供向心力，推导非相对论回旋角频率 $\\omega=qB/m_p$，并求频率与周期。",
        solutionOutline:
          "$qvB=m_pv^2/r$ 且 $v=\\omega r$，故 $\\omega=qB/m_p=7.66\\times10^7\\ \\mathrm{rad\\,s^{-1}}$，$f=12.2\\ \\mathrm{MHz}$，$T=81.9\\ \\mathrm{ns}$。",
      },
      {
        label: "b",
        marks: 4,
        question:
          "求动能为 $2.00\\ \\mathrm{MeV}$ 的质子速率与轨道半径，并检验非相对论近似。",
        solutionOutline:
          "$v=\\sqrt{2K/m_p}=1.96\\times10^7\\ \\mathrm{m\\,s^{-1}}=0.0653c$；$r=m_pv/(qB)=0.255\\ \\mathrm m$，速度远小于 $c$。",
      },
      {
        label: "c",
        marks: 5,
        question:
          "质子每穿越一次电极间隙获得能量 $qV$。从可忽略的初始能量加速到 $2.00\\ \\mathrm{MeV}$，需穿越多少次间隙？忽略间隙飞行时间，估算总加速时间。",
        solutionOutline:
          "每次增能 $20.0\\ \\mathrm{keV}$，需 $100$ 次。相邻穿越相隔半周期，故总时间约 $100(T/2)=4.10\\ \\mu\\mathrm s$。",
      },
      {
        label: "d",
        marks: 5,
        question:
          "证明在非相对论近似下轨道半径满足 $r=\\sqrt{2m_pK}/(qB)$，并说明粒子为何形成向外展开的螺旋轨迹。",
        solutionOutline:
          "由 $p=m_pv=\\sqrt{2m_pK}$ 与 $r=p/(qB)$ 得所给式。每次过缝能量和动量增加，而磁场不变，所以半径逐次增大；D 形电极内每段仍近似半圆。",
      },
      {
        label: "e",
        marks: 6,
        question:
          "质子动能升至 $20.0\\ \\mathrm{MeV}$ 时，取静能 $m_pc^2=938\\ \\mathrm{MeV}$。求 $\\gamma$，以及相对论回旋频率相对非相对论值降低的百分比，并解释固定频率电场为何最终失谐。",
        solutionOutline:
          "$\\gamma=1+K/(m_pc^2)=1.02132$；相对论频率 $f=qB/(2\\pi\\gamma m_p)=f_0/\\gamma$，降低 $1-1/\\gamma=2.09\\%$。质量因子随能量增大，粒子过缝时刻逐渐落后于射频相位，最终不再持续加速。",
      },
    ],
    fullSolution:
      "**a)** $\\omega=qB/m_p=7.66\\times10^7\\ \\mathrm{rad\\,s^{-1}}$，$f=12.2\\ \\mathrm{MHz}$，$T=81.9\\ \\mathrm{ns}$。\n\n**b)** $v=1.96\\times10^7\\ \\mathrm{m\\,s^{-1}}$，$r=0.255\\ \\mathrm m$。\n\n**c)** 需 $100$ 次过缝，约 $4.10\\ \\mu\\mathrm s$。\n\n**d)** $r=\\sqrt{2m_pK}/(qB)$；增能使半径不断增加。\n\n**e)** $\\gamma=1.02132$，频率降低 $2.09\\%$，固定射频因相位累积漂移而失谐。" + NOTE,
  },
  {
    id: "bpho5-carnot-machines-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-thermal",
    difficulty: 3,
    totalMarks: 25,
    context:
      "【Round 2 风格 · 热机与不可逆性】热机在高温热库 $T_h=600\\ \\mathrm K$ 与低温热库 $T_c=300\\ \\mathrm K$ 之间循环工作，每循环从高温热库吸热 $Q_h=1200\\ \\mathrm J$。",
    parts: [
      {
        label: "a",
        marks: 4,
        question:
          "若热机可逆，求卡诺效率、每循环输出功与排向低温热库的热量。",
        solutionOutline:
          "$\\eta_C=1-T_c/T_h=0.500$；$W=\\eta_CQ_h=600\\ \\mathrm J$，$Q_c=Q_h-W=600\\ \\mathrm J$。",
      },
      {
        label: "b",
        marks: 5,
        question:
          "分别求两热库在一个可逆循环中的熵变，并验证总熵变为零。",
        solutionOutline:
          "$\\Delta S_h=-Q_h/T_h=-2.00\\ \\mathrm{J\\,K^{-1}}$；$\\Delta S_c=Q_c/T_c=+2.00\\ \\mathrm{J\\,K^{-1}}$，工作物质回到初态，故宇宙总熵变为零。",
      },
      {
        label: "c",
        marks: 5,
        question:
          "某实际热机在同样吸热条件下每循环只输出 $450\\ \\mathrm J$。求效率、排热量和宇宙总熵增。",
        solutionOutline:
          "$\\eta=450/1200=0.375$；$Q_c=750\\ \\mathrm J$；$\\Delta S_{\\rm univ}=-1200/600+750/300=0.500\\ \\mathrm{J\\,K^{-1}}>0$。",
      },
      {
        label: "d",
        marks: 5,
        question:
          "把可逆机器反向作为制冷机。推导性能系数 $\\mathrm{COP}_R=T_c/(T_h-T_c)$。若每循环从低温库取走 $900\\ \\mathrm J$，求所需功和排向高温库的热量。",
        solutionOutline:
          "可逆性给 $Q_h/T_h=Q_c/T_c$，且 $W=Q_h-Q_c$，故 $Q_c/W=T_c/(T_h-T_c)=1.00$。于是 $W=900\\ \\mathrm J$，$Q_h=1800\\ \\mathrm J$。",
      },
      {
        label: "e",
        marks: 6,
        question:
          "解释卡诺效率为何不是 $100\\%$。若实际热机每分钟运行 $20$ 个循环，求平均输出功率；并说明提高循环频率为何不保证效率不变。",
        solutionOutline:
          "循环热机必须向较冷热库排出熵，有限 $T_c$ 时不能把全部热量转为功。实际机每循环输出 $450\\ \\mathrm J$，故功率 $450\\times20/60=150\\ \\mathrm W$。更快运行会增大有限温差传热、摩擦和流动损失，通常增加熵产生并降低效率。",
      },
    ],
    fullSolution:
      "**a)** $\\eta_C=0.500$，$W=600\\ \\mathrm J$，$Q_c=600\\ \\mathrm J$。\n\n**b)** 两热库熵变分别为 $-2.00$ 与 $+2.00\\ \\mathrm{J\\,K^{-1}}$。\n\n**c)** 实际效率 $0.375$，排热 $750\\ \\mathrm J$，总熵增 $0.500\\ \\mathrm{J\\,K^{-1}}$。\n\n**d)** $\\mathrm{COP}_R=1.00$；移走 $900\\ \\mathrm J$ 需功 $900\\ \\mathrm J$，向热库排出 $1800\\ \\mathrm J$。\n\n**e)** 平均功率 $150\\ \\mathrm W$；加速循环会增强不可逆损失。" + NOTE,
  },
  {
    id: "bpho5-radioisotope-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-modern",
    difficulty: 3,
    totalMarks: 25,
    context:
      "【Round 2 风格 · 放射性示踪】某放射性核素半衰期 $T_{1/2}=6.00\\ \\mathrm h$，摩尔质量 $60.0\\ \\mathrm{g\\,mol^{-1}}$，每次衰变释放可吸收能量 $2.00\\ \\mathrm{MeV}$。样品初始质量 $1.00\\ \\mu\\mathrm g$，取 $N_A=6.022\\times10^{23}\\ \\mathrm{mol^{-1}}$。",
    parts: [
      {
        label: "a",
        marks: 5,
        question:
          "求初始核数、衰变常数（以 $\\mathrm{s^{-1}}$ 表示）和初始活度。",
        solutionOutline:
          "$N_0=(10^{-6}/60.0)N_A=1.00\\times10^{16}$；$\\lambda=\\ln2/(21600\\ \\mathrm s)=3.21\\times10^{-5}\\ \\mathrm{s^{-1}}$；$A_0=\\lambda N_0=3.22\\times10^{11}\\ \\mathrm{Bq}$。",
      },
      {
        label: "b",
        marks: 4,
        question:
          "求 $18.0\\ \\mathrm h$ 后剩余母核比例、活度，以及已衰变核的比例。",
        solutionOutline:
          "经过三个半衰期，母核与活度均为初值的 $1/8$，故 $A=4.03\\times10^{10}\\ \\mathrm{Bq}$；已有 $7/8=87.5\\%$ 衰变。",
      },
      {
        label: "c",
        marks: 5,
        question:
          "取 $1\\ \\mathrm{eV}=1.602\\times10^{-19}\\ \\mathrm J$，求样品若最终全部衰变所释放的总能量与初始热功率。",
        solutionOutline:
          "单次能量 $3.204\\times10^{-13}\\ \\mathrm J$；总能量 $N_0E=3.22\\times10^3\\ \\mathrm J$。初始功率 $A_0E=0.103\\ \\mathrm W$。",
      },
      {
        label: "d",
        marks: 5,
        question:
          "某屏蔽材料的半值层厚度为 $1.50\\ \\mathrm{cm}$。至少需要多厚才能把未屏蔽计数率降低到 $10^{-3}$ 以下？",
        solutionOutline:
          "透射比例 $2^{-x/1.50\\mathrm{cm}}\\le10^{-3}$，故 $x\\ge1.50\\log_2(1000)=14.95\\ \\mathrm{cm}$，实际至少取约 $15.0\\ \\mathrm{cm}$。",
      },
      {
        label: "e",
        marks: 6,
        question:
          "该核素衰变为稳定子核。若初始无子核，某时测得母核数与子核数之比为 $1:7$，求样品年龄。说明若初始已有子核，为什么这种定年会高估年龄。",
        solutionOutline:
          "核总数守恒，$N_p/N_0=1/(1+7)=1/8=2^{-3}$，故年龄为三个半衰期，即 $18.0\\ \\mathrm h$。若初始已有子核，观测到的子核并非全由母核衰变产生；误把它们全部计入会推断出过多衰变，从而高估年龄。",
      },
    ],
    fullSolution:
      "**a)** $N_0=1.00\\times10^{16}$，$\\lambda=3.21\\times10^{-5}\\ \\mathrm{s^{-1}}$，$A_0=3.22\\times10^{11}\\ \\mathrm{Bq}$。\n\n**b)** $18.0\\ \\mathrm h$ 后剩余 $1/8$，活度 $4.03\\times10^{10}\\ \\mathrm{Bq}$，已衰变 $87.5\\%$。\n\n**c)** 总能量 $3.22\\times10^3\\ \\mathrm J$，初始热功率 $0.103\\ \\mathrm W$。\n\n**d)** 屏蔽厚度至少约 $15.0\\ \\mathrm{cm}$。\n\n**e)** $1:7$ 对应剩余 $1/8$，年龄 $18.0\\ \\mathrm h$；初始子核会导致年龄高估。" + NOTE,
  },
];
