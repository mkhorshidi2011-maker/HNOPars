import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CalendarCheck, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  const t = useTranslations("cta");
  const nav = useTranslations("nav");
  return (
    <section className="px-4 pb-20">
      <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-br from-brand-900 to-brand-600 px-8 py-14 text-center text-white shadow-xl">
        <h2 className="text-3xl font-bold">{t("title")}</h2>
        <p className="mx-auto mt-3 max-w-xl text-brand-100">{t("text")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button render={<Link href="/book" />} size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
            <CalendarCheck className="size-5" />{nav("book")}
          </Button>
          <Button render={<a href="tel:+989229261972" dir="ltr" />} size="lg" variant="outline" className="gap-2 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
            <Phone className="size-4" />0922 926 1972
          </Button>
        </div>
      </div>
    </section>
  );
}
