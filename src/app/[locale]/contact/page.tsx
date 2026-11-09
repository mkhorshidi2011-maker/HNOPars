import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const rows = [
    { icon: MapPin, label: t("info.addressLabel"), value: t("info.address"), href: undefined },
    { icon: Phone, label: t("info.phoneLabel"), value: "09229261972", href: "tel:+989229261972", ltr: true },
    { icon: Mail, label: t("info.email"), value: "M.Khorshidi2011@gmail.com", href: "mailto:M.Khorshidi2011@gmail.com", ltr: true },
    { icon: ExternalLink, label: t("info.linkedin"), value: "LinkedIn", href: "https://www.linkedin.com/in/mohammad-m-khorshidi2011-0a148754" },
    { icon: Clock, label: "", value: t("info.hours"), href: undefined },
  ];
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h1 className="text-4xl font-bold">{t("title")}</h1>
          <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3"><ContactForm /></div>
          <div className="space-y-4 lg:col-span-2">
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl">
              <Image src="/images/contact-map.svg" alt="" fill className="object-cover" />
            </div>
            <Card className="rounded-2xl">
              <CardContent className="space-y-4 py-6">
                {rows.map(({ icon: Icon, label, value, href, ltr }) => (
                  <div key={value} className="flex items-start gap-3">
                    <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div className="text-sm">
                      {label && <p className="text-muted-foreground">{label}</p>}
                      {href ? <a href={href} dir={ltr ? "ltr" : undefined} className="font-medium hover:text-primary" target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{value}</a> : <p className="font-medium">{value}</p>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
