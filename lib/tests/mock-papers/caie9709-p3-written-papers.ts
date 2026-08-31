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
} from "@/lib/tests/questions/caie9709-remediation";
import { CAIE9709_P3_CANDIDATE_TARGETED_QUESTIONS as legacyQuestions } from "@/lib/tests/questions/caie9709-candidate-targeted";

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
  id: `caie9709-p3-written-${index + 1}${index >= 8 ? "-r2" : ""}`,
  testId: "caie9709",
  title: `CAIE 9709 P3 ${index >= 8 ? "错题强化综合卷" : "基础与综合练习卷"} ${index + 1}${index >= 8 ? " · R2" : ""}`,
  titleEn: `CAIE 9709 P3 ${index >= 8 ? "Targeted Revision" : "Foundation Practice"} ${index + 1}`,
  description:
    "非官方原创训练卷：110 分钟、75 分、11 道书面结构题。基础卷用于巩固；R2 强化卷增加条件判断与多步推导。难度标签是训练分层，不代表与官方真卷等难；AI 点评仅供参考。",
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

// Preserve old IDs and original question text for existing attempts and bookmarks.
// These papers are intentionally absent from the active catalogue.
export const CAIE9709_P3_ARCHIVED_PAPERS: MockPaper[] = Array.from({ length: 8 }, (_, i) => ({
  ...CAIE9709_P3_WRITTEN_PAPERS[i + 8],
  id: `caie9709-p3-written-${i + 9}`,
  title: `CAIE 9709 P3 旧版卷 ${i + 9}（历史记录）`,
  titleEn: `CAIE 9709 P3 Archived Paper ${i + 9}`,
  description: "旧版题目保留供历史作答回看和继续；新的训练请选择 R2 修订卷。旧版难度标签不作为正式校准依据。",
  formatType: "legacy",
  modules: [{ ...CAIE9709_P3_WRITTEN_PAPERS[i + 8].modules[0], questions: legacyQuestions.slice(i * 11, (i + 1) * 11) }],
}));
