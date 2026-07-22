CREATE TYPE "MaterialStatus" AS ENUM ('MISSING', 'READY', 'NEEDS_UPDATE', 'WAIVED');
CREATE TYPE "RecommendationStatus" AS ENUM ('PENDING', 'SUBMITTED', 'REVOKED', 'EXPIRED');

ALTER TABLE "Application" ADD COLUMN "feePaid" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Document" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Document" ADD COLUMN "validUntil" TIMESTAMP(3);
ALTER TABLE "Document" ADD COLUMN "supersedesId" TEXT;

CREATE TABLE "ApplicationMaterial" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "acceptedTypes" "DocType"[] NOT NULL,
    "status" "MaterialStatus" NOT NULL DEFAULT 'MISSING',
    "documentId" TEXT,
    "dueDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ApplicationMaterial_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RecommendationRequest" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "materialId" TEXT,
    "recommenderName" TEXT NOT NULL,
    "recommenderEmail" TEXT,
    "message" TEXT,
    "tokenHash" TEXT NOT NULL,
    "status" "RecommendationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "documentId" TEXT,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RecommendationRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ApplicationMaterial_applicationId_key_key" ON "ApplicationMaterial"("applicationId", "key");
CREATE INDEX "ApplicationMaterial_applicationId_status_idx" ON "ApplicationMaterial"("applicationId", "status");
CREATE INDEX "ApplicationMaterial_documentId_idx" ON "ApplicationMaterial"("documentId");
CREATE UNIQUE INDEX "RecommendationRequest_tokenHash_key" ON "RecommendationRequest"("tokenHash");
CREATE INDEX "RecommendationRequest_applicationId_status_idx" ON "RecommendationRequest"("applicationId", "status");
CREATE INDEX "RecommendationRequest_materialId_idx" ON "RecommendationRequest"("materialId");
CREATE INDEX "Document_supersedesId_idx" ON "Document"("supersedesId");

ALTER TABLE "Document" ADD CONSTRAINT "Document_supersedesId_fkey" FOREIGN KEY ("supersedesId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ApplicationMaterial" ADD CONSTRAINT "ApplicationMaterial_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ApplicationMaterial" ADD CONSTRAINT "ApplicationMaterial_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RecommendationRequest" ADD CONSTRAINT "RecommendationRequest_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RecommendationRequest" ADD CONSTRAINT "RecommendationRequest_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "ApplicationMaterial"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RecommendationRequest" ADD CONSTRAINT "RecommendationRequest_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;
