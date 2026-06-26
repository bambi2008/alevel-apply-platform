import type { Region } from "@/lib/data/types";

export type MilestoneStatus = "done" | "urgent" | "upcoming" | "future";
export type PrepLevel = "early" | "on-track" | "late";

export interface Milestone {
  id: string;
  date: Date;
  titleKey: string;
  descKey: string;
  regions: Region[];
  status: MilestoneStatus;
  tip?: string; // earlyTip or lateTip based on prep level
}

// For intakeYear (e.g. 2026), applying year is intakeYear-1.
// Returns milestones sorted by date.
export function buildTimeline(
  intakeYear: number,
  targetRegions: Region[],
  now: Date = new Date()
): { milestones: Milestone[]; prepLevel: PrepLevel } {
  const ay = intakeYear - 1; // applying year, e.g. 2025

  const ucasMainDeadline = new Date(`${ay + 1}-01-15`);
  const monthsToUcas = (ucasMainDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
  const prepLevel: PrepLevel =
    monthsToUcas > 6 ? "early" : monthsToUcas > 2 ? "on-track" : "late";

  function status(date: Date): MilestoneStatus {
    if (date < now) return "done";
    const days = (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (days <= 30) return "urgent";
    if (days <= 90) return "upcoming";
    return "future";
  }

  const all: Omit<Milestone, "status">[] = [
    // ── Research & preparation ──────────────────────────────────────
    {
      id: "research",
      date: new Date(`${ay}-09-01`),
      titleKey: "ms.research.title",
      descKey: "ms.research.desc",
      regions: ["UK", "HK"],
      tip:
        prepLevel === "early"
          ? "ms.research.earlyTip"
          : prepLevel === "late"
          ? "ms.research.lateTip"
          : undefined,
    },
    // ── UCAS registration ───────────────────────────────────────────
    {
      id: "ucas-reg",
      date: new Date(`${ay}-09-15`),
      titleKey: "ms.ucasReg.title",
      descKey: "ms.ucasReg.desc",
      regions: ["UK"],
      tip: prepLevel === "late" ? "ms.ucasReg.lateTip" : undefined,
    },
    // ── Oxbridge deadline ───────────────────────────────────────────
    {
      id: "oxbridge",
      date: new Date(`${ay}-10-15`),
      titleKey: "ms.oxbridge.title",
      descKey: "ms.oxbridge.desc",
      regions: ["UK"],
      tip:
        prepLevel === "early"
          ? "ms.oxbridge.earlyTip"
          : prepLevel === "late"
          ? "ms.oxbridge.lateTip"
          : undefined,
    },
    // ── Personal statement draft ────────────────────────────────────
    {
      id: "ps-draft",
      date: new Date(`${ay}-11-01`),
      titleKey: "ms.psDraft.title",
      descKey: "ms.psDraft.desc",
      regions: ["UK"],
      tip:
        prepLevel === "early"
          ? "ms.psDraft.earlyTip"
          : prepLevel === "late"
          ? "ms.psDraft.lateTip"
          : undefined,
    },
    // ── HK applications open ────────────────────────────────────────
    {
      id: "hk-open",
      date: new Date(`${ay}-11-15`),
      titleKey: "ms.hkOpen.title",
      descKey: "ms.hkOpen.desc",
      regions: ["HK"],
    },
    // ── UCAS main deadline ──────────────────────────────────────────
    {
      id: "ucas-main",
      date: new Date(`${ay + 1}-01-15`),
      titleKey: "ms.ucasMain.title",
      descKey: "ms.ucasMain.desc",
      regions: ["UK"],
      tip:
        prepLevel === "late"
          ? "ms.ucasMain.lateTip"
          : prepLevel === "early"
          ? "ms.ucasMain.earlyTip"
          : undefined,
    },
    // ── HK application deadline ─────────────────────────────────────
    {
      id: "hk-deadline",
      date: new Date(`${ay + 1}-03-31`),
      titleKey: "ms.hkDeadline.title",
      descKey: "ms.hkDeadline.desc",
      regions: ["HK"],
    },
    // ── UCAS decisions expected ─────────────────────────────────────
    {
      id: "ucas-decisions",
      date: new Date(`${ay + 1}-03-15`),
      titleKey: "ms.ucasDecisions.title",
      descKey: "ms.ucasDecisions.desc",
      regions: ["UK"],
    },
    // ── UCAS reply deadline ─────────────────────────────────────────
    {
      id: "ucas-reply",
      date: new Date(`${ay + 1}-05-01`),
      titleKey: "ms.ucasReply.title",
      descKey: "ms.ucasReply.desc",
      regions: ["UK"],
    },
    // ── Exam preparation ────────────────────────────────────────────
    {
      id: "exams",
      date: new Date(`${ay + 1}-05-15`),
      titleKey: "ms.exams.title",
      descKey: "ms.exams.desc",
      regions: ["UK", "HK"],
      tip:
        prepLevel === "early"
          ? "ms.exams.earlyTip"
          : prepLevel === "late"
          ? "ms.exams.lateTip"
          : undefined,
    },
    // ── Results & clearing ───────────────────────────────────────────
    {
      id: "results",
      date: new Date(`${ay + 1}-08-14`),
      titleKey: "ms.results.title",
      descKey: "ms.results.desc",
      regions: ["UK", "HK"],
    },
  ];

  const filtered = all
    .filter((m) => m.regions.some((r) => targetRegions.includes(r)))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((m) => ({ ...m, status: status(m.date) }));

  return { milestones: filtered, prepLevel };
}
