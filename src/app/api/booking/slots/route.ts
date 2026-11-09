import { NextResponse } from "next/server";
import { getSlots } from "@/lib/booking";

export async function GET(req: Request) {
  const date = new URL(req.url).searchParams.get("date") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: "invalid_date" }, { status: 400 });
  return NextResponse.json({ slots: await getSlots(date) });
}
