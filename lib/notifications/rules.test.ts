import { describe, expect, it } from "vitest";
import { buildNotificationCandidates, categoryIsEnabled, startOfWeekKey } from "./rules";

describe("notification rules", () => {
  it("aggregates study tasks and prioritizes overdue work", () => {
    const rows = buildNotificationCandidates({
      todayKey: "2026-07-23",
      studyTasks: [
        { scheduledFor: new Date("2026-07-23T00:00:00Z"), status: "PLANNED" },
        { scheduledFor: new Date("2026-07-23T00:00:00Z"), status: "PLANNED" },
        { scheduledFor: new Date("2026-07-22T00:00:00Z"), status: "PLANNED" },
        { scheduledFor: new Date("2026-07-21T00:00:00Z"), status: "DONE" },
      ], applicationTasks: [], timeline: [], weeklyActivityCount: 0,
    });
    expect(rows.map((row) => row.sourceKey)).toEqual(["study-today:2026-07-23", "study-overdue:2026-07-23"]);
    expect(rows[0].title).toContain("2");
    expect(rows[1].priority).toBe("URGENT");
  });

  it("only includes application tasks due within seven days", () => {
    const rows = buildNotificationCandidates({
      todayKey: "2026-07-23", studyTasks: [], timeline: [], weeklyActivityCount: 0,
      applicationTasks: [
        { id: "soon", title: "提交材料", dueDate: new Date("2026-07-25T00:00:00Z") },
        { id: "later", title: "准备面试", dueDate: new Date("2026-08-10T00:00:00Z") },
        { id: "stale", title: "旧待办", dueDate: new Date("2026-05-01T00:00:00Z") },
      ],
    });
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ sourceKey: "application-task:soon:2026-07-25", priority: "URGENT" });
  });

  it("keeps recent overdue tasks visible for the current day", () => {
    const [row] = buildNotificationCandidates({
      todayKey: "2026-07-23", studyTasks: [], timeline: [], weeklyActivityCount: 0,
      applicationTasks: [{ id: "late", title: "补交文件", dueDate: new Date("2026-07-20T00:00:00Z") }],
    });
    expect(row.body).toBe("已逾期 3 天");
    expect(row.expiresAt?.toISOString()).toBe("2026-07-24T00:00:00.000Z");
  });

  it("deduplicates weekly reports by week and honors preferences", () => {
    expect(startOfWeekKey("2026-07-23")).toBe("2026-07-20");
    expect(startOfWeekKey("2026-07-26")).toBe("2026-07-20");
    expect(categoryIsEnabled("REPORT", { studyEnabled: true, applicationEnabled: true, deadlineEnabled: true, weeklyReportEnabled: false })).toBe(false);
    expect(categoryIsEnabled("SYSTEM", { studyEnabled: false, applicationEnabled: false, deadlineEnabled: false, weeklyReportEnabled: false })).toBe(true);
  });
});
