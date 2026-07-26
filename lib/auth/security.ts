import { createHash, randomBytes } from "node:crypto";

export const LEGAL_VERSION = "2026-07-26";
export const PASSWORD_RESET_TTL_MS = 30 * 60_000;

export function normalizeEmail(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

export function isStrongPassword(password: string): boolean {
  return password.length >= 10 && password.length <= 128;
}

export function createOpaqueToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashOpaqueToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}
