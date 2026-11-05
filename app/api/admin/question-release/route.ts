import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isConfiguredAdmin } from "@/lib/admin/allowlist";
import { boundedJson, privateNoStore, sameOriginWrite } from "@/lib/security/json-request";
import { consumePersistentRateLimit, rateLimitKey } from "@/lib/security/rate-limit";
import { createReleasePackage, questionDraftSchema } from "@/lib/tests/authoring";
import { isReleasedPublishedQuestion } from "@/lib/tests/practice-banks";
import { z } from "zod";

const schema = z.object({ draftIds: z.array(z.string().min(1).max(120)).min(1).max(500) }).strict();

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!isConfiguredAdmin(session?.user)) return NextResponse.json({ error: "forbidden" }, { status: 403, headers: privateNoStore });
  const originError = sameOriginWrite(request);
  if (originError) return originError;
  const body = await boundedJson(request, 64 * 1024);
  if (!body.ok) return body.response;
  const parsed = schema.safeParse(body.value);
  if (!parsed.success || new Set(parsed.data?.draftIds).size !== parsed.data?.draftIds.length) return NextResponse.json({ error: "invalid_body" }, { status: 400, headers: privateNoStore });
  const limit = await consumePersistentRateLimit(rateLimitKey("question-release", session!.user.id), { limit: 30, windowMs: 3_600_000 });
  if (!limit.allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { ...privateNoStore, "Retry-After": String(limit.retryAfterSeconds) } });
  const records = await db.questionDraftRecord.findMany({ where: { id: { in: parsed.data.draftIds }, stage: "APPROVED", rightsStatus: { in: ["OWNED", "LICENSED"] } }, select: { payload: true, subjectReviewerId: true, teachingReviewerId: true } });
  if (records.length !== parsed.data.draftIds.length || records.some(row => !row.subjectReviewerId || !row.teachingReviewerId || row.subjectReviewerId === row.teachingReviewerId)) return NextResponse.json({ error: "review_required" }, { status: 409, headers: privateNoStore });
  const drafts = records.map(row => questionDraftSchema.safeParse(row.payload));
  if (drafts.some(draft => !draft.success)) return NextResponse.json({ error: "invalid_stored_draft" }, { status: 409, headers: privateNoStore });
  const release = createReleasePackage(drafts.flatMap(draft => draft.success ? [draft.data] : []), isReleasedPublishedQuestion);
  return NextResponse.json(release, { status: release.releasable ? 200 : 409, headers: privateNoStore });
}
