import type { MockPaper } from "./index";
import {
  CAIE9709_P3_MOCK_1,
  CAIE9709_P3_MOCK_2,
  CAIE9709_P3_MOCK_3,
  CAIE9709_P3_MOCK_4,
} from "@/lib/tests/questions/caie9709";
import {
  CAIE9709_P3_MOCK_5,
  CAIE9709_P3_MOCK_6,
  CAIE9709_P3_MOCK_7,
  CAIE9709_P3_MOCK_8,
} from "@/lib/tests/questions/caie9709-expansion";
import {
  CAIE9709_P3_MOCK_9,
  CAIE9709_P3_MOCK_10,
  CAIE9709_P3_MOCK_11,
  CAIE9709_P3_MOCK_12,
  CAIE9709_P3_MOCK_13,
  CAIE9709_P3_MOCK_14,
  CAIE9709_P3_MOCK_15,
  CAIE9709_P3_MOCK_16,
} from "@/lib/tests/questions/caie9709-candidate-targeted";

const papers = [
  CAIE9709_P3_MOCK_1,
  CAIE9709_P3_MOCK_2,
  CAIE9709_P3_MOCK_3,
  CAIE9709_P3_MOCK_4,
  CAIE9709_P3_MOCK_5,
  CAIE9709_P3_MOCK_6,
  CAIE9709_P3_MOCK_7,
  CAIE9709_P3_MOCK_8,
  CAIE9709_P3_MOCK_9,
  CAIE9709_P3_MOCK_10,
  CAIE9709_P3_MOCK_11,
  CAIE9709_P3_MOCK_12,
  CAIE9709_P3_MOCK_13,
  CAIE9709_P3_MOCK_14,
  CAIE9709_P3_MOCK_15,
  CAIE9709_P3_MOCK_16,
];

export const CAIE9709_P3_WRITTEN_PAPERS: MockPaper[] = papers.map((questions, index) => ({
  id: `caie9709-p3-written-${index + 1}`,
  testId: "caie9709",
  title: `CAIE 9709 Pure Mathematics 3 刁钻角度模拟卷 ${index + 1}`,
  titleEn: `CAIE 9709 Pure Mathematics 3 Unfamiliar-Angle Mock ${index + 1}`,
  description:
    "非官方原创固定卷。按 CAIE 9709 Paper 3 当前结构编排，110 分钟、75 分、11 道结构题。题目不刻意超纲提难，而是训练识别隐藏方法、处理限制条件、保留精确值和适应陌生设问。",
  modules: [{
    id: "pure-mathematics-3",
    title: "Pure Mathematics 3 完整书面卷（11 题）",
    titleEn: "Pure Mathematics 3 full written paper (11 questions)",
    durationSec: 110 * 60,
    questions,
  }],
  instructions: [
    "回答全部 11 题，总分 75 分，考试时间 110 分钟。",
    "写出必要步骤；仅写答案可能无法获得方法分。",
    "可使用符合 CAIE 要求的科学计算器，不得使用图形、CAS 或符号微积分功能。",
    "遇到方程、反三角函数或开方结果时，主动检查定义域、象限、范围及应舍去的解。",
    "除题目另有要求外，非精确数值给出 3 位有效数字。",
  ],
  formatType: "current",
}));
