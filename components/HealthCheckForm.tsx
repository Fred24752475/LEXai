"use client";

import { useState } from "react";
import Link from "next/link";
import type { HealthCheck } from "@/lib/schemas";
import { HealthCheckReport } from "./HealthCheckReport";
import { GeneratingState } from "./GeneratingState";
import { Spinner } from "./Spinner";

const PLACEHOLDER = `Example: We are a registered food catering company in Accra operating for 2 years. We have 8 employees, a TIN, and pay PAYE. We are not sure if we are registered with SSNIT or if we filed our last annual returns with the ORC. We have an FDA permit but it may have expired.`;

export function HealthCheckForm() {
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HealthCheck | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);

  const canSubmit =
    businessName.trim().length >= 2 && description.trim().length >= 20;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/healthcheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: businessName.trim(),
          description: description.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Audit failed.");
      setResult(json.data as HealthCheck);
      setReportId(json.reportId as string);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "loading") {
    return (
      <GeneratingState
        title="Auditing your business compliance"
        steps={[
          "Searching current ORC, GRA and SSNIT obligations",
          "Comparing them against your business description",
          "Scoring each area and ranking priority actions",
        ]}
      />
    );
  }

  if (status === "done" && result) {
    return (
      <div className="space-y-6">
        <HealthCheckReport data={result} />
        <div className="flex flex-wrap gap-3 no-print">
          {reportId ? (
            <Link href={`/report/${reportId}`} className="btn-primary">
              Open saved report
            </Link>
          ) : null}
          <Link href="/dashboard" className="btn-secondary">
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={submit} className="card animate-fade-in p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-ink-900">
          Describe your existing business
        </h1>
        <p className="mt-1 text-ink-500">
          The more detail you give about registration, taxes, staff and permits,
          the sharper your audit.
        </p>

        <div className="mt-6">
          <label htmlFor="hc-name" className="label">
            Business name
          </label>
          <input
            id="hc-name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="input"
            placeholder="e.g. Kwame Logistics Ltd"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="hc-desc" className="label">
            Business description
          </label>
          <textarea
            id="hc-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            className="input resize-y"
            placeholder={PLACEHOLDER}
          />
          <p className="mt-1.5 text-xs text-ink-500">
            {description.trim().length} characters (minimum 20)
          </p>
        </div>

        {error ? (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="btn-primary mt-6 w-full"
        >
          {(status as string) === "loading" ? (
            <Spinner className="h-4 w-4" />
          ) : null}
          Run compliance health check
        </button>
      </form>
    </div>
  );
}
