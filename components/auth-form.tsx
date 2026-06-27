"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/button";

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createClient();

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    if (mode === "signup" && !result.data.session) {
      setMessage("Check your email to confirm your account, then log in.");
      return;
    }

    router.push(params.get("next") || "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-200">
      <div className="mb-6 flex rounded-2xl bg-slate-100 p-1">
        {(["login", "signup"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold ${
              mode === item ? "bg-white text-ink shadow-sm" : "text-slate-500"
            }`}
          >
            {item === "login" ? "Login" : "Sign up"}
          </button>
        ))}
      </div>
      <label className="mb-4 block">
        <span className="text-sm font-semibold text-slate-700">Email</span>
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600"
        />
      </label>
      <label className="mb-5 block">
        <span className="text-sm font-semibold text-slate-700">Password</span>
        <input
          required
          minLength={6}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600"
        />
      </label>
      <Button className="w-full" disabled={loading}>
        {loading ? "Working..." : mode === "login" ? "Login to dashboard" : "Create account"}
      </Button>
      {message ? <p className="mt-4 text-sm text-amber-700">{message}</p> : null}
    </form>
  );
}
