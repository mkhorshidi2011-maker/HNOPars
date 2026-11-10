import { cookies } from "next/headers";
import { createHash, randomBytes } from "crypto";
import { prisma } from "./prisma";
import { getCurrentUser, isStaff, type CurrentUser } from "./auth-adapter";

export const CHAT_COOKIE = "op_chat";
export const MAX_BODY = 2000;
const hash = (t: string) => createHash("sha256").update(t).digest("hex");

/** Find the visitor's conversation: by logged-in user first, then by cookie token (guests). */
export async function findConversation() {
  const user = await getCurrentUser();
  const token = (await cookies()).get(CHAT_COOKIE)?.value;

  if (user) {
    const byUser = await prisma.chatConversation.findFirst({ where: { userId: user.id }, orderBy: { lastMessageAt: "desc" } });
    if (byUser) return { conversation: byUser, user };
  }
  if (token) {
    const byToken = await prisma.chatConversation.findUnique({ where: { tokenHash: hash(token) } });
    if (byToken) {
      if (user && !byToken.userId) {
        // guest chat becomes the user's chat after login
        const linked = await prisma.chatConversation.update({
          where: { id: byToken.id },
          data: { userId: user.id, name: byToken.name ?? user.name ?? null, email: user.email ?? null },
        });
        return { conversation: linked, user };
      }
      return { conversation: byToken, user };
    }
  }
  return { conversation: null, user };
}

export async function createConversation(user: CurrentUser, name: string | undefined, locale: string) {
  const token = randomBytes(32).toString("hex");
  const conversation = await prisma.chatConversation.create({
    data: { tokenHash: hash(token), userId: user?.id ?? null, name: user?.name ?? name ?? null, email: user?.email ?? null, locale },
  });
  (await cookies()).set(CHAT_COOKIE, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 365,
  });
  return conversation;
}

/** For admin endpoints: returns the staff user or a 403 Response. */
export async function requireStaff(): Promise<{ user: NonNullable<CurrentUser> } | { error: Response }> {
  const user = await getCurrentUser();
  if (!user || !isStaff(user)) return { error: Response.json({ error: "forbidden" }, { status: 403 }) };
  return { user };
}
