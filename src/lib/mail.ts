import nodemailer from "nodemailer";

export async function sendMail(opts: { to: string; subject: string; text: string }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (!SMTP_HOST) return; // ایمیل تنظیم نشده؛ بی‌صدا رد می‌شود
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST, port: Number(SMTP_PORT ?? 587), secure: Number(SMTP_PORT) === 465,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });
    await transporter.sendMail({ from: SMTP_FROM || SMTP_USER, ...opts });
  } catch (e) {
    console.error("mail failed", e); // خطای ایمیل نباید ثبت درخواست را خراب کند
  }
}
