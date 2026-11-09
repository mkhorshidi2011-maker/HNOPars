import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const paths = ["", "/services", "/portfolio", "/about", "/contact", "/book"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((p) => [
    { url: `${SITE}${p || "/"}`, alternates: { languages: { fa: `${SITE}${p || "/"}`, en: `${SITE}/en${p}` } } },
    { url: `${SITE}/en${p}`, alternates: { languages: { fa: `${SITE}${p || "/"}`, en: `${SITE}/en${p}` } } },
  ]);
}
