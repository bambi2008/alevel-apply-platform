CREATE TYPE "QuestionFeedbackKind" AS ENUM ('ERROR', 'TOO_HARD', 'MORE_LIKE_THIS');
CREATE TABLE "QuestionFeedback" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "testId" TEXT NOT NULL,
  "topicId" TEXT NOT NULL,
  "questionKey" TEXT NOT NULL,
  "kind" "QuestionFeedbackKind" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "QuestionFeedback_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "QuestionFeedback_userId_testId_questionKey_kind_key" ON "QuestionFeedback"("userId", "testId", "questionKey", "kind");
CREATE INDEX "QuestionFeedback_testId_topicId_createdAt_idx" ON "QuestionFeedback"("testId", "topicId", "createdAt");
CREATE INDEX "QuestionFeedback_createdAt_idx" ON "QuestionFeedback"("createdAt");
ALTER TABLE "QuestionFeedback" ADD CONSTRAINT "QuestionFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
