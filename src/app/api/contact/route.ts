import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validators";
import { getIp, hashIp, rateLimit } from "@/lib/rate-limit";
import { sendMail } from "@/lib/mail";

export async function POST(req: Request) {
  const ip = getIp(req);
  if (!rateLimit(`contact:${ip}`, 5)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const d = parsed.data;
  if (d.website) return NextResponse.json({ ok: true }); // honeypot: موفقیت جعلی

  await prisma.contactMessage.create({
    data: {
      customerType: d.customerType, name: d.name, organizationName: d.organizationName || null,
      email: d.email, phone: d.phone || null, service: d.service, message: d.message,
      locale: d.locale, ipHash: hashIp(ip),
    },
  });

  if (process.env.CONTACT_NOTIFY_EMAIL) {
    await sendMail({
      to: process.env.CONTACT_NOTIFY_EMAIL,
      subject: `پیام جدید از سایت: ${d.name}`,
      text: `نوع: ${d.customerType}\nنام: ${d.name}\nسازمان: ${d.organizationName ?? "-"}\nایمیل: ${d.email}\nتلفن: ${d.phone ?? "-"}\nموضوع: ${d.service}\n\n${d.message}`,
    });
  }
  return NextResponse.json({ ok: true });
}
