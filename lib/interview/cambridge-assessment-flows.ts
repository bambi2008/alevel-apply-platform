export interface TimedAssessmentTask {
  questionId: string;
  preparationSec: number;
  responseSec: number;
}

export interface TimedAssessmentFlow {
  subjectId: string;
  title: string;
  note: string;
  tasks: TimedAssessmentTask[];
}

export const CAMBRIDGE_ASSESSMENT_FLOWS: TimedAssessmentFlow[] = [
  {
    subjectId: "cambridge-source",
    title: "材料分析固定流程",
    note: "先独立阅读与记录，再提交证据判断、替代解释和进一步验证方案。",
    tasks: [
      { questionId: "cam-src-1", preparationSec: 15 * 60, responseSec: 7 * 60 },
      { questionId: "cam-src-2", preparationSec: 10 * 60, responseSec: 6 * 60 },
      { questionId: "cam-src-3", preparationSec: 12 * 60, responseSec: 7 * 60 },
    ],
  },
  {
    subjectId: "cambridge-language-aptitude",
    title: "语言能力固定流程",
    note: "按规则发现、结构歧义和音系迁移三个阶段作答，重点说明假设与验证方法。",
    tasks: [
      { questionId: "cam-lang-1", preparationSec: 8 * 60, responseSec: 6 * 60 },
      { questionId: "cam-lang-2", preparationSec: 10 * 60, responseSec: 6 * 60 },
      { questionId: "cam-lang-3", preparationSec: 10 * 60, responseSec: 6 * 60 },
    ],
  },
  {
    subjectId: "cambridge-visual",
    title: "视觉与作品讨论固定流程",
    note: "先区分观察与解释，再说明作品决策、替代方案和面对追问时的修正。",
    tasks: [
      { questionId: "cam-vis-1", preparationSec: 2 * 60, responseSec: 5 * 60 },
      { questionId: "cam-vis-2", preparationSec: 3 * 60, responseSec: 5 * 60 },
    ],
  },
];
