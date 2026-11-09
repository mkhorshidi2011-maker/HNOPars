<div dir="rtl">

# بریف کامل ساخت وب‌سایت شرکت «هوشمند نوآوران افق پارس» (ویژه Vibe Coding)

> این فایل را در ریشهٔ پروژه با نام `PROJECT_BRIEF.md` ذخیره کنید. در Cursor / Claude Code / Windsurf به ابزار بگویید: «قبل از هر کاری `PROJECT_BRIEF.md` را کامل بخوان و دقیقاً مطابق آن پیش برو.» سپس پرامپت‌های فازبندی‌شدهٔ بخش ۱۰ را یکی‌یکی بدهید.

---

## ۱. معرفی پروژه

| مورد | مقدار |
|---|---|
| نام شرکت (فارسی) | هوشمند نوآوران افق پارس |
| نام شرکت (انگلیسی) | Hooshmand Noavaran Ofogh Pars |
| نام کوتاه برند | افق پارس / Ofogh Pars |
| نوع شرکت | سهامی خاص |
| شمارهٔ ثبت | ۶۹۷۵۹ / 69759 |
| مدیرعامل | محمد خورشیدی (Mohammad Khorshidi) |
| شهر / آدرس | شیراز، تاچارا |
| تلفن | 09229261972 (+98 922 926 1972) |
| ایمیل | M.Khorshidi2011@gmail.com |
| لینکدین | https://www.linkedin.com/in/mohammad-m-khorshidi2011-0a148754 |
| مخاطبان | هم **اشخاص حقیقی** و هم **سازمان‌ها و شرکت‌ها** (B2B و B2C) |
| زبان‌ها | فارسی (پیش‌فرض، RTL) و انگلیسی (LTR) |

**هدف سایت:** معرفی حرفه‌ای شرکت، جلب اعتماد، نمایش سابقه و نمونه‌کارها و جمع‌آوری درخواست مشتری از طریق فرم تماس (ذخیره در PostgreSQL).

**لحن محتوا:** حرفه‌ای، مطمئن، ساده و بدون اغراق. هیچ آمار، مشتری یا پروژهٔ ساختگی اضافه نشود؛ فقط همان چیزهایی که در این بریف آمده.

---

## ۲. هویت بصری (از روی لوگو)

- لوگو: `public/images/logo.png` (فایل پیوست؛ ققنوس آبی تیره داخل آکولاد `{ }` + کمان افق + نام شرکت). لوگو آبی تیره روی زمینهٔ سفید است. برای فوتر/بخش تیره، یک نسخهٔ سفید با `filter: brightness(0) invert(1)` یا نسخهٔ SVG جداگانه استفاده شود.
- رنگ اصلی (تقریبی از لوگو): `#1E3A80`. پالت پیشنهادی در Tailwind:

```ts
// tailwind.config.ts → theme.extend.colors
brand: {
  50:  '#EEF3FB',
  100: '#D9E5F6',
  200: '#B3CAEC',
  300: '#86A8DB',
  400: '#5580C6',
  500: '#2F5BA8',
  600: '#1E3A80', // رنگ لوگو
  700: '#182E66',
  800: '#12234D',
  900: '#0B1633',
},
accent: '#F5A524' // رنگ تأکید کوچک (دکمه ثانویه/هایلایت) - کم مصرف
```

- حس کلی: مدرن، تمیز، فضای سفید زیاد، گوشه‌های گرد (`rounded-2xl`)، سایه‌های نرم، گرادیان ملایم آبی تیره در هیرو، آیکون‌های `lucide-react`، انیمیشن‌های ظریف با `framer-motion` (fade/slide هنگام اسکرول).
- فونت‌ها (با `next/font` یا فایل محلی، نه CDN خارجی):
  - فارسی: **Vazirmatn**
  - انگلیسی: **Inter**
- حالت تاریک (Dark mode) اختیاری؛ در فاز اول فقط حالت روشن.
- Favicon و OG image از لوگو ساخته شود.

---

## ۳. استک فنی

- **Next.js (آخرین نسخهٔ پایدار) – App Router + TypeScript**
- **React**
- **Tailwind CSS** (با پشتیبانی RTL: از کلاس‌های منطقی `ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end` به‌جای `ml/mr/pl/pr/left/right` استفاده شود)
- **PostgreSQL + Prisma ORM**
- **next-intl** برای i18n
- **Zod + react-hook-form** برای اعتبارسنجی فرم
- **framer-motion**, **lucide-react**
- **Nodemailer** (اختیاری) برای ایمیل اطلاع‌رسانی پیام جدید
- **Docker Compose** برای Postgres در محیط توسعه

### ساختار پوشه‌ها

```
/
├─ PROJECT_BRIEF.md
├─ docker-compose.yml          # postgres
├─ .env.example
├─ prisma/schema.prisma
├─ messages/
│  ├─ fa.json
│  └─ en.json
├─ public/images/              # logo.png, og.png, تصاویر
├─ src/
│  ├─ i18n/ (routing.ts, request.ts)
│  ├─ middleware.ts
│  ├─ app/
│  │  ├─ [locale]/
│  │  │  ├─ layout.tsx         # dir، lang، فونت، Header/Footer
│  │  │  ├─ page.tsx           # Home
│  │  │  ├─ about/page.tsx
│  │  │  ├─ services/page.tsx
│  │  │  ├─ portfolio/page.tsx
│  │  │  └─ contact/page.tsx
│  │  ├─ api/contact/route.ts
│  │  ├─ sitemap.ts
│  │  └─ robots.ts
│  ├─ components/ (layout/, sections/, ui/)
│  ├─ lib/ (prisma.ts, validators.ts, rate-limit.ts)
│  └─ data/ (services.ts, portfolio.ts)
```

---

## ۴. دوزبانگی (i18n) و RTL

- زبان‌ها: `fa` (پیش‌فرض) و `en`. مسیرها: `/` ← فارسی، `/en` ← انگلیسی (`localePrefix: 'as-needed'` با `defaultLocale: 'fa'`).
- در `layout.tsx`: `<html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'}>`.
- دکمهٔ تعویض زبان در هدر (FA | EN) که همان صفحه را در زبان دیگر باز کند.
- **هیچ متنی داخل کامپوننت‌ها هاردکد نشود**؛ همه از `messages/fa.json` و `messages/en.json`.
- اعداد در نسخهٔ فارسی با ارقام فارسی نمایش داده شود (`toLocaleString('fa-IR')`)، در انگلیسی لاتین.
- تگ‌های `hreflang` و `alternate` برای SEO.
- متادیتا (title/description/OG) برای هر صفحه و هر زبان جدا.
- آیکون‌های جهت‌دار (فلش‌ها) در RTL برعکس شوند (`rtl:rotate-180`).

