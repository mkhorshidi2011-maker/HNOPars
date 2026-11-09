import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  const t = useTranslations("hero");
  return (
    <section className="relative isolate overflow-hidden bg-brand-900 text-white">
      <Image src="/images/hero.svg" alt="" fill priority className="-z-10 object-cover opacity-90" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 md:grid-cols-2 md:py-32">
        <div className="space-y-6">
          <Badge className="bg-white/10 px-3 py-1 text-brand-100 hover:bg-white/10">{t("badge")}</Badge>
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">{t("title")}</h1>
          <p className="max-w-xl text-lg leading-8 text-brand-100">{t("subtitle")}</p>
          <div className="flex flex-wrap gap-3">
            <Button render={<Link href="/book" />} size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
              <CalendarCheck className="size-5" />{t("primaryCta")}
            </Button>
            <Button render={<Link href="/portfolio" />} size="lg" variant="outline" className="gap-2 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
              {t("secondaryCta")}<ArrowRight className="size-4 rtl:rotate-180" />
            </Button>
          </div>
        </div>
        <div className="hidden justify-center md:flex">
          <div className="rounded-3xl bg-white p-8 shadow-2xl shadow-black/30">
            <Image src="/images/logo.png" alt="Ofogh Pars" width={260} height={290} className="h-auto w-56" />
          </div>
        </div>
      </div>
    </section>
  );
}
