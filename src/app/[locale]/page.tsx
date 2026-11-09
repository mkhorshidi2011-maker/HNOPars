import { setRequestLocale, getTranslations } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { Stats } from "@/components/sections/stats";
import { PortfolioGrid } from "@/components/sections/portfolio-grid";
import { CtaBanner } from "@/components/sections/cta-banner";
import { AuthPanel } from "@/components/auth/auth-panel";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");
  return (
    <>
      <Hero />
      <ServicesGrid />
      <Stats />
      <PortfolioGrid limit={3} />
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold">{t("registerTitle")}</h2>
            <p className="text-muted-foreground">{t("registerSubtitle")}</p>
          </div>
          <AuthPanel />
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
