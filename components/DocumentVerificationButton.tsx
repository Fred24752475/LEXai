"use client";

import { useState } from "react";
import { Spinner } from "./Spinner";

export interface VerificationState {
  id?: string;
  status: "verified" | "failed";
  message: string;
  checked_at: string;
}

interface DocumentVerificationButtonProps {
  reportId: string;
  stepIndex: number;
  itemTitle: string;
  authority: string;
  requiredDocuments: string[];
  verificationKind?: "checklist_step" | "health_action";
  initialVerification?: VerificationState | null;
}

function formatCheckedAt(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

export function DocumentVerificationButton({
  reportId,
  stepIndex,
  itemTitle,
  authority,
  requiredDocuments,
  verificationKind = "checklist_step",
  initialVerification = null
}: DocumentVerificationButtonProps) {
  const [verification, setVerification] = useState<VerificationState | null>(
    initialVerification
  );
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function verify() {
    setChecking(true);
    setError(null);

    // Deliberate short pause for demo: it makes the registry-check moment visible.
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const response = await fetch("/api/verify-document", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reportId,
        stepIndex,
        itemTitle,
        authority,
        requiredDocuments,
        verificationKind
      })
    });
    const result = await response.json();
    setChecking(false);

    if (!response.ok) {
      setError(result.error || "Verification failed. Try again.");
      return;
    }

    setVerification(result.verification);
  }

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 no-print">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
            Government database check
          </p>
          <p className="mt-1 text-xs text-ink-500">
            Mark this item done, then LexGH simulates agency verification for the demo.
          </p>
        </div>
        <button
          type="button"
          onClick={verify}
          disabled={checking}
          className="btn-secondary"
        >
          {checking ? <Spinner className="h-4 w-4" /> : null}
          {checking ? "Checking registry..." : "Done with required document"}
        </button>
      </div>

      {checking ? (
        <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-ink-600">
          Checking ORC/GRA/agency records from simulated government database...
        </div>
      ) : null}

      {verification ? (
        <div
          className={`mt-3 rounded-lg px-3 py-2 text-xs ring-1 ring-inset ${
            verification.status === "verified"
              ? "bg-brand-50 text-brand-700 ring-brand-100"
              : "bg-red-50 text-red-700 ring-red-100"
          }`}
        >
          <p className="font-bold">
            {verification.status === "verified"
              ? "Verification successful"
              : "Verification unsuccessful"}
          </p>
          <p className="mt-1">{verification.message}</p>
          <p className="mt-1 opacity-80">
            Checked {formatCheckedAt(verification.checked_at)}
          </p>
        </div>
      ) : null}

      {error ? (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
