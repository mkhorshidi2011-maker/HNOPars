import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getIp, rateLimit } from "@/lib/rate-limit";
import { sendMail } from "@/lib/mail";
import { createConversation, findConversation, MAX_BODY } from "@/lib/chat";

const sendSchema = z.object({
  body: z.string().trim().min(1).max(MAX_BODY),
  name: z.string().trim().max(80).optional(),
  locale: z.enum(["fa", "en"]).default("fa"),
});

// GET /api/chat/messages?after=<lastMessageId>  → new messages for THIS visitor
export async function GET(req: Request) {
  const after = Number(new URL(req.url).searchParams.get("after") ?? 0) || 0;
  const { conversation, user } = await findConversation();
  const me = user ? { name: user.name ?? null } : null;
  if (!conversation) return NextResponse.json({ messages: [], status: null, user: me });
  const messages = await prisma.chatMessage.findMany({
    where: { conversationId: conversation.id, id: { gt: after } },
    orderBy: { id: "asc" }, take: 200,
    select: { id: true, sender: true, body: true, createdAt: true },
  });
  return NextResponse.json({ messages, status: conversation.status, user: me });
}

// POST /api/chat/messages  { body, name?, locale }
export async function POST(req: Request) {
  if (!rateLimit(`chat:${getIp(req)}`, 30, 10 * 60 * 1000)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  const parsed = sendSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const { body, name, locale } = parsed.data;

  const found = await findConversation();
  let conversation = found.conversation;
  const isNew = !conversation;
  if (!conversation) conversation = await createConversation(found.user, name, locale);

  const lastVisitor = isNew ? null : await prisma.chatMessage.findFirst({ where: { conversationId: conversation.id, sender: "VISITOR" }, orderBy: { id: "desc" }, select: { createdAt: true } });

  const message = await prisma.chatMessage.create({
    data: { conversationId: conversation.id, sender: "VISITOR", body },
    select: { id: true, sender: true, body: true, createdAt: true },
  });
  await prisma.chatConversation.update({ where: { id: conversation.id }, data: { lastMessageAt: new Date(), status: "OPEN" } });

  // email staff for new chats or after 10+ minutes of silence (avoids spam)
  const quiet = !lastVisitor || Date.now() - lastVisitor.createdAt.getTime() > 10 * 60 * 1000;
  if (quiet && process.env.CONTACT_NOTIFY_EMAIL) {
    const who = conversation.name ?? found.user?.name ?? "Guest";
    await sendMail({ to: process.env.CONTACT_NOTIFY_EMAIL, subject: `New chat message from ${who}`, text: `${who}:\n\n${body}\n\nReply: ${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/chat` });
  }
  return NextResponse.json({ message });
}
