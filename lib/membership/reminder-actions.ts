"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function saveMembershipEmailPreference(data: FormData) {
  const userId = (await auth())?.user.id;
  const locale = data.get("locale") === "en" ? "en" : "zh-CN";
  if (!userId) redirect(`/${locale}/login`);
  const membershipEmailEnabled = data.get("membershipEmailEnabled") === "on";
  await db.notificationPreference.upsert({
    where: { userId }, update: { membershipEmailEnabled }, create: { userId, membershipEmailEnabled },
  });
  redirect(`/${locale}/account?reminderSaved=1`);
}
