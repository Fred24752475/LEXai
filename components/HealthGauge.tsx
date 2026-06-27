"use client";

import { useEffect, useState } from "react";

function colorForScore(score: number): { stroke: string; text: string } {
  if (score >= 75) return { stroke: "#059669", text: "text-brand-700" };
  if (score >= 50) return { stroke: "#d97706", text: "text-gold-600" };
  return { stroke: "#dc2626", text: "text-red-600" };
}

export function HealthGauge({
  score,
  grade,
}: {
  score: number;
  grade: string;
}) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(score));
    return () => cancelAnimationFrame(id);
  }, [score]);

  // Semi-circle gauge geometry.
  const radius = 90;
  const circumference = Math.PI * radius; // half circle
  const progress = (animated / 100) * circumference;
  const { stroke, text } = colorForScore(score);

  return (
    <div className="relative flex flex-col items-center">
      <svg width="220" height="130" viewBox="0 0 220 130" aria-hidden="true">
        <path
          d="M 20 120 A 90 90 0 0 1 200 120"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M 20 120 A 90 90 0 0 1 200 120"
          fill="none"
          stroke={stroke}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </svg>
      <div className="-mt-16 flex flex-col items-center">
        <span className={`text-5xl font-extrabold tabular-nums ${text}`}>
          {Math.round(animated)}
        </span>
        <span className="text-sm font-medium text-ink-500">out of 100</span>
        <span
          className={`mt-2 rounded-full px-3 py-1 text-sm font-semibold ${text} bg-slate-50 ring-1 ring-inset ring-slate-200`}
        >
          {grade}
        </span>
      </div>
    </div>
  );
}
