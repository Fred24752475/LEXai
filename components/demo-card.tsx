"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, RotateCw, Shield } from "lucide-react";

const items = [
  { title: "Business registration", detail: "ORC incorporation documents", priority: "High" as const },
  { title: "Tax compliance", detail: "TIN and GRA registration", priority: "High" as const },
  { title: "Employment obligations", detail: "SSNIT registration", priority: "Medium" as const },
];

export function DemoCard() {
  const [phase, setPhase] = useState<"idle" | "scanning" | "done">("idle");
  const [visible, setVisible] = useState<string[]>([]);

  useEffect(() => {
    setPhase("scanning");
    const t1 = setTimeout(() => {
      setPhase("done");
      items.forEach((item, i) => {
        setTimeout(() => {
          setVisible((prev) => [...prev, item.title]);
        }, (i + 1) * 400);
      });
    }, 1800);
    return () => clearTimeout(t1);
  }, []);

  function handleRerun() {
    setPhase("scanning");
    setVisible([]);
    setTimeout(() => {
      setPhase("done");
      items.forEach((item, i) => {
        setTimeout(() => {
          setVisible((prev) => [...prev, item.title]);
        }, (i + 1) * 400);
      });
    }, 1800);
  }

  const score = Math.round((visible.length / items.length) * 100);

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-slate-200">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Live demo</p>
          <h2 className="text-2xl font-black text-ink">Compliance Scan</h2>
        </div>
        <div className="relative rounded-2xl bg-emerald-100 p-3 text-leaf transition-all duration-500">
          {phase === "scanning" ? (
            <Loader2 className="animate-spin" size={22} />
          ) : (
            <Shield size={22} />
          )}
        </div>
      </div>

      {phase === "scanning" ? (
        <div className="flex flex-col items-center gap-4 py-10">
          <div className="relative">
            <div className="h-16 w-16 animate-pulse rounded-full border-2 border-emerald-200" />
            <Shield
              size={28}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-leaf/60"
            />
          </div>
          <p className="text-sm font-medium text-slate-500">
            Scanning Ghanaian registries...
          </p>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2 w-2 animate-pulse rounded-full bg-leaf/50"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="mb-5 rounded-xl bg-emerald-50 px-4 py-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-leaf">Compliance score</span>
              <span className="font-black text-leaf transition-all duration-700">
                {score}%
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-emerald-200">
              <div
                className="h-full rounded-full bg-leaf transition-all duration-700 ease-out"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          <div className="grid gap-3">
            {items.map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl border border-slate-200 p-4 transition-all duration-500 ${
                  visible.includes(item.title)
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className={`mt-1 transition-all duration-500 ${
                      visible.includes(item.title)
                        ? "scale-100 text-leaf"
                        : "scale-50 text-slate-200"
                    }`}
                    size={19}
                  />
                  <div className="flex-1">
                    <p className="font-bold text-ink">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.detail}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      item.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-gold"
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleRerun}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <RotateCw size={15} />
            Re-run check
          </button>
        </>
      )}
    </div>
  );
}
