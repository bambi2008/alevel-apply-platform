import { z } from "zod";

export const gradeEnum = z.enum(["A*", "A", "B", "C", "D", "E", "U"]);

export const subjectSchema = z.object({
  subject: z.string().min(1, "请填写科目"),
  kind: z.enum(["AS", "PREDICTED", "ACTUAL"]),
  grade: gradeEnum,
});

export const testScoreSchema = z.object({
  type: z.enum(["IELTS", "TOEFL", "DUOLINGO"]),
  overall: z.number().min(0).max(120).optional(),
  takenAt: z.coerce.date().optional(),
});

export const profileSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  school: z.string().max(200).optional(),
  isMinor: z.boolean().default(false),
  intakeYear: z.number().int().min(2025).max(2035).optional(),
  targetRegions: z.array(z.enum(["UK", "HK"])).min(1, "至少选择一个目标地区"),
  intendedMajors: z.array(z.string().min(1)).max(10).default([]),
  budgetNote: z.string().max(500).optional(),
  subjects: z.array(subjectSchema).max(8).default([]),
  testScores: z.array(testScoreSchema).max(5).default([]),
});

export type ProfileInput = z.infer<typeof profileSchema>;
