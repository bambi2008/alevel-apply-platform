-- CreateTable
CREATE TABLE "ExamSession" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "totalEarned" INTEGER NOT NULL,
    "totalMax" INTEGER NOT NULL,
    "timeUsedSec" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamAnswer" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "selected" TEXT,
    "work" JSONB,
    "earned" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,
    "feedback" JSONB,

    CONSTRAINT "ExamAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExamSession_studentId_idx" ON "ExamSession"("studentId");

-- CreateIndex
CREATE INDEX "ExamSession_testId_idx" ON "ExamSession"("testId");

-- CreateIndex
CREATE INDEX "ExamAnswer_sessionId_idx" ON "ExamAnswer"("sessionId");

-- AddForeignKey
ALTER TABLE "ExamSession" ADD CONSTRAINT "ExamSession_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAnswer" ADD CONSTRAINT "ExamAnswer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ExamSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
