import {
  getQuantitativeDrills,
  type QuantitativeDiscipline,
  type QuantitativeInterviewDrill,
} from "./quantitative-interview";

export type QuantitativeInterviewPaper = {
  id: string;
  title: string;
  note: string;
  pressure: "中压" | "高压" | "极限";
  tasks: QuantitativeInterviewDrill[];
};

const PAPER_BLUEPRINTS = [
  { id: "paper-1", title: "模拟卷 1 · 建模起步", note: "从数量级或基本模型开始，再逐步接受一次条件变化。", pressure: "中压" as const },
  { id: "paper-2", title: "模拟卷 2 · 连续追问", note: "每道题都要求把公式、单位和假设说清楚，再处理边界。", pressure: "高压" as const },
  { id: "paper-3", title: "模拟卷 3 · 混合压力", note: "题目跨越不同思维方式，训练切换模型和保持表达完整。", pressure: "极限" as const },
];

function pickTasks(drills: QuantitativeInterviewDrill[], start: number) {
  return [0, 1, 2].map((offset) => drills[(start + offset) % drills.length]);
}

export function getQuantitativeInterviewPapers(subjectId: string): QuantitativeInterviewPaper[] {
  const drills = getQuantitativeDrills(subjectId);
  if (drills.length < 3) return [];
  return PAPER_BLUEPRINTS.map((blueprint, index) => ({
    ...blueprint,
    id: `${subjectId}-${blueprint.id}`,
    tasks: pickTasks(drills, index),
  }));
}

export function isQuantitativePaperSubject(subjectId: string) {
  return getQuantitativeInterviewPapers(subjectId as QuantitativeDiscipline).length > 0;
}
