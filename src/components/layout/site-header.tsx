"use client";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Menu, Languages, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const links = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Ofogh Pars">
          <Image src="/images/logo.png" alt="" width={36} height={40} className="h-10 w-auto" priority />
          <span className="hidden text-sm font-bold text-primary sm:block">
            {locale === "fa" ? "هوشمند نوآوران افق پارس" : "Hooshmand Noavaran Ofogh Pars"}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map(({ href, key }) => (
            <Button key={key} render={<Link href={href} />} variant={pathname === href ? "secondary" : "ghost"} size="sm">
              {t(key)}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="Language" />}>
              <Languages className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.replace(pathname, { locale: "fa" })}>فارسی</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.replace(pathname, { locale: "en" })}>English</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button render={<Link href="/book" />} size="sm" className="hidden gap-2 sm:inline-flex">
            <CalendarCheck className="size-4" />{t("book")}
          </Button>

          <Sheet>
            <SheetTrigger render={<Button variant="outline" size="icon" className="md:hidden" aria-label="Menu" />}>
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side={locale === "fa" ? "right" : "left"} className="w-72">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav className="mt-10 flex flex-col gap-1">
                {links.map(({ href, key }) => (
                  <Button key={key} render={<Link href={href} />} variant="ghost" className="justify-start text-base">
                    {t(key)}
                  </Button>
                ))}
                <Button render={<Link href="/book" />} className="mt-4 gap-2"><CalendarCheck className="size-4" />{t("book")}</Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
