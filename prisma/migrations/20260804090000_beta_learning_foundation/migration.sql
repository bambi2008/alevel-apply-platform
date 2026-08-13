CREATE TYPE "BetaParticipantStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'WITHDRAWN');
CREATE TYPE "ProgressKind" AS ENUM ('OBJECTIVE_EXAM', 'WRITTEN_EXAM', 'INTERVIEW_DRILL', 'INTERVIEW_PAPER', 'CAMBRIDGE_ASSESSMENT', 'IELTS_SPEAKING');
CREATE TYPE "LearningEventType" AS ENUM ('REGISTERED', 'PROFILE_COMPLETED', 'DIAGNOSTIC_STARTED', 'DIAGNOSTIC_COMPLETED', 'PRACTICE_STARTED', 'PRACTICE_COMPLETED', 'MOCK_STARTED', 'MOCK_COMPLETED', 'REMEDIATION_STARTED', 'REMEDIATION_COMPLETED', 'INTERVIEW_STARTED', 'INTERVIEW_COMPLETED', 'ACTIVE_DAY');
CREATE TYPE "LearningRecordKind" AS ENUM ('INTERVIEW_DRILL', 'INTERVIEW_PAPER', 'CAMBRIDGE_ASSESSMENT', 'IELTS_SPEAKING');
CREATE TYPE "AiEvaluationStatus" AS ENUM ('RUNNING', 'SUCCEEDED', 'FAILED', 'TIMED_OUT');
CREATE TYPE "QuestionWorkflowStage" AS ENUM ('DRAFT', 'SUBJECT_REVIEW', 'TEACHING_REVIEW', 'APPROVED', 'RETIRED');

CREATE TABLE "AuthSession" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revokedAt" TIMESTAMP(3),
  "userAgentHash" TEXT,
  "ipHash" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RateLimitBucket" (
  "key" TEXT NOT NULL,
  "count" INTEGER NOT NULL,
  "resetAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RateLimitBucket_pkey" PRIMARY KEY ("key")
);

