/** Display configuration approved in the October 25 package; not a payment API. */
export const PLAN_RELEASE = {
  purchasesEnabled: false,
  trialEnabled: false,
  quotaLimitsEnabled: false,
} as const;

export const STUDY_PLANS = [
  { id: "basic", name: "基础练习", nameEn: "Basic Practice", priceCny: 0, durationMonths: null, durationDays: null, autoRenew: false },
  { id: "trial", name: "7 天完整体验", nameEn: "7-day Full Trial", priceCny: 0, durationMonths: null, durationDays: 7, autoRenew: false },
  { id: "season", name: "考季卡", nameEn: "Exam Season Pass", priceCny: 399, durationMonths: 3, durationDays: null, autoRenew: false },
  { id: "annual", name: "年卡", nameEn: "Annual Pass", priceCny: 799, durationMonths: 12, durationDays: null, autoRenew: false },
] as const;

export type StudyPlanId = (typeof STUDY_PLANS)[number]["id"];

// Null means not decided, never a public allowance or permission to charge.
export const PLAN_QUOTAS: Record<StudyPlanId, {
  dailyQuestions: number | null;
  dailyAiFeedback: number | null;
  monthlyStatementFeedback: number | null;
}> = {
  basic: { dailyQuestions: null, dailyAiFeedback: null, monthlyStatementFeedback: null },
  trial: { dailyQuestions: null, dailyAiFeedback: null, monthlyStatementFeedback: null },
  season: { dailyQuestions: null, dailyAiFeedback: null, monthlyStatementFeedback: null },
  annual: { dailyQuestions: null, dailyAiFeedback: null, monthlyStatementFeedback: null },
};
