import { getTranslations, setRequestLocale } from "next-intl/server";
import { BookingWizard } from "@/components/booking/booking-wizard";

export default async function BookPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ type?: string }> }) {
  const { locale } = await params;
  const { type } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("booking");
  const initialTopic = (["software", "infrastructure", "data", "general"] as const).find((x) => x === type) ?? "general";
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold">{t("title")}</h1>
          <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <BookingWizard initialTopic={initialTopic} />
      </div>
    </section>
  );
}
