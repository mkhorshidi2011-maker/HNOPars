-- جلوگیری قطعی از رزرو دوبل: برای هر زمان فقط یک رزرو غیرلغوشده
-- بعد از `npx prisma migrate dev --name init` این دستور را یک‌بار اجرا کنید:
--   docker compose exec -T db psql -U ofoghpars -d ofoghpars < prisma/partial-index.sql
CREATE UNIQUE INDEX IF NOT EXISTS consultation_active_slot
  ON "Consultation" ("startsAt")
  WHERE status <> 'CANCELLED';
