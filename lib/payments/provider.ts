export type PaymentChannel = "wechat" | "alipay";

export type PaymentInstruction =
  | { channel: "wechat"; url: string }
  | { channel: "alipay"; action: string; fields: Array<{ name: string; value: string }> };

export type PaymentNotification = {
  type: "charge_succeeded" | "complaint";
  outTradeNo: string;
  amountFen: number;
  chargeId?: string;
  payway?: PaymentChannel;
  detail?: string;
  payerPhone?: string;
};

export type ProviderOrder = {
  amountFen: number;
  state: number;
  refundState: number;
  refundAmount: number;
  chargeId: string;
  payway: PaymentChannel;
  paidAt: Date | null;
};

export interface PaymentProvider {
  createPayment(order: { outTradeNo: string; amountFen: number; channel: PaymentChannel; returnUrl: string }): Promise<PaymentInstruction>;
  parseNotification(payload: unknown): PaymentNotification | null;
  verifyNotification(payload: unknown): boolean;
  queryOrder(outTradeNo: string): Promise<ProviderOrder | null>;
}
