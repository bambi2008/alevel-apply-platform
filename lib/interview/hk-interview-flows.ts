import type { TimedAssessmentFlow } from "./cambridge-assessment-flows";

export const HK_INTERVIEW_FLOWS: TimedAssessmentFlow[] = [
  {
    subjectId: "hk-general",
    title: "港校综合面试固定流程",
    note: "依次完成课程动机、失败复盘和专业相关议题。回答必须具体，并保持与申请材料一致。",
    tasks: [
      { questionId: "hk-gen-1", preparationSec: 60, responseSec: 2 * 60 },
      { questionId: "hk-gen-2", preparationSec: 60, responseSec: 2 * 60 },
      { questionId: "hk-gen-3", preparationSec: 60, responseSec: 2 * 60 },
    ],
  },
  {
    subjectId: "hk-medicine-mmi",
    title: "港校医学 MMI 固定三站",
    note: "覆盖专业诚信、患者沟通与资源分配。先识别安全与角色边界，再权衡选项并说明升级路径。",
    tasks: [
      { questionId: "hk-mmi-1", preparationSec: 2 * 60, responseSec: 6 * 60 },
      { questionId: "hk-mmi-2", preparationSec: 2 * 60, responseSec: 6 * 60 },
      { questionId: "hk-mmi-3", preparationSec: 2 * 60, responseSec: 7 * 60 },
    ],
  },
  {
    subjectId: "hk-business-group",
    title: "港校商科讨论固定流程",
    note: "打字流程训练框架、利益相关者和推进共识；真实小组中的倾听、打断和协作仍需多人练习。",
    tasks: [
      { questionId: "hk-biz-1", preparationSec: 3 * 60, responseSec: 8 * 60 },
      { questionId: "hk-biz-2", preparationSec: 2 * 60, responseSec: 4 * 60 },
    ],
  },
  {
    subjectId: "hk-stem",
    title: "港校理工面试固定流程",
    note: "完成项目误差深挖与陌生估算，重点展示假设、量纲、验证和面对不确定性的修正。",
    tasks: [
      { questionId: "hk-stem-1", preparationSec: 2 * 60, responseSec: 5 * 60 },
      { questionId: "hk-stem-2", preparationSec: 2 * 60, responseSec: 5 * 60 },
    ],
  },
];
