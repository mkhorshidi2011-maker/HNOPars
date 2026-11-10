# پیشرفت پروژه (حافظهٔ کاری)

آخرین به‌روزرسانی: ۱۴۰۵/۰۸/۲۰ (2026-11-10) | جلسهٔ شمارهٔ: نصب قابلیت گفتگوی زنده (chat-feature)

## کار بعدی
- **تأیید دستی ویژگی چت (درخواست VIBE_PROMPT مرحلهٔ ۹):** اجرای `npm run dev` و بررسی (الف) دکمهٔ چت پایین-راست در `/` و `/en`، (ب) ارسال پیام و ثبت ردیف در `ChatMessage` (Prisma Studio)، (ج) دسترسی کاربر staff به `/admin/chat` و پاسخ، (د) نمایش پاسخ برای بازدیدکننده ظرف ~۳ ثانیه، (ه) حفظ گفتگوی مهمان پس از ورود. رفع هر باگ مشاهده‌شده.
- **پیکربندی staff:** مقداردهی `ADMIN_EMAILS` در `.env` (ایمیل‌های جداشده با کاما، بدون حساسیت به بزرگی/کوچکی) برای دسترسی به `/admin/chat`؛ در صورت نیاز افزودن نقش در سیستم کاربر.
- **Prisma Client:** در صورت خطای runtime مربوط به مدل‌های چت، dev server را متوقف و `npx prisma generate` اجرا شود (در این جلسه تولید کلاینت با خطای EPERM قفل DLL روی ویندوز مواجه شد، هرچند build موفق بود).
- **کامیت/انتشار چت:** کاربر در ۱۴۰۵/۰۸/۲۰ صریحاً درخواست push داد؛ lint و build موفق‌اند. پوشهٔ منبع موقت `docs/chat-feature` در این تغییر نگه داشته می‌شود اما از lint/type-check خارج است. تست دستی end-to-end همچنان نیازمند تأیید است.
- ادامهٔ موارد قبلی: تست دستی کامل احراز هویت، بهبود UX/اعتبارسنجی فیلدبه‌فیلد و پیام rate limit، امنیت تولید (`AUTH_SECRET`, `IP_HASH_SALT`, Redis در صورت چندسرور)، فاز ۸/۹ (سئو/Lighthouse، پنل ادمین جامع).

## فازها
- [x] ۱. اسکلت پروژه (Next.js App Router، TypeScript، Tailwind، next-intl، فونت Vazirmatn/Inter، پالت برند، لوگو) — پایه در ریپو موجود است.
- [x] ۲. Header و Footer (ناوبری، سوییچر زبان، CTA رزرو، منوی موبایل، RTL-safe).
- [x] ۳. صفحهٔ اصلی (هیرو، خدمات، آمار، نمونه‌کارهای برجسته، CTA).
- [x] ۴. خدمات و نمونه‌کارها (صفحات Services/Portfolio، فیلتر دسته‌بندی).
- [x] ۵. دربارهٔ ما (داستان، مدیرعامل، مهارت‌ها، ارزش‌ها، تایم‌لاین، اطلاعات ثبتی).
- [x] ۶. دیتابیس و فرم تماس (Postgres/Prisma، `ContactMessage`، فرم react-hook-form+Zod، API تماس با honeypot و rate limit).
- [x] ۶-ب. رزرو مشاوره (مدل‌ها/قوانین، API اسلات/رزرو با جلوگیری از تداخل، ویزارد `/book`، کد پیگیری، ICS، اطلاع‌رسانی ایمیل در صورت تنظیم SMTP).
- [~] ۷. تصاویر و اطلاعات تماس (SVGها/لوگو/اطلاعات تماس استفاده می‌شوند؛ بازبینی نهایی محتوا/OG/مجوز نمایش نام مشتری پیش از انتشار لازم است).
- [~] ۸. سئو و کیفیت (metadata/sitemap/robots/JSON-LD/hreflang پیاده‌سازی شده در ساختار؛ Lighthouse و مرور نهایی دسترس‌پذیری/RTL باقی‌مانده).
- [ ] ۹. پنل ادمین جامع (مدیریت پیام‌ها/رزروها/ساعات کاری/تعطیلات؛ فعلاً از Prisma Studio).
- [~] گفتگوی زنده (Live chat): کد/اسکیما/API/UI نصب و build موفق؛ مهاجرت `add_chat` اعمال شد؛ **تأیید دستی end-to-end و تعیین staff باقی‌مانده**.

## تغییرات اخیر (جلسهٔ جاری — نصب chat-feature طبق `docs/chat-feature/VIBE_PROMPT.md`)

