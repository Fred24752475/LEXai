"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";

const steps = [
  {
    key: "sector",
    title: "What sector are you entering?",
    options: ["Retail / Trading", "Food & Hospitality", "Technology", "Professional services", "Manufacturing"]
  },
  {
    key: "structure",
    title: "Preferred business structure?",
    options: ["Sole proprietor", "Partnership", "Limited liability company", "NGO / social enterprise"]
  },
  {
    key: "employees",
    title: "How many employees will you start with?",
    options: ["Just me", "1-5", "6-20", "20+"]
  },
  {
    key: "location",
    title: "Where will the business operate?",
    options: ["Accra", "Kumasi", "Takoradi", "Tamale", "Multiple regions / online"]
  },
  {
    key: "revenueStage",
    title: "What stage are you at?",
    options: ["Idea only", "Pre-revenue", "Already selling", "Registered elsewhere"]
  }
] as const;

type Answers = Record<(typeof steps)[number]["key"], string>;

export function SetupWizard() {
  const [businessName, setBusinessName] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const step = steps[currentStep];
  const complete = useMemo(
    () => businessName.trim().length > 1 && steps.every((item) => answers[item.key]),
    [answers, businessName]
  );

  async function submit() {
    if (!complete) return;
    setLoading(true);
    setError("");

    const response = await fetch("/api/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessName, ...answers })
    });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error || "Unable to create checklist.");
      return;
    }

    router.push(`/report/${result.reportId}`);
  }

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-slate-200">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">
          Step {currentStep + 1} of {steps.length}
        </p>
        <h1 className="mt-2 text-3xl font-black text-ink">Business setup wizard</h1>
      </div>

      <label className="mb-6 block">
        <span className="text-sm font-semibold text-slate-700">Business name</span>
        <input
          value={businessName}
          onChange={(event) => setBusinessName(event.target.value)}
          placeholder="e.g. Adinkra Foods Ltd"
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600"
        />
      </label>

      <h2 className="mb-4 text-2xl font-black text-ink">{step.title}</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {step.options.map((option) => {
          const selected = answers[step.key] === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setAnswers((current) => ({ ...current, [step.key]: option }))}
              className={`rounded-3xl border p-5 text-left font-bold transition ${
                selected
                  ? "border-emerald-600 bg-emerald-50 text-leaf"
                  : "border-slate-200 bg-white text-ink hover:bg-slate-50"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="secondary"
          onClick={() => setCurrentStep((value) => Math.max(0, value - 1))}
          disabled={currentStep === 0 || loading}
        >
          Back
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button
            onClick={() => setCurrentStep((value) => Math.min(steps.length - 1, value + 1))}
            disabled={!answers[step.key] || loading}
          >
            Next
          </Button>
        ) : (
          <Button onClick={submit} disabled={!complete || loading}>
            {loading ? "Searching Ghana compliance rules..." : "Generate checklist"}
          </Button>
        )}
      </div>
      {error ? <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
