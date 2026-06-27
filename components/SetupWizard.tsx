"use client";

import { useState } from "react";
import Link from "next/link";
import { WIZARD_QUESTIONS, type WizardAnswers } from "@/lib/wizard";
import type { Checklist } from "@/lib/schemas";
import { OptionCard } from "./OptionCard";
import { WizardProgress } from "./WizardProgress";
import { ComplianceChecklist } from "./ComplianceChecklist";
import { GeneratingState } from "./GeneratingState";

// Step 0 = business name, steps 1..N = questions.
const TOTAL_STEPS = WIZARD_QUESTIONS.length + 1;

export function SetupWizard() {
  const [step, setStep] = useState(0);
  const [businessName, setBusinessName] = useState("");
  const [answers, setAnswers] = useState<WizardAnswers>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Checklist | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);

  const isNameStep = step === 0;
  const question = isNameStep ? null : WIZARD_QUESTIONS[step - 1];

  function next() {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
  }
  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  function selectOption(value: string) {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    // Auto-advance after a short beat for a snappy feel.
    setTimeout(() => {
      setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
    }, 220);
  }

  const canContinueName = businessName.trim().length >= 2;
  const isLastStep = step === TOTAL_STEPS - 1;
  const allAnswered = WIZARD_QUESTIONS.every((q) => answers[q.id]);

  async function submit() {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName: businessName.trim(), answers }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Generation failed.");
      setResult(json.data as Checklist);
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
        title="Building your compliance checklist"
        steps={[
          "Searching the web for current ORC registration rules",
          "Checking GRA tax and SSNIT requirements",
          "Compiling fees, timelines and documents",
        ]}
      />
    );
  }

  if (status === "done" && result) {
    return (
      <div className="space-y-6">
        <ComplianceChecklist data={result} />
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
      <WizardProgress current={step} total={TOTAL_STEPS} />

      <div className="card animate-fade-in p-6 sm:p-8" key={step}>
        {isNameStep ? (
          <div>
            <h1 className="text-2xl font-bold text-ink-900">
              What is your business called?
            </h1>
            <p className="mt-1 text-ink-500">
              We&apos;ll personalise your registration checklist for Ghana.
            </p>
            <div className="mt-6">
              <label htmlFor="bname" className="label">
                Business name
              </label>
              <input
                id="bname"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canContinueName) next();
                }}
                className="input"
                placeholder="e.g. Adwoa Foods Ltd"
                autoFocus
              />
            </div>
          </div>
        ) : question ? (
          <div>
            <h1 className="text-2xl font-bold text-ink-900">{question.title}</h1>
            <p className="mt-1 text-ink-500">{question.subtitle}</p>
            <div className="mt-6 space-y-3">
              {question.options.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  description={opt.description}
                  selected={answers[question.id] === opt.value}
                  onClick={() => selectOption(opt.value)}
                />
              ))}
            </div>
          </div>
        ) : null}

        {error ? (
          <p className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            className="btn-ghost disabled:opacity-40"
          >
            Back
          </button>

          {isNameStep ? (
            <button
              onClick={next}
              disabled={!canContinueName}
              className="btn-primary"
            >
              Continue
            </button>
          ) : isLastStep ? (
            <button
              onClick={submit}
              disabled={!allAnswered}
              className="btn-primary"
            >
              Generate checklist
            </button>
          ) : (
            <button
              onClick={next}
              disabled={!answers[question!.id]}
              className="btn-secondary"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
