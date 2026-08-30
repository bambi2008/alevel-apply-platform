import { randomBytes } from "node:crypto";
import { hashOpaqueToken, normalizeEmail } from "@/lib/auth/security";

export const BETA_COHORT = "beta-2026-1";
export const BETA_REGISTRATION_LIMIT = 20;
export const BETA_INVITE_LOCK_ID = 2026080901;

type RegistrationInvite = {
  email: string;
  cohort: string;
  status: "AVAILABLE" | "USED" | "REVOKED";
  expiresAt: Date | null;
  usedByUserId: string | null;
};

export function classifyRegistrationInvite(
  invite: RegistrationInvite | null,
  email: string,
  existingUserId: string | null,
  now = new Date(),
): "AVAILABLE" | "EXISTS" | "INVALID" {
  if (!invite || invite.email !== email || invite.cohort !== BETA_COHORT) return "INVALID";
  if (invite.status === "USED") {
    return invite.usedByUserId && invite.usedByUserId === existingUserId ? "EXISTS" : "INVALID";
  }
  if (invite.status !== "AVAILABLE" || (invite.expiresAt && invite.expiresAt <= now)) return "INVALID";
  return existingUserId ? "EXISTS" : "AVAILABLE";
}

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function normalizeInviteCode(value: unknown): string {
  return String(value ?? "").trim().toUpperCase().replace(/[\s-]+/g, "");
}

export function hashInviteCode(value: unknown): string {
  return hashOpaqueToken(normalizeInviteCode(value));
}

export function createInviteCode(): string {
  const bytes = randomBytes(10);
  let body = "";
  for (const byte of bytes) body += ALPHABET[byte % ALPHABET.length];
  return `QS-${body.slice(0, 5)}-${body.slice(5)}`;
}

export function parseInviteEmails(value: unknown): string[] {
  return Array.from(new Set(
    String(value ?? "")
      .split(/[\s,;]+/)
      .map(normalizeEmail)
      .filter(Boolean),
  ));
}
