"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Conv = { id: string; name: string | null; email: string | null; userId: string | null; status: "OPEN" | "CLOSED"; lastMessageAt: string; last: { body: string; sender: string } | null; unread: number };
type Msg = { id: number; sender: "VISITOR" | "STAFF"; body: string; createdAt: string };

export function ChatAdmin() {
  const t = useTranslations("chat.admin");
  const [list, setList] = useState<Conv[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const lastId = useRef(0);
  const bottom = useRef<HTMLDivElement>(null);
  const active = list.find((c) => c.id === activeId) ?? null;

  const loadList = useCallback(async () => {
    const r = await fetch("/api/admin/chat", { cache: "no-store" });
    if (r.ok) setList((await r.json()).conversations);
  }, []);

  const loadMessages = useCallback(async (id: string, reset = false) => {
    const after = reset ? 0 : lastId.current;
    const r = await fetch(`/api/admin/chat/${id}?after=${after}`, { cache: "no-store" });
    if (!r.ok) return;
    const j = await r.json();
    const incoming: Msg[] = j.messages;
    if (reset) { lastId.current = 0; setMessages([]); }
    if (incoming.length) {
      lastId.current = Math.max(lastId.current, ...incoming.map((m) => m.id));
      setMessages((prev) => { const ids = new Set(prev.map((m) => m.id)); return [...(reset ? [] : prev), ...incoming.filter((m) => !ids.has(m.id))]; });
    }
  }, []);

  useEffect(() => {
    const run = () => { void loadList(); };
    run();
    const i = setInterval(run, 5000);
    return () => clearInterval(i);
  }, [loadList]);
  useEffect(() => {
    if (!activeId) return;
    const run = (reset = false) => { void loadMessages(activeId, reset); };
    run(true);
    const i = setInterval(() => run(false), 3000);
    return () => clearInterval(i);
  }, [activeId, loadMessages]);
  useEffect(() => { bottom.current?.scrollIntoView({ block: "end" }); }, [messages.length]);

  async function reply() {
    const body = text.trim();
    if (!body || !activeId) return;
    const r = await fetch(`/api/admin/chat/${activeId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body }) });
    if (r.ok) { setText(""); loadMessages(activeId); loadList(); }
  }
  async function setStatus(status: "OPEN" | "CLOSED") {
    if (!activeId) return;
    await fetch(`/api/admin/chat/${activeId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    loadList();
  }

  const label = (c: Conv) => c.name || c.email || t("guest");

  return (
    <div className="mx-auto grid h-[calc(100dvh-10rem)] max-w-6xl gap-4 px-4 py-6 md:grid-cols-3">
      <aside className="overflow-y-auto rounded-2xl border bg-card">
        <h1 className="border-b p-4 font-bold">{t("title")}</h1>
        {list.length === 0 && <p className="p-4 text-sm text-muted-foreground">{t("empty")}</p>}
        {list.map((c) => (
          <button key={c.id} onClick={() => setActiveId(c.id)} className={`flex w-full flex-col gap-1 border-b p-4 text-start hover:bg-secondary ${c.id === activeId ? "bg-secondary" : ""}`}>
            <span className="flex items-center justify-between gap-2">
              <span className="truncate font-medium">{label(c)}</span>
              {c.unread > 0 && <Badge variant="destructive">{c.unread}</Badge>}
            </span>
            <span className="truncate text-xs text-muted-foreground">{c.last?.sender === "STAFF" ? `${t("you")}: ` : ""}{c.last?.body}</span>
            {c.status === "CLOSED" && <Badge variant="secondary" className="w-fit">{t("closed")}</Badge>}
          </button>
        ))}
      </aside>

      <section className="flex flex-col overflow-hidden rounded-2xl border bg-card md:col-span-2">
        {!active ? <p className="m-auto text-sm text-muted-foreground">{t("pick")}</p> : (
          <>
            <header className="flex items-center justify-between border-b p-4">
              <div>
                <h2 className="font-bold">{label(active)}</h2>
                {active.email && <p className="text-xs text-muted-foreground" dir="ltr">{active.email}</p>}
              </div>
              <Button size="sm" variant="outline" onClick={() => setStatus(active.status === "OPEN" ? "CLOSED" : "OPEN")}>{active.status === "OPEN" ? t("close") : t("reopen")}</Button>
            </header>
            <div className="flex-1 space-y-3 overflow-y-auto bg-muted/40 p-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === "STAFF" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${m.sender === "STAFF" ? "bg-primary text-primary-foreground" : "border bg-card"}`}>
                    <p className="whitespace-pre-wrap break-words">{m.body}</p>
                    <p className="mt-1 text-[10px] opacity-70">{new Date(m.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              <div ref={bottom} />
            </div>
            <footer className="flex items-end gap-2 border-t p-3">
              <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} placeholder={t("replyPlaceholder")} className="resize-none"
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); reply(); } }} />
              <Button size="icon" onClick={reply} disabled={!text.trim()} aria-label={t("send")}><Send className="size-4 rtl:-scale-x-100" /></Button>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}
