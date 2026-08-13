ALTER TABLE "ExamSession"
ADD COLUMN "paperId" TEXT,
ADD COLUMN "presetId" TEXT,
ADD COLUMN "startedAt" TIMESTAMP(3),
ADD COLUMN "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "clientMeta" JSONB;

ALTER TABLE "ExamAnswer"
ADD COLUMN "timeSpentSec" INTEGER,
ADD COLUMN "answerChanges" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "visits" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "flagged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "firstSelected" TEXT;

CREATE TYPE "CalibrationDecisionStatus" AS ENUM ('APPROVED', 'DISMISSED', 'ROLLED_BACK');

CREATE TABLE "CalibrationDecision" (
  "id" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "testId" TEXT NOT NULL,
  "fromDifficulty" INTEGER NOT NULL,
  "toDifficulty" INTEGER NOT NULL,
  "status" "CalibrationDecisionStatus" NOT NULL,
  "metrics" JSONB NOT NULL,
  "note" TEXT,
  "actorId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CalibrationDecision_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CalibrationDecision_questionId_createdAt_idx" ON "CalibrationDecision"("questionId", "createdAt");
CREATE INDEX "CalibrationDecision_testId_status_idx" ON "CalibrationDecision"("testId", "status");

ALTER TABLE "CalibrationDecision"
ADD CONSTRAINT "CalibrationDecision_actorId_fkey"
FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