---

## ۵. نقشه سایت

1. **صفحهٔ اصلی (`/`)**: هیرو (لوگو + شعار + دو دکمه) ← خدمات کلیدی (۳ کارت) ← آمار ← نمونه‌کارهای برجسته (۳ کارت) ← دعوت به همکاری + فرم تماس سریع.
2. **دربارهٔ ما (`/about`)**: داستان شرکت ← بیوگرافی مدیرعامل ← ارزش‌ها ← مسیر تجربه (Timeline) ← مدارک و دوره‌ها ← اطلاعات ثبتی شرکت.
3. **خدمات (`/services`)**: توسعه نرم‌افزار ← مدیریت زیرساخت و شبکه ← علم داده و هوش مصنوعی ← روش کار (۴ مرحله) ← CTA.
4. **نمونه‌کارها (`/portfolio`)**: کارت‌های سیستم‌های توسعه‌یافته با فیلتر دسته‌بندی.
5. **تماس با ما (`/contact`)**: فرم کامل، اطلاعات تماس (تلفن، آدرس شیراز–تاچارا، ایمیل)، لینکدین، نقشه.
6. **رزرو مشاوره (`/book`)**: انتخاب نوع مشاوره، تاریخ و ساعت خالی، ثبت اطلاعات و دریافت کد پیگیری (بخش ۷-ب).

**ناوبری هدر:** خانه، خدمات، نمونه‌کارها، دربارهٔ ما، تماس با ما + سوییچر زبان + دکمهٔ برجستهٔ «رزرو مشاوره» (لینک به `/book`). دکمهٔ شناور تماس/رزرو در موبایل هم اضافه شود.
**فوتر:** لوگو (نسخه سفید)، توضیح کوتاه، لینک‌ها، «شرکت سهامی خاص – شمارهٔ ثبت ۶۹۷۵۹»، شیراز–تاچارا، تلفن 09229261972 (لینک `tel:+989229261972`)، ایمیل، لینکدین، کپی‌رایت.

---

## ۶. محتوا (فارسی و انگلیسی)

> محتوا از روی رزومهٔ مدیرعامل نوشته شده و آمادهٔ قرار گرفتن در `messages/*.json` است. ساختار کلیدها را حفظ کنید و در صورت نیاز متن را ویرایش کنید.

### ۶.۱ `messages/fa.json`

