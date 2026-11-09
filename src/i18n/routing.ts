import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["fa", "en"],
  defaultLocale: "fa",
  localePrefix: "as-needed", // فارسی بدون پیشوند، انگلیسی /en
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
