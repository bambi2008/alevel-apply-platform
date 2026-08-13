INSERT INTO "BetaParticipant" (
  "id", "studentId", "cohort", "status", "onboardingCompletedAt",
  "lastActiveAt", "createdAt", "updatedAt"
)
SELECT
  'beta_' || md5(profile."id"),
  profile."id",
  'beta-2026-1',
  'ACTIVE',
  CASE WHEN
    profile."fullName" IS NOT NULL
    AND profile."school" IS NOT NULL
    AND profile."intakeYear" IS NOT NULL
    AND COALESCE(array_length(profile."targetRegions", 1), 0) > 0
    AND COALESCE(array_length(profile."intendedMajors", 1), 0) > 0
    AND EXISTS (SELECT 1 FROM "ALevelSubject" subject WHERE subject."profileId" = profile."id")
  THEN profile."updatedAt" ELSE NULL END,
  COALESCE((
    SELECT max(session."completedAt")
    FROM "ExamSession" session
    WHERE session."studentId" = profile."id"
  ), account."createdAt"),
  account."createdAt",
  CURRENT_TIMESTAMP
FROM "StudentProfile" profile
JOIN "User" account ON account."id" = profile."userId"
WHERE account."role" = 'STUDENT'
ON CONFLICT ("studentId") DO NOTHING;

INSERT INTO "LearningEvent" (
  "id", "studentId", "type", "eventKey", "occurredAt", "createdAt"
)
SELECT
  'event_' || md5('registered:' || account."id"),
  profile."id",
  'REGISTERED',
  'registered:' || account."id",
  account."createdAt",
  CURRENT_TIMESTAMP
FROM "StudentProfile" profile
JOIN "User" account ON account."id" = profile."userId"
WHERE account."role" = 'STUDENT'
ON CONFLICT ("eventKey") DO NOTHING;

INSERT INTO "LearningEvent" (
  "id", "studentId", "type", "eventKey", "occurredAt", "createdAt"
)
SELECT
  'event_' || md5('profile-completed:' || profile."id"),
  profile."id",
  'PROFILE_COMPLETED',
  'profile-completed:' || profile."id",
  profile."updatedAt",
  CURRENT_TIMESTAMP
FROM "StudentProfile" profile
JOIN "User" account ON account."id" = profile."userId"
WHERE account."role" = 'STUDENT'
  AND profile."fullName" IS NOT NULL
  AND profile."school" IS NOT NULL
  AND profile."intakeYear" IS NOT NULL
  AND COALESCE(array_length(profile."targetRegions", 1), 0) > 0
  AND COALESCE(array_length(profile."intendedMajors", 1), 0) > 0
  AND EXISTS (SELECT 1 FROM "ALevelSubject" subject WHERE subject."profileId" = profile."id")
ON CONFLICT ("eventKey") DO NOTHING;
