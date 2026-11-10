import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/chat";

// GET /api/admin/chat → conversation list (newest activity first)
export async function GET() {
  const auth = await requireStaff();
  if ("error" in auth) return auth.error;
  const rows = await prisma.chatConversation.findMany({
    orderBy: { lastMessageAt: "desc" }, take: 100,
    include: {
      messages: { orderBy: { id: "desc" }, take: 1, select: { body: true, sender: true } },
      _count: { select: { messages: { where: { sender: "VISITOR", readAt: null } } } },
    },
  });
  return NextResponse.json({
    conversations: rows.map((c) => ({
      id: c.id, name: c.name, email: c.email, userId: c.userId, status: c.status,
      lastMessageAt: c.lastMessageAt, last: c.messages[0] ?? null, unread: c._count.messages,
    })),
  });
}