```json
{
  "meta": {
    "siteName": "هوشمند نوآوران افق پارس",
    "defaultTitle": "هوشمند نوآوران افق پارس | توسعه نرم‌افزار، زیرساخت و هوش مصنوعی",
    "defaultDescription": "شرکت سهامی خاص هوشمند نوآوران افق پارس در شیراز؛ طراحی و توسعه نرم‌افزارهای سازمانی، مدیریت زیرساخت و شبکه، علم داده و هوش مصنوعی با بیش از ۲۰ سال تجربه."
  },
  "nav": {
    "home": "خانه",
    "services": "خدمات",
    "portfolio": "نمونه‌کارها",
    "about": "دربارهٔ ما",
    "contact": "تماس با ما",
    "cta": "رزرو مشاوره",
    "book": "رزرو مشاوره"
  },
  "hero": {
    "badge": "بیش از ۲۰ سال تجربهٔ حرفه‌ای",
    "title": "فناوری هوشمند، برای رشد کسب‌وکار شما",
    "subtitle": "ما در افق پارس، نرم‌افزارهای سازمانی، زیرساخت‌های پایدار و راهکارهای داده‌محور و هوش مصنوعی را برای اشخاص و سازمان‌ها طراحی و پیاده‌سازی می‌کنیم.",
    "primaryCta": "شروع همکاری",
    "secondaryCta": "مشاهدهٔ نمونه‌کارها"
  },
  "services": {
    "title": "خدمات ما",
    "subtitle": "از ایده تا اجرا و پشتیبانی، در کنار شما هستیم.",
    "items": {
      "software": {
        "title": "توسعه نرم‌افزار",
        "short": "طراحی و ساخت نرم‌افزارهای تحت وب و سازمانی متناسب با فرآیندهای کسب‌وکار شما.",
        "description": "از سیستم‌های حقوق و دستمزد و حسابداری تا مدیریت انبار، حمل‌ونقل و نوبت‌دهی؛ نرم‌افزارهایی می‌سازیم که دقیقاً با فرآیند کاری شما هماهنگ است، قابل توسعه است و با پایگاه‌داده‌های معتبر کار می‌کند.",
        "features": [
          "توسعهٔ وب‌اپلیکیشن با ASP.NET، React و Next.js",
          "طراحی و بهینه‌سازی پایگاه‌داده (SQL Server، Oracle، PostgreSQL)",
          "اتوماسیون فرآیندها با VBA و اسکریپت‌نویسی",
          "یکپارچه‌سازی با سیستم‌های موجود و مهاجرت از نرم‌افزارهای قدیمی",
          "توسعهٔ سریع با رویکرد AI-Assisted Development"
        ]
      },
      "infrastructure": {
        "title": "مدیریت زیرساخت و شبکه",
        "short": "راه‌اندازی، مدیریت و پشتیبانی شبکه و سرورها برای عملکرد پایدار و امن.",
        "description": "با بیش از دو دهه تجربهٔ مدیریت زیرساخت فناوری اطلاعات یک مجموعهٔ سازمانی، خدمات پشتیبانی و مدیریت شبکه و سرور را با تمرکز بر پایداری و امنیت ارائه می‌دهیم.",
        "features": [
          "مدیریت Windows Server و Active Directory",
          "طراحی و راه‌اندازی شبکه، مسیریابی و DHCP",
          "مدیریت IIS و مجازی‌سازی",
          "مدیریت امنیت و آنتی‌ویروس سازمانی",
          "پشتیبانی و عیب‌یابی سخت‌افزار و نرم‌افزار"
        ]
      },
      "data": {
        "title": "علم داده و هوش مصنوعی",
        "short": "تحلیل داده، داشبوردهای مدیریتی و راهکارهای هوش مصنوعی برای تصمیم‌گیری بهتر.",
        "description": "داده‌های سازمان شما را به بینش قابل استفاده تبدیل می‌کنیم؛ از تحلیل و مصورسازی تا مدل‌سازی و اتوماسیون هوشمند.",
        "features": [
          "تحلیل داده با Python، R و SAS",
          "داشبوردهای مدیریتی با Tableau و Excel پیشرفته",
          "معماری داده و کار با SQL Server، Oracle و MongoDB",
          "راهکارهای هوش مصنوعی و اتوماسیون هوشمند"
        ]
      }
    },
    "processTitle": "روش کار ما",
    "process": [
      { "title": "شناخت نیاز", "text": "جلسهٔ مشاوره و تحلیل دقیق نیازها و فرآیندها." },
      { "title": "طراحی راهکار", "text": "ارائهٔ معماری و پیشنهاد فنی شفاف." },
      { "title": "توسعه و پیاده‌سازی", "text": "ساخت مرحله‌ای با بازخورد مستمر." },
      { "title": "پشتیبانی", "text": "آموزش، تحویل و پشتیبانی پس از اجرا." }
    ]
  },
  "stats": {
    "years": { "value": "20+", "label": "سال تجربه حرفه‌ای" },
    "users": { "value": "70+", "label": "کاربر تحت پشتیبانی روزانهٔ زیرساخت" },
    "systems": { "value": "5", "label": "حوزهٔ اصلی سیستم‌های توسعه‌یافته" },
    "certs": { "value": "CCNA", "label": "و Network+ و دورهٔ معماری علم داده" }
  },
  "portfolio": {
    "title": "نمونه‌کارها",
    "subtitle": "بخشی از سیستم‌هایی که طراحی و توسعه داده‌ایم.",
    "filters": { "all": "همه", "software": "نرم‌افزار", "transport": "حمل‌ونقل", "pharma": "دارو و سلامت", "finance": "مالی و حقوق" },
    "items": {
      "payroll": {
        "title": "سیستم حقوق و دستمزد و حسابداری",
        "text": "نرم‌افزار محاسبهٔ حقوق، دستمزد و گزارش‌های مالی برای شرکت‌ها، توسعه‌یافته به‌صورت شبکه‌ای و چندکاربره.",
        "tags": ["حقوق و دستمزد", "حسابداری", "گزارش‌گیری"]
      },
      "pharma": {
        "title": "سیستم مدیریت موجودی دارو",
        "text": "مدیریت انبار و موجودی کالاهای دارویی با کنترل ورود و خروج، سوابق و گزارش‌های تحلیلی.",
        "tags": ["انبار", "دارو", "گزارش‌های تحلیلی"]
      },
      "freight": {
        "title": "سیستم اعلام بار و صدور بارنامه",
        "text": "مدیریت اعلام بار، حمل‌ونقل و صدور بارنامه برای شرکت‌های حمل‌ونقل (کامیون‌داران شیراز و مرودشت).",
        "tags": ["حمل‌ونقل", "بارنامه", "شبکه"]
      },
      "appointment": {
        "title": "سیستم نوبت‌دهی",
        "text": "نرم‌افزار زمان‌بندی و نوبت‌دهی مراجعان با مدیریت ظرفیت و یادآوری.",
        "tags": ["نوبت‌دهی", "زمان‌بندی"]
      },
      "furnace": {
        "title": "وب‌سایت اعلام بار کارخانه سیمان خاکستری نیریز – بخش فروش",
        "text": "وب‌سایت Full-stack برای اعلام بار بخش فروش کارخانه سیمان خاکستری نیریز با بک‌اند ASP.NET، فرانت‌اند React و پایگاه‌داده SQL Server.",
        "tags": ["ASP.NET", "React", "SQL Server"]
      }
    },
    "cta": "پروژهٔ مشابهی در ذهن دارید؟"
  },
  "about": {
    "title": "دربارهٔ افق پارس",
    "storyTitle": "داستان ما",
    "story": "شرکت هوشمند نوآوران افق پارس با تکیه بر بیش از دو دهه تجربهٔ عملی در توسعه نرم‌افزار و مدیریت زیرساخت فناوری اطلاعات، در شیراز شکل گرفت. هدف ما ساده است: تبدیل فناوری به ابزاری قابل اعتماد برای کسب‌وکارها. از نخستین سیستم‌های شبکه‌ای حمل‌ونقل و حقوق‌ودستمزد تا وب‌اپلیکیشن‌های امروزی و راهکارهای داده‌محور، مسیر ما همواره بر پایهٔ یادگیری مداوم و حل مسئلهٔ واقعی مشتری بوده است.",
    "ceoTitle": "مدیرعامل",
    "ceoName": "محمد خورشیدی",
    "ceoRole": "مدیرعامل و بنیان‌گذار",
    "ceoBio": "محمد خورشیدی دارای مدرک کارشناسی ریاضی (گرایش علوم کامپیوتر) از دانشگاه فردوسی مشهد (فارغ‌التحصیل ۱۳۷۵ / ۱۹۹۶) است. فعالیت حرفه‌ای او از سال ۱۳۷۶ (۱۹۹۷) با توسعهٔ نرم‌افزار برای شرکت‌های حمل‌ونقل آغاز شد و از سال ۱۳۷۹ (۲۰۰۱) مدیریت زیرساخت فناوری اطلاعات یک مجموعهٔ سازمانی را بر عهده دارد. او علاوه بر توسعهٔ Full-stack با C#، ASP.NET، React و Next.js، دارای مدارک CCNA و CompTIA Network+ و گذراندهٔ دورهٔ Data Science Architect (IntelliPaat، ۲۰۲۵) است و به‌طور فعال از توسعهٔ مبتنی بر هوش مصنوعی (Vibe Coding) در پروژه‌ها بهره می‌برد.",
    "skillsTitle": "مهارت‌های کلیدی",
    "skills": ["C#", "Python", "R", "SAS", "JavaScript", "ASP.NET", "React", "Next.js", "SQL Server", "Oracle", "PL/SQL", "MongoDB", "Tableau", "Windows Server", "Active Directory", "Docker", "Git"],
    "valuesTitle": "ارزش‌های ما",
    "values": [
      { "title": "اعتماد و شفافیت", "text": "ارتباط روشن، قول‌های قابل‌اجرا و گزارش‌دهی مستمر." },
      { "title": "کیفیت فنی", "text": "معماری درست، کد تمیز و راهکارهای پایدار و قابل نگهداری." },
      { "title": "نوآوری کاربردی", "text": "استفاده از فناوری‌های روز، از جمله هوش مصنوعی، فقط جایی که ارزش واقعی می‌سازد." },
      { "title": "یادگیری مستمر", "text": "به‌روز بودن دانش فنی، شرط ماندن در مسیر رشد است." }
    ],
    "timelineTitle": "مسیر تجربه",
    "timeline": [
      { "year": "۱۹۹۲–۱۹۹۶", "text": "تحصیل در رشتهٔ ریاضی، گرایش علوم کامپیوتر، دانشگاه فردوسی مشهد" },
      { "year": "۱۹۹۷–۱۹۹۹", "text": "برنامه‌نویس سیستم‌های حمل‌ونقل و حقوق‌ودستمزد (FoxPro و Novell NetWare)" },
      { "year": "۲۰۰۱–اکنون", "text": "مدیریت زیرساخت IT و شبکه برای ۷۰+ کاربر؛ Windows Server، Active Directory و Oracle" },
      { "year": "۱۹۹۷–اکنون", "text": "توسعهٔ نرم‌افزار پروژه‌ای برای شرکت‌های مختلف" },
      { "year": "۲۰۲۵", "text": "دورهٔ Data Science Architect (IntelliPaat) و ورود به حوزهٔ هوش مصنوعی" }
    ],
    "legalTitle": "اطلاعات شرکت",
    "legal": { "name": "هوشمند نوآوران افق پارس", "type": "شرکت سهامی خاص", "regNo": "۶۹۷۵۹", "city": "شیراز" }
  },
  "contact": {
    "title": "تماس با ما",
    "subtitle": "پروژه یا نیاز خود را بنویسید؛ در اولین فرصت پاسخ می‌دهیم.",
    "form": {
      "customerType": "شما به‌عنوان …",
      "person": "شخص حقیقی",
      "organization": "سازمان / شرکت",
      "name": "نام و نام خانوادگی",
      "organizationName": "نام سازمان",
      "email": "ایمیل",
      "phone": "شمارهٔ تماس",
      "service": "موضوع درخواست",
      "serviceOptions": { "software": "توسعه نرم‌افزار", "infrastructure": "زیرساخت و شبکه", "data": "علم داده و هوش مصنوعی", "other": "سایر" },
      "message": "پیام شما",
      "submit": "ارسال پیام",
      "sending": "در حال ارسال…",
      "success": "پیام شما با موفقیت ارسال شد. به‌زودی با شما تماس می‌گیریم.",
      "error": "ارسال پیام ناموفق بود. لطفاً دوباره تلاش کنید.",
      "required": "این فیلد الزامی است",
      "invalidEmail": "ایمیل معتبر نیست"
    },
    "info": { "addressLabel": "آدرس", "address": "شیراز، تاچارا", "phoneLabel": "تلفن", "phone": "09229261972", "email": "ایمیل", "linkedin": "لینکدین", "hours": "شنبه تا چهارشنبه، ۹ تا ۱۷" }
  },
  "booking": {
    "title": "رزرو مشاوره",
    "subtitle": "یک وقت مشاوره انتخاب کنید تا نیاز شما را بررسی و بهترین راهکار را پیشنهاد دهیم.",
    "steps": { "type": "نوع مشاوره", "datetime": "تاریخ و ساعت", "details": "اطلاعات شما", "done": "تأیید" },
    "types": {
      "software": "مشاورهٔ توسعه نرم‌افزار",
      "infrastructure": "مشاورهٔ زیرساخت و شبکه",
      "data": "مشاورهٔ علم داده و هوش مصنوعی",
      "general": "مشاورهٔ عمومی"
    },
    "mode": "نحوهٔ برگزاری",
    "modes": { "phone": "تلفنی", "online": "آنلاین (ویدئو)", "inperson": "حضوری – شیراز، تاچارا" },
    "duration": "مدت جلسه: ۳۰ دقیقه",
    "pickDate": "تاریخ را انتخاب کنید",
    "pickTime": "ساعت را انتخاب کنید",
    "noSlots": "در این روز زمان خالی وجود ندارد.",
    "slotTaken": "این زمان همین حالا رزرو شد؛ لطفاً زمان دیگری انتخاب کنید.",
    "notes": "توضیحات (اختیاری)",
    "submit": "ثبت رزرو",
    "successTitle": "رزرو شما ثبت شد",
    "successText": "کد پیگیری شما: {code}. به‌زودی برای تأیید با شما تماس می‌گیریم.",
    "statusLabel": "پیگیری رزرو",
    "trackPlaceholder": "کد پیگیری را وارد کنید",
    "error": "ثبت رزرو ناموفق بود. لطفاً دوباره تلاش کنید."
  },
  "cta": {
    "title": "آمادهٔ شروع هستیم",
    "text": "نیاز خود را با ما در میان بگذارید تا بهترین راهکار را پیشنهاد دهیم.",
    "button": "تماس با ما"
  },
  "footer": {
    "about": "شرکت سهامی خاص | شمارهٔ ثبت ۶۹۷۵۹ | شیراز",
    "links": "دسترسی سریع",
    "rights": "تمامی حقوق محفوظ است."
  }
}
```

