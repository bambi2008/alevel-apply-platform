CREATE TYPE "PaymentOrderStatus" AS ENUM ('pending', 'paid', 'failed', 'closed');
CREATE TABLE "PaymentOrder" (
  "id" TEXT PRIMARY KEY,
  "outTradeNo" TEXT NOT NULL UNIQUE,
  "requestKey" TEXT NOT NULL UNIQUE,
  "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  "plan" "MembershipPlan" NOT NULL DEFAULT 'season_pass',
  "amountFen" INTEGER NOT NULL CHECK ("amountFen" > 0),
  "months" INTEGER NOT NULL CHECK ("months" BETWEEN 1 AND 36),
  "status" "PaymentOrderStatus" NOT NULL DEFAULT 'pending',
  "provider" TEXT NOT NULL,
  "providerChargeId" TEXT,
  "payway" TEXT NOT NULL CHECK ("payway" IN ('wechat', 'alipay')),
  "agreedAt" TIMESTAMP(3) NOT NULL,
  "termsVersion" TEXT NOT NULL,
  "paidAt" TIMESTAMP(3),
  "membershipEndsAt" TIMESTAMP(3),
  "recoveryCheckedAt" TIMESTAMP(3),
  "testPayment" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  UNIQUE ("provider", "providerChargeId")
);
CREATE INDEX "PaymentOrder_userId_createdAt_idx" ON "PaymentOrder"("userId", "createdAt");
CREATE INDEX "PaymentOrder_status_paidAt_idx" ON "PaymentOrder"("status", "paidAt");
CREATE TABLE "PaymentComplaint" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL REFERENCES "PaymentOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "fingerprint" TEXT NOT NULL UNIQUE,
  "detail" TEXT NOT NULL,
  "payerPhone" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "PaymentComplaint_orderId_createdAt_idx" ON "PaymentComplaint"("orderId", "createdAt");
