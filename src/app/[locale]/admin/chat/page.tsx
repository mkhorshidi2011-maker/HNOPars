import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getCurrentUser, isStaff } from "@/lib/auth-adapter";
import { ChatAdmin } from "@/components/chat/chat-admin";

export const dynamic = "force-dynamic";

export default async function AdminChatPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!isStaff(user)) notFound(); // non-staff just see a 404
  return <ChatAdmin />;
}
