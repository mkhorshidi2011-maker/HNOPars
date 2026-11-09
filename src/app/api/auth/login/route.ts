import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";
import { verifyPassword } from "@/lib/password";
import { createSessionToken, sessionCookie } from "@/lib/session";
import { getIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = getIp(req);
  if (!rateLimit(`login:${ip}`, 10)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const d = parsed.data;
  if (d.website) return NextResponse.json({ ok: true }); // honeypot

  const email = d.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(d.password, user.passwordHash))) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }
  const token = createSessionToken({ id: user.id, name: user.name, email: user.email, phone: user.phone });
  const res = NextResponse.json({ ok: true, user: { name: user.name, email: user.email, phone: user.phone ?? "" } });
  res.cookies.set(sessionCookie(token));
  return res;
}
