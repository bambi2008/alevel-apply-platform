import type { AdmissionsTest } from "./index";
import { EXAM_SCOPE_NOTES } from "./syllabus-release";

const descriptions:Record<string,string> = {
  "esat-math1":"M1–M7：数与单位、比例、代数、几何、统计和基础概率；不含微积分。",
  "esat-math2":"MM1/MM4–MM7：代数、指数对数、基本三角、有理幂函数微分与积分；不要求链式/乘积/商法则、复数或矩阵。",
  "esat-math3":"MM2–MM4/MM8：数列、正整数二项展开、坐标几何、基本三角和图像。",
  "esat-phys1":"P3：一维运动、速度加速度、牛顿定律、力和动量；不把圆周运动或二维抛体作为必备方法。",
  "esat-chem1":"C1/C6：原子粒子、前20元素的壳层排布、离子/共价/金属键；不要求轨道排布或分子形状理论。",
  "esat-chem2":"C13：碳氢化合物、醇、羧酸、酯与聚合物；不要求大学反应机理。",
  "esat-bio1":"B1/B2/B3/B5/B8：细胞、跨膜运输、细胞分裂、遗传信息与酶的基本作用。",
  "esat-bio3":"B9/B11：人体系统、呼吸和光合作用的总体过程与限制因素；不要求分子反应途径。",
  "tmua-calc":"MM6/MM7：有理幂及其和差的微分与积分、梯形法；不要求指数/三角求导或一般微分方程。",
  "tmua-stats":"M6/M7：数据表示、平均数中位数众数、四分位距、基础概率和预期频数；不要求方差或随机变量分布。",
  "tmua-logic":"直接证明、分类讨论、反证、反例与必要/充分条件；不要求数学归纳法。",
  "mat-calc":"历史范围：幂函数及和差求导、指数函数导数、幂函数积分和面积；不要求一般微分方程或旋转体体积。",
  "mat-logic":"基于给定条件的推理和反例，不把额外高级证明技术当作先验要求。",
  "step-pure5":"STEP 2：2×2 矩阵、行列式、逆矩阵、变换与不变直线；STEP 3 另含3×3。不要求未提供引导的特征值/对角化。",
  "bpho-thermal":"范围受限训练：气体、热量、状态变化与热传递；未核实的卡诺循环等大学级前置方法不进入新题组。",
  "bpho-modern":"范围受限训练：光电、核物理和数量级估算；未核实的相对论前置方法不进入新题组。",
  "csat-algorithms":"给定简单规则的搜索、递归、增长率与推理训练；不要求未提供定义的专业算法。",
  "csat-graphs":"题目给定规则的路径、树和网络推理训练；不是经核实的当前 CSAT 全部知识要求。",
};
const titles:Record<string,[string,string]> = {
  "esat-math1":["数学1 — 基础数学（无微积分）","Mathematics 1"],
  "esat-math2":["数学2 — 代数与幂函数微积分","Mathematics 2: Algebra & Power Calculus"],
  "esat-math3":["数学2 — 几何、数列与三角","Mathematics 2: Geometry & Sequences"],
  "step-pure5":["矩阵与变换（分 STEP 2/3）","Matrices & Transformations (STEP 2/3)"],
};
export function withSyllabusMetadata(test:AdmissionsTest):AdmissionsTest {
  const topics=test.topics.filter(t=>!["esat-math2a","esat-math2b"].includes(t.id)).map(t=>({
    ...t, description:descriptions[t.id] ?? t.description,
    ...(titles[t.id] ? {title:titles[t.id][0],titleEn:titles[t.id][1]} : {}),
  }));
  let revised={...test,topics,statusNote:EXAM_SCOPE_NOTES[test.id] ?? test.statusNote};
  if(test.id==="esat") revised={...revised,
    formatZh:"多数课程要求 Mathematics 1，加课程指定的另外两个模块；各27题、40分钟，独立计时。预约前核对目标课程要求。",
    studyPlan:[
      {week:"第1–2周",focus:"确认模块与基础",tasks:["核对课程指定模块","按官方 M1–M7 复习 Mathematics 1（无微积分）","完成官方对应模块样题"]},
      {week:"第3–4周",focus:"分模块训练",tasks:["只练目标课程要求的科目","Math 2 微积分限有理幂及和差","对照官方条目标记薄弱点"]},
      {week:"第5–6周",focus:"限时与复盘",tasks:["每个模块单独练27题/40分钟","区分知识、单位与计算失误","旧ENGAA/NSAA题只使用官方标明仍适用的部分"]},
      {week:"第7–8周",focus:"三模块连做",tasks:["按所需三模块独立计时","保留错题并回查对应考纲","训练题不代表官方难度或完整覆盖"]},
    ],
    tips:["每模块27题/40分钟，答错不倒扣。","Math 1 不含微积分；不可混入 Math 2 题目。","旧 ENGAA/NSAA 不等同 ESAT，只使用官方标明仍适用的题。","模块由目标课程指定，以考试机构与院校官网为准。"],
  };
  if(test.id==="tmua") revised={...revised,
    structureDetails:"两卷各20题、75分钟，不用计算器。知识要求以官方 M/MM 条目为限，不等同整个 A-Level 数学；Paper 2 另考日常语言数学推理与证明。",
    studyPlan:[
      {week:"第1–3周",focus:"规定知识范围",tasks:["复习 M1–M7 与 MM1–MM8","基础数据与概率，不混入概率分布或方差","有理幂微积分专项"]},
      {week:"第4–6周",focus:"推理与证明",tasks:["直接证明、分类讨论、反证与反例","必要条件与充分条件","完成官方样卷"]},
      {week:"第7–8周",focus:"限时与复盘",tasks:["两卷各75分钟","回查错题方法是否在规定范围","训练难度须以官方样题校准"]},
    ],
  };
  if(["mat","pat","csat","bpho"].includes(test.id)) revised={...revised,
    structureDetails:EXAM_SCOPE_NOTES[test.id],overview:EXAM_SCOPE_NOTES[test.id],
    studyPlan:[
      {week:"准备阶段",focus:"确认训练范围",tasks:["先阅读考试机构来源","区分历史/专项训练与现行正式考试","未明确列出的先验技术不当作必备要求"]},
      {week:"练习阶段",focus:"范围内训练与复盘",tasks:["从范围检查后的题组开始","必要的新定义应由题目提供","以正式机构样题校准结构与难度"]},
    ],
    tips:[EXAM_SCOPE_NOTES[test.id],"平台内容与分数仅用于训练；不宣称官方难度等值或完整覆盖。"],
  };
  return revised;
}