### نصب گفتگوی زنده
- **تنظیمات:** `docs` به `exclude` در `tsconfig.json` و `globalIgnores` در `eslint.config.mjs` اضافه شد تا کپی‌های pack چک نشوند.
- **دیتابیس/Prisma:** مدل‌ها و enumهای چت (`ChatSender`, `ChatStatus`, `ChatConversation`, `ChatMessage`) به انتهای `prisma/schema.prisma` اضافه شد. `docker compose up -d` به‌دلیل عدم اجرای Docker Desktop ناموفق بود، اما مهاجرت `npx prisma migrate dev --name add_chat` اجرا و اعمال شد (`prisma/migrations/20261110112826_add_chat/migration.sql`، DB در sync). `npx prisma generate` با خطای EPERM قفل `query_engine-windows.dll.node` مواجه شد؛ `npm run build` در ادامه موفق بود.
- **فایل‌ها:** محتوای `docs/chat-feature/src/**` به `src/**` کپی شد (مسیرهای API بازدیدکننده/ادمین، کامپوننت‌ها، `src/lib/chat.ts`, صفحهٔ `/[locale]/admin/chat`). `src/lib/mail.ts` و `src/lib/rate-limit.ts` موجود حفظ شدند (کپی pack یکسان بود).
- **اتصال احراز هویت:** `src/lib/auth-adapter.ts` به سیستم نشست موجود (`getSession` از `src/lib/session.ts`) متصل شد؛ `getCurrentUser` بر اساس کوکی نشست، `isStaff` با نقش `ADMIN/STAFF` یا عضویت ایمیل در `ADMIN_EMAILS`. `ADMIN_EMAILS` به `.env.example` اضافه شد.
- **متن‌ها:** اجرای `node docs/chat-feature/scripts/add-chat-messages.mjs` کلید `chat` را به `messages/fa.json` و `messages/en.json` افزود (بدون حذف سایر کلیدها).
- **UI:** `<ChatWidget />` در `src/app/[locale]/layout.tsx` داخل `NextIntlClientProvider` و بعد از `<SiteFooter />` رندر شد؛ دکمه شناور با `right-4` فیزیکی (پایین-راست در fa/en). کامپوننت‌های shadcn موردنیاز (`button`, `input`, `textarea`, `badge`) موجود بودند.
- **کیفیت:** رفع خطاهای lint در فایل‌های نصب‌شده/مرتبط (`chat-admin`, `chat-widget`, `auth-panel` با `key={authMode}` در هدر به‌جای setState همگام در effect، حذف import بلااستفاده در `login/page.tsx`، ignore کردن `docs/**` در ESLint). `npm run lint` بدون خطا (۴ warning قدیمی در فایل‌های دیگر)؛ `npm run build` موفق با مسیرهای جدید: `/[locale]/admin/chat`, `/api/chat/messages`, `/api/admin/chat`, `/api/admin/chat/[id]`.
- **وضعیت تأیید/پاک‌سازی:** تست دستی مرورگر (مراحل verify پرامپت) در این محیط انجام نشد؛ `docs/chat-feature` حذف نشده و کامیت/push انجام نشده (طبق درخواست کاربر: عدم push تا دستور صریح).

## تغییرات پیشین (خلاصه)

### اصلاح محتوای نمونه‌کار «اعلام بار» (`62e3082`, `0f04681`)
- تغییر به «وب‌سایت اعلام بار کارخانه سیمان خاکستری نیریز – بخش فروش» در `messages/fa.json`, `messages/en.json`, `PROJECT_BRIEF.md`, `README.md`, `Complete-Guide.html`؛ اطلاعات فنی بدون تغییر.

### احراز هویت کاربر (`65304aa`, `1274bb5`, `7e672af`)
- مدل `User` و مهاجرت `20261109192622_add_user`؛ هش `scrypt` (`src/lib/password.ts`)؛ نشست HMAC در کوکی `ofogh_session` (`src/lib/session.ts` با `phone`)؛ APIهای register/login/logout/me با Zod/honeypot/rate limit؛ `AUTH_SECRET` در `.env.example`.
- پیش‌پر خودکار و قابل‌ویرایش `name/email/phone` در رزرو و تماس از `/api/auth/me`.
- ورود/ثبت‌نام در Dialog هدر (`AuthPanel` با `initialMode`/`onSuccess`)، حذف فرم حساب از صفحهٔ خانه، ریدایرکت به خانه پس از موفقیت.

