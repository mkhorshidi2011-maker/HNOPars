<div dir="rtl">

# راهنمای کامل ساخت و اجرای وب‌سایت «هوشمند نوآوران افق پارس»

این پوشه یک **بستهٔ شروع (Starter)** کامل است: همهٔ فایل‌های لازم (تنظیمات، دیتابیس، APIها، صفحات، کامپوننت‌های shadcn، تصاویر، متن‌های فارسی/انگلیسی، رزرو مشاوره) به‌علاوهٔ راهنمای گام‌به‌گام.

> **صادقانه بدانید:** این فایل‌ها در محیط من اجرا و build نشده‌اند (امکان نصب کامل shadcn و Next در اینجا نبود). کد با دقت و مطابق مستندات نوشته شده، اما در اولین `npm run build` ممکن است چند خطای کوچک (تایپ، import یا اختلاف نسخه) ببینید. بخش «عیب‌یابی» و روش Vibe Coding همین‌جا برای رفع سریع آن‌هاست.

## فهرست

1. [آنچه در این بسته هست و آنچه نیست](#۱-آنچه-در-این-بسته-هست-و-آنچه-نیست)
2. [پیش‌نیازها](#۲-پیشنیازها)
3. [گام ۱ – ساخت پروژهٔ Next.js](#۳-گام-۱--ساخت-پروژه)
4. [گام ۲ – نصب کتابخانه‌ها و shadcn](#۴-گام-۲--نصب-کتابخانهها-و-shadcn)
5. [گام ۳ – کپی فایل‌های این بسته](#۵-گام-۳--کپی-فایلهای-این-بسته)
6. [گام ۴ – دیتابیس PostgreSQL](#۶-گام-۴--دیتابیس)
7. [گام ۵ – اجرا و تست](#۷-گام-۵--اجرا-و-تست)
8. [ساختار فایل‌ها](#۸-ساختار-فایلها)
9. [نحوهٔ کار بخش‌های مهم](#۹-نحوه-کار-بخشهای-مهم)
10. [سفارشی‌سازی](#۱۰-سفارشیسازی)
11. [روش Vibe Coding با حافظهٔ پروژه](#۱۱-روش-vibe-coding)
12. [استقرار روی سرور](#۱۲-استقرار)
13. [عیب‌یابی رایج](#۱۳-عیبیابی-رایج)
14. [چک‌لیست قبل از انتشار](#۱۴-چکلیست-قبل-از-انتشار)

---

## ۱. آنچه در این بسته هست و آنچه نیست

**هست:**
- سایت دوزبانه فارسی (پیش‌فرض، RTL) / انگلیسی با `next-intl`
- ۵ صفحهٔ اصلی + صفحهٔ **رزرو مشاوره** (`/book`)
- متن کامل فارسی و انگلیسی (`messages/fa.json`, `en.json`) بر اساس رزومهٔ مدیرعامل
- رابط کاربری با **shadcn/ui** (تم برند آبی، حالت روشن/تیره در CSS)
- ۱۱ تصویر SVG هماهنگ با برند + لوگو + OG image + آیکن سایت
- فرم تماس + API (honeypot، rate limit، ذخیره در Postgres، ایمیل اختیاری)
- رزرو مشاوره: ساعت‌های خالی، جلوگیری از رزرو دوبل، کد پیگیری، فایل تقویم `.ics`
- سئو: metadata، sitemap، robots، JSON-LD، hreflang
- Docker (توسعه و استقرار)، فایل‌های حافظهٔ Vibe Coding (`CLAUDE.md`, `docs/PROGRESS.md`)
- تلفن 09229261972 و آدرس «شیراز، تاچارا»

**نیست (باید بعداً اضافه شود):**
- **پنل `/admin`**: فعلاً رزروها و پیام‌ها را از دیتابیس می‌بینید (با `npx prisma studio`). پنل ادمین فاز بعدی است (پرامپتش در بخش ۱۱).
- **تقویم شمسی**: انتخاب تاریخ با تقویم میلادی shadcn است ولی تاریخ انتخاب‌شده به‌صورت **شمسی** نمایش داده می‌شود. برای تقویم کاملاً شمسی از نمای Persian نسخهٔ ۹ `react-day-picker` استفاده کنید (پرامپت در بخش ۱۱).
- **پیامک** اطلاع‌رسانی (نیاز به سرویس‌دهندهٔ پیامک).
- عکس‌های واقعی (فعلاً تصاویر برداری).

---

## ۲. پیش‌نیازها

| ابزار | نسخه | نکته |
|---|---|---|
| Node.js | 20 یا بالاتر (پیشنهاد 22) | `node -v` |
| npm | همراه Node | |
| Docker Desktop | هر نسخهٔ جدید | برای PostgreSQL |
| Git | | `git --version` |
| ابزار Vibe Coding | Cursor یا Claude Code یا Windsurf | |

---

## ۳. گام ۱ – ساخت پروژه

```bash
npx create-next-app@latest ofogh-pars --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd ofogh-pars
git init && git add -A && git commit -m "chore: init"
```

> هنگام پرسش‌ها: TypeScript بله، ESLint بله، Tailwind بله، `src/` بله، App Router بله، alias بله (`@/*`).

---

## ۴. گام ۲ – نصب کتابخانه‌ها و shadcn

```bash
# کتابخانه‌های اصلی
npm i next-intl lucide-react react-hook-form zod @hookform/resolvers nodemailer next-themes
npm i prisma@6 @prisma/client@6
npm i -D tsx @types/nodemailer

# shadcn/ui
npx shadcn@latest init
#   Base color: Neutral (بعداً با globals.css ما جایگزین می‌شود)
#   CSS variables: Yes

npx shadcn@latest add button card input textarea label select radio-group checkbox \
  badge tabs dialog sheet dropdown-menu accordion calendar popover form sonner \
  separator avatar skeleton toggle-group table tooltip scroll-area navigation-menu
```

> اگر `form` در نسخهٔ shadcn شما موجود نبود، کامپوننت `field` را اضافه کنید و `contact-form.tsx` را از ابزار Vibe Coding بخواهید با آن بازنویسی کند.

در `package.json` این دو قسمت را اضافه کنید:

```json
{
  "scripts": {
    "db:up": "docker compose up -d",
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio"
  },
  "prisma": { "seed": "tsx prisma/seed.ts" }
}
```

---

## ۵. گام ۳ – کپی فایل‌های این بسته

محتوای این پوشه را روی پروژه کپی کنید (جایگزینی فایل‌های موجود **بله**):

| از این بسته | به پروژه |
|---|---|
| `src/` | `src/` (شامل `globals.css`، کامپوننت‌ها، صفحات، API، lib) |
| `messages/` | `messages/` (ریشهٔ پروژه) |
| `prisma/` | `prisma/` |
| `public/images/` | `public/images/` |
| `next.config.ts`, `docker-compose.yml`, `docker-compose.prod.yml`, `Dockerfile`, `.gitignore` | ریشهٔ پروژه |
| `.env.example` | به نام `.env` کپی و ویرایش شود |
| `CLAUDE.md`, `PROJECT_BRIEF.md`, `docs/` | ریشهٔ پروژه |

نکته‌ها:
- فایل‌های `src/components/ui/*` را **خود shadcn** ساخته است؛ پوشهٔ `ui` در این بسته نیست و نباید آن را بازنویسی کنید.
- اگر create-next-app فایل `src/app/page.tsx` و `src/app/layout.tsx` ساخته، **حذفشان کنید** (صفحات ما زیر `src/app/[locale]/` هستند).
- اگر نسخهٔ Next شما 16 به بعد است و هشدار middleware دیدید، `src/middleware.ts` را به `src/proxy.ts` تغییر نام دهید.

---

## ۶. گام ۴ – دیتابیس

```bash
cp .env.example .env         # سپس مقادیر را بررسی کنید
npm run db:up                # اجرای PostgreSQL با Docker
npx prisma generate
npx prisma migrate dev --name init
```

**ایندکس ضد رزرو دوبل (فقط یک‌بار):**

```bash
docker compose exec -T db psql -U ofoghpars -d ofoghpars < prisma/partial-index.sql
```

**ساعات کاری (شنبه تا چهارشنبه، ۹ تا ۱۷):**

```bash
npm run db:seed
```

---

## ۷. گام ۵ – اجرا و تست

```bash
npm run dev
```

باز کنید: `http://localhost:3000` (فارسی) و `http://localhost:3000/en` (انگلیسی).

**تست دستی:**
- [ ] صفحهٔ اصلی فارسی RTL است و انگلیسی LTR
- [ ] سوییچ زبان همان صفحه را در زبان دیگر باز می‌کند
- [ ] منوی موبایل (عرض کم مرورگر) از سمت راست باز می‌شود
- [ ] فرم تماس: ارسال → پیام موفقیت → رکورد در `npx prisma studio` (جدول ContactMessage)
- [ ] `/book`: انتخاب نوع → تاریخ (شنبه تا چهارشنبه ساعت دارد، جمعه و پنج‌شنبه ندارد) → ساعت → اطلاعات → کد پیگیری
- [ ] رزرو دوبارهٔ همان ساعت پیام «این زمان رزرو شد» می‌دهد
- [ ] دانلود فایل `.ics` کار می‌کند
- [ ] `npm run lint` و `npm run build` بدون خطا

---

## ۸. ساختار فایل‌ها

```
ofogh-pars/
├─ README.md                      ← همین راهنما
├─ PROJECT_BRIEF.md               ← بریف کامل نیازمندی‌ها (برای ابزار هوش مصنوعی)
├─ CLAUDE.md                      ← قوانین ثابت و حافظهٔ ابزار Vibe Coding
├─ docs/{PROGRESS.md, UI_TEMPLATE.md}
├─ docker-compose.yml             ← PostgreSQL برای توسعه
├─ docker-compose.prod.yml, Dockerfile   ← استقرار
├─ .env.example                   ← نمونهٔ تنظیمات
├─ next.config.ts
├─ messages/{fa,en}.json          ← همهٔ متن‌های سایت
├─ prisma/{schema.prisma, seed.ts, partial-index.sql}
├─ public/images/                 ← logo.png, og.png, 11 تصویر SVG
└─ src/
   ├─ middleware.ts               ← مسیریابی زبان
   ├─ i18n/{routing.ts, request.ts}
   ├─ app/
   │  ├─ globals.css              ← تم برند + توکن‌های shadcn
   │  ├─ icon.png, sitemap.ts, robots.ts
   │  ├─ [locale]/{layout, page}.tsx, about/, services/, portfolio/, contact/, book/
   │  └─ api/{contact, booking, booking/slots, booking/[code], booking/[code]/ics}
   ├─ components/
   │  ├─ layout/{site-header, site-footer}.tsx
   │  ├─ sections/{hero, services-grid, stats, portfolio-grid, cta-banner}.tsx
   │  ├─ booking/booking-wizard.tsx
   │  └─ contact-form.tsx
   ├─ data/{services, portfolio}.ts
   └─ lib/{prisma, validators, booking, rate-limit, mail}.ts
```

---

## ۹. نحوهٔ کار بخش‌های مهم

**دوزبانگی.** فارسی بدون پیشوند (`/about`) و انگلیسی با `/en` (`/en/about`). `layout.tsx` برای هر زبان `lang` و `dir` را درست می‌گذارد. هیچ متنی هاردکد نیست؛ همه از `messages/*.json`.

**رزرو مشاوره.**
- `GET /api/booking/slots?date=YYYY-MM-DD`: ساعت‌های آن روز را از جدول `AvailabilityRule` می‌سازد (اسلات ۳۰ دقیقه‌ای + ۱۰ دقیقه فاصله)، روزهای تعطیل (`BlockedDate`) و ساعت‌های پر را حذف می‌کند؛ حداقل ۲ ساعت قبل و حداکثر ۶۰ روز بعد.
- `POST /api/booking`: ورودی را با Zod می‌سنجد، دوباره خالی بودن اسلات را در سرور چک می‌کند، رزرو را ذخیره می‌کند و کد پیگیری (مثل `OP-7K3Q9X`) برمی‌گرداند. اگر دو نفر هم‌زمان یک ساعت را بزنند، ایندکس یکتای دیتابیس یکی را رد می‌کند (خطای 409).
- زمان‌ها همیشه به وقت تهران (UTC+03:30) محاسبه و در دیتابیس UTC ذخیره می‌شوند.
- `GET /api/booking/[code]` فقط وضعیت و زمان را برمی‌گرداند (بدون اطلاعات شخصی).

**امنیت فرم‌ها.** فیلد مخفی honeypot، محدودیت ۵ درخواست در ۱۰ دقیقه برای هر IP (IP به‌صورت هش ذخیره می‌شود)، اعتبارسنجی سمت سرور، هدرهای امنیتی در `next.config.ts`.

**تغییر وضعیت رزرو (تا ساخت پنل ادمین).** `npx prisma studio` ← جدول `Consultation` ← ستون `status` را از `PENDING` به `CONFIRMED` یا `CANCELLED` تغییر دهید. رزرو `CANCELLED` ساعتش دوباره آزاد می‌شود.

**ایمیل.** اگر `SMTP_*` را در `.env` پر کنید، با هر پیام/رزرو ایمیل به `CONTACT_NOTIFY_EMAIL` می‌رسد؛ اگر خالی باشد همه‌چیز بدون ایمیل کار می‌کند.

---

## ۱۰. سفارشی‌سازی

| می‌خواهم… | کجا |
|---|---|
| متن‌ها را عوض کنم | `messages/fa.json` و `messages/en.json` |
| رنگ برند | `src/app/globals.css` (`--primary` و `--brand-*`) |
| ساعات کاری | `prisma/seed.ts` یا جدول `AvailabilityRule` در Prisma Studio، سپس `npm run db:seed` |
| روز تعطیل | یک ردیف در جدول `BlockedDate` |
| طول جلسه و فاصله | `SLOT_MIN` و `GAP_MIN` در `src/lib/booking.ts` |
| تلفن/آدرس | `messages/*.json` (بخش contact.info)، `site-footer.tsx`, `cta-banner.tsx`, `contact/page.tsx`, JSON-LD در `[locale]/layout.tsx` |
| نمونه‌کار جدید | یک آیتم در `src/data/portfolio.ts` + متنش در `messages/*.json` |
| تصاویر | `public/images/` (عکس واقعی را با همان نام جایگزین کنید) |

---

## ۱۱. روش Vibe Coding

۱. پروژه را در Cursor / Claude Code باز کنید. `CLAUDE.md` در ریشه است و ابزار آن را می‌خواند.
۲. اولین پرامپت:
> `CLAUDE.md` و `PROJECT_BRIEF.md` و `docs/PROGRESS.md` را بخوان. سپس `npm run lint` و `npm run build` را اجرا کن، همهٔ خطاها را رفع کن و نتیجه را در `docs/PROGRESS.md` ثبت کن.

۳. پرامپت‌های بعدی (هر کدام جدا، با commit بعد از هر یک):

- **مرور RTL:** «همهٔ فایل‌های `src/components/ui/*` را بررسی کن و کلاس‌های `left/right/ml/mr/pl/pr/text-left/text-right` را با معادل منطقی (`start/end/ms/me/ps/pe`) جایگزین کن. بعد صفحات را در حالت RTL تست کن.»
- **تقویم شمسی:** «در `BookingWizard` به‌جای `Calendar` میلادی، برای locale فارسی تقویم شمسی با `react-day-picker/persian` بگذار و تاریخ را همچنان به‌صورت YYYY-MM-DD میلادی به API بفرست.»
- **پنل ادمین:** «صفحهٔ `/admin` بساز با احراز هویت ساده (ایمیل/رمز هش‌شده در `.env`)، جدول رزروها و پیام‌ها با shadcn `Table`، تغییر وضعیت با `DropdownMenu`، و مدیریت ساعات کاری و روزهای تعطیل.»
- **پیامک:** «ارسال پیامک تأیید رزرو را با سرویس‌دهندهٔ [نام سرویس] اضافه کن؛ کلید API در `.env`.»
- **عکس واقعی:** «تصاویر SVG را با عکس‌های بهینه‌شدهٔ WebP جایگزین کن.»
- **سئو:** «برای هر صفحه `generateMetadata` اختصاصی (عنوان و توضیح فارسی/انگلیسی) اضافه کن و Lighthouse را بالای ۹۰ ببر.»

۴. قبل از بستن هر جلسه: «`docs/PROGRESS.md` را به‌روز کن و بنویس جلسهٔ بعد از کجا شروع کنیم.» جلسهٔ بعد فقط بگویید: «`CLAUDE.md` را بخوان و از «کار بعدی» ادامه بده.»

---

## ۱۲. استقرار

**گزینهٔ الف – سرور (VPS) با Docker (پیشنهادی، مستقل از سرویس خارجی):**
1. روی سرور Docker نصب کنید و پروژه را با Git بیاورید.
2. در `.env` مقدار `DB_PASSWORD` و `NEXT_PUBLIC_SITE_URL` (دامنهٔ واقعی با https) و `IP_HASH_SALT` را بگذارید.
3. `docker compose -f docker-compose.prod.yml up -d --build`
4. ایندکس ضد رزرو دوبل را روی دیتابیس تولید هم اجرا کنید:
   `docker compose -f docker-compose.prod.yml exec -T db psql -U ofoghpars -d ofoghpars < prisma/partial-index.sql`
5. `seed` را یک‌بار اجرا کنید (از کامپیوتر خودتان با `DATABASE_URL` سرور، یا دستی ردیف‌های `AvailabilityRule` را بسازید).
6. Nginx یا Caddy را جلوی پورت 3000 بگذارید و گواهی SSL (Let's Encrypt) بگیرید.

**گزینهٔ ب – Vercel + دیتابیس ابری:** پروژه را به Vercel وصل کنید و `DATABASE_URL` یک Postgres ابری (Neon/Supabase) بدهید. توجه: محدودیت‌های دسترسی از ایران و تحریم‌ها را قبل از انتخاب بررسی کنید؛ برای مخاطب ایرانی، سرور داخل ایران یا اروپا معمولاً مطمئن‌تر است.

> `Dockerfile` و `docker-compose.prod.yml` آزمایش نشده‌اند؛ اگر در build خطا دادند، خروجی خطا را به ابزار Vibe Coding بدهید.

---

## ۱۳. عیب‌یابی رایج

| مشکل | راه‌حل |
|---|---|
| `Cannot find module '@/components/ui/...'` | آن کامپوننت shadcn نصب نشده؛ `npx shadcn@latest add <name>` |
| خطای `Can't reach database` | `npm run db:up` اجرا شده؟ `DATABASE_URL` در `.env` درست است؟ |
| `Table does not exist` | `npx prisma migrate dev --name init` را اجرا کنید |
| هیچ ساعتی در `/book` نیست | `npm run db:seed` اجرا نشده یا روز انتخابی جمعه/پنج‌شنبه است |
| رزرو دوبل ممکن است | `prisma/partial-index.sql` اجرا نشده |
| متن به‌جای ترجمه، کلید نشان می‌دهد (`services.bookCta`) | کلید در `messages/*.json` نیست |
| منوها در RTL جابه‌جا شده‌اند | پرامپت «مرور RTL» در بخش ۱۱ |
| `middleware` deprecated در Next 16 | تغییر نام به `proxy.ts` |
| تصویر SVG نمایش داده نمی‌شود | `next.config.ts` را بررسی کنید (`dangerouslyAllowSVG`) یا از `<img>` ساده استفاده کنید |
| فونت‌ها لود نمی‌شوند | `next/font/google` هنگام build به اینترنت نیاز دارد؛ یا فایل Vazirmatn را محلی با `next/font/local` بگذارید |
| `form` در shadcn نیست | کامپوننت `field` را جایگزین کنید (بخش ۴) |

---

## ۱۴. چک‌لیست قبل از انتشار

- [ ] `.env` تولید پر شده و در Git نیست
- [ ] دامنه و `NEXT_PUBLIC_SITE_URL` درست است
- [ ] متن‌ها را یک بار کامل خوانده و ویرایش کرده‌اید (فارسی و انگلیسی)
- [ ] اجازهٔ نمایش نام مشتریان (مثلاً «سیمَتن نیریز») را گرفته‌اید
- [ ] آدرس کامل‌تر دفتر (در صورت تمایل) اضافه شده
- [ ] ایندکس ضد رزرو دوبل و seed ساعات کاری روی دیتابیس تولید اجرا شده
- [ ] ایمیل اطلاع‌رسانی (SMTP) تست شده
- [ ] `npm run build` و Lighthouse (بالای ۹۰) موفق
- [ ] گواهی SSL فعال، پشتیبان‌گیری منظم از Postgres برقرار است
- [ ] پنل ادمین یا روش مدیریت رزروها مشخص است

</div>
