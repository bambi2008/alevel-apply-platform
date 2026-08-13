import type { QuantitativeInterviewDrill } from "./quantitative-interview";

export type InterviewProcessSkillId = "model" | "method" | "calculation" | "check" | "adapt";

export type InterviewProcessSkill = {
  id: InterviewProcessSkillId;
  label: string;
  shortLabel: string;
  passed: boolean;
  partial: boolean;
  evidence: string[];
  missing: string;
  nextAction: string;
};

export const INTERVIEW_PROCESS_SKILLS: ReadonlyArray<Pick<InterviewProcessSkill, "id" | "label" | "shortLabel">> = [
  { id: "model", label: "变量、假设和模型", shortLabel: "建模" },
  { id: "method", label: "为什么选择这个方法", shortLabel: "方法选择" },
  { id: "calculation", label: "边算边解释每一步", shortLabel: "分步计算" },
  { id: "check", label: "单位、量级和合理性检查", shortLabel: "结果检查" },
  { id: "adapt", label: "提示或条件变化后的修正", shortLabel: "面对追问" },
];

export type QuantitativeInterviewReview = {
  total: number;
  max: number;
  band: string;
  skills: InterviewProcessSkill[];
  weakest: InterviewProcessSkill;
  summary: string;
  retryPrompt: string;
};

const METHOD_SIGNALS = [
  "因为", "由于", "选择", "采用", "使用", "公式", "定律", "方程", "关系式", "方法", "证明", "比较", "拆分", "先", "再",
  "because", "since", "choose", "use", "equation", "formula", "law", "compare", "first", "then",
];
const CONDITION_SIGNALS = ["如果", "若", "改变", "条件", "新", "当", "假设", "if", "when", "change", "condition", "assumption"];
const ADAPT_SIGNALS = ["修正", "重新", "取决于", "边界", "敏感", "限制", "改成", "recompute", "adjust", "depends", "boundary", "limit"];
const REASON_SIGNALS = ["因为", "由于", "这样", "因此", "所以", "取决于", "because", "since", "therefore", "depends"];
const UNIT_SIGNALS = ["单位", "量纲", "焦耳", "瓦", "米", "秒", "千克", "mol", "百分比", "kg", "m/s", "j", "w"];
const SANITY_SIGNALS = ["量级", "合理", "误差", "检查", "范围", "上限", "下限", "极限", "估算", "数量级", "sanity", "error", "range", "limit", "estimate"];

function lower(text: string) {
  return text.toLocaleLowerCase();
}

