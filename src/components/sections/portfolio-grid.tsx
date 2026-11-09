"use client";
import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { portfolio } from "@/data/portfolio";

const filters = ["all", "software", "transport", "pharma", "finance"] as const;

export function PortfolioGrid({ limit }: { limit?: number }) {
  const t = useTranslations("portfolio");
  const [active, setActive] = useState<(typeof filters)[number]>("all");
  const items = portfolio.filter((p) => active === "all" || p.category === active).slice(0, limit);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
        </div>
        {!limit && (
          <Tabs value={active} onValueChange={(v) => setActive(v as typeof active)} className="mb-8 flex items-center">
            <TabsList className="h-auto flex-wrap">
              {filters.map((f) => <TabsTrigger key={f} value={f}>{t(`filters.${f}`)}</TabsTrigger>)}
            </TabsList>
          </Tabs>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <Card key={p.key} className="group overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image src={p.image} alt="" fill className="object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{t(`items.${p.key}.title`)}</CardTitle>
                <CardDescription className="leading-7">{t(`items.${p.key}.text`)}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {(t.raw(`items.${p.key}.tags`) as string[]).map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
