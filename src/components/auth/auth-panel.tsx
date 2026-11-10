"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Me = { name: string; email: string } | null;

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  website: z.string().max(0).optional(),
});

const registerFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  website: z.string().max(0).optional(),
});

type LoginValues = z.infer<typeof loginFormSchema>;
type RegisterValues = z.infer<typeof registerFormSchema>;

export function AuthPanel({
  compact = false,
  initialMode = "login",
  onSuccess,
}: {
  compact?: boolean;
  initialMode?: "login" | "register";
  onSuccess?: (user: Me) => void;
}) {
  const t = useTranslations("auth");
  const nav = useTranslations("nav");
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [user, setUser] = useState<Me>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    toast.success(nav("logout"));
  }

  function handleSuccess(u: Me) {
    setUser(u);
    onSuccess?.(u);
  }

  if (loading) return <div className="h-40 animate-pulse rounded-2xl border bg-card" />;
  if (user)
    return (
      <Card className={compact ? "rounded-2xl border-0 shadow-none" : "rounded-2xl"}>
        <CardContent className="flex items-center justify-between gap-4 py-6">
          <div>
            <p className="font-semibold">{t("loggedInAs", { name: user.name })}</p>
            <p className="text-sm text-muted-foreground" dir="ltr">{user.email}</p>
          </div>
          <Button variant="outline" onClick={logout}>{nav("logout")}</Button>
        </CardContent>
      </Card>
    );

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold leading-none">{mode === "login" ? t("loginTitle") : t("registerTitle")}</h2>
          <p className="text-sm text-muted-foreground">{mode === "login" ? t("loginSubtitle") : t("registerSubtitle")}</p>
        </div>
        {mode === "login" ? (
          <LoginForm onSuccess={handleSuccess} onSwitch={() => setMode("register")} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} onSwitch={() => setMode("login")} />
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>{t("loginTitle")}</CardTitle>
          <CardDescription>{t("loginSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent><LoginForm onSuccess={handleSuccess} /></CardContent>
      </Card>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>{t("registerTitle")}</CardTitle>
          <CardDescription>{t("registerSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent><RegisterForm onSuccess={handleSuccess} /></CardContent>
      </Card>
    </div>
  );
}

function LoginForm({ onSuccess, onSwitch }: { onSuccess: (u: Me) => void; onSwitch?: () => void }) {
  const t = useTranslations("auth");
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "", website: "" },
  });

  async function onSubmit(values: LoginValues) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      toast.success(t("loginSuccess"));
      onSuccess(data.user ?? null);
    } else if (res.status === 401) toast.error(t("invalid"));
    else toast.error(t("error"));
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">{t("email")}</Label>
        <Input id="login-email" type="email" dir="ltr" autoComplete="email" aria-invalid={!!form.formState.errors.email} {...form.register("email")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">{t("password")}</Label>
        <Input id="login-password" type="password" dir="ltr" autoComplete="current-password" aria-invalid={!!form.formState.errors.password} {...form.register("password")} />
      </div>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...form.register("website")} />
      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? t("loggingIn") : t("login")}
      </Button>
      {onSwitch && (
        <p className="text-center text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <button type="button" className="text-primary underline-offset-4 hover:underline" onClick={onSwitch}>{t("register")}</button>
        </p>
      )}
    </form>
  );
}

function RegisterForm({ onSuccess, onSwitch }: { onSuccess: (u: Me) => void; onSwitch?: () => void }) {
  const t = useTranslations("auth");
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", website: "" },
  });

  async function onSubmit(values: RegisterValues) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      toast.success(t("registerSuccess"));
      onSuccess(data.user ?? null);
    } else if (res.status === 409) toast.error(t("emailTaken"));
    else toast.error(t("error"));
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reg-name">{t("name")}</Label>
        <Input id="reg-name" aria-invalid={!!form.formState.errors.name} {...form.register("name")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-email">{t("email")}</Label>
        <Input id="reg-email" type="email" dir="ltr" autoComplete="email" aria-invalid={!!form.formState.errors.email} {...form.register("email")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-phone">{t("phone")}</Label>
        <Input id="reg-phone" type="tel" dir="ltr" {...form.register("phone")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-password">{t("password")}</Label>
        <Input id="reg-password" type="password" dir="ltr" autoComplete="new-password" aria-invalid={!!form.formState.errors.password} {...form.register("password")} />
        <p className="text-xs text-muted-foreground">{t("passwordMin")}</p>
      </div>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...form.register("website")} />
      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? t("registering") : t("register")}
      </Button>
      {onSwitch && (
        <p className="text-center text-sm text-muted-foreground">
          {t("haveAccount")}{" "}
          <button type="button" className="text-primary underline-offset-4 hover:underline" onClick={onSwitch}>{t("login")}</button>
        </p>
      )}
    </form>
  );
}
