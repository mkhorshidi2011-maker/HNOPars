"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Menu, Languages, CalendarCheck, LogIn, LogOut, UserPlus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const links = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

type Me = { name: string; email: string } | null;

export function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<Me>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => setUser(null));
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    toast.success(t("logout"));
    router.refresh();
  }

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

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="hidden gap-2 sm:inline-flex" />}>
                <User className="size-4" /><span className="max-w-24 truncate">{user.name}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={logout} className="gap-2"><LogOut className="size-4" />{t("logout")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button render={<Link href="/login" />} variant="outline" size="sm" className="hidden gap-2 sm:inline-flex">
                <LogIn className="size-4" />{t("login")}
              </Button>
              <Button render={<Link href="/register" />} size="sm" className="hidden gap-2 sm:inline-flex">
                <UserPlus className="size-4" />{t("register")}
              </Button>
            </>
          )}

          <Button render={<Link href="/book" />} size="sm" variant="secondary" className="hidden gap-2 lg:inline-flex">
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
                <div className="my-2 border-t" />
                {user ? (
                  <>
                    <p className="px-3 py-2 text-sm text-muted-foreground">{user.name}</p>
                    <Button variant="ghost" className="justify-start gap-2 text-base" onClick={logout}><LogOut className="size-4" />{t("logout")}</Button>
                  </>
                ) : (
                  <>
                    <Button render={<Link href="/login" />} variant="ghost" className="justify-start gap-2 text-base"><LogIn className="size-4" />{t("login")}</Button>
                    <Button render={<Link href="/register" />} className="mt-1 gap-2"><UserPlus className="size-4" />{t("register")}</Button>
                  </>
                )}
                <Button render={<Link href="/book" />} variant="secondary" className="mt-2 gap-2"><CalendarCheck className="size-4" />{t("book")}</Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
