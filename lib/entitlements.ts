// 权益与免费额度（单一事实来源）。UI / 练习页只问这里，不关心支付渠道。
// 设计依据教育类 freemium 最佳实践：知识卡全开做钩子、少量带详解的题证明价值、题量与模考做付费理由。
import type { Tier } from "@/lib/billing";
import { isPro } from "@/lib/billing";

/** 付费墙总开关。
 *  接入支付、准备好上线前，保持 false —— 此时一切照旧、不拦任何人（现有行为零改变）。
 *  真正开始收费时改成 true 即可全站生效。 */
export const PAYWALL_ENABLED = false;

/** 免费层配额（可随时调整 / A-B 测试）。 */
export const FREE_LIMITS = {
  /** 每门考试免费可练的题量（含完整详解，作为「解析质量」体验钩子）。 */
  questionsPerTest: 20,
  /** 免费可做的全真模考套数（其余需会员）。 */
  freeMockPapers: 1,
  /** 知识卡是否全开（建议全开，作为获客钩子）。 */
  knowledgeCardsFree: true,
  /** 反向试用天数：新用户前 N 天给全功能，到期落回免费层（0 = 关闭）。 */
  reverseTrialDays: 7,
} as const;

/** 免费题量上限：返回数字表示「最多 N 题」，null 表示不限。 */
export function freeQuestionCap(_testId: string, tier: Tier): number | null {
  if (!PAYWALL_ENABLED) return null; // 付费墙关闭 → 不限
  if (isPro(tier)) return null; // 会员 → 不限
  return FREE_LIMITS.questionsPerTest; // 免费 → 限量
}

/** 给练习题池套用免费额度。
 *  付费墙关闭或会员时【原样返回】，绝不改变现有行为。 */
export function applyFreeLimit<T>(pool: T[], testId: string, tier: Tier): T[] {
  const cap = freeQuestionCap(testId, tier);
  return cap == null ? pool : pool.slice(0, cap);
}

/** 第 index 套模考是否免费可做（index 从 0 起）。 */
export function canAccessMock(index: number, tier: Tier): boolean {
  if (!PAYWALL_ENABLED || isPro(tier)) return true;
  return index < FREE_LIMITS.freeMockPapers;
}

/** 免费用户是否已练满某考试的题量（用于决定是否显示升级卡）。 */
export function reachedFreeQuestionLimit(
  testId: string,
  tier: Tier,
  distinctPracticed: number,
): boolean {
  const cap = freeQuestionCap(testId, tier);
  return cap != null && distinctPracticed >= cap;
}
