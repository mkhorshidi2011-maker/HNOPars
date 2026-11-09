import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";
import { hashPassword } from "@/lib/password";
import { createSessionToken, sessionCookie } from "@/lib/session";
import { getIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = getIp(req);
  if (!rateLimit(`register:${ip}`, 10)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid", issues: parsed.error.flatten() }, { status: 400 });
  const d = parsed.data;
  if (d.website) return NextResponse.json({ ok: true }); // honeypot

  const email = d.email.toLowerCase();
  try {
    const user = await prisma.user.create({
      data: { name: d.name, email, phone: d.phone || null, passwordHash: await hashPassword(d.password) },
      select: { id: true, name: true, email: true },
    });
    const token = createSessionToken(user);
    const res = NextResponse.json({ ok: true, user: { name: user.name, email: user.email } });
    res.cookies.set(sessionCookie(token));
    return res;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "email_taken" }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