### ۶.۲ `messages/en.json`

```json
{
  "meta": {
    "siteName": "Hooshmand Noavaran Ofogh Pars",
    "defaultTitle": "Hooshmand Noavaran Ofogh Pars | Software, Infrastructure & AI",
    "defaultDescription": "Hooshmand Noavaran Ofogh Pars, a private joint-stock company based in Shiraz, Iran: enterprise software development, IT infrastructure and network management, data science and AI, with 20+ years of experience."
  },
  "nav": {
    "home": "Home",
    "services": "Services",
    "portfolio": "Portfolio",
    "about": "About Us",
    "contact": "Contact",
    "cta": "Book a Consultation",
    "book": "Book a Consultation"
  },
  "hero": {
    "badge": "20+ years of professional experience",
    "title": "Smart technology for your business growth",
    "subtitle": "At Ofogh Pars we design and deliver enterprise software, reliable infrastructure, and data-driven and AI solutions for individuals and organizations.",
    "primaryCta": "Start a Project",
    "secondaryCta": "View Our Work"
  },
  "services": {
    "title": "Our Services",
    "subtitle": "From idea to delivery and support, we are by your side.",
    "items": {
      "software": {
        "title": "Software Development",
        "short": "Web and enterprise applications tailored to your business processes.",
        "description": "From payroll and accounting to inventory, transportation and appointment systems, we build software that fits your workflow, scales with you, and runs on proven databases.",
        "features": [
          "Web applications with ASP.NET, React and Next.js",
          "Database design and optimization (SQL Server, Oracle, PostgreSQL)",
          "Process automation with VBA and scripting",
          "Integration with existing systems and legacy migration",
          "Rapid delivery through AI-assisted development"
        ]
      },
      "infrastructure": {
        "title": "Infrastructure & Network Management",
        "short": "Setup, administration and support of networks and servers for stable, secure operations.",
        "description": "With two decades of hands-on experience running the IT infrastructure of a large organizational branch, we provide network and server management focused on reliability and security.",
        "features": [
          "Windows Server and Active Directory administration",
          "Network design, routing and DHCP",
          "IIS management and virtualization",
          "Enterprise antivirus and security management",
          "Hardware and software troubleshooting and support"
        ]
      },
      "data": {
        "title": "Data Science & AI",
        "short": "Data analysis, executive dashboards and AI solutions for better decisions.",
        "description": "We turn your organization's data into actionable insight, from analysis and visualization to modeling and intelligent automation.",
        "features": [
          "Data analysis with Python, R and SAS",
          "Dashboards with Tableau and advanced Excel",
          "Data architecture with SQL Server, Oracle and MongoDB",
          "AI solutions and intelligent automation"
        ]
      }
    },
    "processTitle": "How We Work",
    "process": [
      { "title": "Discovery", "text": "A consultation and careful analysis of your needs and processes." },
      { "title": "Solution Design", "text": "A clear architecture and technical proposal." },
      { "title": "Build & Deliver", "text": "Incremental development with continuous feedback." },
      { "title": "Support", "text": "Training, handover and post-launch support." }
    ]
  },
  "stats": {
    "years": { "value": "20+", "label": "Years of professional experience" },
    "users": { "value": "70+", "label": "Users supported daily on managed infrastructure" },
    "systems": { "value": "5", "label": "Core system categories developed" },
    "certs": { "value": "CCNA", "label": "plus Network+ and a Data Science Architect program" }
  },
  "portfolio": {
    "title": "Portfolio",
    "subtitle": "A selection of systems we have designed and developed.",
    "filters": { "all": "All", "software": "Software", "transport": "Transportation", "pharma": "Pharma & Health", "finance": "Finance & Payroll" },
    "items": {
      "payroll": {
        "title": "Payroll & Accounting System",
        "text": "Payroll, wage calculation and financial reporting software for companies, built as a networked multi-user system.",
        "tags": ["Payroll", "Accounting", "Reporting"]
      },
      "pharma": {
        "title": "Pharmaceutical Inventory Management",
        "text": "Warehouse and stock management for pharmaceutical goods with inbound/outbound control, history and analytical reports.",
        "tags": ["Inventory", "Pharma", "Analytics"]
      },
      "freight": {
        "title": "Freight Announcement & Bill of Lading System",
        "text": "Freight announcement, shipment management and bill-of-lading issuance for transportation companies in Shiraz and Marvdasht.",
        "tags": ["Transportation", "Bill of Lading", "Networked"]
      },
      "appointment": {
        "title": "Appointment Scheduling System",
        "text": "Scheduling software with capacity management and reminders.",
        "tags": ["Appointments", "Scheduling"]
      },
      "furnace": {
        "title": "Gray Cement Loading Announcement Website – Neyriz Cement Plant, Sales Department",
        "text": "A full-stack website for announcing loading schedules for the sales department of Neyriz Gray Cement Plant, with an ASP.NET backend, React frontend and SQL Server database.",
        "tags": ["ASP.NET", "React", "SQL Server"]
      }
    },
    "cta": "Have a similar project in mind?"
  },
  "about": {
    "title": "About Ofogh Pars",
    "storyTitle": "Our Story",
    "story": "Hooshmand Noavaran Ofogh Pars was founded in Shiraz on more than two decades of hands-on experience in software development and IT infrastructure management. Our goal is simple: to make technology a dependable tool for businesses. From early networked transportation and payroll systems to today's web applications and data-driven solutions, our path has always been built on continuous learning and solving real customer problems.",
    "ceoTitle": "Chief Executive Officer",
    "ceoName": "Mohammad Khorshidi",
    "ceoRole": "CEO & Founder",
    "ceoBio": "Mohammad Khorshidi holds a B.Sc. in Mathematics (Computer Science major) from Ferdowsi University of Mashhad (graduated 1996). His professional career began in 1997 developing software for transportation companies, and since 2001 he has managed the IT infrastructure of a large organizational branch. Beyond full-stack development with C#, ASP.NET, React and Next.js, he holds CCNA and CompTIA Network+ certifications, completed the Data Science Architect program (IntelliPaat, 2025), and actively uses AI-assisted development (vibe coding) in his projects.",
    "skillsTitle": "Key Skills",
    "skills": ["C#", "Python", "R", "SAS", "JavaScript", "ASP.NET", "React", "Next.js", "SQL Server", "Oracle", "PL/SQL", "MongoDB", "Tableau", "Windows Server", "Active Directory", "Docker", "Git"],
    "valuesTitle": "Our Values",
    "values": [
      { "title": "Trust & Transparency", "text": "Clear communication, achievable promises and steady reporting." },
      { "title": "Technical Quality", "text": "Sound architecture, clean code and maintainable solutions." },
      { "title": "Practical Innovation", "text": "Modern technology, including AI, only where it creates real value." },
      { "title": "Continuous Learning", "text": "Staying current is how we keep growing." }
    ],
    "timelineTitle": "Experience Timeline",
    "timeline": [
      { "year": "1992–1996", "text": "B.Sc. in Mathematics, Computer Science major, Ferdowsi University of Mashhad" },
      { "year": "1997–1999", "text": "Programmer of transportation and payroll systems (FoxPro and Novell NetWare)" },
      { "year": "2001–Present", "text": "IT infrastructure and network management for 70+ users; Windows Server, Active Directory and Oracle" },
      { "year": "1997–Present", "text": "Project-based software development for various companies" },
      { "year": "2025", "text": "Data Science Architect program (IntelliPaat) and expansion into AI" }
    ],
    "legalTitle": "Company Information",
    "legal": { "name": "Hooshmand Noavaran Ofogh Pars", "type": "Private Joint-Stock Company", "regNo": "69759", "city": "Shiraz" }
  },
  "contact": {
    "title": "Contact Us",
    "subtitle": "Tell us about your project or need; we will get back to you shortly.",
    "form": {
      "customerType": "I am contacting as…",
      "person": "An individual",
      "organization": "An organization / company",
      "name": "Full name",
      "organizationName": "Organization name",
      "email": "Email",
      "phone": "Phone number",
      "service": "Subject",
      "serviceOptions": { "software": "Software development", "infrastructure": "Infrastructure & network", "data": "Data science & AI", "other": "Other" },
      "message": "Your message",
      "submit": "Send Message",
      "sending": "Sending…",
      "success": "Your message was sent successfully. We will contact you soon.",
      "error": "Sending failed. Please try again.",
      "required": "This field is required",
      "invalidEmail": "Invalid email address"
    },
    "info": { "addressLabel": "Address", "address": "Tachara, Shiraz, Iran", "phoneLabel": "Phone", "phone": "+98 922 926 1972", "email": "Email", "linkedin": "LinkedIn", "hours": "Sat–Wed, 9:00–17:00" }
  },
  "booking": {
    "title": "Book a Consultation",
    "subtitle": "Pick a time for a consultation and we will review your needs and propose the best solution.",
    "steps": { "type": "Consultation type", "datetime": "Date & time", "details": "Your details", "done": "Confirmation" },
    "types": {
      "software": "Software development consultation",
      "infrastructure": "Infrastructure & network consultation",
      "data": "Data science & AI consultation",
      "general": "General consultation"
    },
    "mode": "Meeting format",
    "modes": { "phone": "Phone call", "online": "Online (video)", "inperson": "In person – Tachara, Shiraz" },
    "duration": "Session length: 30 minutes",
    "pickDate": "Choose a date",
    "pickTime": "Choose a time",
    "noSlots": "No free slots on this day.",
    "slotTaken": "This slot was just booked; please choose another time.",
    "notes": "Notes (optional)",
    "submit": "Confirm Booking",
    "successTitle": "Your booking is confirmed",
    "successText": "Your tracking code: {code}. We will contact you shortly to confirm.",
    "statusLabel": "Track your booking",
    "trackPlaceholder": "Enter tracking code",
    "error": "Booking failed. Please try again."
  },
  "cta": {
    "title": "Ready when you are",
    "text": "Share your need with us and we will propose the best solution.",
    "button": "Contact Us"
  },
  "footer": {
    "about": "Private Joint-Stock Company | Reg. No. 69759 | Shiraz",
    "links": "Quick Links",
    "rights": "All rights reserved."
  }
}
```

