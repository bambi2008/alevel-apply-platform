-- CreateEnum
CREATE TYPE "StudentProjectStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETE');

-- CreateEnum
CREATE TYPE "AppPrepRegion" AS ENUM ('UK_UCAS', 'HK');

-- AlterTable
ALTER TABLE "Program" ADD COLUMN "verifiedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN "guideProgress" JSONB;

-- CreateTable
CREATE TABLE "StudentProject" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "summary" TEXT,
    "ideaInputs" JSONB NOT NULL,
    "structure" JSONB,
    "progress" JSONB,
    "status" "StudentProjectStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "StudentProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationPrep" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "region" "AppPrepRegion" NOT NULL,
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ApplicationPrep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BackgroundItem" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "catalogId" TEXT,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "field" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "notes" TEXT,
    "targetDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BackgroundItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhoneCode" (
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastSentAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PhoneCode_pkey" PRIMARY KEY ("phone")
);

-- CreateIndex
CREATE INDEX "StudentProject_ownerId_idx" ON "StudentProject"("ownerId");
CREATE INDEX "ApplicationPrep_ownerId_idx" ON "ApplicationPrep"("ownerId");
CREATE UNIQUE INDEX "ApplicationPrep_ownerId_region_key" ON "ApplicationPrep"("ownerId", "region");
CREATE INDEX "BackgroundItem_studentId_idx" ON "BackgroundItem"("studentId");

-- AddForeignKey
ALTER TABLE "StudentProject" ADD CONSTRAINT "StudentProject_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ApplicationPrep" ADD CONSTRAINT "ApplicationPrep_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BackgroundItem" ADD CONSTRAINT "BackgroundItem_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
