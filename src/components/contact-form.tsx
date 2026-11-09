"use client";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const schema = z.object({
  customerType: z.enum(["PERSON", "ORGANIZATION"]),
  name: z.string().min(2),
  organizationName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  service: z.enum(["software", "infrastructure", "data", "other"]),
  message: z.string().min(10),
  website: z.string().max(0).optional(), // honeypot
}).refine((d) => d.customerType === "PERSON" || !!d.organizationName?.trim(), { path: ["organizationName"], message: "required" });

type Values = z.infer<typeof schema>;

export function ContactForm() {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { customerType: "PERSON", service: "software", name: "", email: "", phone: "", message: "", organizationName: "", website: "" },
  });
  const isOrg = useWatch({ control: form.control, name: "customerType" }) === "ORGANIZATION";

  async function onSubmit(values: Values) {
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, locale }) });
    if (res.ok) { toast.success(t("success")); form.reset(); } else toast.error(t("error"));
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 rounded-2xl border bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <Label>{t("customerType")}</Label>
          <Controller control={form.control} name="customerType" render={({ field }) => (
            <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-6">
              <Label className="flex items-center gap-2 text-sm"><RadioGroupItem value="PERSON" />{t("person")}</Label>
              <Label className="flex items-center gap-2 text-sm"><RadioGroupItem value="ORGANIZATION" />{t("organization")}</Label>
            </RadioGroup>
          )} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">{t("name")}</Label>
            <Input id="name" aria-invalid={!!form.formState.errors.name} {...form.register("name")} />
            {form.formState.errors.name && <p role="alert" className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
          </div>
          {isOrg && (
            <div className="space-y-2">
              <Label htmlFor="organizationName">{t("organizationName")}</Label>
              <Input id="organizationName" aria-invalid={!!form.formState.errors.organizationName} {...form.register("organizationName")} />
              {form.formState.errors.organizationName && <p role="alert" className="text-sm text-destructive">{form.formState.errors.organizationName.message}</p>}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input id="email" type="email" dir="ltr" aria-invalid={!!form.formState.errors.email} {...form.register("email")} />
            {form.formState.errors.email && <p role="alert" className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t("phone")}</Label>
            <Input id="phone" type="tel" dir="ltr" {...form.register("phone")} />
          </div>
        </div>
        <div className="space-y-2">
            <Label>{t("service")}</Label>
            <Controller control={form.control} name="service" render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(["software", "infrastructure", "data", "other"] as const).map((k) => (
                  <SelectItem key={k} value={k}>{t(`serviceOptions.${k}`)}</SelectItem>
                ))}
              </SelectContent>
              </Select>
            )} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">{t("message")}</Label>
          <Textarea id="message" rows={5} aria-invalid={!!form.formState.errors.message} {...form.register("message")} />
          {form.formState.errors.message && <p role="alert" className="text-sm text-destructive">{form.formState.errors.message.message}</p>}
        </div>
        {/* honeypot */}
        <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...form.register("website")} />
        <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? t("sending") : t("submit")}
        </Button>
    </form>
  );
}
