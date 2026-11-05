CREATE TABLE "StudyAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "paperId" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'zh-CN',
    "questionIds" TEXT[],
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "reportId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StudyAttempt_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "StudyAttempt_mode" CHECK ("mode" IN ('practice', 'paper')),
    CONSTRAINT "StudyAttempt_questions" CHECK (cardinality("questionIds") BETWEEN 1 AND 300)
);
CREATE TABLE "StudyAttemptAnswer" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "submission" JSONB NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StudyAttemptAnswer_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "StudyAttempt_userId_createdAt_idx" ON "StudyAttempt"("userId", "createdAt");
CREATE INDEX "StudyAttempt_createdAt_idx" ON "StudyAttempt"("createdAt");
CREATE UNIQUE INDEX "StudyAttempt_reportId_key" ON "StudyAttempt"("reportId");
CREATE UNIQUE INDEX "StudyAttemptAnswer_attemptId_questionId_key" ON "StudyAttemptAnswer"("attemptId", "questionId");
ALTER TABLE "StudyAttempt" ADD CONSTRAINT "StudyAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudyAttemptAnswer" ADD CONSTRAINT "StudyAttemptAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "StudyAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Expand the schema without changing the old integer-column contract. The old
-- generated client truncates DOUBLE PRECISION values mapped to Int on rollback.
ALTER TABLE "ExamSession" ADD COLUMN "totalEarnedExact" DOUBLE PRECISION;
ALTER TABLE "ExamAnswer" ADD COLUMN "earnedExact" DOUBLE PRECISION;
