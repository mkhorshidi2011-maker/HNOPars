import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { services } from "@/data/services";

// نیاز به کلید services.bookCta در messages دارد (در بخش پایین README ذکر شده)
export function ServicesGrid({ detailed = false }: { detailed?: boolean }) {
  const t = useTranslations("services");
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <Card key={s.key} className="group overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image src={s.image} alt="" fill className="object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{t(`items.${s.key}.title`)}</CardTitle>
                <CardDescription className="leading-7">
                  {t(detailed ? `items.${s.key}.description` : `items.${s.key}.short`)}
                </CardDescription>
              </CardHeader>
              {detailed && (
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {(t.raw(`items.${s.key}.features`) as string[]).map((f) => (
                      <li key={f} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{f}</li>
                    ))}
                  </ul>
                </CardContent>
              )}
              <CardFooter>
                <Button render={<Link href={`/book?type=${s.key}`} />} variant="ghost" className="gap-2 px-0 text-primary hover:bg-transparent">
                  {t("bookCta")}<ArrowRight className="size-4 rtl:rotate-180" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
