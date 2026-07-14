// 收费端口（Billing Port）—— provider 无关的「订阅 / 权益」接入层。
// 现在只有 stub。真正接入微信支付 / 支付宝 / Stripe 时：实现一个 BillingProvider，
// 在 getBillingProvider() 里 return 它即可——练习页、entitlements、UI 全都不用改。
// 参考 RevenueCat 的 Entitlement 思路：UI 只问「有没有 pro 权益」，不关心钱从哪个渠道来。

export type Tier = "free" | "pro";

export interface SubscriptionStatus {
  tier: Tier;
  active: boolean;
  plan?: "monthly" | "annual";
  currentPeriodEnd?: string; // ISO
  trialEndsAt?: string; // ISO —— 反向试用到期时间
}

export interface CheckoutRequest {
  plan: "monthly" | "annual";
  userId?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutResult {
  /** 可跳转的支付页 URL（微信/支付宝二维码页、Stripe Checkout 等）。 */
  url: string;
  provider: string;
}

/** 支付提供方接口：接入任意渠道时实现它。 */
export interface BillingProvider {
  readonly name: string;
  /** 发起支付会话，返回可跳转的支付 URL。 */
  createCheckout(req: CheckoutRequest): Promise<CheckoutResult>;
  /** 查询某用户的订阅状态。 */
  getSubscription(userId: string): Promise<SubscriptionStatus>;
}

/** 未接入任何支付渠道时的占位实现（不会误收费；查询一律返回 free）。 */
const stubProvider: BillingProvider = {
  name: "stub",
  async createCheckout(): Promise<CheckoutResult> {
    throw new Error(
      "[billing] 未配置支付提供方。请实现 BillingProvider（微信/支付宝/Stripe）并在 getBillingProvider() 返回。",
    );
  },
  async getSubscription(): Promise<SubscriptionStatus> {
    return { tier: "free", active: false };
  },
};

// ▼▼▼ 接入真实支付时：在这里 return 你的 provider（如 return wechatProvider）▼▼▼
export function getBillingProvider(): BillingProvider {
  return stubProvider;
}

/** 发起结账 —— 业务代码统一走这里，不关心底层是哪家渠道。 */
export function createCheckout(req: CheckoutRequest): Promise<CheckoutResult> {
  return getBillingProvider().createCheckout(req);
}

/** 从「用户样对象」解析层级：读 tier / isPro / subscription.active，默认 free。
 *  真实接入后，让它读用户记录或 session 里的订阅状态即可。 */
export function getUserTier(
  user?: { tier?: Tier; isPro?: boolean; subscription?: { active?: boolean } } | null,
): Tier {
  if (!user) return "free";
  if (user.tier === "pro") return "pro";
  if (user.isPro) return "pro";
  if (user.subscription?.active) return "pro";
  return "free";
}

export function isPro(tier: Tier): boolean {
  return tier === "pro";
}
