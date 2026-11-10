/**
 * Connects the chat feature to this project's auth system.
 * Auth: HMAC-signed cookie session (src/lib/session.ts, cookie `ofogh_session`), User in Prisma.
 * Staff: any logged-in user whose email is listed in ADMIN_EMAILS (comma-separated, case-insensitive).
 * To make a user staff, add their email to ADMIN_EMAILS in .env (e.g. ADMIN_EMAILS="you@example.com").
 */
import { getSession } from "@/lib/session";

export type CurrentUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
} | null;

export async function getCurrentUser(): Promise<CurrentUser> {
  const session = await getSession();
  if (!session) return null;
  return { id: session.uid, name: session.name, email: session.email, role: null };
}

export function isStaff(user: CurrentUser): boolean {
  if (!user) return false;
  if (user.role === "ADMIN" || user.role === "admin" || user.role === "STAFF") return true;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return !!user.email && admins.includes(user.email.toLowerCase());
}
