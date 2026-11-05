/** V4 plan catalogue. Runtime grants and payment availability are server-owned. */
export const PLAN_RELEASE = {
  purchasesEnabled: false,
  trialEnabled: false,
  quotaLimitsEnabled: false,
} as const;

export const STUDY_PLANS = [
  { id: "trial", name: "7 天完整体验", nameEn: "7-day Full Trial", priceCny: 0, durationMonths: null, durationDays: 7, autoRenew: false },
  { id: "season_pass", name: "考季卡", nameEn: "Exam Season Pass", priceCny: 399, durationMonths: 3, durationDays: null, autoRenew: false },
] as const;

export type StudyPlanId = (typeof STUDY_PLANS)[number]["id"];

export const PLAN_QUOTAS: Record<StudyPlanId, {
  dailyAiFeedback: number;
  dailyPhotoFeedback: number;
  dailyStatementFeedback: number;
}> = {
  trial: { dailyAiFeedback: 20, dailyPhotoFeedback: 10, dailyStatementFeedback: 3 },
  season_pass: { dailyAiFeedback: 20, dailyPhotoFeedback: 10, dailyStatementFeedback: 3 },
};
