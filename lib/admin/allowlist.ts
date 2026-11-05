/** The deployment owner chooses administrators; public contact is not a grant. */
export function isConfiguredAdmin(user: { email?: string | null; role?: string } | null | undefined, env: Record<string, string | undefined> = process.env): boolean {
  if (user?.role !== "ADMIN" || !user.email) return false;
  const email = user.email.trim().toLowerCase();
  return (env.ADMIN_EMAILS ?? "").split(/[,;\s]+/).filter(Boolean).some(value => value.trim().toLowerCase() === email);
}
