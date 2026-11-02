import type { InterviewProcessSkill, InterviewProcessSkillId, QuantitativeInterviewReview } from "./quantitative-interview-review";

const englishSkills: Record<InterviewProcessSkillId, { label: string; shortLabel: string; missing: string; nextAction: string }> = {
  model: { label: "Variables, assumptions and model", shortLabel: "Modelling", missing: "State the variables, assumptions and factors temporarily ignored.", nextAction: "Start by naming your variables, assumptions and target quantity." },
  method: { label: "Why this method", shortLabel: "Method selection", missing: "Explain how the formula, law or comparison connects to this problem, rather than giving only a result.", nextAction: "Explain why your chosen method connects the relevant quantities in this problem." },
  calculation: { label: "Explain each calculation step", shortLabel: "Step-by-step calculation", missing: "Show the relationship, substitution and intermediate conclusions, rather than jumping to a final number.", nextAction: "Explain the relationship, substitution, units and intermediate conclusions in at least two steps." },
  check: { label: "Units, scale and reasonableness", shortLabel: "Checking", missing: "Check both units or dimensions and the scale, range and reasonableness of the result.", nextAction: "Check consistent units, a plausible range and the largest possible source of error." },
  adapt: { label: "Revise after hints or changed conditions", shortLabel: "Responding to follow-ups", missing: "Identify the changed condition and explain how to revise the model or conclusion.", nextAction: "Name the assumption that changed, then recompute the affected relationship, parameter or boundary." },
};

/** Display owned feedback metadata only. Evidence is the learner's original wording. */
export function presentInterviewSkill<T extends InterviewProcessSkill>(skill: T, locale: string): T {
  if (locale !== "en") return skill;
  const shown = englishSkills[skill.id];
  return { ...skill, ...shown, missing: skill.passed ? "" : skill.id === "check" && skill.missing === "还没有检查单位或量纲。" ? "Check the units or dimensions." : skill.id === "check" && skill.missing === "还没有检查量级、范围或结果是否合理。" ? "Check the scale, range and reasonableness of the result." : shown.missing, evidence: skill.evidence };
}

export function interviewSkillLabel(id: InterviewProcessSkillId, locale: string, fallback: string): string {
  return locale === "en" ? englishSkills[id].label : fallback;
}

export function presentInterviewReview(review: QuantitativeInterviewReview, locale: string): QuantitativeInterviewReview {
  if (locale !== "en") return review;
  const skills = review.skills.map(skill => presentInterviewSkill(skill, locale));
  const weakest = skills.find(skill => skill.id === review.weakest.id)!;
  return {
    ...review, skills, weakest,
    band: review.total >= 5 ? "Complete reasoning chain: ready for challenging follow-ups" : review.total >= 3 ? "Method taking shape: keep practising" : "Practise explaining the full calculation process first",
    summary: weakest.passed ? "All five process skills have identifiable evidence. Next, practise speed and concise explanations." : `Prioritise ${weakest.label.toLowerCase()} before pursuing faster or more precise results.`,
    retryPrompt: weakest.nextAction,
  };
}
