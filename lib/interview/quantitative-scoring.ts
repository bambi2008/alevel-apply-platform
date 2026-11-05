import type { QuantitativeCheckpoint, QuantitativeInterviewDrill } from "./quantitative-interview";
import { reviewQuantitativeResponse } from "./quantitative-interview-review";

const DEFENCE_CHECKPOINT: QuantitativeCheckpoint = {
  id: "defence",
  label: "面对追问",
  description: "面对新条件时，能修正模型而不是只重复答案。",
  signals: ["如果", "改变", "修正", "重新", "取决于", "敏感", "边界", "限制"],
};

export function scoreQuantitativeResponse(drill: QuantitativeInterviewDrill, response: string, followUpResponse: string) {
  const review = reviewQuantitativeResponse(drill, response, followUpResponse);
  const main = response.toLocaleLowerCase();
  const followUp = followUpResponse.toLocaleLowerCase();
  const checks = drill.checkpoints.map((checkpoint) => ({
    ...checkpoint,
    passed: checkpoint.signals.some((signal) => main.includes(signal.toLocaleLowerCase())),
  }));
  const defence = {
    ...DEFENCE_CHECKPOINT,
    passed: DEFENCE_CHECKPOINT.signals.some((signal) => followUp.includes(signal.toLocaleLowerCase())),
  };
  const total = review.total;
  return {
    total,
    max: review.max,
    checks,
    defence,
    band: review.band,
    review,
  };
}
