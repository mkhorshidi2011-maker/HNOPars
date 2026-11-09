import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Inter, Vazirmatn } from "next/font/google";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Toaster } from "@/components/ui/sonner";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const vazir = Vazirmatn({ subsets: ["arabic", "latin"], variable: "--font-vazirmatn", display: "swap" });

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE),
    title: { default: t("defaultTitle"), template: `%s | ${t("siteName")}` },
    description: t("defaultDescription"),
    alternates: { languages: { fa: "/", en: "/en" } },
    openGraph: { title: t("defaultTitle"), description: t("defaultDescription"), images: ["/images/og.png"], locale: locale === "fa" ? "fa_IR" : "en_US", type: "website" },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: locale === "fa" ? "هوشمند نوآوران افق پارس" : "Hooshmand Noavaran Ofogh Pars",
    url: SITE,
    logo: `${SITE}/images/logo.png`,
    telephone: "+989229261972",
    email: "M.Khorshidi2011@gmail.com",
    address: { "@type": "PostalAddress", addressLocality: "Shiraz", streetAddress: "Tachara", addressCountry: "IR" },
    sameAs: ["https://www.linkedin.com/in/mohammad-m-khorshidi2011-0a148754"],
    identifier: "69759",
  };

  return (
    <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"} className={`${inter.variable} ${vazir.variable}`}>
      <body>
        <NextIntlClientProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <Toaster richColors position={locale === "fa" ? "bottom-left" : "bottom-right"} />
        </NextIntlClientProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
