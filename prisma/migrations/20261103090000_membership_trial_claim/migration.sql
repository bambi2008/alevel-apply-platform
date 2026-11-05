CREATE TYPE "MembershipPlan" AS ENUM ('trial', 'season_pass');

CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "MembershipPlan" NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "sourceOrderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Membership_valid_window" CHECK ("endsAt" > "startsAt")
);
CREATE UNIQUE INDEX "Membership_userId_key" ON "Membership"("userId");
CREATE INDEX "Membership_plan_endsAt_idx" ON "Membership"("plan", "endsAt");
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "TrialClaim" (
    "emailDigest" TEXT NOT NULL,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TrialClaim_pkey" PRIMARY KEY ("emailDigest"),
    CONSTRAINT "TrialClaim_digest_format" CHECK ("emailDigest" ~ '^[0-9a-f]{64}$')
);
