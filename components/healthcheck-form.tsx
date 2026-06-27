"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { AlertCircle, Loader2, X } from "lucide-react";

const MAX_CHARS = 2000;

export function HealthcheckForm() {
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/healthcheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessName, description })
    });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error || "Unable to run audit.");
      return;
    }

    router.push(`/report/${result.reportId}`);
  }

  return (
    <form onSubmit={submit} className="rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-slate-200">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">Existing business</p>
      <h1 className="mt-2 text-3xl font-black text-ink">Compliance health check</h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600">
        Describe your business, registrations, taxes, employees, licenses and current operations.
        Grok will search current Ghana requirements and produce an audit score.
      </p>

      <label className="mt-6 block">
        <span className="text-sm font-semibold text-slate-700">Business name</span>
        <input
          required
          value={businessName}
          onChange={(event) => setBusinessName(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          placeholder="e.g. Kwame Agro Services"
        />
      </label>

      <label className="mt-5 block">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Business description</span>
          <span
            className={`text-xs tabular-nums ${
              description.length >= MAX_CHARS
                ? "font-semibold text-red-600"
                : description.length > MAX_CHARS * 0.9
                  ? "text-amber-600"
                  : "text-slate-400"
            }`}
          >
            {description.length}/{MAX_CHARS}
          </span>
        </div>
        <textarea
          required
          minLength={20}
          maxLength={MAX_CHARS}
          rows={9}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          placeholder="Tell us what the business does, whether it is registered, staff count, revenue activities, tax status, permits, and anything you are unsure about."
        />
      </label>

      <div className="mt-6">
        <Button disabled={loading || description.trim().length < 20}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Running live compliance audit...
            </span>
          ) : (
            "Generate health dashboard"
          )}
        </Button>
      </div>

      {error ? (
        <div className="mt-4 flex items-start gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0 rounded-lg p-1 transition hover:bg-red-100"
          >
            <X size={16} />
          </button>
        </div>
      ) : null}
    </form>
  );
}
