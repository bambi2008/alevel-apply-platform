// BPhO Round 2 风格原创长题第三批：五条主线各一题。
// 题目按“基本模型 -> 推导 -> 数值 -> 物理解读”递进；全部数值已用独立 Node 脚本核对。
import type { LongQuestion } from "./types";

export const BPHO3_LONG_SAMPLE: LongQuestion[] = [
  {
    id: "bpho3-coupled-oscillators-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-mechanics",
    difficulty: 3,
    totalMarks: 25,
    context:
      "【Round 2 风格 · 阶梯式长题】两个相同小车各有质量 $m=0.50\\ \\mathrm{kg}$，在水平无摩擦轨道上运动。每辆小车分别用劲度系数 $k=20\\ \\mathrm{N\\,m^{-1}}$ 的弹簧连接到相邻墙壁，两车之间再用劲度系数 $k_c=10\\ \\mathrm{N\\,m^{-1}}$ 的弹簧连接。三根弹簧在 $x_1=x_2=0$ 时均为自然长度。设向右位移分别为 $x_1,x_2$。",
    parts: [
      {
        label: "a",
        marks: 4,
        question: "分别对两辆小车应用牛顿第二定律，写出关于 $x_1,x_2$ 的两个耦合运动方程。",
        solutionOutline:
          "左车受力 $-kx_1-k_c(x_1-x_2)$，右车受力 $-kx_2-k_c(x_2-x_1)$。故 $m\\ddot x_1=-(k+k_c)x_1+k_cx_2$，$m\\ddot x_2=k_cx_1-(k+k_c)x_2$。",
      },
      {
        label: "b",
        marks: 4,
        question: "第一种简正模式中两车始终同相且等位移，即 $x_1=x_2=x$。求角频率 $\\omega_1$、周期 $T_1$，并解释中间弹簧为何不影响该模式。",
        solutionOutline:
          "$x_1-x_2=0$，中间弹簧不伸缩。方程化为 $m\\ddot x=-kx$，故 $\\omega_1=\\sqrt{k/m}=6.32\\ \\mathrm{rad\\,s^{-1}}$，$T_1=2\\pi/\\omega_1=0.993\\ \\mathrm{s}$。",
      },
      {
        label: "c",
        marks: 4,
        question: "第二种简正模式中两车反相且 $x_1=-x_2=x$。求 $\\omega_2$ 与 $T_2$，并说明为什么它的频率更高。",
        solutionOutline:
          "中间弹簧伸长为 $2x$，回复力给出 $m\\ddot x=-(k+2k_c)x$。$\\omega_2=\\sqrt{(k+2k_c)/m}=8.94\\ \\mathrm{rad\\,s^{-1}}$，$T_2=0.702\\ \\mathrm{s}$。额外回复力使有效劲度更大。",
      },
      {
        label: "d",
        marks: 5,
        question: "初始时只把左车向右拉开 $A$ 后由静止释放：$x_1(0)=A,x_2(0)=0,\\dot x_1(0)=\\dot x_2(0)=0$。把初始形状分解为同相与反相模式，证明 $x_1=\\dfrac A2(\\cos\\omega_1t+\\cos\\omega_2t)$，$x_2=\\dfrac A2(\\cos\\omega_1t-\\cos\\omega_2t)$。",
        solutionOutline:
          "$(A,0)=\\tfrac A2(1,1)+\\tfrac A2(1,-1)$。两模式均从最大位移静止释放，分别乘 $\\cos\\omega_1t$ 与 $\\cos\\omega_2t$ 后相加，立即得到两式，并满足四个初始条件。",
      },
      {
        label: "e",
        marks: 5,
        question: "用和差化积说明振幅会在两车之间缓慢转移。求第一次出现“左车振幅包络为零、右车振幅包络最大”的时间，并说明实际快速振动为何仍叠加在包络上。",
        solutionOutline:
          "$x_1=A\\cos[(\\omega_1+\\omega_2)t/2]\\cos[(\\omega_2-\\omega_1)t/2]$，$x_2=A\\sin[(\\omega_1+\\omega_2)t/2]\\sin[(\\omega_2-\\omega_1)t/2]$（整体符号不影响包络）。首次转移时间 $t=\\pi/(\\omega_2-\\omega_1)=1.20\\ \\mathrm{s}$。平均频率控制快振动，频差控制慢包络。",
      },
      {
        label: "f",
        marks: 3,
        question: "若耦合很弱，即 $k_c\\ll k$，利用 $\\sqrt{1+\\epsilon}\\approx1+\\epsilon/2$ 证明 $\\omega_2-\\omega_1\\approx k_c/\\sqrt{km}$。由此说明减弱耦合会怎样改变能量转移时间。",
        solutionOutline:
          "$\\omega_2=\\sqrt{k/m}\\sqrt{1+2k_c/k}\\approx\\omega_1(1+k_c/k)$，故频差 $\\approx k_c/\\sqrt{km}$。转移时间 $\\pi/(\\omega_2-\\omega_1)\\propto1/k_c$，耦合越弱，能量交换越慢。",
      },
    ],
    fullSolution:
      "**a)** $m\\ddot x_1=-(k+k_c)x_1+k_cx_2$，$m\\ddot x_2=k_cx_1-(k+k_c)x_2$。\\n\\n**b)** 同相时耦合弹簧不伸缩：$\\omega_1=\\sqrt{k/m}=6.32\\ \\mathrm{rad\\,s^{-1}}$，$T_1=0.993\\ \\mathrm{s}$。\\n\\n**c)** 反相时中间弹簧伸长 $2x$：$\\omega_2=\\sqrt{(k+2k_c)/m}=8.94\\ \\mathrm{rad\\,s^{-1}}$，$T_2=0.702\\ \\mathrm{s}$。\\n\\n**d)** 初始形状是等幅同相模式与反相模式之和，故 $x_1=\\tfrac A2(\\cos\\omega_1t+\\cos\\omega_2t)$，$x_2=\\tfrac A2(\\cos\\omega_1t-\\cos\\omega_2t)$。\\n\\n**e)** 和差化积后可见快振动角频率约为 $(\\omega_1+\\omega_2)/2$，包络角频率为 $(\\omega_2-\\omega_1)/2$。第一次包络转移在 $t=\\pi/(\\omega_2-\\omega_1)=1.20\\ \\mathrm{s}$。\\n\\n**f)** 弱耦合展开得 $\\omega_2-\\omega_1\\approx k_c/\\sqrt{km}$，所以耦合减半会使转移时间约加倍。\\n\\n---\\n*原创阶梯长题；数值已独立核对；请对照解答自评。*",
  },
  {
    id: "bpho3-diffraction-grating-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-waves",
    difficulty: 3,
    totalMarks: 25,
    context:
      "【Round 2 风格 · 阶梯式长题】一块透射光栅的相邻狭缝间距为 $d=2.00\\ \\mu\\mathrm m$。一束含两条很接近的黄光谱线 $\\lambda_1=589.0\\ \\mathrm{nm}$、$\\lambda_2=589.6\\ \\mathrm{nm}$ 垂直入射。设照亮的狭缝数为 $N$，小角差可用弧度表示。",
    parts: [
      {
        label: "a",
        marks: 3,
        question: "从相邻狭缝的光程差出发写出主极大的光栅方程，并求 $589.0\\ \\mathrm{nm}$ 光可能出现的最高级次。",
        solutionOutline:
          "相邻光程差 $d\\sin\\theta$ 等于整数个波长：$d\\sin\\theta=m\\lambda$。因 $\\sin\\theta\\le1$，$m\\le d/\\lambda=3.40$，故最高为三级。",
      },
      {
        label: "b",
        marks: 4,
        question: "求 $\\lambda_1$ 的二级主极大角度 $\\theta$。",
        solutionOutline:
          "$\\sin\\theta=2(589.0\\times10^{-9})/(2.00\\times10^{-6})=0.5890$，故 $\\theta=36.1^\\circ$。",
      },
      {
        label: "c",
        marks: 5,
        question: "对 $d\\sin\\theta=m\\lambda$ 作微小变化，推导同一级次两条谱线的角间隔 $\\Delta\\theta\\approx m\\Delta\\lambda/(d\\cos\\theta)$，并计算二级谱线的角间隔。",
        solutionOutline:
          "$d\\cos\\theta\\,\\Delta\\theta=m\\Delta\\lambda$。取 $\\cos36.1^\\circ=0.808$，$\\Delta\\lambda=0.6\\ \\mathrm{nm}$，得 $\\Delta\\theta=7.43\\times10^{-4}\\ \\mathrm{rad}=0.0426^\\circ$。",
      },
      {
        label: "d",
        marks: 5,
        question: "有限的 $N$ 个等间距狭缝使主极大具有宽度。已知主极大中心到相邻第一极小的角宽约为 $\\delta\\theta=\\lambda/(Nd\\cos\\theta)$。结合 c) 推导光栅的分辨本领 $\\mathcal R=\\lambda/\\Delta\\lambda=mN$。",
        solutionOutline:
          "按瑞利判据，刚好分辨时 $\\Delta\\theta\\approx\\delta\\theta$。令 $m\\Delta\\lambda/(d\\cos\\theta)=\\lambda/(Nd\\cos\\theta)$，约去共同因子得 $\\lambda/\\Delta\\lambda=mN$。",
      },
      {
        label: "e",
        marks: 4,
        question: "要在二级光谱中刚好分辨这两条黄线，至少需照亮多少条狭缝？",
        solutionOutline:
          "$N\\ge\\lambda/(m\\Delta\\lambda)=589.0/(2\\times0.6)=490.8$，狭缝数必须为整数，故至少 $491$ 条。",
      },
      {
        label: "f",
        marks: 4,
        question: "若入射光束只照亮光栅上 $1.00\\ \\mathrm{mm}$ 的宽度，它能否在二级分辨两线？同时说明主极大峰值强度为何随 $N^2$ 增长，而所有方向积分后的总能量不能随 $N^2$ 增长。",
        solutionOutline:
          "$N=W/d=1.00\\times10^{-3}/2.00\\times10^{-6}=500$，$mN=1000>589/0.6=982$，可以但余量很小。主极大处场振幅同相相加为 $N$ 倍，峰值强度为 $N^2$；但峰宽约按 $1/N$ 缩窄，积分能量仍只与入射总功率（约 $N$）相符。",
      },
    ],
    fullSolution:
      "**a)** $d\\sin\\theta=m\\lambda$；$d/\\lambda_1=3.40$，最高三级。\\n\\n**b)** 二级满足 $\\sin\\theta=0.5890$，$\\theta=36.1^\\circ$。\\n\\n**c)** 微分光栅方程得 $\\Delta\\theta=m\\Delta\\lambda/(d\\cos\\theta)=7.43\\times10^{-4}\\ \\mathrm{rad}$。\\n\\n**d)** 把谱线角间隔与有限孔径的主峰半宽按瑞利判据相等，得到 $\\mathcal R=\\lambda/\\Delta\\lambda=mN$。\\n\\n**e)** $N_{\\min}=\\lceil589/(2\\times0.6)\\rceil=491$。\\n\\n**f)** $1.00\\ \\mathrm{mm}$ 覆盖 $500$ 条缝，二级分辨本领 $1000$，略高于所需 $982$。峰高 $\\propto N^2$，峰宽 $\\propto1/N$，所以总能量不违背守恒。\\n\\n---\\n*原创阶梯长题；数值已独立核对；请对照解答自评。*",
  },
  {
    id: "bpho3-coaxial-capacitor-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-em",
    difficulty: 3,
    totalMarks: 25,
    context:
      "【Round 2 风格 · 阶梯式长题】一段空气绝缘同轴电缆由半径 $a=1.00\\ \\mathrm{mm}$ 的内导体和内半径 $b=5.00\\ \\mathrm{mm}$ 的外导体组成，长度 $L=2.00\\ \\mathrm m$，忽略端部效应。真空介电常数 $\\varepsilon_0=8.85\\times10^{-12}\\ \\mathrm{F\\,m^{-1}}$。内导体带单位长度电荷 $+\\lambda$，外导体带相反电荷。",
    parts: [
      {
        label: "a",
        marks: 4,
        question: "取半径 $r$、长度 $\\ell$ 的同轴圆柱高斯面（$a<r<b$），用高斯定律证明电场大小为 $E(r)=\\lambda/(2\\pi\\varepsilon_0r)$。",
        solutionOutline:
          "电场在高斯面上径向且等大，通量 $E(2\\pi r\\ell)$；包围电荷为 $\\lambda\\ell$。由 $E(2\\pi r\\ell)=\\lambda\\ell/\\varepsilon_0$ 得所求。",
      },
      {
        label: "b",
        marks: 4,
        question: "由 $V=\\int_a^b E(r)\\,dr$ 推导两导体间电势差 $V=\\dfrac{\\lambda}{2\\pi\\varepsilon_0}\\ln(b/a)$。",
        solutionOutline:
          "积分 $\\int_a^b dr/r=\\ln(b/a)$，故内导体相对外导体电势为 $V=\\lambda\\ln(b/a)/(2\\pi\\varepsilon_0)$。",
      },
      {
        label: "c",
        marks: 4,
        question: "由 $C=Q/V$ 推导这段电缆的电容，并计算数值。",
        solutionOutline:
          "$Q=\\lambda L$，故 $C=2\\pi\\varepsilon_0L/\\ln(b/a)=6.91\\times10^{-11}\\ \\mathrm F=69.1\\ \\mathrm{pF}$。",
      },
      {
        label: "d",
        marks: 5,
        question: "把电缆接到 $1000\\ \\mathrm V$ 电源。求内导体电荷量，以及绝缘层中的最大电场强度和它出现的位置。",
        solutionOutline:
          "$Q=CV=6.91\\times10^{-8}\\ \\mathrm C$，$\\lambda=Q/L=3.46\\times10^{-8}\\ \\mathrm{C\\,m^{-1}}$。因 $E\\propto1/r$，最大值在 $r=a$：$E_{\\max}=\\lambda/(2\\pi\\varepsilon_0a)=6.21\\times10^5\\ \\mathrm{V\\,m^{-1}}$。",
      },
      {
        label: "e",
        marks: 5,
        question: "先用 $U=\\tfrac12CV^2$ 求储能；再从电场能量密度 $u=\\tfrac12\\varepsilon_0E^2$ 出发，对体积元 $d\\mathcal V=2\\pi rL\\,dr$ 积分，验证得到同一结果。",
        solutionOutline:
          "$U=3.46\\times10^{-5}\\ \\mathrm J$。积分得 $U=\\int_a^b\\tfrac12\\varepsilon_0[\\lambda/(2\\pi\\varepsilon_0r)]^2(2\\pi rL)dr=\\lambda^2L\\ln(b/a)/(4\\pi\\varepsilon_0)=\\tfrac12QV=\\tfrac12CV^2$。",
      },
      {
        label: "f",
        marks: 3,
        question: "若在两导体间完全填入相对介电常数 $\\varepsilon_r=2.5$ 的绝缘体，说明电容如何变化；并分别讨论保持电压不变与先断开电源保持电荷不变时，储能如何变化。",
        solutionOutline:
          "$C'=\\varepsilon_rC$。恒压时 $U'=\\tfrac12C'V^2=2.5U$，增加的能量由电源提供；恒电荷时 $U'=Q^2/(2C')=U/2.5$，减少的场能转化为把介质吸入的机械功等。",
      },
    ],
    fullSolution:
      "**a)** 高斯定律给 $E(2\\pi r\\ell)=\\lambda\\ell/\\varepsilon_0$，所以 $E=\\lambda/(2\\pi\\varepsilon_0r)$。\\n\\n**b)** 从 $a$ 到 $b$ 积分得 $V=\\lambda\\ln(b/a)/(2\\pi\\varepsilon_0)$。\\n\\n**c)** $C=2\\pi\\varepsilon_0L/\\ln(b/a)=69.1\\ \\mathrm{pF}$。\\n\\n**d)** $Q=69.1\\ \\mathrm{nC}$；最大场在内导体表面，为 $6.21\\times10^5\\ \\mathrm{V\\,m^{-1}}$。\\n\\n**e)** $U=\\tfrac12CV^2=3.46\\times10^{-5}\\ \\mathrm J$；场能密度的圆柱壳积分同样给出 $\\lambda^2L\\ln(b/a)/(4\\pi\\varepsilon_0)$。\\n\\n**f)** 填充介质使 $C$ 乘 $2.5$；恒压储能乘 $2.5$，恒电荷储能除以 $2.5$。\\n\\n---\\n*原创阶梯长题；数值已独立核对；请对照解答自评。*",
  },
  {
    id: "bpho3-adiabatic-atmosphere-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-thermal",
    difficulty: 3,
    totalMarks: 25,
    context:
      "【Round 2 风格 · 阶梯式长题】把干燥大气近似为理想气体，并设上升气团变化足够快，来不及与环境交换热量。空气摩尔质量 $M=0.0290\\ \\mathrm{kg\\,mol^{-1}}$，绝热指数 $\\gamma=1.40$，$R=8.31\\ \\mathrm{J\\,mol^{-1}K^{-1}}$，$g=9.81\\ \\mathrm{m\\,s^{-2}}$。海平面温度 $T_0=288\\ \\mathrm K$。",
    parts: [
      {
        label: "a",
        marks: 4,
        question: "考虑厚度 $dz$ 的水平空气薄层，从竖直方向受力平衡证明 $dp/dz=-\\rho g$；再用理想气体方程写出 $\\rho$ 关于 $p,T,M,R$ 的表达式。",
        solutionOutline:
          "上下表面压力差平衡重量：$pA-(p+dp)A=\\rho A dz\\,g$，故 $dp/dz=-\\rho g$。每摩尔质量为 $M$，由 $pV=nRT$ 得 $\\rho=Mn/V=Mp/(RT)$。",
      },
      {
        label: "b",
        marks: 5,
        question: "气团绝热变化满足 $p\\rho^{-\\gamma}=\\text{常量}$。结合 a) 推导干绝热温度递减率 $dT/dz=-\\dfrac{\\gamma-1}{\\gamma}\\dfrac{Mg}{R}$。",
        solutionOutline:
          "由 $p\\rho^{-\\gamma}=常量$ 得 $dp/p=\\gamma\\,d\\rho/\\rho$；由 $p=\\rho RT/M$ 得 $dp/p=d\\rho/\\rho+dT/T$。消去 $d\\rho/\\rho$ 得 $dT/T=(\\gamma-1)dp/(\\gamma p)$。再代入 $dp/dz=-Mp g/(RT)$，得到所求常数递减率。",
      },
      {
        label: "c",
        marks: 4,
        question: "计算干绝热递减率（以 $\\mathrm{K\\,km^{-1}}$ 表示），并估算高度 $5.00\\ \\mathrm{km}$ 处的温度。",
        solutionOutline:
          "$\\Gamma_d=(0.4/1.4)(0.0290\\times9.81/8.31)=9.78\\times10^{-3}\\ \\mathrm{K\\,m^{-1}}=9.78\\ \\mathrm{K\\,km^{-1}}$。$T=288-9.78\\times5=239\\ \\mathrm K$。",
      },
      {
        label: "d",
        marks: 4,
        question: "由绝热关系与理想气体方程证明 $p/p_0=(T/T_0)^{\\gamma/(\\gamma-1)}$，并求 $5.00\\ \\mathrm{km}$ 处的压强与海平面压强之比。",
        solutionOutline:
          "绝热关系可写 $T\\rho^{1-\\gamma}=常量$，从而 $p\\propto T^{\\gamma/(\\gamma-1)}$。代入 $T/T_0=239.1/288$，得 $p/p_0=0.521$。",
      },
      {
        label: "e",
        marks: 4,
        question: "另一模型把整层大气视为恒温 $288\\ \\mathrm K$。证明其压强标高 $H=RT_0/(Mg)$，即 $p/p_0=e^{-z/H}$；计算 $H$ 与 $5.00\\ \\mathrm{km}$ 处的压强比，并与 d) 比较。",
        solutionOutline:
          "把 $\\rho=Mp/(RT_0)$ 代入静力方程：$dp/p=-Mg\\,dz/(RT_0)$。积分得 $H=8410\\ \\mathrm m$，$p/p_0=e^{-5000/8410}=0.552$。绝热模型因温度随高下降，密度相对更大，压强下降略快。",
      },
      {
        label: "f",
        marks: 4,
        question: "现实中潮湿空气上升冷却的速率通常小于干绝热值。解释水汽凝结如何改变气团的能量收支，并说明这与云的形成有什么联系。",
        solutionOutline:
          "上升膨胀使气团冷却；达到露点后水汽凝结并释放潜热，补偿一部分膨胀做功，因此温度下降较慢。凝结产生微小水滴或冰晶，即形成可见云；持续潜热释放也可增强浮力与对流。",
      },
    ],
    fullSolution:
      "**a)** 薄层受力平衡给 $dp/dz=-\\rho g$；理想气体给 $\\rho=Mp/(RT)$。\\n\\n**b)** 联立 $dp/p=\\gamma d\\rho/\\rho$ 与 $dp/p=d\\rho/\\rho+dT/T$，再用静力方程，得 $dT/dz=-[(\\gamma-1)/\\gamma]Mg/R$。\\n\\n**c)** 干绝热递减率为 $9.78\\ \\mathrm{K\\,km^{-1}}$；$5.00\\ \\mathrm{km}$ 处约 $239\\ \\mathrm K$。\\n\\n**d)** $p/p_0=(T/T_0)^{3.5}=0.521$。\\n\\n**e)** 恒温模型 $H=RT_0/(Mg)=8.41\\ \\mathrm{km}$，$p/p_0=0.552$；它比绝热模型下降稍慢。\\n\\n**f)** 凝结潜热抵消部分绝热冷却，令湿空气温降较慢；凝结出的水滴或冰晶构成云。\\n\\n---\\n*原创阶梯长题；数值已独立核对；请对照解答自评。*",
  },
  {
    id: "bpho3-compton-scattering-001",
    type: "long",
    testId: "bpho",
    topicId: "bpho-modern",
    difficulty: 3,
    totalMarks: 25,
    context:
      "【Round 2 风格 · 阶梯式长题】波长 $\\lambda=0.0710\\ \\mathrm{nm}$ 的 X 射线光子撞击一个初始静止的自由电子。散射光子偏转角为 $\\theta$，波长变为 $\\lambda'$。可用 $E_\\gamma=pc=hc/\\lambda$，电子相对论关系 $E_e^2=p_e^2c^2+m_e^2c^4$，$h/(m_ec)=2.43\\ \\mathrm{pm}$，$hc=1240\\ \\mathrm{eV\\,nm}$。",
    parts: [
      {
        label: "a",
        marks: 4,
        question: "分别写出碰撞前后的总能量守恒式和二维动量守恒关系。令入射方向为 $x$ 轴。",
        solutionOutline:
          "能量：$hc/\\lambda+m_ec^2=hc/\\lambda'+E_e$。动量分量：$h/\\lambda=(h/\\lambda')\\cos\\theta+p_{ex}$，$0=(h/\\lambda')\\sin\\theta+p_{ey}$。",
      },
      {
        label: "b",
        marks: 6,
        question: "把电子动量平方写成光子动量矢量之差的平方，再结合电子相对论能量关系，推导康普顿公式 $\\lambda'-\\lambda=\\dfrac{h}{m_ec}(1-\\cos\\theta)$。",
        solutionOutline:
          "$p_e^2=p^2+p'^2-2pp'\\cos\\theta$。能量守恒给 $E_e=m_ec^2+pc-p'c$。平方后代入 $E_e^2=p_e^2c^2+m_e^2c^4$，消去 $p^2c^2,p'^2c^2$，得到 $m_ec(p-p')=pp'(1-\\cos\\theta)$。再用 $p=h/\\lambda,p'=h/\\lambda'$ 化简即得。",
      },
      {
        label: "c",
        marks: 4,
        question: "对 $\\theta=90^\\circ$ 的散射，求波长改变量与散射后波长。",
        solutionOutline:
          "$1-\\cos90^\\circ=1$，故 $\\Delta\\lambda=2.43\\ \\mathrm{pm}=0.00243\\ \\mathrm{nm}$，$\\lambda'=0.07343\\ \\mathrm{nm}$。",
      },
      {
        label: "d",
        marks: 4,
        question: "求入射与散射光子的能量，并由能量守恒求反冲电子的动能。",
        solutionOutline:
          "$E_i=1240/0.0710=17.5\\ \\mathrm{keV}$；$E_f=1240/0.07343=16.9\\ \\mathrm{keV}$。电子动能 $K=E_i-E_f\\approx0.577\\ \\mathrm{keV}=577\\ \\mathrm{eV}$。",
      },
      {
        label: "e",
        marks: 4,
        question: "因 $K\\ll m_ec^2=511\\ \\mathrm{keV}$，可用非相对论式 $K=\\tfrac12m_ev^2$。取 $m_e=9.11\\times10^{-31}\\ \\mathrm{kg}$，求电子速度并检验非相对论近似是否合理。",
        solutionOutline:
          "$K=577\\times1.602\\times10^{-19}=9.24\\times10^{-17}\\ \\mathrm J$，$v=\\sqrt{2K/m_e}=1.42\\times10^7\\ \\mathrm{m\\,s^{-1}}=0.0475c$。远小于 $c$，近似合理。",
      },
      {
        label: "f",
        marks: 3,
        question: "散射角取何值时波长改变量最大？求最大改变量，并说明康普顿位移为何与入射波长无关。",
        solutionOutline:
          "$1-\\cos\\theta$ 在 $\\theta=180^\\circ$ 时最大为 2，故 $\\Delta\\lambda_{\\max}=2h/(m_ec)=4.86\\ \\mathrm{pm}$。位移只由电子的基本尺度 $h/(m_ec)$ 与散射几何决定，入射波长只影响相对改变量及能量转移比例。",
      },
    ],
    fullSolution:
      "**a)** $hc/\\lambda+m_ec^2=hc/\\lambda'+E_e$，并在两个方向分别守恒动量。\\n\\n**b)** 由 $p_e^2=p^2+p'^2-2pp'\\cos\\theta$ 和相对论能量关系消去电子变量，得到 $m_ec(p-p')=pp'(1-\\cos\\theta)$；代入 $p=h/\\lambda$ 即得 $\\lambda'-\\lambda=h(1-\\cos\\theta)/(m_ec)$。\\n\\n**c)** $90^\\circ$ 时位移 $2.43\\ \\mathrm{pm}$，$\\lambda'=0.07343\\ \\mathrm{nm}$。\\n\\n**d)** $E_i=17.5\\ \\mathrm{keV}$，$E_f=16.9\\ \\mathrm{keV}$，反冲电子 $K\\approx577\\ \\mathrm{eV}$。\\n\\n**e)** $v=1.42\\times10^7\\ \\mathrm{m\\,s^{-1}}=0.0475c$，非相对论动能式足够准确。\\n\\n**f)** 背向散射给最大位移 $4.86\\ \\mathrm{pm}$；它由电子康普顿波长与几何角度决定。\\n\\n---\\n*原创阶梯长题；数值已独立核对；请对照解答自评。*",
  },
];
