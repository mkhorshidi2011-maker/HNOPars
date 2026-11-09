import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { Stats } from "@/components/sections/stats";
import { PortfolioGrid } from "@/components/sections/portfolio-grid";
import { CtaBanner } from "@/components/sections/cta-banner";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <ServicesGrid />
      <Stats />
      <PortfolioGrid limit={3} />
      <CtaBanner />
    </>
  );
}
