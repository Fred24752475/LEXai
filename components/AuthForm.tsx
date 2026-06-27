"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Spinner } from "./Spinner";

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const redirectedFrom = searchParams.get("redirectedFrom") || "/dashboard";

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        // If email confirmation is enabled, there is no active session yet.
        if (!data.session) {
          setNotice(
            "Account created. If email confirmation is on, check your inbox, then log in."
          );
          setMode("login");
          setLoading(false);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }

      router.push(redirectedFrom);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Authentication failed. Try again."
      );
      setLoading(false);
    }
  }

  return (
    <div className="card animate-scale-in p-7 sm:p-8">
      <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError(null);
          }}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
            mode === "login"
              ? "bg-white text-ink-900 shadow-sm"
              : "text-ink-500 hover:text-ink-700"
          }`}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError(null);
          }}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
            mode === "signup"
              ? "bg-white text-ink-900 shadow-sm"
              : "text-ink-500 hover:text-ink-700"
          }`}
        >
          Sign up
        </button>
      </div>

      <h1 className="text-xl font-bold text-ink-900">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        {mode === "login"
          ? "Log in to access your compliance dashboard."
          : "Start generating compliance checklists in minutes."}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="At least 6 characters"
          />
        </div>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        {notice ? (
          <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700">
            {notice}
          </p>
        ) : null}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Spinner className="h-4 w-4" /> : null}
          {mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>
    </div>
  );
}
