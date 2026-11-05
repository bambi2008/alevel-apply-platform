import { isConfiguredAdmin } from "@/lib/admin/allowlist";
import { LEGAL_VERSION } from "@/lib/auth/security";
import { seasonPassOffer } from "@/lib/membership/config";

export const PURCHASE_TERMS_VERSION = `season-pass-2026-11-05+${LEGAL_VERSION}`;

export function paymentOffer(user?: { role?: string; email?: string | null } | null, env = process.env) {
  const standard = seasonPassOffer(env);
  const adminOnly = env.PAYMENTS_ADMIN_ONLY !== "false";
  const testAmount = Number(env.PAYMENT_TEST_AMOUNT_FEN);
  const testPayment = adminOnly && isConfiguredAdmin(user, env)
    && /^[1-9]\d*$/.test(env.PAYMENT_TEST_AMOUNT_FEN ?? "") && Number.isSafeInteger(testAmount) && testAmount <= 10_000_000;
  return {
    ...standard,
    priceFen: testPayment ? testAmount : standard.priceFen,
    testPayment,
    enabled: env.PAYMENTS_ENABLED === "true" && env.PAYMENT_PROVIDER === "mianbaoduo"
      && !!env.MBD_APP_ID?.trim() && !!env.MBD_APP_KEY?.trim() && !!env.APP_ORIGIN
      && (!adminOnly || testPayment),
    parentHint: env.PAYMENT_PARENT_HINT === "true",
  };
}
