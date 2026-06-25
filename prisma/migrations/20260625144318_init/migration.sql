-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN', 'MENTOR');

-- CreateEnum
CREATE TYPE "ConsentType" AS ENUM ('PRIVACY_PIPL', 'CROSS_BORDER', 'GUARDIAN', 'MARKETING');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('UK', 'HK');

-- CreateEnum
CREATE TYPE "GradeKind" AS ENUM ('AS', 'PREDICTED', 'ACTUAL');

-- CreateEnum
CREATE TYPE "AppSystem" AS ENUM ('UCAS', 'DIRECT', 'BOTH');

-- CreateEnum
CREATE TYPE "ApplyRoute" AS ENUM ('UCAS', 'HK_DIRECT');

-- CreateEnum
CREATE TYPE "DegreeType" AS ENUM ('BA', 'BSc', 'BEng', 'LLB', 'MBChB', 'OTHER');

-- CreateEnum
CREATE TYPE "ChoiceType" AS ENUM ('UCAS_CHOICE', 'HK_DIRECT');

-- CreateEnum
CREATE TYPE "AppStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'SUBMITTED', 'INTERVIEW', 'OFFER', 'REJECTED', 'ACCEPTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "OfferType" AS ENUM ('CONDITIONAL', 'UNCONDITIONAL');

-- CreateEnum
CREATE TYPE "OfferDecision" AS ENUM ('FIRM', 'INSURANCE', 'DECLINE', 'ACCEPTED');

-- CreateEnum
CREATE TYPE "DocType" AS ENUM ('TRANSCRIPT', 'PASSPORT', 'PREDICTED_GRADES', 'IELTS', 'TOEFL', 'CERTIFICATE', 'PHOTO', 'OTHER');

-- CreateEnum
CREATE TYPE "PsKind" AS ENUM ('UK_UCAS_3Q', 'HK_ESSAY');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'DOING', 'DONE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "passwordHash" TEXT,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "locale" TEXT NOT NULL DEFAULT 'zh-CN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ConsentType" NOT NULL,
    "version" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT,
    "school" TEXT,
    "isMinor" BOOLEAN NOT NULL DEFAULT false,
    "intakeYear" INTEGER,
    "targetRegions" "Region"[],
    "intendedMajors" TEXT[],
    "budgetNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ALevelSubject" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "kind" "GradeKind" NOT NULL,
    "grade" TEXT NOT NULL,

    CONSTRAINT "ALevelSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestScore" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "overall" DOUBLE PRECISION,
    "subscores" JSONB,
    "takenAt" TIMESTAMP(3),

    CONSTRAINT "TestScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameZh" TEXT,
    "region" "Region" NOT NULL,
    "city" TEXT,
    "league" TEXT,
    "qsRankWorld" INTEGER,
    "qsRankSubject" JSONB,
    "ucasCode" TEXT,
    "ucasInstitutionCode" TEXT,
    "website" TEXT,
    "admissionsUrl" TEXT,
    "logoUrl" TEXT,
    "applicationSystem" "AppSystem",
    "applicationPortalUrl" TEXT,
    "applicationFeeGbp" INTEGER,
    "applicationFeeHkd" INTEGER,
    "maxChoices" INTEGER,
    "openDate" TIMESTAMP(3),
    "deadlineEarly" TIMESTAMP(3),
    "deadlineMain" TIMESTAMP(3),
    "deadlineLate" TIMESTAMP(3),
    "resultReleaseFrom" TIMESTAMP(3),
    "resultReleaseTo" TIMESTAMP(3),
    "ranking" JSONB,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameZh" TEXT,
    "degreeType" "DegreeType",
    "durationYears" INTEGER,
    "applyRoute" "ApplyRoute" NOT NULL,
    "ucasCourseCode" TEXT,
    "coursePageUrl" TEXT,
    "mode" TEXT,
    "acceptsGapYear" BOOLEAN,
    "deadlineEarlyOverride" TIMESTAMP(3),
    "annualTuitionGbp" INTEGER,
    "annualTuitionHkd" INTEGER,
    "alevelOfferTypical" TEXT,
    "alevelOfferMinimum" TEXT,
    "requiredSubjects" JSONB,
    "preferredSubjects" TEXT[],
    "excludedSubjects" TEXT[],
    "asLevelRequired" BOOLEAN,
    "epqConsidered" BOOLEAN,
    "gcseMinEnglish" INTEGER,
    "gcseMinMaths" INTEGER,
    "ibMinimum" INTEGER,
    "satAccepted" BOOLEAN,
    "ieltsOverall" DOUBLE PRECISION,
    "ieltsSubscores" JSONB,
    "toeflMinimum" INTEGER,
    "languageExemptions" TEXT,
    "admissionsTest" TEXT,
    "interviewRequired" BOOLEAN,
    "scholarshipAvailable" BOOLEAN,
    "scholarshipUrl" TEXT,
    "acceptanceRate" DOUBLE PRECISION,
    "avgOfferGrade" TEXT,
    "intlStudentRatio" DOUBLE PRECISION,
    "mainlandChinaCohort" INTEGER,
    "dataYear" INTEGER,
    "requirementsText" TEXT,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "choiceType" "ChoiceType" NOT NULL,
    "status" "AppStatus" NOT NULL DEFAULT 'PLANNING',
    "externalRef" TEXT,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "type" "OfferType" NOT NULL,
    "conditions" TEXT,
    "decision" "OfferDecision",
    "deadline" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "type" "DocType" NOT NULL,
    "fileKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mime" TEXT,
    "size" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationDocument" (
    "applicationId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "ApplicationDocument_pkey" PRIMARY KEY ("applicationId","documentId")
);

