import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

const keys = ["years", "users", "systems", "certs"] as const;

export function Stats() {
  const t = useTranslations("stats");
  return (
    <section className="bg-secondary/60 py-16">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
        {keys.map((k) => (
          <Card key={k} className="rounded-2xl border-0 text-center shadow-sm">
            <CardContent className="space-y-1 py-8">
              <div className="text-4xl font-extrabold text-primary">{t(`${k}.value`)}</div>
              <p className="text-sm text-muted-foreground">{t(`${k}.label`)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
