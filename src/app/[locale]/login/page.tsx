import { setRequestLocale } from "next-intl/server";
import { AuthPanel } from "@/components/auth/auth-panel";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <section className="py-16">
      <div className="mx-auto max-w-md px-4">
        <AuthPanel compact />
      </div>
    </section>
  );
}
