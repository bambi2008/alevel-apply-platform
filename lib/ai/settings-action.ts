"use server";

import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { paymentAdmin } from "@/lib/payments/admin";

const int = z.coerce.number().int().min(0).max(1_000);
const schema = z.object({ total: int, photo: int, statement: int })
  .refine(value => value.photo <= value.total && value.statement <= value.total);

export async function saveAiFeedbackLimits(form: FormData) {
  const actor = await paymentAdmin();
  if (!actor) notFound();
  const locale = form.get("locale") === "en" ? "en" : "zh-CN";
  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) redirect(`/${locale}/admin/settings?result=invalid`);
  const settings = parsed.data;
  await db.$transaction([
    db.aiFeedbackSettings.upsert({ where: { id: "daily" }, create: { id: "daily", ...settings }, update: settings }),
    db.auditLog.create({ data: { actorId: actor.id, action: "AI_LIMITS_UPDATED", entity: "AiFeedbackSettings", entityId: "daily", meta: settings } }),
  ]);
  redirect(`/${locale}/admin/settings?result=saved`);
}
