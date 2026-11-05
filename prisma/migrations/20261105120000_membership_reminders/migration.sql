ALTER TABLE "Notification" ADD COLUMN "emailAttemptedAt" TIMESTAMP(3), ADD COLUMN "emailSentAt" TIMESTAMP(3);
ALTER TABLE "NotificationPreference" ADD COLUMN "membershipEmailEnabled" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "PaymentComplaint" ADD COLUMN "emailAttemptedAt" TIMESTAMP(3);