---

## ۷. پایگاه‌داده (PostgreSQL + Prisma) و API تماس

### `docker-compose.yml`

```yaml
services:
  db:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: ofoghpars
      POSTGRES_PASSWORD: change_me
      POSTGRES_DB: ofoghpars
    ports: ["5432:5432"]
    volumes: [pgdata:/var/lib/postgresql/data]
volumes:
  pgdata:
```

### `.env.example`

```
DATABASE_URL="postgresql://ofoghpars:change_me@localhost:5432/ofoghpars?schema=public"
NEXT_PUBLIC_SITE_URL="https://example.com"
CONTACT_NOTIFY_EMAIL="M.Khorshidi2011@gmail.com"
NEXT_PUBLIC_PHONE="09229261972"
NEXT_PUBLIC_ADDRESS_FA="شیراز، تاچارا"
NEXT_PUBLIC_ADDRESS_EN="Tachara, Shiraz, Iran"
ADMIN_EMAIL=""
ADMIN_PASSWORD_HASH=""
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""
```

### `prisma/schema.prisma`

```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

enum CustomerType { PERSON ORGANIZATION }
enum MessageStatus { NEW READ ARCHIVED }
enum BookingStatus { PENDING CONFIRMED CANCELLED DONE }
enum MeetingMode { PHONE ONLINE INPERSON }

model ContactMessage {
  id               String        @id @default(cuid())
  customerType     CustomerType
  name             String
  organizationName String?
  email            String
  phone            String?
  service          String        // software | infrastructure | data | other
  message          String
  locale           String        // fa | en
  status           MessageStatus @default(NEW)
  ipHash           String?
  createdAt        DateTime      @default(now())

  @@index([status, createdAt])
}

model Consultation {
  id               String        @id @default(cuid())
  trackingCode     String        @unique        // مثلاً OP-7K3Q9X
  customerType     CustomerType
  name             String
  organizationName String?
  email            String?
  phone            String                       // الزامی برای تماس تأیید
  topic            String                       // software | infrastructure | data | general
  mode             MeetingMode
  startsAt         DateTime                     // UTC؛ نمایش با منطقهٔ زمانی Asia/Tehran
  durationMin      Int           @default(30)
  notes            String?
  locale           String
  status           BookingStatus @default(PENDING)
  createdAt        DateTime      @default(now())

  // جلوگیری از رزرو دوبل یک ساعت (به‌جز رزروهای لغوشده؛ در migration با partial unique index)
  @@index([startsAt, status])
}

model AvailabilityRule {          // ساعت‌های کاری قابل رزرو
  id        Int    @id @default(autoincrement())
  weekday   Int                   // 0=یکشنبه … 6=شنبه (با تقویم JS هماهنگ شود)
  startTime String                // "09:00"
  endTime   String                // "17:00"
  active    Boolean @default(true)
}

model BlockedDate {                // تعطیلات یا روزهای غیرفعال
  id     Int      @id @default(autoincrement())
  date   DateTime @unique
  reason String?
}
```

