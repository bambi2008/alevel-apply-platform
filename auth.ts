import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifyCode } from "@/lib/auth/phone-codes";
import { LEGAL_VERSION } from "@/lib/auth/security";
import {
  clientIp,
  consumePersistentRateLimit,
  rateLimitKey,
} from "@/lib/security/rate-limit";

const SESSION_TTL_MS = 30 * 24 * 60 * 60_000;
const SESSION_TOUCH_INTERVAL_MS = 15 * 60_000;

function cookieName() {
  return process.env.NODE_ENV === "production"
    ? "__Host-qiaoshen_session"
    : "qiaoshen_session";
}

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function privacyDigest(value: string) {
  const secret = process.env.AUTH_SECRET || "qiaoshen-local-session-secret";
  return digest(`${secret}\u0000${value}`);
}

function safeRedirect(value: unknown, fallback = "/") {
  const target = typeof value === "string" ? value : fallback;
  return target.startsWith("/") && !target.startsWith("//") ? target : fallback;
}

export class AuthError extends Error {
  type: "CredentialsSignin" | "Configuration";

  constructor(type: AuthError["type"], message: string) {
    super(message);
    this.name = "AuthError";
    this.type = type;
  }
}

export type AppSession = {
  user: {
    id: string;
    email?: string;
    phone?: string;
    role: "STUDENT" | "ADMIN" | "MENTOR";
    name?: string;
  };
  expires: string;
};

async function issueSession(userId: string, requestHeaders: Headers) {
  const rawToken = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.authSession.create({
    data: {
      userId,
      tokenHash: digest(rawToken),
      expiresAt,
      userAgentHash: requestHeaders.get("user-agent")
        ? privacyDigest(requestHeaders.get("user-agent")!)
        : null,
      ipHash: privacyDigest(clientIp(requestHeaders)),
    },
  });

  const active = await db.authSession.findMany({
    where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
    skip: 10,
    select: { id: true },
  });
  if (active.length) {
    await db.authSession.updateMany({
      where: { id: { in: active.map((session) => session.id) } },
      data: { revokedAt: new Date() },
    });
  }

  const cookieStore = await cookies();
  cookieStore.set(cookieName(), rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function auth(): Promise<AppSession | null> {
  const rawToken = (await cookies()).get(cookieName())?.value;
  if (!rawToken) return null;
  const now = new Date();
  const session = await db.authSession.findUnique({
    where: { tokenHash: digest(rawToken) },
    select: {
      id: true,
      expiresAt: true,
      lastSeenAt: true,
      revokedAt: true,
      user: {
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          profile: { select: { fullName: true } },
        },
      },
    },
  });
  if (!session || session.revokedAt || session.expiresAt <= now) return null;

  if (now.getTime() - session.lastSeenAt.getTime() >= SESSION_TOUCH_INTERVAL_MS) {
    await db.authSession.update({
      where: { id: session.id },
      data: { lastSeenAt: now },
    });
  }

  return {
    user: {
      id: session.user.id,
      email: session.user.email ?? undefined,
      phone: session.user.phone ?? undefined,
      role: session.user.role,
      name: session.user.profile?.fullName ?? undefined,
    },
    expires: session.expiresAt.toISOString(),
  };
}

export async function signIn(
  provider: "credentials" | "phone",
  options: Record<string, unknown>,
) {
  const requestHeaders = await headers();
  let user: { id: string } | null = null;

  if (provider === "credentials") {
    const email = String(options.email ?? "").trim().toLowerCase();
    const password = String(options.password ?? "");
    if (!email || !password) throw new AuthError("CredentialsSignin", "Invalid credentials");
    const limit = await consumePersistentRateLimit(
      rateLimitKey("password-login", clientIp(requestHeaders), email),
      { limit: 10, windowMs: 15 * 60_000 },
    );
    if (!limit.allowed) throw new AuthError("CredentialsSignin", "Too many attempts");
    const candidate = await db.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true },
    });
    if (!candidate?.passwordHash || !(await bcrypt.compare(password, candidate.passwordHash))) {
      throw new AuthError("CredentialsSignin", "Invalid credentials");
    }
    user = candidate;
  } else if (provider === "phone") {
    const phone = String(options.phone ?? "").trim();
    const code = String(options.code ?? "").trim();
    if (!/^1[3-9]\d{9}$/.test(phone) || !/^\d{6}$/.test(code)) {
      throw new AuthError("CredentialsSignin", "Invalid phone code");
    }
    const limit = await consumePersistentRateLimit(
      rateLimitKey("phone-login", clientIp(requestHeaders), phone),
      { limit: 10, windowMs: 15 * 60_000 },
    );
    if (!limit.allowed || !(await verifyCode(phone, code))) {
      throw new AuthError("CredentialsSignin", "Invalid phone code");
    }
    user = await db.user.findUnique({ where: { phone }, select: { id: true } });
    if (!user) {
      if (options.privacyConsent !== true || options.termsConsent !== true) {
        throw new AuthError("CredentialsSignin", "Consent is required for registration");
      }
      user = await db.$transaction(async (tx) => {
        const created = await tx.user.create({
          data: {
            phone,
            role: "STUDENT",
            consents: {
              create: [
                { type: "PRIVACY_PIPL", version: LEGAL_VERSION },
                { type: "TERMS", version: LEGAL_VERSION },
              ],
            },
            profile: { create: {} },
          },
          select: { id: true, profile: { select: { id: true } } },
        });
        if (!created.profile) throw new Error("Student profile was not created");
        await tx.betaParticipant.create({ data: { studentId: created.profile.id } });
        await tx.learningEvent.create({
          data: {
            studentId: created.profile.id,
            type: "REGISTERED",
            eventKey: `registered:${created.id}`,
          },
        });
        return { id: created.id };
      });
    }
  } else {
    throw new AuthError("Configuration", "Unsupported sign-in provider");
  }

  await issueSession(user.id, requestHeaders);
  redirect(safeRedirect(options.redirectTo, "/profile"));
}

export async function signOut(options: { redirectTo?: string } = {}) {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(cookieName())?.value;
  if (rawToken) {
    await db.authSession.updateMany({
      where: { tokenHash: digest(rawToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  cookieStore.delete(cookieName());
  redirect(safeRedirect(options.redirectTo));
}

export async function revokeAllUserSessions(userId: string) {
  await db.authSession.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function revokeOtherUserSessions(userId: string) {
  const rawToken = (await cookies()).get(cookieName())?.value;
  await db.authSession.updateMany({
    where: {
      userId,
      revokedAt: null,
      ...(rawToken ? { tokenHash: { not: digest(rawToken) } } : {}),
    },
    data: { revokedAt: new Date() },
  });
}
