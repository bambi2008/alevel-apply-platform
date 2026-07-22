CREATE TYPE "StudyTaskStatus" AS ENUM ('PLANNED', 'DONE', 'SKIPPED');
CREATE TYPE "StudyTaskKind" AS ENUM ('DIAGNOSTIC', 'REVIEW', 'FOCUS', 'MOCK');

CREATE TABLE "StudyGoal" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "targetLevel" TEXT,
    "weeklyMinutes" INTEGER NOT NULL DEFAULT 180,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "StudyGoal_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StudyTask" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "goalId" TEXT,
    "testId" TEXT NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "kind" "StudyTaskKind" NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT,
    "href" TEXT NOT NULL,
    "topicId" TEXT,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL,
    "status" "StudyTaskStatus" NOT NULL DEFAULT 'PLANNED',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "StudyTask_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "StudyGoal_studentId_testId_key" ON "StudyGoal"("studentId", "testId");
CREATE INDEX "StudyGoal_studentId_active_idx" ON "StudyGoal"("studentId", "active");
CREATE UNIQUE INDEX "StudyTask_studentId_sourceKey_scheduledFor_key" ON "StudyTask"("studentId", "sourceKey", "scheduledFor");
CREATE INDEX "StudyTask_studentId_scheduledFor_status_idx" ON "StudyTask"("studentId", "scheduledFor", "status");
CREATE INDEX "StudyTask_goalId_idx" ON "StudyTask"("goalId");

ALTER TABLE "StudyGoal" ADD CONSTRAINT "StudyGoal_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudyTask" ADD CONSTRAINT "StudyTask_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudyTask" ADD CONSTRAINT "StudyTask_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "StudyGoal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
