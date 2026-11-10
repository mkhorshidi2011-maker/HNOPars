"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Msg = { id: number; sender: "VISITOR" | "STAFF"; body: string; createdAt: string };

export function ChatWidget() {
  const t = useTranslations("chat");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const [closed, setClosed] = useState(false);
  const [unread, setUnread] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const lastId = useRef(0);
  const openRef = useRef(open);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const merge = useCallback((incoming: Msg[]) => {
    if (!incoming.length) return;
    setMessages((prev) => {
      const ids = new Set(prev.map((m) => m.id));
      const fresh = incoming.filter((m) => !ids.has(m.id));
      if (!fresh.length) return prev;
      if (!openRef.current) setUnread((u) => u + fresh.filter((m) => m.sender === "STAFF").length);
      return [...prev, ...fresh];
    });
    lastId.current = Math.max(lastId.current, ...incoming.map((m) => m.id));
  }, []);

  const poll = useCallback(async () => {
    if (document.hidden) return;
    try {
      const r = await fetch(`/api/chat/messages?after=${lastId.current}`, { cache: "no-store" });
      if (!r.ok) return;
      const j = await r.json();
      setUserName(j.user?.name ?? null);
      setClosed(j.status === "CLOSED");
      merge(j.messages ?? []);
    } catch { /* offline: try again next tick */ }
  }, [merge]);

  // poll fast while open, slowly while closed (to show the unread badge)
  useEffect(() => {
    poll();
    const id = setInterval(poll, open ? 3000 : 20000);
    return () => clearInterval(id);
  }, [open, poll]);

  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => setUnread(0));
    bottom.current?.scrollIntoView({ block: "end" });
  }, [open, messages.length]);

  async function send() {
    const body = text.trim();
    if (!body || sending) return;
    setSending(true); setError(false);
    try {
      const r = await fetch("/api/chat/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body, name: name.trim() || undefined, locale }) });
      if (!r.ok) throw new Error();
      const j = await r.json();
      setText(""); setClosed(false); merge([j.message]);
    } catch { setError(true); } finally { setSending(false); }
  }

  const needsName = messages.length === 0 && !userName;
  const hhmm = (iso: string) => new Date(iso).toLocaleTimeString(locale === "fa" ? "fa-IR" : "en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {open && (
        <section role="dialog" aria-label={t("title")} className="fixed bottom-24 right-4 z-50 flex h-[min(32rem,calc(100dvh-8rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl sm:w-96">
          <header className="flex items-center justify-between bg-gradient-to-br from-brand-900 to-brand-600 px-4 py-3 text-white">
            <div>
              <h2 className="text-sm font-bold">{t("title")}</h2>
              <p className="text-xs text-brand-100">{t("subtitle")}</p>
            </div>
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/10 hover:text-white" onClick={() => setOpen(false)} aria-label={t("close")}><X className="size-5" /></Button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-muted/40 p-4">
            {messages.length === 0 && <p className="rounded-xl bg-card p-3 text-sm text-muted-foreground">{t("greeting")}</p>}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === "VISITOR" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.sender === "VISITOR" ? "bg-primary text-primary-foreground" : "border bg-card"}`}>
                  <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  <p className={`mt-1 text-[10px] ${m.sender === "VISITOR" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.sender === "STAFF" ? `${t("staff")} · ` : ""}{hhmm(m.createdAt)}</p>
                </div>
              </div>
            ))}
            {closed && <p className="text-center text-xs text-muted-foreground">{t("closedNote")}</p>}
            <div ref={bottom} />
          </div>

          <footer className="space-y-2 border-t p-3">
            {needsName && <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("namePlaceholder")} maxLength={80} />}
            {error && <p className="text-xs text-destructive">{t("error")}</p>}
            <div className="flex items-end gap-2">
              <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={1} maxLength={2000} placeholder={t("placeholder")} className="max-h-28 min-h-10 resize-none"
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
              <Button size="icon" onClick={send} disabled={sending || !text.trim()} aria-label={t("send")}><Send className="size-4 rtl:-scale-x-100" /></Button>
            </div>
          </footer>
        </section>
      )}

      {/* physical bottom-RIGHT on purpose (not logical "end") so it stays on the right in both fa and en */}
      <Button size="icon" onClick={() => setOpen((o) => !o)} aria-label={open ? t("close") : t("open")}
        className="fixed bottom-4 right-4 z-50 size-14 rounded-full bg-accent text-accent-foreground shadow-xl hover:bg-accent/90">
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
        {!open && unread > 0 && <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">{unread > 9 ? "9+" : unread}</span>}
      </Button>
    </>
  );
}
