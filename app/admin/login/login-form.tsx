"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import styles from "./login.module.css";

export default function LoginForm() {
  const [status, setStatus] = useState<"" | "loading" | "error">("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: data.get("username"), password: data.get("password") }),
      });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error || "تعذر تسجيل الدخول");
      window.location.replace("/dashboard");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "تعذر تسجيل الدخول");
    }
  }

  return <main className={styles.shell} dir="rtl"><section className={styles.panel}>
    <a className={styles.logo} href="/"><img src="/media/be-fighter-logo.png" alt="Be Fighter Academy" /></a>
    <span className={styles.badge}><ShieldCheck /> منطقة إدارة مؤمّنة</span>
    <h1>دخول إدارة Be Fighter</h1>
    <p>الصفحة دي مخصصة لإدارة طلبات العملاء ومتابعتها فقط.</p>
    <form onSubmit={submit}>
      <label>اسم المستخدم<Input name="username" autoComplete="username" required dir="ltr" /></label>
      <label>كلمة المرور<Input name="password" type="password" autoComplete="current-password" required dir="ltr" /></label>
      <Button type="submit" disabled={status === "loading"}><LockKeyhole />{status === "loading" ? "جاري التحقق…" : "دخول لوحة الإدارة"}</Button>
      <output aria-live="polite">{status === "error" ? message : ""}</output>
    </form>
    <a className={styles.back} href="/"><ArrowLeft /> الرجوع للموقع</a>
  </section></main>;
}
