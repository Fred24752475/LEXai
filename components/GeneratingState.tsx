"use client";

import { useEffect, useState } from "react";

interface GeneratingStateProps {
  title: string;
  steps: string[];
}

export function GeneratingState({ title, steps }: GeneratingStateProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a < steps.length - 1 ? a + 1 : a));
    }, 2200);
    return () => clearInterval(id);
  }, [steps.length]);

  return (
    <div className="mx-auto max-w-xl">
      <div className="card animate-scale-in p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50">
          <span className="relative flex h-10 w-10">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-300 opacity-60" />
            <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </span>
          </span>
        </div>

        <h2 className="mt-6 text-xl font-bold text-ink-900">{title}</h2>
        <p className="mt-1 text-sm text-ink-500">
          Grok is searching the live web for the latest Ghanaian regulations.
          This can take up to a minute.
        </p>

        <ul className="mx-auto mt-6 max-w-sm space-y-3 text-left">
          {steps.map((s, i) => {
            const state =
              i < active ? "done" : i === active ? "active" : "pending";
            return (
              <li key={i} className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition ${
                    state === "done"
                      ? "bg-brand-600 text-white"
                      : state === "active"
                        ? "bg-brand-100 text-brand-700"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {state === "done" ? (
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : state === "active" ? (
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-600" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                  )}
                </span>
                <span
                  className={`text-sm ${
                    state === "pending" ? "text-ink-500" : "text-ink-900"
                  }`}
                >
                  {s}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
