"use server";

import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { extendMembership, paymentAdmin } from "./admin";

const inputSchema = z.object({
  userId: z.string().min(1).max(100), tradeNo: z.string().regex(/^qs[a-f0-9]{28}$/),
  reason: z.string().trim().min(5).max(300), months: z.coerce.number().int().min(1).max(36), requestId: z.uuid(),
});

export async function extendMembershipAction(data: FormData) {
  const actor = await paymentAdmin();
  if (!actor) notFound();
  const locale = data.get("locale") === "en" ? "en" : "zh-CN";
  const parsed = inputSchema.safeParse(Object.fromEntries(data));
  const saved = parsed.success && await extendMembership({ ...parsed.data, actorId: actor.id });
  redirect(`/${locale}/admin/members?result=${saved ? "saved" : "invalid"}`);
}
