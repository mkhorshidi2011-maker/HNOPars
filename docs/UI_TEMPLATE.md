<div dir="rtl">

# تمپلت رابط کاربری سایت افق پارس (shadcn/ui)

این پوشه یک «اسکلت طراحی» آماده است: تم برند، نصب shadcn، و کامپوننت‌های اصلی (هدر، هیرو، خدمات، آمار، نمونه‌کارها، CTA، فوتر، فرم تماس). همه چیز با shadcn/ui ساخته شده و فایل‌ها را مستقیم در پروژه کپی کنید.

## ۱. نصب (یک‌بار)

```bash
npx create-next-app@latest ofogh-pars --typescript --tailwind --eslint --app --src-dir
cd ofogh-pars
npx shadcn@latest init            # style: new-york | base color: neutral | CSS variables: yes
npx shadcn@latest add button card input textarea label select radio-group checkbox \
  badge tabs dialog sheet dropdown-menu accordion calendar popover form sonner \
  separator avatar skeleton toggle-group table tooltip scroll-area navigation-menu
npm i next-intl lucide-react framer-motion react-hook-form zod @hookform/resolvers
```

سپس محتوای `src/app/globals.css` همین پوشه را جایگزین (یا ادغام) کنید تا رنگ برند و فونت‌ها اعمال شود.

## ۲. نقشهٔ کنترل‌ها ← کامپوننت shadcn

| نیاز سایت | کامپوننت |
|---|---|
| دکمه‌ها (CTA، ثانویه، لینک) | `Button` (variants: default, secondary, outline, ghost) |
| منوی موبایل | `Sheet` |
| منوی سوییچ زبان / منوی کاربر ادمین | `DropdownMenu` |
| کارت خدمات و نمونه‌کار | `Card` |
| برچسب‌ها (تگ‌ها، مهارت‌ها) | `Badge` |
| فیلتر نمونه‌کارها | `Tabs` یا `ToggleGroup` |
| سوالات متداول / ارزش‌ها | `Accordion` |
| فیلدهای فرم تماس و رزرو | `Form`, `Input`, `Textarea`, `Label`, `Select` |
| شخص/سازمان، نحوهٔ برگزاری مشاوره | `RadioGroup` |
| انتخاب تاریخ رزرو | `Calendar` داخل `Popover` |
| ساعت‌های خالی | `ToggleGroup` (هر ساعت یک گزینه) |
| پیام موفقیت/خطا | `Sonner` (toast) |
| جدول رزروها در `/admin` | `Table` + `Badge` برای وضعیت |
| جزئیات پیام/رزرو | `Dialog` |
| لودینگ | `Skeleton` |

## ۳. نکات RTL و فارسی

- فقط کلاس‌های منطقی: `ms-* me-* ps-* pe-* text-start text-end`. بعد از `shadcn add` بررسی کنید کامپوننت‌های تولیدشده کلاس‌های `left/right/ml/mr` ندارند؛ اگر داشتند به معادل منطقی تغییر دهید (مثلاً در `Select`, `Sheet`, `Dialog`, `DropdownMenu`).
- `Sheet` منوی موبایل در فارسی از سمت راست باز شود: `side={locale === 'fa' ? 'right' : 'left'}`.
- فلش‌ها در RTL برعکس: `rtl:rotate-180`.
- تقویم شمسی: `react-day-picker` نسخهٔ ۹ نمای Persian دارد (`import { DayPicker } from 'react-day-picker/persian'`). در کامپوننت `Calendar` پروژه آن را برای locale فارسی استفاده کنید و از مستندات shadcn/react-day-picker درستی نسخه را بررسی کنید.

## ۴. اصول طراحی

- فضای سفید زیاد، شعاع گوشهٔ `rounded-2xl`، سایهٔ نرم، گرادیان آبی تیرهٔ برند فقط در هیرو و CTA.
- رنگ زرد `accent` فقط برای یک نقطهٔ تأکید در هر بخش.
- عنوان‌ها `font-bold tracking-tight`، متن `text-muted-foreground`.
- هر سکشن: `py-20` و کانتینر `max-w-6xl mx-auto px-4`.
- انیمیشن ظریف و با احترام به `prefers-reduced-motion`.

</div>

<div dir="rtl">

## ۵. کلیدهای پیام اضافه‌شده (به `messages/fa.json` و `en.json` بیفزایید)

- در بخش `services`: `"bookCta": "رزرو مشاوره"` (انگلیسی: `"Book a consultation"`).
- کامپوننت‌ها از کلیدهای `nav.book`، `hero.*`، `stats.*`، `portfolio.*`، `cta.*`، `footer.*` و `contact.form.*` بریف اصلی استفاده می‌کنند.
- مسیر `@/i18n/routing` باید `Link`, `usePathname`, `useRouter` را از `createNavigation(routing)` در next-intl خروجی بدهد.

## ۶. ساختار فایل‌ها

```
src/app/globals.css                   ← تم برند + توکن‌های shadcn (روشن/تیره)
src/data/{services,portfolio}.ts      ← داده‌های کارت‌ها (ارجاع به messages)
src/components/layout/                ← site-header، site-footer
src/components/sections/              ← hero، services-grid، stats، portfolio-grid، cta-banner
src/components/contact-form.tsx       ← فرم تماس کامل با shadcn Form
src/app/home-page-example.tsx         ← نمونهٔ ترکیب صفحهٔ اصلی
```

</div>
