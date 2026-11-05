CREATE TYPE "AiFeedbackKind" AS ENUM ('general','photo','statement');
ALTER TABLE "AiEvaluation" ADD COLUMN "providerCalls" INTEGER NOT NULL DEFAULT 1;
CREATE TABLE "AiFeedbackUse" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "cacheKey" TEXT NOT NULL,
  "dayKey" TEXT NOT NULL,
  "kind" "AiFeedbackKind" NOT NULL,
  "leaseUntil" TIMESTAMP(3) NOT NULL,
  "completedAt" TIMESTAMP(3),
  "output" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("userId", "cacheKey")
);
CREATE INDEX "AiFeedbackUse_userId_dayKey_idx" ON "AiFeedbackUse"("userId", "dayKey");
CREATE INDEX "AiFeedbackUse_createdAt_idx" ON "AiFeedbackUse"("createdAt");
CREATE TABLE "AiFeedbackSettings" (
  "id" TEXT PRIMARY KEY CHECK ("id" = 'daily'),
  "total" INTEGER NOT NULL CHECK ("total" BETWEEN 0 AND 1000),
  "photo" INTEGER NOT NULL CHECK ("photo" BETWEEN 0 AND "total"),
  "statement" INTEGER NOT NULL CHECK ("statement" BETWEEN 0 AND "total"),
  "updatedAt" TIMESTAMP(3) NOT NULL
);
