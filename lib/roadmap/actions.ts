"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { UK_UCAS_SECTIONS, HK_SECTIONS } from "@/lib/application/prep-schema";

export type NodeProgress = { pct: number };
export type RoadmapProgress = {
  authed: boolean;
  nodes: Record<string, NodeProgress>;
};

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export async function getRoadmapProgress(): Promise<RoadmapProgress> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { authed: false, nodes: {} };

  const profile = await db.studentProfile.findUnique({
    where: { userId },
    include: {
      subjects: true,
      testScores: true,
      statements: true,
      applications: true,
      backgroundItems: true,
      _count: {
        select: {
          subjects: true,
          testScores: true,
          statements: true,
          applications: true,
          backgroundItems: true,
          examSessions: true,
        },
      },
    },
  });

  const preps = await db.applicationPrep.findMany({ where: { ownerId: userId } });

  if (!profile) {
    return {
      authed: true,
      nodes: {
        profile: { pct: 0 }, match: { pct: 0 }, background: { pct: 0 },
        tests: { pct: 0 }, statements: { pct: 0 }, prep: { pct: 0 }, submit: { pct: 0 },
      },
    };
  }

  const c = profile._count;

  // 1) 个人档案：关键字段填写比例
  const profileFields = [
    !!profile.fullName,
    !!profile.school,
    !!profile.intakeYear,
    (profile.targetRegions?.length ?? 0) > 0,
    (profile.intendedMajors?.length ?? 0) > 0,
    c.subjects > 0,
    c.testScores > 0,
  ];
  const profilePct = clamp((profileFields.filter(Boolean).length / profileFields.length) * 100);

  // 2) 选校匹配：设定专业方向 + 已加入意向院校
  const matchSignals = [
    (profile.intendedMajors?.length ?? 0) > 0,
    (profile.targetRegions?.length ?? 0) > 0,
    c.applications > 0,
  ];
  const matchPct = clamp((matchSignals.filter(Boolean).length / matchSignals.length) * 100);

  // 3) 背景提升：以 3 项为“较充分”参照
  const backgroundPct = clamp((Math.min(c.backgroundItems, 3) / 3) * 100);

  // 4) 考试备考：做多做少看个人，以 8 次练习/模考为满参照（完成比例）
  const testsPct = clamp((Math.min(c.examSessions, 8) / 8) * 100);

  // 5) 文书：UK 三题 + HK essay，按已完成篇/段计
  let stmtUnits = 0;
  let stmtDone = 0;
  for (const s of profile.statements) {
    const content = (s.content ?? {}) as Record<string, unknown>;
    if (s.kind === "UK_UCAS_3Q") {
      stmtUnits += 3;
      ["q1", "q2", "q3"].forEach((k) => {
        if (typeof content[k] === "string" && (content[k] as string).trim().length > 50) stmtDone += 1;
      });
    } else {
      stmtUnits += 1;
      if (typeof content.body === "string" && (content.body as string).trim().length > 50) stmtDone += 1;
    }
  }
  const statementsPct = stmtUnits > 0 ? clamp((stmtDone / stmtUnits) * 100) : 0;

  // 6) 填表助手：两地区已标记就绪的栏目 / 总栏目
  const prepTotal = UK_UCAS_SECTIONS.length + HK_SECTIONS.length;
  let prepDone = 0;
  for (const row of preps) {
    const data = (row.data ?? {}) as Record<string, { __done?: boolean }>;
    for (const sec of Object.values(data)) if (sec?.__done) prepDone += 1;
  }
  const prepPct = clamp((prepDone / prepTotal) * 100);

  // 7) 申请提交：已加志愿 + 已提交（SUBMITTED 及之后）状态
  const SUBMITTED_STATES = ["SUBMITTED", "INTERVIEW", "OFFER", "REJECTED", "ACCEPTED", "WITHDRAWN"];
  const submitted = profile.applications.filter((a) => SUBMITTED_STATES.includes(a.status)).length;
  let submitPct = 0;
  if (c.applications > 0) {
    submitPct = clamp(30 + (submitted / c.applications) * 70); // 加了志愿就有基础分，提交后拉满
  }

  return {
    authed: true,
    nodes: {
      profile: { pct: profilePct },
      match: { pct: matchPct },
      background: { pct: backgroundPct },
      tests: { pct: testsPct },
      statements: { pct: statementsPct },
      prep: { pct: prepPct },
      submit: { pct: submitPct },
    },
  };
}
