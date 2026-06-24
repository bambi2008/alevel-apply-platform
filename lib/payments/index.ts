// 支付适配器接口（预留）。MVP 不收费；Phase 2 实现微信支付 / 支付宝。

export type PaymentProvider = "wechat" | "alipay";

export interface CreatePaymentInput {
  provider: PaymentProvider;
  orderId: string;
  amount: number; // 单位：分
  currency: "CNY";
  description: string;
  returnUrl?: string;
}

export interface PaymentResult {
  provider: PaymentProvider;
  prepayParams: Record<string, unknown>; // 前端唤起支付所需参数
}

export interface PaymentGateway {
  createPayment(input: CreatePaymentInput): Promise<PaymentResult>;
  verifyWebhook(headers: Record<string, string>, rawBody: string): Promise<{ ok: boolean; orderId?: string }>;
}

class NotImplementedGateway implements PaymentGateway {
  async createPayment(): Promise<PaymentResult> {
    throw new Error("支付能力尚未启用（Phase 2）");
  }
  async verifyWebhook() {
    return { ok: false };
  }
}

export function getPaymentGateway(): PaymentGateway {
  return new NotImplementedGateway();
}
