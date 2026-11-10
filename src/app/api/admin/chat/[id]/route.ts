import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { MAX_BODY, requireStaff } from "@/lib/chat";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/admin/chat/[id]?after=N → messages (marks visitor messages as read)
export async function GET(req: Request, { params }: Ctx) {
  const auth = await requireStaff();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  const after = Number(new URL(req.url).searchParams.get("after") ?? 0) || 0;
  const conv = await prisma.chatConversation.findUnique({ where: { id }, select: { id: true, name: true, email: true, status: true } });
  if (!conv) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const messages = await prisma.chatMessage.findMany({
    where: { conversationId: id, id: { gt: after } }, orderBy: { id: "asc" }, take: 200,
    select: { id: true, sender: true, body: true, createdAt: true },
  });
  await prisma.chatMessage.updateMany({ where: { conversationId: id, sender: "VISITOR", readAt: null }, data: { readAt: new Date() } });
  return NextResponse.json({ conversation: conv, messages });
}

// POST /api/admin/chat/[id] { body } → staff reply
export async function POST(req: Request, { params }: Ctx) {
  const auth = await requireStaff();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  const parsed = z.object({ body: z.string().trim().min(1).max(MAX_BODY) }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const exists = await prisma.chatConversation.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const message = await prisma.chatMessage.create({ data: { conversationId: id, sender: "STAFF", body: parsed.data.body }, select: { id: true, sender: true, body: true, createdAt: true } });
  await prisma.chatConversation.update({ where: { id }, data: { lastMessageAt: new Date() } });
  return NextResponse.json({ message });
}

// PATCH /api/admin/chat/[id] { status: "OPEN" | "CLOSED" }
export async function PATCH(req: Request, { params }: Ctx) {
  const auth = await requireStaff();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  const parsed = z.object({ status: z.enum(["OPEN", "CLOSED"]) }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  await prisma.chatConversation.update({ where: { id }, data: { status: parsed.data.status } });
  return NextResponse.json({ ok: true });
}
