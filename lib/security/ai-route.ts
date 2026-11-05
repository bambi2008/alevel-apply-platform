import { NextRequest, NextResponse } from "next/server";
import { clientIp, consumePersistentRateLimit, rateLimitKey } from "./rate-limit";
import { membershipAccess } from "@/lib/membership/access";
import { privateNoStore, sameOriginWrite } from "./json-request";

const MAX_AI_REQUEST_BYTES = 128 * 1024;

export async function requireAiAccess(
  request: NextRequest,
  namespace: string,
  limit = 60,
): Promise<
  | { ok: true; userId: string }
  | { ok: false; response: NextResponse }
> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_AI_REQUEST_BYTES) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Request is too large" }, { status: 413, headers: privateNoStore }),
    };
  }

  const { auth } = await import("@/auth");
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Authentication required" }, { status: 401, headers: privateNoStore }),
    };
  }
  const originError = sameOriginWrite(request);
  if (originError) return { ok: false, response: originError };

  const access = await membershipAccess(userId);
  if (!access.active) return { ok: false, response: NextResponse.json({ error: access.membership?.plan === "trial" ? "trial_expired" : "membership_required" }, { status: 402, headers: { "Cache-Control": "private, no-store" } }) };

  if (process.env.AI_REQUIRES_CROSS_BORDER_CONSENT !== "false") {
    const { db } = await import("@/lib/db");
    const consent = await db.consent.findFirst({
      where: { userId, type: "CROSS_BORDER" },
      select: { id: true },
    });
    if (!consent) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "AI processing consent required", consentRequired: true },
          { status: 403, headers: privateNoStore },
        ),
      };
    }
  }

  const rateLimit = await consumePersistentRateLimit(
    rateLimitKey(`ai:${namespace}`, userId, clientIp(request.headers)),
    { limit, windowMs: 60 * 60_000 },
  );
  if (!rateLimit.allowed) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "AI request rate limit reached" },
        {
          status: 429,
          headers: { ...privateNoStore, "Retry-After": String(rateLimit.retryAfterSeconds) },
        },
      ),
    };
  }

  return { ok: true, userId };
}