### ۷-ب. ویژگی «رزرو مشاوره» (Consultation Booking)

**تجربهٔ کاربر (`/book` – ویزارد ۴ مرحله‌ای، موبایل‌فرست):**
1. **نوع مشاوره**: نرم‌افزار، زیرساخت و شبکه، علم داده و AI، عمومی + نحوهٔ برگزاری (تلفنی / آنلاین / حضوری در شیراز–تاچارا). مدت هر جلسه ۳۰ دقیقه.
2. **تاریخ و ساعت**: تقویم (شمسی در نسخهٔ فارسی، میلادی در انگلیسی؛ پیشنهاد: `react-day-picker` با locale فارسی/Jalali) و لیست ساعت‌های خالی همان روز. روزها و ساعت‌های پر یا تعطیل غیرفعال نمایش داده شوند.
3. **اطلاعات**: شخص/سازمان، نام (و نام سازمان)، **شمارهٔ تماس (الزامی)**، ایمیل (اختیاری)، توضیحات.
4. **تأیید**: نمایش کد پیگیری، خلاصهٔ رزرو، دکمهٔ «افزودن به تقویم» (دانلود فایل `.ics`) و لینک پیگیری.

**قوانین کسب‌وکاری:**
- ساعات پیش‌فرض: شنبه تا چهارشنبه، ۹ تا ۱۷ (از جدول `AvailabilityRule`؛ قابل‌ویرایش)؛ اسلات‌های ۳۰ دقیقه‌ای، با فاصلهٔ ۱۰ دقیقه بین جلسات.
- حداقل ۲ ساعت قبل از شروع و حداکثر ۶۰ روز آینده قابل رزرو است.
- منطقهٔ زمانی همیشه `Asia/Tehran`؛ در دیتابیس UTC ذخیره شود.
- **جلوگیری از رزرو دوبل**: بررسی در تراکنش دیتابیس + partial unique index روی `startsAt` برای وضعیت‌های غیر `CANCELLED`. در صورت تداخل، پیام `slotTaken` نمایش داده شود.
- وضعیت اولیه `PENDING` است و پس از تماس تأیید دستی به `CONFIRMED` تغییر می‌کند.

