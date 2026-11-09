import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  const t = useTranslations();
  const locale = useLocale();
  const nav = ["home", "services", "portfolio", "about", "contact"] as const;
  const href = (k: string) => (k === "home" ? "/" : `/${k}`);
  return (
    <footer className="bg-brand-900 text-brand-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div className="space-y-4">
          <div className="inline-block rounded-xl bg-white p-3">
            <Image src="/images/logo.png" alt="Ofogh Pars" width={80} height={90} className="h-16 w-auto" />
          </div>
          <p className="text-sm leading-7">{t("footer.about")}</p>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-white">{t("footer.links")}</h3>
          <ul className="space-y-2 text-sm">
            {nav.map((k) => (
              <li key={k}><Link href={href(k)} className="hover:text-white">{t(`nav.${k}`)}</Link></li>
            ))}
          </ul>
        </div>
        <ul className="space-y-3 text-sm">
          <li className="flex gap-2"><MapPin className="size-4 shrink-0" />{t("contact.info.address")}</li>
          <li className="flex gap-2"><Phone className="size-4 shrink-0" /><a href="tel:+989229261972" dir="ltr" className="hover:text-white">09229261972</a></li>
          <li className="flex gap-2"><Mail className="size-4 shrink-0" /><a href="mailto:M.Khorshidi2011@gmail.com" dir="ltr" className="hover:text-white">M.Khorshidi2011@gmail.com</a></li>
          <li className="flex gap-2"><ExternalLink className="size-4 shrink-0" /><a href="https://www.linkedin.com/in/mohammad-m-khorshidi2011-0a148754" target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</a></li>
        </ul>
      </div>
      <Separator className="bg-white/10" />
      <p className="py-5 text-center text-xs">© {new Date().getFullYear()} {locale === "fa" ? "هوشمند نوآوران افق پارس" : "Hooshmand Noavaran Ofogh Pars"} — {t("footer.rights")}</p>
    </footer>
  );
}
