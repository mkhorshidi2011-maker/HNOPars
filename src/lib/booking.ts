import { prisma } from "./prisma";

// ایران از ۱۴۰۱ ساعت تابستانی ندارد: همیشه UTC+03:30
export const TEHRAN_OFFSET_MIN = 210;
export const SLOT_MIN = 30;
export const GAP_MIN = 10;
export const MIN_LEAD_MS = 2 * 60 * 60 * 1000;
export const MAX_DAYS_AHEAD = 60;

const hm = (s: string) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };

/** «تاریخ + ساعت» به وقت تهران → لحظهٔ UTC */
export function tehranToUtc(date: string, time: string) {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  return new Date(Date.UTC(y, mo - 1, d, h, mi) - TEHRAN_OFFSET_MIN * 60000);
}

export function isValidDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

export async function getSlots(date: string): Promise<{ time: string; available: boolean }[]> {
  if (!isValidDate(date)) return [];
  const [y, m, d] = date.split("-").map(Number);
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();

  const blocked = await prisma.blockedDate.findUnique({ where: { date: new Date(Date.UTC(y, m - 1, d)) } });
  if (blocked) return [];

  const rules = await prisma.availabilityRule.findMany({ where: { weekday, active: true } });
  if (!rules.length) return [];

  const dayStart = tehranToUtc(date, "00:00");
  const dayEnd = new Date(dayStart.getTime() + 24 * 3600 * 1000);
  const taken = await prisma.consultation.findMany({
    where: { startsAt: { gte: dayStart, lt: dayEnd }, status: { not: "CANCELLED" } },
    select: { startsAt: true },
  });
  const takenSet = new Set(taken.map((t) => t.startsAt.getTime()));

  const now = Date.now();
  const maxTs = now + MAX_DAYS_AHEAD * 24 * 3600 * 1000;
  const out: { time: string; available: boolean }[] = [];
  for (const r of rules) {
    for (let t = hm(r.startTime); t + SLOT_MIN <= hm(r.endTime); t += SLOT_MIN + GAP_MIN) {
      const time = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
      const ts = tehranToUtc(date, time).getTime();
      out.push({ time, available: ts - now >= MIN_LEAD_MS && ts <= maxTs && !takenSet.has(ts) });
    }
  }
  return out.sort((a, b) => a.time.localeCompare(b.time));
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function makeTrackingCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return "OP-" + Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}