**API ها:**
- `GET /api/booking/slots?date=YYYY-MM-DD` ← لیست ساعت‌های خالی آن روز.
- `POST /api/booking` ← ثبت رزرو (Zod، honeypot، rate limit، تراکنش)، خروجی: `trackingCode`.
- `GET /api/booking/[trackingCode]` ← وضعیت رزرو (فقط با کد پیگیری؛ بدون نمایش اطلاعات شخصی کامل).
- `GET /api/booking/[trackingCode]/ics` ← فایل تقویم.

**اطلاع‌رسانی:** با ثبت رزرو، ایمیل به `CONTACT_NOTIFY_EMAIL` (و در صورت وارد کردن ایمیل، ایمیل تأیید برای مشتری). فاز بعد (اختیاری): پیامک اطلاع‌رسانی با سرویس‌دهندهٔ ایرانی (مثلاً کاوه‌نگار یا ملی‌پیامک) به شمارهٔ مشتری.

**پنل مدیریت (`/admin`):** لیست رزروها با فیلتر وضعیت و تاریخ، تأیید/لغو/اتمام، مدیریت ساعات کاری و روزهای تعطیل. احراز هویت ساده (یک کاربر ادمین با رمز هش‌شده در `.env`، یا Auth.js).

**دکمه‌های رزرو در سایت:** هدر، هیرو، انتهای صفحهٔ خدمات، کارت هر خدمت (با پیش‌انتخاب نوع مشاوره از طریق `?type=software`) و فوتر.

### `POST /api/contact`

- اعتبارسنجی با Zod (اگر `customerType = ORGANIZATION` آنگاه `organizationName` الزامی است).
- **Honeypot**: فیلد مخفی `website`؛ اگر پر بود، موفقیت جعلی برگردان و ذخیره نکن.
- **Rate limit** ساده بر اساس IP (مثلاً ۵ درخواست در ۱۰ دقیقه) با هش کردن IP قبل از ذخیره.
- ذخیره در Postgres، سپس (اختیاری) ارسال ایمیل اطلاع‌رسانی به `CONTACT_NOTIFY_EMAIL`.
- پاسخ JSON و پیام موفقیت/خطا به زبان فعلی صفحه.
- فاز اختیاری ۲: صفحهٔ `/admin` با احراز هویت ساده برای دیدن پیام‌ها و تغییر وضعیت.

---

## ۸. تصاویر

تصاویر مطابق محتوای سایت و با رنگ برند به‌صورت **SVG برداری** ساخته شده و پیوست همین بریف است (پوشهٔ `images/`). آن‌ها را در `public/images/` بگذارید. SVG سبک، تیز در هر اندازه و بدون مشکل مجوز است. هیچ متنی داخل تصاویر نیست، پس برای هر دو زبان قابل استفاده‌اند.

| فایل | محل استفاده | موضوع |
|---|---|---|
| `hero.svg` | پس‌زمینهٔ هیرو صفحهٔ اصلی | شبکهٔ نقطه‌ای فناوری و کمان «افق» (هماهنگ با لوگو) |
| `service-software.svg` | کارت و صفحهٔ توسعه نرم‌افزار | پنجره‌های کد و `{ }` |
| `service-infrastructure.svg` | کارت و صفحهٔ زیرساخت و شبکه | رک سرور و اتصال شبکه |
| `service-data.svg` | کارت و صفحهٔ علم داده و AI | داشبورد نموداری و شبکهٔ عصبی |
| `portfolio-payroll.svg` | نمونه‌کار حقوق و حسابداری | فیش، ماشین‌حساب و سکه |
| `portfolio-pharma.svg` | نمونه‌کار موجودی دارو | قفسه، کپسول و علامت دارو |
| `portfolio-freight.svg` | نمونه‌کار اعلام بار و بارنامه | کامیون و جاده |
| `portfolio-appointment.svg` | نمونه‌کار نوبت‌دهی و صفحهٔ `/book` | تقویم و ساعت |
| `portfolio-furnace.svg` | نمونه‌کار اعلام بار سیمان (نیریز) | کوره صنعتی، دودکش و پنل کنترل |
| `about-shiraz.svg` | صفحهٔ دربارهٔ ما | طاق الهام‌گرفته از معماری ایرانی و افق |
| `contact-map.svg` | صفحهٔ تماس | پین موقعیت (شیراز–تاچارا) |

نکات اجرا:
- با `next/image` نمایش داده شوند (برای SVG ثابت: `<Image src="/images/hero.svg" alt="…" fill priority />`). برای SVG ممکن است لازم باشد `dangerouslyAllowSVG` فعال نشود؛ ساده‌ترین راه استفاده از `<img>` معمولی یا `unoptimized` است.
- `alt` دوزبانه از فایل پیام‌ها خوانده شود (تصاویر تزئینی: `alt=""`).
- تصویر OG (`og.png` با ابعاد 1200×630) از ترکیب `hero.svg` و لوگو ساخته شود.
- اگر بعداً عکس واقعی خواستید، از Unsplash/Pexels (مجوز آزاد) دانلود و جایگزین کنید؛ کلیدواژه‌های پیشنهادی: *server room*, *developer coding*, *data dashboard*, *trucks highway logistics*, *pharmacy shelves*, *Shiraz Iran*.
- از ققنوس لوگو می‌توان به‌صورت شفاف (opacity ۵–۸٪) در پس‌زمینهٔ هیرو و CTA استفاده کرد.

---

## ۹. کیفیت، سئو و دسترس‌پذیری

