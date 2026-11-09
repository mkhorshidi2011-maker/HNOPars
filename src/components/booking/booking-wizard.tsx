"use client";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { CalendarCheck, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as PersianCalendar } from "@/components/ui/persian-calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { bookingSchema } from "@/lib/validators";

type Topic = "software" | "infrastructure" | "data" | "general";
type Slot = { time: string; available: boolean };

// تاریخ محلی (انتخاب‌شده در تقویم) → رشتهٔ YYYY-MM-DD بدون تبدیل منطقهٔ زمانی
const toYmd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function BookingWizard({ initialTopic = "general" }: { initialTopic?: Topic }) {
  const t = useTranslations("booking");
  const tf = useTranslations("contact.form");
  const locale = useLocale();
  const isFa = locale === "fa";
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [mode, setMode] = useState<"PHONE" | "ONLINE" | "INPERSON">("PHONE");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [customerType, setCustomerType] = useState<"PERSON" | "ORGANIZATION">("PERSON");
  const [form, setForm] = useState({ name: "", organizationName: "", phone: "", email: "", notes: "", website: "" });
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState<string | null>(null);

  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const maxDate = useMemo(() => new Date(today.getTime() + 60 * 86400000), [today]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        const u = d.user as { name?: string; email?: string; phone?: string } | null;
        if (!u) return;
        setForm((f) => ({
          ...f,
          name: f.name || u.name || "",
          email: f.email || u.email || "",
          phone: f.phone || u.phone || "",
        }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!date) return;
    const controller = new AbortController();
    fetch(`/api/booking/slots?date=${toYmd(date)}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((j) => setSlots(j.slots ?? []))
      .catch(() => {
        if (!controller.signal.aborted) setSlots([]);
      });
    return () => controller.abort();
  }, [date]);

  const prettyDate = (d: Date) => new Intl.DateTimeFormat(isFa ? "fa-IR-u-ca-persian" : "en-GB", { dateStyle: "full" }).format(d);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const Next = isFa ? ChevronLeft : ChevronRight;

  async function submit() {
    if (!date || !time) return;
    const payload = { customerType, topic, mode, date: toYmd(date), time, locale, ...form };
    const parsed = bookingSchema.safeParse(payload);
    if (!parsed.success) { toast.error(parsed.error.issues.some((i) => i.path[0] === "phone") ? t("invalidPhone") : t("error")); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/booking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const j = await res.json();
      if (res.ok) { setCode(j.trackingCode); setStep(3); }
      else if (res.status === 409) { toast.error(t("slotTaken")); setStep(1); setSlots(null); setTime(""); setDate((d) => (d ? new Date(d) : d)); }
      else toast.error(t("error"));
    } catch { toast.error(t("error")); } finally { setSubmitting(false); }
  }

  const stepNames = [t("steps.type"), t("steps.datetime"), t("steps.details"), t("steps.done")];

  return (
    <div className="space-y-6">
      <ol className="flex items-center justify-between gap-2 text-xs sm:text-sm">
        {stepNames.map((n, i) => (
          <li key={n} className="flex flex-1 items-center gap-2">
            <span className={`flex size-7 shrink-0 items-center justify-center rounded-full font-bold ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {i < step ? <Check className="size-4" /> : (i + 1).toLocaleString(isFa ? "fa-IR" : "en")}
            </span>
            <span className={i === step ? "font-semibold" : "hidden text-muted-foreground sm:inline"}>{n}</span>
          </li>
        ))}
      </ol>

      <Card className="rounded-2xl">
        <CardContent className="space-y-6 py-6">
          {step === 0 && (
            <>
              <RadioGroup value={topic} onValueChange={(v) => setTopic(v as Topic)} className="grid gap-3 sm:grid-cols-2">
                {(["software", "infrastructure", "data", "general"] as const).map((k) => (
                  <Label key={k} htmlFor={`t-${k}`} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${topic === k ? "border-primary bg-secondary" : ""}`}>
                    <RadioGroupItem id={`t-${k}`} value={k} />{t(`types.${k}`)}
                  </Label>
                ))}
              </RadioGroup>
              <div className="space-y-3">
                <Label>{t("mode")}</Label>
                <ToggleGroup value={[mode]} onValueChange={(v) => { if (v[0] === "PHONE" || v[0] === "ONLINE" || v[0] === "INPERSON") setMode(v[0]); }} variant="outline" className="flex flex-wrap justify-start">
                  {(["PHONE", "ONLINE", "INPERSON"] as const).map((m) => (
                    <ToggleGroupItem key={m} value={m} className="px-4">{t(`modes.${m.toLowerCase()}`)}</ToggleGroupItem>
                  ))}
                </ToggleGroup>
                <p className="text-xs text-muted-foreground">{t("duration")}</p>
              </div>
              <div className="flex justify-end"><Button onClick={() => setStep(1)} className="gap-2">{t("next")}<Next className="size-4" /></Button></div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label className="mb-2 block">{t("pickDate")}</Label>
                  {isFa ? (
                    <PersianCalendar
                      selected={date}
                      onSelect={(selectedDate) => {
                        setDate(selectedDate);
                        setSlots(null);
                        setTime("");
                      }}
                      disabled={(d) => d < today || d > maxDate}
                      className="rounded-xl border"
                      locale="fa"
                    />
                  ) : (
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(selectedDate) => {
                        setDate(selectedDate);
                        setSlots(null);
                        setTime("");
                      }}
                      disabled={(d) => d < today || d > maxDate}
                      className="rounded-xl border"
                    />
                  )}
                </div>
                <div>
                  <Label className="mb-2 block">{t("pickTime")}</Label>
                  {date && <p className="mb-3 text-sm font-medium text-primary">{prettyDate(date)}</p>}
                  {!date && <p className="text-sm text-muted-foreground">{t("pickDate")}</p>}
                  {date && slots === null && <p className="text-sm text-muted-foreground">…</p>}
                  {date && slots?.length === 0 && <p className="text-sm text-muted-foreground">{t("noSlots")}</p>}
                  {slots && slots.length > 0 && (
                    <ToggleGroup value={time ? [time] : []} onValueChange={(v) => setTime(v[0] ?? "")} variant="outline" className="grid grid-cols-3 gap-2" dir="ltr">
                      {slots.map((s) => (
                        <ToggleGroupItem key={s.time} value={s.time} disabled={!s.available} className="w-full">{s.time}</ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(0)}>{t("back")}</Button>
                <Button disabled={!date || !time} onClick={() => setStep(2)} className="gap-2">{t("next")}<Next className="size-4" /></Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <RadioGroup value={customerType} onValueChange={(v) => setCustomerType(v as typeof customerType)} className="flex gap-6">
                <Label className="flex items-center gap-2"><RadioGroupItem value="PERSON" />{tf("person")}</Label>
                <Label className="flex items-center gap-2"><RadioGroupItem value="ORGANIZATION" />{tf("organization")}</Label>
              </RadioGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="name">{tf("name")}</Label><Input id="name" value={form.name} onChange={set("name")} /></div>
                {customerType === "ORGANIZATION" && <div className="space-y-2"><Label htmlFor="org">{tf("organizationName")}</Label><Input id="org" value={form.organizationName} onChange={set("organizationName")} /></div>}
                <div className="space-y-2"><Label htmlFor="phone">{tf("phone")}</Label><Input id="phone" type="tel" dir="ltr" value={form.phone} onChange={set("phone")} placeholder="09xxxxxxxxx" /><p className="text-xs text-muted-foreground">{t("phoneHint")}</p></div>
                <div className="space-y-2"><Label htmlFor="email">{tf("email")}</Label><Input id="email" type="email" dir="ltr" value={form.email} onChange={set("email")} /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="notes">{t("notes")}</Label><Textarea id="notes" rows={4} value={form.notes} onChange={set("notes")} /></div>
              <input type="text" tabIndex={-1} autoComplete="off" className="hidden" value={form.website} onChange={set("website")} />
              {date && <p className="rounded-xl bg-secondary p-3 text-sm">{t(`types.${topic}`)} · {t(`modes.${mode.toLowerCase()}`)} · {prettyDate(date)} · <span dir="ltr">{time}</span></p>}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>{t("back")}</Button>
                <Button disabled={submitting || form.name.trim().length < 2 || !form.phone} onClick={submit} className="gap-2"><CalendarCheck className="size-4" />{t("submit")}</Button>
              </div>
            </>
          )}

          {step === 3 && code && (
            <div className="space-y-4 py-4 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="size-7" /></div>
              <h2 className="text-2xl font-bold">{t("successTitle")}</h2>
              <p className="text-muted-foreground">{t("successText", { code })}</p>
              <p className="mx-auto w-fit rounded-xl bg-secondary px-6 py-3 text-2xl font-extrabold tracking-widest text-primary" dir="ltr">{code}</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button render={<a href={`/api/booking/${code}/ics`} />} variant="outline">{t("addToCalendar")}</Button>
                <Button onClick={() => { setCode(null); setStep(0); setDate(undefined); setTime(""); }}>{t("newBooking")}</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
