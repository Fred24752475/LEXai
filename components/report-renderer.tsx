"use client";

import { useEffect, useState, type ComponentType } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  ClipboardList,
  Scale,
  FileText,
  Building,
  Shield,
  Users,
  Heart,
} from "lucide-react";
import type { ChecklistData, HealthCheckData, ReportType } from "@/lib/types";

const categoryIcons: Record<string, ComponentType<{ className?: string }>> = {
  Tax: Scale,
  "Legal & Compliance": FileText,
  Registration: Building,
  Licenses: Shield,
  Employment: Users,
  Health: Heart,
};

export function ScoreGauge({ score }: { score: number }) {
  const [animated, setAnimated] = useState(false);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setAnimated(true), 200);
    const t2 = setTimeout(() => setShowScore(true), 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [score]);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = animated
    ? circumference * (1 - Math.min(score, 100) / 100)
    : circumference;

  const color =
    score >= 75 ? "#166534" : score >= 50 ? "#b45309" : "#dc2626";
  const textColor =
    score >= 75
      ? "text-leaf"
      : score >= 50
        ? "text-gold"
        : "text-red-700";

  return (
    <div
      className="relative mx-auto flex h-44 w-44 items-center justify-center"
      style={{
        opacity: 0,
        animation: "fade-in 0.6s ease-out 0.1s forwards",
      }}
    >
      <svg viewBox="0 0 120 120" className="h-44 w-44 -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition:
              "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </svg>
      <div
        className={`absolute flex flex-col items-center justify-center transition-all duration-500 ${
          showScore ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        <span className={`text-4xl font-black ${textColor}`}>{score}</span>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
          score
        </span>
      </div>
    </div>
  );
}

export function ReportRenderer({
  type,
  data,
}: {
  type: ReportType;
  data: unknown;
}) {
  if (type === "healthcheck") {
    return <HealthCheck data={data as HealthCheckData} />;
  }
  return <Checklist data={data as ChecklistData} />;
}

const priorityStyles: Record<string, string> = {
  High: "bg-red-100 text-red-700 ring-red-300/50",
  Medium: "bg-amber-100 text-amber-700 ring-amber-300/50",
  Low: "bg-emerald-100 text-emerald-700 ring-emerald-300/50",
};

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${
        priorityStyles[priority] ?? priorityStyles.Medium
      }`}
    >
      {priority}
    </span>
  );
}

