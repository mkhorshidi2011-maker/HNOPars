import { prisma } from "@/lib/prisma";

const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export async function GET(_: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const c = await prisma.consultation.findUnique({ where: { trackingCode: code.toUpperCase() } });
  if (!c) return new Response("Not found", { status: 404 });
  const end = new Date(c.startsAt.getTime() + c.durationMin * 60000);
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Ofogh Pars//Booking//FA", "BEGIN:VEVENT",
    `UID:${c.trackingCode}@ofoghpars`, `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(c.startsAt)}`, `DTEND:${fmt(end)}`,
    `SUMMARY:Consultation - Ofogh Pars (${c.trackingCode})`,
    "LOCATION:Tachara\\, Shiraz", "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  return new Response(ics, { headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="${c.trackingCode}.ics"` } });
}