function splitEvidence(text: string) {
  return text
    .split(/[。！？；.!?;\n]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function evidenceFor(text: string, signals: string[]) {
  const normalized = lower(text);
  const hits = signals.filter((signal) => normalized.includes(lower(signal)));
  const snippets = splitEvidence(text).filter((sentence) => signals.some((signal) => lower(sentence).includes(lower(signal))));
  return { hits: [...new Set(hits)], snippets: [...new Set(snippets)].slice(0, 2) };
}

function skillResult(
  definition: (typeof INTERVIEW_PROCESS_SKILLS)[number],
  response: string,
  followUpResponse: string,
  drill: QuantitativeInterviewDrill,
): InterviewProcessSkill {
  const main = response.trim();
  const followUp = followUpResponse.trim();
  const checkpoint = drill.checkpoints.find((item) => item.id === definition.id);
  const checkpointSignals = definition.id === "adapt" ? ADAPT_SIGNALS : checkpoint?.signals ?? [];
  const source = definition.id === "adapt" ? followUp : main;
  const checkpointEvidence = evidenceFor(source, checkpointSignals);

  if (definition.id === "model") {
    const passed = checkpointEvidence.hits.length >= 1;
    return {
      ...definition,
      passed,
      partial: checkpointEvidence.hits.length > 0 && !passed,
      evidence: checkpointEvidence.snippets,
      missing: passed ? "" : "还没有明确说出变量、假设，或暂时忽略的因素。",
      nextAction: "下一次开口先说“我把 ___ 设为变量，暂时假设 ___，要估计的是 ___”。",
    };
  }

  if (definition.id === "method") {
    const methodEvidence = evidenceFor(main, METHOD_SIGNALS);
    const reasonEvidence = evidenceFor(main, REASON_SIGNALS);
    const passed = methodEvidence.hits.length >= 1 && reasonEvidence.hits.length >= 1;
    return {
      ...definition,
      passed,
      partial: methodEvidence.hits.length > 0 || reasonEvidence.hits.length > 0,
      evidence: [...new Set([...methodEvidence.snippets, ...reasonEvidence.snippets])].slice(0, 2),
      missing: passed ? "" : "需要把公式、定律或比较方法和当前问题的连接说出来，而不只是写出结果。",
      nextAction: `下一次先说“我选择 ${drill.approach.split("，")[0]}，因为它能连接题目中的 ___ 与 ___”。`,
    };
  }

  if (definition.id === "calculation") {
    const calculationEvidence = evidenceFor(main, checkpointSignals);
    const passed = calculationEvidence.hits.length >= 2;
    return {
      ...definition,
      passed,
      partial: calculationEvidence.hits.length > 0,
      evidence: calculationEvidence.snippets,
      missing: passed ? "" : "计算链证据不足：需要出现关系式、代入或中间结论，而不是跳到最后的数。",
      nextAction: "下一次把关系式、代入、单位变化和中间结论分成至少两步说出来。",
    };
  }

  if (definition.id === "check") {
    const unitEvidence = evidenceFor(main, UNIT_SIGNALS);
    const sanityEvidence = evidenceFor(main, SANITY_SIGNALS);
    const passed = unitEvidence.hits.length > 0 && sanityEvidence.hits.length > 0;
    return {
      ...definition,
      passed,
      partial: unitEvidence.hits.length > 0 || sanityEvidence.hits.length > 0,
      evidence: [...new Set([...unitEvidence.snippets, ...sanityEvidence.snippets])].slice(0, 2),
      missing: passed ? "" : unitEvidence.hits.length === 0 ? "还没有检查单位或量纲。" : "还没有检查量级、范围或结果是否合理。",
      nextAction: "下一次算完主动补一句：单位是否一致、结果落在哪个范围、最大误差可能来自哪里。",
    };
  }

  const conditionEvidence = evidenceFor(followUp, CONDITION_SIGNALS);
  const defenceEvidence = evidenceFor(followUp, checkpointSignals);
  const passed = conditionEvidence.hits.length > 0 && defenceEvidence.hits.length > 0;
  return {
    ...definition,
    passed,
    partial: conditionEvidence.hits.length > 0 || defenceEvidence.hits.length > 0,
    evidence: [...new Set([...conditionEvidence.snippets, ...defenceEvidence.snippets])].slice(0, 2),
    missing: passed ? "" : "追问中还没有明确指出哪个条件改变，以及模型或结论要怎样重做。",
    nextAction: "下一次先指出“改变的是 ___ 假设”，再说明哪个关系式、参数或边界需要重新计算。",
  };
}

export function reviewQuantitativeResponse(
  drill: QuantitativeInterviewDrill,
  response: string,
  followUpResponse: string,
): QuantitativeInterviewReview {
  const skills = INTERVIEW_PROCESS_SKILLS.map((definition) => skillResult(definition, response, followUpResponse, drill));
  const total = skills.filter((skill) => skill.passed).length;
  const weakest = [...skills].sort((a, b) => Number(a.passed) - Number(b.passed) || Number(a.partial) - Number(b.partial))[0];
  const band = total >= 5 ? "过程链完整，可承受高压追问" : total >= 3 ? "方法基本成形，需继续练习" : "先练习把计算过程说完整";
  return {
    total,
    max: skills.length,
    band,
    skills,
    weakest,
    summary: weakest.passed ? "五项过程能力都留下了可识别证据，可以继续练习速度和表达压缩。" : `当前最值得优先补强的是“${weakest.label}”。先补这一环，再追求更快或更精确的结果。`,
    retryPrompt: weakest.nextAction,
  };
}
