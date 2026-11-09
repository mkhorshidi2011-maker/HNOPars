import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// فقط وضعیت و زمان؛ هیچ اطلاعات شخصی برنمی‌گردد
export async function GET(_: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const c = await prisma.consultation.findUnique({
    where: { trackingCode: code.toUpperCase() },
    select: { trackingCode: true, status: true, startsAt: true, topic: true, mode: true, durationMin: true },
  });
  if (!c) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(c);
}
