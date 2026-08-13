import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import type { Prisma, QuestionWorkflowStage } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { questionDraftSchema, validateDraft, type QuestionDraft } from "@/lib/tests/authoring";

const STAGE_ORDER: QuestionWorkflowStage[] = ["DRAFT", "SUBJECT_REVIEW", "TEACHING_REVIEW", "APPROVED"];

async function currentAdmin() {
  const session = await auth();
  return session?.user.role === "ADMIN" ? session.user : null;
}

function contentHash(draft: QuestionDraft) {
  return createHash("sha256").update(JSON.stringify(draft.question)).digest("hex");
}

function stageOf(draft: QuestionDraft) {
  return draft.review.stage as QuestionWorkflowStage;
}

export async function GET() {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const records = await db.questionDraftRecord.findMany({
    orderBy: { updatedAt: "desc" },
    take: 500,
    select: { payload: true },
  });
  return NextResponse.json({ drafts: records.map((record) => record.payload) });
}

export async function PUT(request: NextRequest) {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 4 * 1024 * 1024) return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  const raw = await request.json().catch(() => null) as { drafts?: unknown[] } | null;
  if (!raw || !Array.isArray(raw.drafts) || raw.drafts.length > 500) {
    return NextResponse.json({ error: "Invalid workspace" }, { status: 400 });
  }
  const parsed = raw.drafts.map((draft) => questionDraftSchema.safeParse(draft));
  const invalid = parsed.find((item) => !item.success);
  if (invalid && !invalid.success) {
    return NextResponse.json({ error: "Invalid draft", issues: invalid.error.issues.slice(0, 10) }, { status: 400 });
  }
  const drafts = parsed.map((item) => item.data!);

  try {
    await db.$transaction(async (tx) => {
      for (const draft of drafts) {
        const existing = await tx.questionDraftRecord.findUnique({ where: { id: draft.draftId } });
        const nextStage = stageOf(draft);
        const validation = validateDraft(draft);
        if (!existing && nextStage !== "DRAFT") {
          throw new Error(`New draft ${draft.question.id} must enter the workflow as a draft`);
        }
        if (nextStage === "APPROVED" && validation.issues.some((issue) => issue.severity === "critical")) {
          throw new Error(`Draft ${draft.question.id} has release blockers`);
        }

        let subjectReviewerId = existing?.subjectReviewerId ?? null;
        let subjectReviewedAt = existing?.subjectReviewedAt ?? null;
        let teachingReviewerId = existing?.teachingReviewerId ?? null;
        let teachingReviewedAt = existing?.teachingReviewedAt ?? null;
        let publishedAt = existing?.publishedAt ?? null;
        let authorId = existing?.authorId ?? admin.id;

        if (existing) {
          const currentIndex = STAGE_ORDER.indexOf(existing.stage);
          const nextIndex = STAGE_ORDER.indexOf(nextStage);
          const revision = draft.version > existing.version && nextStage === "DRAFT";
          const protectedContentChanged = existing.stage !== "DRAFT" && (
            existing.contentHash !== contentHash(draft)
            || existing.sourceType !== draft.source.type
            || existing.sourceTitle !== draft.source.title
            || (existing.sourceUrl ?? "") !== (draft.source.url ?? "")
            || existing.rightsStatus !== draft.source.rights
          );
          if (protectedContentChanged && !revision) {
            throw new Error(`Reviewed content ${draft.question.id} requires a new draft version`);
          }
          if (!revision && (nextIndex < currentIndex || nextIndex > currentIndex + 1)) {
            throw new Error(`Invalid workflow transition for ${draft.question.id}`);
          }
          if (revision) {
            authorId = admin.id;
            subjectReviewerId = null;
            subjectReviewedAt = null;
            teachingReviewerId = null;
            teachingReviewedAt = null;
            publishedAt = null;
          } else if (existing.stage === "SUBJECT_REVIEW" && nextStage === "TEACHING_REVIEW") {
            subjectReviewerId = admin.id;
            subjectReviewedAt = new Date();
          } else if (existing.stage === "TEACHING_REVIEW" && nextStage === "APPROVED") {
            if (!subjectReviewerId || subjectReviewerId === admin.id) {
              throw new Error(`A second administrator must complete teaching review for ${draft.question.id}`);
            }
            teachingReviewerId = admin.id;
            teachingReviewedAt = new Date();
            publishedAt = new Date();
          }
        }

        await tx.questionDraftRecord.upsert({
          where: { id: draft.draftId },
          update: {
            questionId: draft.question.id,
            testId: draft.question.testId,
            topicId: draft.question.topicId,
            version: draft.version,
            stage: nextStage,
            contentHash: contentHash(draft),
            payload: draft as unknown as Prisma.InputJsonValue,
            sourceType: draft.source.type,
            sourceTitle: draft.source.title,
            sourceUrl: draft.source.url || null,
            rightsStatus: draft.source.rights,
            authorId,
            subjectReviewerId,
            subjectReviewedAt,
            teachingReviewerId,
            teachingReviewedAt,
            publishedAt,
          },
          create: {
            id: draft.draftId,
            questionId: draft.question.id,
            testId: draft.question.testId,
            topicId: draft.question.topicId,
            version: draft.version,
            stage: nextStage,
            contentHash: contentHash(draft),
            payload: draft as unknown as Prisma.InputJsonValue,
            sourceType: draft.source.type,
            sourceTitle: draft.source.title,
            sourceUrl: draft.source.url || null,
            rightsStatus: draft.source.rights,
            authorId,
            subjectReviewerId,
            subjectReviewedAt,
            teachingReviewerId,
            teachingReviewedAt,
            publishedAt,
          },
        });
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Workspace save failed" }, { status: 409 });
  }
  return NextResponse.json({ saved: drafts.length });
}

export async function DELETE(request: NextRequest) {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing draft id" }, { status: 400 });
  const record = await db.questionDraftRecord.findUnique({ where: { id }, select: { stage: true } });
  if (record?.stage === "APPROVED") return NextResponse.json({ error: "Approved questions must be retired, not deleted" }, { status: 409 });
  await db.questionDraftRecord.deleteMany({ where: { id } });
  return NextResponse.json({ deleted: true });
}
