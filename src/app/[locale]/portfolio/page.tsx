import { setRequestLocale } from "next-intl/server";
import { PortfolioGrid } from "@/components/sections/portfolio-grid";
import { CtaBanner } from "@/components/sections/cta-banner";

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (<><PortfolioGrid /><CtaBanner /></>);
}
