-- AlterTable
ALTER TABLE "StudentProfile"
ADD COLUMN "intendedUniversities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
