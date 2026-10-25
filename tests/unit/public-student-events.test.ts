import { beforeEach, describe, expect, it, vi } from "vitest";

const m = vi.hoisted(() => ({
  profile: vi.fn(), cohort: vi.fn(), event: vi.fn(), transaction: vi.fn(),
  removeSubjects: vi.fn(), addSubjects: vi.fn(), removeScores: vi.fn(), execute: vi.fn(),
}));
vi.mock("@/auth", () => ({ auth: async () => ({ user: { id: "public-user" } }) }));
vi.mock("@/lib/db", () => ({ db: {
  studentProfile: { upsert: m.profile },
  // No create/upsert method: public activity may only update historical membership.
  betaParticipant: { updateMany: m.cohort },
  learningEvent: { createMany: m.event },
  aLevelSubject: { deleteMany: m.removeSubjects, createMany: m.addSubjects },
  testScore: { deleteMany: m.removeScores },
  $transaction: m.transaction, $executeRaw: m.execute,
} }));
import { ensureStudentContext, recordLearningEvent } from "../../lib/beta/events";
import { saveProfileAction } from "../../lib/profile/actions";

beforeEach(() => {
  vi.resetAllMocks();
  m.profile.mockResolvedValue({ id: "public-profile" });
  m.cohort.mockResolvedValue({ count: 0 });
  m.event.mockResolvedValue({ count: 1 });
  m.transaction.mockImplementation((operations) => Promise.all(operations));
});

describe("public students do not enter the historical invitation cohort", () => {
  it("initialises student context without writing cohort membership", async () => {
    expect(await ensureStudentContext("public-user")).toEqual({ id: "public-profile" });
    expect(m.cohort).not.toHaveBeenCalled();
  });
  it("records learning events while updating only existing historical participants", async () => {
    const occurredAt = new Date("2026-10-25T01:00:00Z");
    await recordLearningEvent({ studentId: "public-profile", type: "ACTIVE_DAY", eventKey: "day", occurredAt });
    expect(m.event).toHaveBeenCalledWith(expect.objectContaining({ skipDuplicates: true }));
    expect(m.cohort).toHaveBeenCalledWith({
      where: { studentId: "public-profile", lastActiveAt: { lt: occurredAt } },
      data: { lastActiveAt: occurredAt },
    });
  });
  it.each([false, true])("saving a profile (complete=%s) does not auto-enrol it", async (complete) => {
    await expect(saveProfileAction({
      fullName: complete ? "Test Student" : undefined,
      school: complete ? "Test School" : undefined,
      intakeYear: complete ? 2027 : undefined,
      targetRegions: ["UK"], intendedMajors: ["Mathematics"],
      intendedUniversities: ["University of Cambridge"],
      subjects: complete ? [{ subject: "Mathematics", grade: "A", kind: "PREDICTED" }] : [],
      ielts: null,
    })).resolves.toEqual({ authed: true });
    expect(m.cohort).toHaveBeenCalledWith(expect.objectContaining({ where: { studentId: "public-profile" } }));
    expect(m.event).toHaveBeenCalledTimes(complete ? 2 : 1);
  });
});