## تصمیم‌ها (با تاریخ و دلیل)
- ۱۴۰۵/۰۸/۱۸: فایل CSS پکیج `tw-animate-css` مستقیماً از `node_modules` وارد شود؛ Turbopack در build این پکیج را از طریق export شرطی `style` resolve نمی‌کند.
- ۱۴۰۵/۰۸/۱۸: پیکربندی loader رسمی `@tailwindcss/turbopack` برای پردازش directiveهای Tailwind v4 در build.
- ۱۴۰۵/۰۸/۱۸: استفاده از API ویژگی `render` در کامپوننت‌های Base UI به‌جای `asChild` ناسازگار با Radix UI.
- ۱۴۰۵/۰۸/۱۹: احراز هویت بدون وابستگی جدید با `scrypt` (Node crypto) + کوکی نشست امضاشدهٔ HMAC (`AUTH_SECRET`) پیاده‌سازی شد تا با Prisma/Postgres موجود و بدون Auth.js اضافه سازگار باشد.
- ۱۴۰۵/۰۸/۱۹: مهاجرت `add_user` باید قبل از تست ثبت‌نام اعمال شود (`npx prisma migrate deploy/dev`)؛ در صورت قفل فایل Prisma engine در ویندوز هنگام dev، تولید کلاینت را با dev server متوقف انجام دهید.
- ۱۴۰۵/۰۸/۱۹: پیش‌پر کردن فرم‌های رزرو/تماس از `/api/auth/me` فقط فیلدهای خالی را مقداردهی می‌کند تا ویرایش کاربر حفظ شود.
- ۱۴۰۵/۰۸/۱۹: ورود/ثبت‌نام از هدر در Dialog انجام می‌شود و پس از موفقیت به خانه هدایت می‌شود؛ فرم حساب کاربری در بدنهٔ صفحهٔ خانه نمایش داده نمی‌شود.
- ۱۴۰۵/۰۸/۲۰: گفتگوی زنده با polling (هر ۳ ثانیه هنگام باز بودن پنل، هر ۲۰ ثانیه هنگام بسته برای badge) پیاده‌سازی شد؛ مهمان با توکن تصادفی در کوکی `httpOnly` شناسایی و هش (`tokenHash`) ذخیره می‌شود؛ پس از ورود، گفتگوی مهمان به `userId` لینک می‌شود.
- ۱۴۰۵/۰۸/۲۰: دسترسی staff به `/admin/chat` و APIهای ادمین از طریق `isStaff` (نقش ADMIN/STAFF یا `ADMIN_EMAILS`) و نشست موجود پروژه تعیین می‌شود؛ کاربران غیر-staff در صفحهٔ ادمین 404 می‌بینند.
- ۱۴۰۵/۰۸/۲۰: پوشهٔ `docs/chat-feature` موقتاً نگه داشته شده و از type-check/lint خارج شده (`tsconfig` exclude, ESLint ignore)؛ حذف آن پس از تأیید دستی کارکرد انجام شود.

## مشکلات باز / بدهی فنی
- **چت:** تأیید دستی مرورگر کامل نشده (ارسال/ذخیره پیام، پاسخ staff، polling، لینک گفتگوی مهمان به کاربر پس از login). `ADMIN_EMAILS` باید در `.env` تنظیم شود تا staff بتواند `/admin/chat` را ببیند.
- `npx prisma generate` در این جلسه با EPERM روی `query_engine-windows.dll.node` شکست خورد (احتمال قفل فایل در ویندوز)؛ در صورت نیاز با dev server متوقف دوباره اجرا شود.
- `docker compose up -d` در این محیط اجرا نشد (Docker Desktop در دسترس نبود)؛ مهاجرت چت روی DB در دسترس اعمال شد.
- `npm run build` و `npm run lint` موفق هستند (lint: ۴ warning قدیمی در `persian-calendar.tsx` و `password.ts`)؛ Next.js دربارهٔ منسوخ‌شدن قرارداد فایل `middleware` هشدار می‌دهد.
- rate limit احراز هویت/فرم‌ها/چت در حافظهٔ پردازش است (برای dev تک‌سرور؛ در تولید چندنمونه‌ای Redis پیشنهاد می‌شود).
- کامیت‌های متن فارسی/JSON در ابزارها ممکن است با encoding ترمینال PowerShell بدنمایش شوند؛ محتوای فایل‌ها UTF-8 معتبر است.
- پنل ادمین جامع، تقویم کاملاً شمسی در ویزارد رزرو (در صورت نیاز)، پیامک، و موارد تکمیلی چت (نوتیفیکیشن مرورگر staff، SSE/WebSocket، پیوست فایل، پاسخ خودکار AI) باقی‌مانده‌اند.

## یادداشت برای جلسهٔ بعد
- **وضعیت git:** تغییرات نصب چت هنوز کامیت نشده‌اند؛ `docs/chat-feature` هنوز وجود دارد؛ **push ممنوع تا دستور صریح کاربر**. پس از تأیید دستی می‌توان cleanup/commit (`feat(chat): live chat with database storage`) انجام داد.
- **محیط:** `ADMIN_EMAILS` را در `.env` تنظیم کنید. برای تست محلی: Postgres در دسترس (`localhost:5433` طبق `.env` فعلی)، مهاجرت‌های `add_user` و `add_chat` اعمال شده‌اند؛ در صورت مشکل Prisma client، `npx prisma generate` با توقف dev server.
- **سناریوی تست چت:** مهمان پیام بفرستد → بررسی `ChatMessage`/`ChatConversation` → ورود کاربر staff → `/admin/chat` پاسخ دهد → مشاهدهٔ پاسخ در ویجت مهمان (~۳ ثانیه) → مهمان لاگین کند و گفتگو حفظ شود. همچنین تست احراز هویت/پیش‌پر رزرو و تماس طبق یادداشت قبلی.
