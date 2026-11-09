import { createHash } from "crypto";

// ساده و درون‌حافظه‌ای (برای یک سرور کافی است؛ برای چند سرور از Redis استفاده کنید)
const hits = new Map<string, number[]>();

export function rateLimit(key: string, max = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= max) { hits.set(key, arr); return false; }
  arr.push(now); hits.set(key, arr);
  return true;
}

export function getIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export function hashIp(ip: string) {
  return createHash("sha256").update(ip + (process.env.IP_HASH_SALT ?? "salt")).digest("hex").slice(0, 32);
}
