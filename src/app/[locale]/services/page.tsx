import { getTranslations, setRequestLocale } from "next-intl/server";
import { ServicesGrid } from "@/components/sections/services-grid";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Card, CardContent } from "@/components/ui/card";

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const steps = t.raw("process") as { title: string; text: string }[];
  return (
    <>
      <ServicesGrid detailed />
      <section className="bg-secondary/60 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-10 text-center text-3xl font-bold">{t("processTitle")}</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {steps.map((s, i) => (
              <Card key={s.title} className="rounded-2xl border-0 shadow-sm">
                <CardContent className="space-y-2 py-6">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{(i + 1).toLocaleString(locale === "fa" ? "fa-IR" : "en")}</div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <div className="pt-20"><CtaBanner /></div>
    </>
  );
}
