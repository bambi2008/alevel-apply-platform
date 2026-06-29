import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getTopicIdForQuestion, getTopicMeta } from "@/lib/tests/lookup";

// 学情分析：把该用户在某门考试下的全部作答，按知识点聚合正确率。
// 作答记录里只存了 questionId，topicId 由静态题库经 getTopicIdForQuestion 反查。
export async function GET(req: NextRequest) {
  const testId = req.nextUrl.searchParams.get("testId");
  if (!testId) {
    return NextResponse.json({ error: "Missing testId" }, { status: 400 });
  }

  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) {
    // 还没建档 = 还没有任何记录
    return NextResponse.json({ topics: [], totalAnswered: 0 });
  }

  const sessions = await db.examSession.findMany({
    where: { studentId: profile.id, testId },
    select: {
      answers: { select: { questionId: true, earned: true, max: true } },
    },
  });

  // 按知识点累计 earned / max / 题数
  const agg = new Map<string, { earned: number; max: number; count: number }>();
  let totalAnswered = 0;

  for (const s of sessions) {
    for (const a of s.answers) {
      const topicId = getTopicIdForQuestion(a.questionId);
      if (!topicId) continue; // 题目已下架/找不到则跳过
      totalAnswered++;
      const cur = agg.get(topicId) ?? { earned: 0, max: 0, count: 0 };
      cur.earned += a.earned;
      cur.max += a.max;
      cur.count += 1;
      agg.set(topicId, cur);
    }
  }

  const topics = [...agg.entries()]
    .map(([topicId, v]) => {
      const meta = getTopicMeta(testId, topicId);
      const accuracy = v.max > 0 ? v.earned / v.max : 0;
      return {
        topicId,
        title: meta?.title ?? topicId,
        titleEn: meta?.titleEn ?? topicId,
        earned: v.earned,
        max: v.max,
        count: v.count,
        accuracy, // 0..1
      };
    })
    // 正确率低的排前面（最该补的）
    .sort((a, b) => a.accuracy - b.accuracy);

  return NextResponse.json({ topics, totalAnswered });
}
