CREATE TABLE "StudySessionFeedback" (
  "sessionId" TEXT NOT NULL REFERENCES "ExamSession"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "kind" "QuestionFeedbackKind" NOT NULL,
  "questionId" TEXT,
  "reason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("sessionId", "kind"),
  CONSTRAINT "StudySessionFeedback_reason_check" CHECK (
    ("kind" = 'ERROR' AND "reason" IS NOT NULL AND "reason" IN ('PROMPT','ANSWER','SOLUTION','DISPLAY','OTHER'))
    OR ("kind" <> 'ERROR' AND "questionId" IS NULL AND "reason" IS NULL)
  )
);
CREATE INDEX "StudySessionFeedback_createdAt_idx" ON "StudySessionFeedback"("createdAt");