CREATE TABLE "BetaParticipant" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "cohort" TEXT NOT NULL DEFAULT 'beta-2026-1',
  "status" "BetaParticipantStatus" NOT NULL DEFAULT 'ACTIVE',
  "source" TEXT,
  "onboardingCompletedAt" TIMESTAMP(3),
  "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BetaParticipant_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProgressSnapshot" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "kind" "ProgressKind" NOT NULL,
  "resourceId" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "startedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProgressSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LearningEvent" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "type" "LearningEventType" NOT NULL,
  "eventKey" TEXT NOT NULL,
  "testId" TEXT,
  "resourceId" TEXT,
  "sessionId" TEXT,
  "score" DOUBLE PRECISION,
  "maxScore" DOUBLE PRECISION,
  "metadata" JSONB,
  "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LearningEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LearningRecord" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "kind" "LearningRecordKind" NOT NULL,
  "resourceId" TEXT NOT NULL,
  "subject" TEXT,
  "score" DOUBLE PRECISION,
  "maxScore" DOUBLE PRECISION,
  "weakestSkillId" TEXT,
  "payload" JSONB,
  "attemptKey" TEXT NOT NULL,
  "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LearningRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AiEvaluation" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "route" TEXT NOT NULL,
  "purpose" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "status" "AiEvaluationStatus" NOT NULL DEFAULT 'RUNNING',
  "requestHash" TEXT NOT NULL,
  "inputChars" INTEGER NOT NULL,
  "outputChars" INTEGER NOT NULL DEFAULT 0,
  "promptTokens" INTEGER,
  "completionTokens" INTEGER,
  "totalTokens" INTEGER,
  "estimatedCostMicros" INTEGER,
  "latencyMs" INTEGER,
  "confidence" TEXT,
  "agreementRate" INTEGER,
  "scoreDelta" INTEGER,
  "errorCode" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AiEvaluation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "QuestionDraftRecord" (
  "id" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "testId" TEXT NOT NULL,
  "topicId" TEXT NOT NULL,
  "version" INTEGER NOT NULL,
  "stage" "QuestionWorkflowStage" NOT NULL DEFAULT 'DRAFT',
  "contentHash" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "sourceType" TEXT NOT NULL,
  "sourceTitle" TEXT NOT NULL,
  "sourceUrl" TEXT,
  "rightsStatus" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "subjectReviewerId" TEXT,
  "subjectReviewedAt" TIMESTAMP(3),
  "teachingReviewerId" TEXT,
  "teachingReviewedAt" TIMESTAMP(3),
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "QuestionDraftRecord_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AuthSession_tokenHash_key" ON "AuthSession"("tokenHash");
CREATE INDEX "AuthSession_userId_revokedAt_expiresAt_idx" ON "AuthSession"("userId", "revokedAt", "expiresAt");
CREATE INDEX "AuthSession_expiresAt_idx" ON "AuthSession"("expiresAt");
CREATE INDEX "RateLimitBucket_resetAt_idx" ON "RateLimitBucket"("resetAt");
CREATE UNIQUE INDEX "BetaParticipant_studentId_key" ON "BetaParticipant"("studentId");
CREATE INDEX "BetaParticipant_cohort_status_idx" ON "BetaParticipant"("cohort", "status");
CREATE INDEX "BetaParticipant_lastActiveAt_idx" ON "BetaParticipant"("lastActiveAt");
CREATE UNIQUE INDEX "ProgressSnapshot_studentId_kind_resourceId_key" ON "ProgressSnapshot"("studentId", "kind", "resourceId");
CREATE INDEX "ProgressSnapshot_studentId_updatedAt_idx" ON "ProgressSnapshot"("studentId", "updatedAt");
CREATE INDEX "ProgressSnapshot_expiresAt_idx" ON "ProgressSnapshot"("expiresAt");
CREATE UNIQUE INDEX "LearningEvent_eventKey_key" ON "LearningEvent"("eventKey");
CREATE INDEX "LearningEvent_studentId_occurredAt_idx" ON "LearningEvent"("studentId", "occurredAt");
CREATE INDEX "LearningEvent_type_occurredAt_idx" ON "LearningEvent"("type", "occurredAt");
CREATE INDEX "LearningEvent_testId_type_idx" ON "LearningEvent"("testId", "type");
CREATE UNIQUE INDEX "LearningRecord_attemptKey_key" ON "LearningRecord"("attemptKey");
CREATE INDEX "LearningRecord_studentId_kind_completedAt_idx" ON "LearningRecord"("studentId", "kind", "completedAt");
CREATE INDEX "LearningRecord_resourceId_completedAt_idx" ON "LearningRecord"("resourceId", "completedAt");
CREATE INDEX "AiEvaluation_userId_createdAt_idx" ON "AiEvaluation"("userId", "createdAt");
CREATE INDEX "AiEvaluation_route_status_createdAt_idx" ON "AiEvaluation"("route", "status", "createdAt");
CREATE INDEX "AiEvaluation_requestHash_createdAt_idx" ON "AiEvaluation"("requestHash", "createdAt");
CREATE UNIQUE INDEX "QuestionDraftRecord_questionId_version_key" ON "QuestionDraftRecord"("questionId", "version");
CREATE INDEX "QuestionDraftRecord_testId_stage_idx" ON "QuestionDraftRecord"("testId", "stage");
CREATE INDEX "QuestionDraftRecord_rightsStatus_stage_idx" ON "QuestionDraftRecord"("rightsStatus", "stage");
CREATE INDEX "QuestionDraftRecord_updatedAt_idx" ON "QuestionDraftRecord"("updatedAt");

ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BetaParticipant" ADD CONSTRAINT "BetaParticipant_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProgressSnapshot" ADD CONSTRAINT "ProgressSnapshot_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LearningEvent" ADD CONSTRAINT "LearningEvent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LearningRecord" ADD CONSTRAINT "LearningRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AiEvaluation" ADD CONSTRAINT "AiEvaluation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuestionDraftRecord" ADD CONSTRAINT "QuestionDraftRecord_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QuestionDraftRecord" ADD CONSTRAINT "QuestionDraftRecord_subjectReviewerId_fkey" FOREIGN KEY ("subjectReviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "QuestionDraftRecord" ADD CONSTRAINT "QuestionDraftRecord_teachingReviewerId_fkey" FOREIGN KEY ("teachingReviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