-- CreateTable
CREATE TABLE "PersonalStatement" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "kind" "PsKind" NOT NULL,
    "title" TEXT,
    "content" JSONB NOT NULL,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PersonalStatement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalStatementVersion" (
    "id" TEXT NOT NULL,
    "statementId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PersonalStatementVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "applicationId" TEXT,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "dueDate" TIMESTAMP(3),
    "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentArticle" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT,
    "entityId" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Consent_userId_idx" ON "Consent"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");

-- CreateIndex
CREATE INDEX "ALevelSubject_profileId_idx" ON "ALevelSubject"("profileId");

-- CreateIndex
CREATE INDEX "TestScore_profileId_idx" ON "TestScore"("profileId");

-- CreateIndex
CREATE INDEX "University_region_idx" ON "University"("region");

-- CreateIndex
CREATE INDEX "Program_universityId_idx" ON "Program"("universityId");

-- CreateIndex
CREATE INDEX "Program_applyRoute_idx" ON "Program"("applyRoute");

-- CreateIndex
CREATE INDEX "Application_studentId_idx" ON "Application"("studentId");

-- CreateIndex
CREATE INDEX "Application_programId_idx" ON "Application"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "Offer_applicationId_key" ON "Offer"("applicationId");

-- CreateIndex
CREATE INDEX "Document_ownerId_idx" ON "Document"("ownerId");

-- CreateIndex
CREATE INDEX "PersonalStatement_studentId_idx" ON "PersonalStatement"("studentId");

-- CreateIndex
CREATE INDEX "PersonalStatementVersion_statementId_idx" ON "PersonalStatementVersion"("statementId");

-- CreateIndex
CREATE INDEX "Task_studentId_idx" ON "Task"("studentId");

-- CreateIndex
CREATE INDEX "Task_applicationId_idx" ON "Task"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentArticle_slug_locale_key" ON "ContentArticle"("slug", "locale");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");

-- AddForeignKey
ALTER TABLE "Consent" ADD CONSTRAINT "Consent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ALevelSubject" ADD CONSTRAINT "ALevelSubject_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestScore" ADD CONSTRAINT "TestScore_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationDocument" ADD CONSTRAINT "ApplicationDocument_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationDocument" ADD CONSTRAINT "ApplicationDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalStatement" ADD CONSTRAINT "PersonalStatement_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalStatementVersion" ADD CONSTRAINT "PersonalStatementVersion_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "PersonalStatement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
