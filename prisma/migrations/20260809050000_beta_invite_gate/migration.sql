CREATE TYPE "BetaInviteStatus" AS ENUM ('AVAILABLE', 'USED', 'REVOKED');

CREATE TABLE "BetaInvite" (
  "id" TEXT NOT NULL,
  "codeHash" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "cohort" TEXT NOT NULL DEFAULT 'beta-2026-1',
  "status" "BetaInviteStatus" NOT NULL DEFAULT 'AVAILABLE',
  "usedByUserId" TEXT,
  "usedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BetaInvite_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BetaInvite_codeHash_key" ON "BetaInvite"("codeHash");
CREATE UNIQUE INDEX "BetaInvite_usedByUserId_key" ON "BetaInvite"("usedByUserId");
CREATE UNIQUE INDEX "BetaInvite_cohort_email_key" ON "BetaInvite"("cohort", "email");
CREATE INDEX "BetaInvite_cohort_status_idx" ON "BetaInvite"("cohort", "status");
CREATE INDEX "BetaInvite_email_status_idx" ON "BetaInvite"("email", "status");

ALTER TABLE "BetaInvite"
  ADD CONSTRAINT "BetaInvite_usedByUserId_fkey"
  FOREIGN KEY ("usedByUserId") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
