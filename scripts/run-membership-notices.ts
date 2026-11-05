import { PrismaClient } from "@prisma/client";
import { getEmail } from "../lib/email";
import { runMembershipReminders, sendPaymentComplaintEmails } from "../lib/membership/reminders";

async function main() {
  if (process.env.MEMBERSHIP_REMINDERS_ENABLED !== "true") return;
  const origin = process.env.APP_ORIGIN;
  if (!origin || new URL(origin).protocol !== "https:") throw Error("Membership notices require the production HTTPS origin");
  const email = getEmail();
  if (email.isDev) throw Error("Membership notices require the production mail adapter");
  const client = new PrismaClient({ log: [] });
  try {
    const reminders = await runMembershipReminders({ client, email, origin });
    const complaints = await sendPaymentComplaintEmails({ client, email, origin });
    console.log(JSON.stringify({ task: "membership-notices", ...reminders, complaintSent: complaints.sent, complaintFailed: complaints.failed }));
    if (reminders.emailFailed || complaints.failed) process.exitCode = 1;
  } finally { await client.$disconnect(); }
}
main().catch(() => { console.error('{"task":"membership-notices","status":"failed"}'); process.exitCode = 1; });
