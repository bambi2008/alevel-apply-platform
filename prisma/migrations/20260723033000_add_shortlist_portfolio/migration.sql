CREATE TABLE "ShortlistItem" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "note" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ShortlistItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ShortlistItem_studentId_programId_key" ON "ShortlistItem"("studentId", "programId");
CREATE INDEX "ShortlistItem_studentId_priority_idx" ON "ShortlistItem"("studentId", "priority");
CREATE INDEX "ShortlistItem_programId_idx" ON "ShortlistItem"("programId");
ALTER TABLE "ShortlistItem" ADD CONSTRAINT "ShortlistItem_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ShortlistItem" ADD CONSTRAINT "ShortlistItem_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
