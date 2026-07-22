import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { evaluateMatch, type IeltsSubscores, type MatchResult, type SubjectRequirement } from "@/lib/matching";
import { analyzePortfolio, categoryRank } from "@/lib/portfolio/analyze";

const actionSchema = z.object({
  action: z.enum(["add", "remove", "apply", "note"]),
  programId: z.string().min(1),
  note: z.string().trim().max(500).optional(),
});

async function currentUserId() {
  const session = await auth();
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

async function studentContext(userId: string) {
  return db.studentProfile.findUnique({ where: { userId }, include: { subjects: true, testScores: true } });
}

function evaluate(profile: NonNullable<Awaited<ReturnType<typeof studentContext>>>, program: {
  alevelOfferTypical: string | null; alevelOfferMinimum: string | null; requiredSubjects: unknown;
  excludedSubjects: string[]; ieltsOverall: number | null; ieltsSubscores: unknown;
}): MatchResult {
  const ielts = profile.testScores.find((score) => score.type === "IELTS");
  return evaluateMatch({
    grades: profile.subjects.map((subject) => ({ subject: subject.subject, grade: subject.grade })),
    ielts: ielts?.overall,
    ieltsSubscores: (ielts?.subscores as IeltsSubscores | null) ?? null,
  }, {
    typicalOffer: program.alevelOfferTypical,
    minimumOffer: program.alevelOfferMinimum,
    requiredSubjects: (program.requiredSubjects as SubjectRequirement[] | null) ?? [],
    excludedSubjects: program.excludedSubjects,
    ielts: program.ieltsOverall,
    ieltsSubscores: (program.ieltsSubscores as IeltsSubscores | null) ?? null,
  });
}

function programView(program: {
  id: string; name: string; nameZh: string | null; field: string | null; applyRoute: string;
  alevelOfferTypical: string | null; alevelOfferMinimum: string | null; ieltsOverall: number | null;
  admissionsTest: string | null; annualTuitionGbp: number | null; annualTuitionHkd: number | null;
  university: { id: string; name: string; nameZh: string | null; region: "UK" | "HK"; city: string | null; qsRankWorld: number | null };
}) {
  return {
    id: program.id, name: program.name, nameZh: program.nameZh, field: program.field, applyRoute: program.applyRoute,
    typicalOffer: program.alevelOfferTypical, minimumOffer: program.alevelOfferMinimum, ielts: program.ieltsOverall,
    admissionsTest: program.admissionsTest, tuitionGbp: program.annualTuitionGbp, tuitionHkd: program.annualTuitionHkd,
    university: program.university,
  };
}

export async function GET(request: NextRequest) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = await studentContext(userId);
  if (!profile || profile.subjects.length === 0) return NextResponse.json({ needsProfile: true, shortlist: [], recommendations: [] });
  const field = request.nextUrl.searchParams.get("field")?.trim() || null;
  const region = request.nextUrl.searchParams.get("region") as "UK" | "HK" | null;
  const [programs, shortlistRows, applications] = await Promise.all([
    db.program.findMany({
      where: { ...(field ? { field } : {}), ...(region ? { university: { region } } : {}) },
      include: { university: true }, orderBy: [{ university: { qsRankWorld: "asc" } }, { name: "asc" }],
    }),
    db.shortlistItem.findMany({ where: { studentId: profile.id }, include: { program: { include: { university: true } } }, orderBy: [{ priority: "desc" }, { createdAt: "asc" }] }),
    db.application.findMany({ where: { studentId: profile.id }, select: { id: true, programId: true } }),
  ]);
  const applicationMap = new Map(applications.map((item) => [item.programId, item.id]));
  const shortlist = shortlistRows.map((row) => {
    const match = evaluate(profile, row.program);
    return { id: row.id, note: row.note, priority: row.priority, program: programView(row.program), match, applicationId: applicationMap.get(row.programId) ?? null };
  });
  const shortlisted = new Set(shortlistRows.map((row) => row.programId));
  const recommendations = programs
    .map((program) => ({ program: programView(program), match: evaluate(profile, program), shortlisted: shortlisted.has(program.id), applicationId: applicationMap.get(program.id) ?? null }))
    .filter((item) => item.match.category !== "out_of_reach")
    .sort((a, b) => categoryRank(a.match.category) - categoryRank(b.match.category) || (a.program.university.qsRankWorld ?? 999) - (b.program.university.qsRankWorld ?? 999))
    .slice(0, 30);
  const analysis = analyzePortfolio(shortlist.map((item) => ({ category: item.match.category, region: item.program.university.region, universityId: item.program.university.id })), profile.targetRegions);
  return NextResponse.json({ needsProfile: false, shortlist, recommendations, analysis, selectedField: field, selectedRegion: region });
}

export async function POST(request: NextRequest) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = actionSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const profile = await db.studentProfile.upsert({ where: { userId }, create: { userId }, update: {} });
  const { action, programId, note } = parsed.data;
  if (action === "add") await db.shortlistItem.upsert({ where: { studentId_programId: { studentId: profile.id, programId } }, create: { studentId: profile.id, programId }, update: {} });
  if (action === "remove") await db.shortlistItem.deleteMany({ where: { studentId: profile.id, programId } });
  if (action === "note") await db.shortlistItem.updateMany({ where: { studentId: profile.id, programId }, data: { note: note || null } });
  if (action === "apply") {
    const program = await db.program.findUnique({ where: { id: programId }, select: { applyRoute: true } });
    if (!program) return NextResponse.json({ error: "Program not found" }, { status: 404 });
    const existing = await db.application.findFirst({ where: { studentId: profile.id, programId } });
    if (!existing && program.applyRoute === "UCAS") {
      const ucasCount = await db.application.count({ where: { studentId: profile.id, choiceType: "UCAS_CHOICE", status: { not: "WITHDRAWN" } } });
      if (ucasCount >= 5) return NextResponse.json({ error: "UCAS_LIMIT" }, { status: 409 });
    }
    if (!existing) await db.application.create({ data: { studentId: profile.id, programId, choiceType: program.applyRoute === "HK_DIRECT" ? "HK_DIRECT" : "UCAS_CHOICE", status: "PLANNING" } });
  }
  return NextResponse.json({ ok: true });
}
