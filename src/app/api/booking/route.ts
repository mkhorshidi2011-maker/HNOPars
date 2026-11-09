import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validators";
import { getIp, hashIp, rateLimit } from "@/lib/rate-limit";
import { getSlots, makeTrackingCode, tehranToUtc, SLOT_MIN } from "@/lib/booking";
import { sendMail } from "@/lib/mail";

export async function POST(req: Request) {
  const ip = getIp(req);
  if (!rateLimit(`booking:${ip}`, 5)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const d = parsed.data;
  if (d.website) return NextResponse.json({ ok: true, trackingCode: "OP-XXXXXX" }); // honeypot

  // اعتبارسنجی سمت سرور: آیا این اسلات واقعاً خالی است؟
  const slots = await getSlots(d.date);
  if (!slots.find((s) => s.time === d.time && s.available)) {
    return NextResponse.json({ error: "slot_taken" }, { status: 409 });
  }

  const startsAt = tehranToUtc(d.date, d.time);
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const c = await prisma.consultation.create({
        data: {
          trackingCode: makeTrackingCode(),
          customerType: d.customerType, name: d.name, organizationName: d.organizationName || null,
          email: d.email || null, phone: d.phone, topic: d.topic, mode: d.mode,
          startsAt, durationMin: SLOT_MIN, notes: d.notes || null, locale: d.locale, ipHash: hashIp(ip),
        },
      });
      const when = `${d.date} ${d.time} (Asia/Tehran)`;
      if (process.env.CONTACT_NOTIFY_EMAIL) {
        await sendMail({
          to: process.env.CONTACT_NOTIFY_EMAIL,
          subject: `رزرو مشاوره جدید ${c.trackingCode}`,
          text: `کد: ${c.trackingCode}\nزمان: ${when}\nموضوع: ${d.topic} | نحوه: ${d.mode}\nنام: ${d.name} ${d.organizationName ? `(${d.organizationName})` : ""}\nتلفن: ${d.phone}\nایمیل: ${d.email || "-"}\nتوضیحات: ${d.notes || "-"}`,
        });
      }
      if (d.email) {
        await sendMail({
          to: d.email,
          subject: `Consultation booking ${c.trackingCode}`,
          text: `Tracking code: ${c.trackingCode}\nTime: ${when}\nWe will contact you to confirm.`,
        });
      }
      return NextResponse.json({ ok: true, trackingCode: c.trackingCode });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        const target = String(e.meta?.target ?? "");
        if (target.includes("trackingCode")) continue;          // کد تکراری: دوباره تلاش
        return NextResponse.json({ error: "slot_taken" }, { status: 409 }); // ایندکس یکتای زمان
      }
      console.error(e);
      return NextResponse.json({ error: "server" }, { status: 500 });
    }
  }
  return NextResponse.json({ error: "server" }, { status: 500 });
}
