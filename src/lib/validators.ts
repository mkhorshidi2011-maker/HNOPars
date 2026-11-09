import { z } from "zod";

const customerType = z.enum(["PERSON", "ORGANIZATION"]);
const phoneRe = /^(\+98|0098|0)?9\d{9}$/; // موبایل ایران
const normalizeDigits = (s: string) =>
  s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? normalizeDigits(v).replace(/[\s-]/g, "") : "")),
  password: z.string().min(8, "password_min").max(128),
  website: z.string().max(0).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(1).max(128),
  website: z.string().max(0).optional(),
});

export const contactSchema = z.object({
  customerType,
  name: z.string().trim().min(2).max(120),
  organizationName: z.string().trim().max(160).optional(),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(30).optional(),
  service: z.enum(["software", "infrastructure", "data", "other"]),
  message: z.string().trim().min(10).max(4000),
  locale: z.enum(["fa", "en"]),
  website: z.string().max(0).optional(), // honeypot
}).refine((d) => d.customerType === "PERSON" || !!d.organizationName?.trim(), { path: ["organizationName"], message: "required" });

export const bookingSchema = z.object({
  customerType,
  name: z.string().trim().min(2).max(120),
  organizationName: z.string().trim().max(160).optional(),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  phone: z.string().trim().transform(normalizeDigits).refine((v) => phoneRe.test(v.replace(/[\s-]/g, "")), "invalid phone"),
  topic: z.enum(["software", "infrastructure", "data", "general"]),
  mode: z.enum(["PHONE", "ONLINE", "INPERSON"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // تاریخ میلادی به وقت تهران
  time: z.string().regex(/^\d{2}:\d{2}$/),
  notes: z.string().trim().max(2000).optional(),
  locale: z.enum(["fa", "en"]),
  website: z.string().max(0).optional(),
}).refine((d) => d.customerType === "PERSON" || !!d.organizationName?.trim(), { path: ["organizationName"], message: "required" });

export type ContactInput = z.infer<typeof contactSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
