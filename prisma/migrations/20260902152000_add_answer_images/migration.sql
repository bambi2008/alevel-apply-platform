CREATE TABLE "AnswerImage" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "contextKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnswerImage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AnswerImage_fileKey_key" ON "AnswerImage"("fileKey");
CREATE INDEX "AnswerImage_ownerId_createdAt_idx" ON "AnswerImage"("ownerId", "createdAt");

ALTER TABLE "AnswerImage"
ADD CONSTRAINT "AnswerImage_ownerId_fkey"
FOREIGN KEY ("ownerId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