function Checklist({ data }: { data: ChecklistData }) {
  const items = data.checklist ?? [];
  const grouped: Record<string, typeof items> = {};
  items.forEach((item) => {
    (grouped[item.category] ??= []).push(item);
  });

  const indexMap = new Map(items.map((item, i) => [item, i]));

  return (
    <div className="space-y-6">
      <div
        className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-200"
        style={{
          opacity: 0,
          animation: "fade-in-up 0.5s ease-out 0s forwards",
        }}
      >
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">
          Startup checklist
        </p>
        <h1 className="mt-2 text-3xl font-black text-ink">{data.title}</h1>
        <p className="mt-3 leading-7 text-slate-600">{data.summary}</p>
      </div>

      {Object.entries(grouped).map(([category, categoryItems], groupIdx) => {
        const Icon = categoryIcons[category] ?? ClipboardList;
        return (
          <div
            key={category}
            className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-200"
            style={{
              opacity: 0,
              animation: `fade-in-up 0.5s ease-out ${(
                0.1 +
                groupIdx * 0.1
              ).toFixed(2)}s forwards`,
            }}
          >
            <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf/10">
                <Icon className="h-5 w-5 text-leaf" />
              </div>
              <h2 className="text-lg font-black text-ink">{category}</h2>
            </div>
            <div className="grid gap-3">
              {categoryItems.map((item) => {
                const idx = (indexMap.get(item) ?? 0) + 1;
                return (
                  <article
                    key={`${item.action}-${idx}`}
                    className="rounded-2xl bg-slate-50 p-5 transition-all hover:shadow-sm hover:ring-1 hover:ring-slate-200"
                  >
                    <div className="flex gap-4">
                      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-leaf to-emerald-500 font-black text-white shadow-sm">
                        <span className="relative z-10 text-sm">{idx}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-ink">
                            {item.action}
                          </h3>
                          <PriorityBadge priority={item.priority} />
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                          {item.agency} &middot; {item.timeline}
                        </p>
                        <p className="mt-3 rounded-xl bg-white p-3 text-sm text-slate-600 ring-1 ring-slate-200">
                          Estimated cost:{" "}
                          <strong>{item.estimatedCostGHS}</strong>{" "}
                          <span className="text-slate-300">|</span> Verify:{" "}
                          {item.sourceHint}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        );
      })}

      <InfoList title="Documents to prepare" items={data.documents} />
      <InfoList title="Immediate next steps" items={data.nextSteps} />
    </div>
  );
}

const statusConfig = {
  Compliant: {
    border: "border-leaf",
    icon: CheckCircle2,
    iconBg: "bg-leaf/10",
    iconColor: "text-leaf",
    badge: "bg-leaf/10 text-leaf",
  },
  "Needs attention": {
    border: "border-gold",
    icon: AlertTriangle,
    iconBg: "bg-gold/10",
    iconColor: "text-gold",
    badge: "bg-gold/10 text-gold",
  },
  "At risk": {
    border: "border-red-600",
    icon: AlertTriangle,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    badge: "bg-red-100 text-red-600",
  },
  Unknown: {
    border: "border-slate-400",
    icon: Circle,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-400",
    badge: "bg-slate-100 text-slate-500",
  },
} as const;

function HealthCheck({ data }: { data: HealthCheckData }) {
  const riskColor =
    data.riskLevel === "Critical" || data.riskLevel === "High"
      ? "bg-red-100 text-red-700 ring-red-300/50"
      : data.riskLevel === "Medium"
        ? "bg-amber-100 text-amber-700 ring-amber-300/50"
        : "bg-emerald-100 text-emerald-700 ring-emerald-300/50";

  return (
    <div className="space-y-6">
      <div
        className="grid gap-6 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-200 md:grid-cols-[240px_1fr] md:items-center"
        style={{
          opacity: 0,
          animation: "fade-in-up 0.5s ease-out 0s forwards",
        }}
      >
        <ScoreGauge score={data.score ?? 0} />
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">
            Compliance audit
          </p>
          <h1 className="mt-2 text-3xl font-black text-ink">{data.title}</h1>
          <p className="mt-3 leading-7 text-slate-600">{data.summary}</p>
          <span
            className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-bold ring-1 ${riskColor}`}
          >
            Risk level: {data.riskLevel}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {data.audit?.map((item, idx) => {
          const config = statusConfig[item.status] ?? statusConfig.Unknown;
          const Icon = config.icon;
          return (
            <article
              key={item.area}
              className={`rounded-3xl border-l-4 bg-white p-5 shadow-soft ring-1 ring-slate-200 ${config.border}`}
              style={{
                opacity: 0,
                animation: `fade-in-up 0.4s ease-out ${(
                  0.1 +
                  idx * 0.05
                ).toFixed(2)}s forwards`,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${config.iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-black text-ink">
                      {item.area}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${config.badge}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.agency}
                  </p>
                  <p className="mt-3 leading-6 text-slate-600">
                    {item.finding}
                  </p>
                  <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-200">
                    <span className="font-bold">Action:</span>{" "}
                    {item.priorityAction}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <InfoList title="Priority actions" items={data.priorityActions} />
      <InfoList title="Sources to verify" items={data.sourcesToVerify} />
    </div>
  );
}

function InfoList({
  title,
  items = [],
}: {
  title: string;
  items?: string[];
}) {
  return (
    <section
      className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-200"
      style={{
        opacity: 0,
        animation: "fade-in-up 0.5s ease-out 0.3s forwards",
      }}
    >
      <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-ink">
        <ClipboardList className="text-leaf" /> {title}
      </h2>
      <ul className="grid gap-3">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700 ring-1 ring-slate-100"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