- SEO: `generateMetadata` برای هر صفحه/زبان، `sitemap.ts`، `robots.ts`، OG image، و JSON-LD از نوع `Organization` / `LocalBusiness` (نام، لوگو، تلفن، آدرس شیراز–تاچارا، لینکدین، شمارهٔ ثبت).
- Lighthouse هدف: بالای ۹۰ در Performance، Accessibility، SEO.
- Accessibility: کنتراست مناسب، `aria-label` برای دکمه‌ها، فوکوس قابل‌مشاهده، ناوبری با کیبورد، منوی موبایل قابل‌دسترس، `prefers-reduced-motion`.
- ریسپانسیو کامل (موبایل‌فرست).
- امنیت: عدم افشای کلیدها، هدرهای امنیتی در `next.config`، اعتبارسنجی سمت سرور.
- متغیرهای محیطی فقط از `.env`.

---

## ۱۰. پرامپت‌های فازبندی‌شده برای Vibe Coding

هر فاز را جداگانه بدهید، خروجی را اجرا و تست کنید، سپس برید فاز بعد. بعد از هر فاز بگویید: «`npm run lint` و `npm run build` را اجرا کن و خطاها را رفع کن.»

**فاز ۱ – اسکلت پروژه**
> `PROJECT_BRIEF.md` را کامل بخوان. پروژهٔ Next.js (App Router, TypeScript, Tailwind) بساز. `next-intl` را با دو زبان `fa` (پیش‌فرض، RTL) و `en` راه‌اندازی کن. `messages/fa.json` و `messages/en.json` را دقیقاً از بخش ۶ بریف بساز. فونت‌های Vazirmatn و Inter را با `next/font` اضافه کن. پالت `brand` را در Tailwind تعریف کن. لوگو را در `public/images/logo.png` بگذار.

**فاز ۲ – چیدمان کلی**
> Header (لوگو، منو، سوییچر زبان، دکمهٔ CTA، منوی موبایل) و Footer را مطابق بخش ۵ بساز. همهٔ استایل‌ها باید RTL-safe باشند (کلاس‌های منطقی `ms/me/ps/pe/text-start`).

**فاز ۳ – صفحهٔ اصلی**
> صفحهٔ Home را با سکشن‌های هیرو، خدمات کلیدی، آمار (انیمیشن شمارنده)، نمونه‌کارهای برجسته و CTA/فرم تماس سریع بساز. از متن‌های `messages` استفاده کن. انیمیشن اسکرول با framer-motion اضافه کن.

**فاز ۴ – خدمات و نمونه‌کارها**
> صفحات Services و Portfolio را بساز. در Portfolio فیلتر دسته‌بندی کلاینتی بگذار. داده‌ها در `src/data/` با کلید ارجاع به `messages` باشند.

**فاز ۵ – دربارهٔ ما**
> صفحهٔ About را با داستان شرکت، کارت مدیرعامل (محمد خورشیدی)، مهارت‌ها (badge)، ارزش‌ها، Timeline و بخش اطلاعات ثبتی بساز.

**فاز ۶ – دیتابیس و فرم تماس**
> `docker-compose.yml`، Prisma و مدل `ContactMessage` را مطابق بخش ۷ بساز. فرم تماس (react-hook-form + Zod) با انتخاب «شخص/سازمان» (فیلد نام سازمان فقط برای سازمان) و `POST /api/contact` با honeypot و rate limit را پیاده کن. فرم سریع صفحهٔ اصلی و فرم صفحهٔ تماس از یک کامپوننت مشترک استفاده کنند.

**فاز ۶-ب – رزرو مشاوره**
> مطابق بخش ۷-ب ویژگی رزرو مشاوره را بساز: مدل‌های `Consultation`, `AvailabilityRule`, `BlockedDate` در Prisma (با seed برای شنبه تا چهارشنبه ۹ تا ۱۷)، API های `slots` و `booking` با تراکنش برای جلوگیری از رزرو دوبل، ویزارد ۴ مرحله‌ای `/book` با تقویم شمسی در نسخهٔ فارسی، صفحهٔ تأیید با کد پیگیری و فایل ICS، و ایمیل اطلاع‌رسانی. دکمهٔ «رزرو مشاوره» را در هدر، هیرو، کارت خدمات و فوتر اضافه کن. متن‌ها از بخش `booking` در messages باشد.

**فاز ۷ – تصاویر**
> فایل‌های SVG پوشهٔ `images/` را در `public/images/` قرار بده و مطابق جدول بخش ۸ در هیرو، کارت خدمات، نمونه‌کارها، دربارهٔ ما و تماس استفاده کن. تلفن 09229261972 و آدرس «شیراز، تاچارا» را در صفحهٔ تماس، فوتر و JSON-LD بگذار.

**فاز ۸ – سئو و کیفیت**
> مطابق بخش ۹: متادیتا، sitemap، robots، JSON-LD، hreflang، OG image، بررسی دسترس‌پذیری و Lighthouse.

**فاز ۹ – پنل ادمین**
> صفحهٔ `/admin` با احراز هویت ساده برای مدیریت پیام‌های تماس و رزروهای مشاوره (تأیید/لغو/اتمام) و تنظیم ساعات کاری و روزهای تعطیل.

### نکته‌های طلایی Vibe Coding
- در هر پرامپت یک هدف مشخص بدهید؛ پرامپت‌های بزرگ و مبهم نتیجهٔ ضعیف می‌دهند.
- بعد از هر فاز commit بگیرید (`git commit`) تا در صورت خرابی برگردید.
- اگر ابزار متن را هاردکد کرد، بگویید: «همهٔ متن‌ها را به messages منتقل کن.»
- اگر چیدمان RTL به‌هم ریخت، بگویید: «همهٔ `ml/mr/pl/pr/left/right` را با کلاس‌های منطقی جایگزین کن.»

---

## ۱۱. مواردی که باید قبل از انتشار خودتان تکمیل کنید

- در صورت وجود، آدرس کامل‌تر دفتر (خیابان/پلاک/کدپستی) و مختصات روی نقشه برای ریزتر شدن آدرس و JSON-LD.
- ساعات کاری واقعی (متن نمونه: شنبه تا چهارشنبه ۹ تا ۱۷).
- دامنه و آدرس نهایی سایت در `.env`.
- تأیید اینکه نمونه‌کارها اجازهٔ نمایش عمومی دارند (نام مشتریان، از جمله «کارخانه سیمان خاکستری نیریز»، فقط با رضایت آن‌ها نمایش داده شود).
- اگر رضایت‌نامه یا لوگوی مشتری دارید، به بخش نمونه‌کارها اضافه کنید.
- لوگوی نسخهٔ شفاف/سفید (SVG) برای فوتر و هدر تیره.
- تصمیم دربارهٔ پیامک اطلاع‌رسانی رزرو (نیاز به سرویس‌دهندهٔ پیامک و API Key دارد).

</div>
