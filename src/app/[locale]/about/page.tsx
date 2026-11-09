import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CtaBanner } from "@/components/sections/cta-banner";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const values = t.raw("values") as { title: string; text: string }[];
  const timeline = t.raw("timeline") as { year: string; text: string }[];
  const skills = t.raw("skills") as string[];

  return (
    <>
      <section className="bg-brand-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-extrabold">{t("title")}</h1>
          <h2 className="mt-8 text-xl font-semibold text-brand-200">{t("storyTitle")}</h2>
          <p className="mt-3 leading-8 text-brand-100">{t("story")}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 md:grid-cols-3">
          <Card className="rounded-2xl text-center md:col-span-1">
            <CardContent className="space-y-3 py-8">
              <Image src="/images/about-shiraz.svg" alt="" width={400} height={267} className="rounded-xl" />
              <h3 className="text-xl font-bold">{t("ceoName")}</h3>
              <p className="text-sm text-muted-foreground">{t("ceoRole")}</p>
            </CardContent>
          </Card>
          <div className="space-y-6 md:col-span-2">
            <h2 className="text-2xl font-bold">{t("ceoTitle")}</h2>
            <p className="leading-8 text-muted-foreground">{t("ceoBio")}</p>
            <div>
              <h3 className="mb-3 font-semibold">{t("skillsTitle")}</h3>
              <div className="flex flex-wrap gap-2">{skills.map((s) => <Badge key={s} variant="secondary" dir="ltr">{s}</Badge>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/60 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-2xl font-bold">{t("valuesTitle")}</h2>
            <Accordion defaultValue={["v0"]}>
              {values.map((v, i) => (
                <AccordionItem key={v.title} value={`v${i}`}>
                  <AccordionTrigger>{v.title}</AccordionTrigger>
                  <AccordionContent>{v.text}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div>
            <h2 className="mb-6 text-2xl font-bold">{t("timelineTitle")}</h2>
            <ol className="space-y-5 border-s-2 border-primary/30 ps-6">
              {timeline.map((x) => (
                <li key={x.year + x.text} className="relative">
                  <span className="absolute -start-[33px] top-1.5 size-3 rounded-full bg-primary" />
                  <p className="text-sm font-bold text-primary">{x.year}</p>
                  <p className="text-sm text-muted-foreground">{x.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <Card className="rounded-2xl">
            <CardContent className="grid gap-3 py-6 text-sm sm:grid-cols-2">
              <h3 className="font-bold sm:col-span-2">{t("legalTitle")}</h3>
              {Object.entries(t.raw("legal") as Record<string, string>).map(([k, v]) => (
                <p key={k}><span className="text-muted-foreground">{k === "regNo" ? "No." : k === "type" ? "Type" : k === "city" ? "City" : "Name"}: </span>{v}</p>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
