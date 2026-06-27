import type { CategoryStatus, HealthCheck, Priority } from "@/lib/schemas";
import { HealthGauge } from "./HealthGauge";
import { PrintButton } from "./PrintButton";
import { SourceList } from "./SourceList";

const STATUS_META: Record<
  CategoryStatus,
  { label: string; dot: string; ring: string; text: string }
> = {
  compliant: {
    label: "Compliant",
    dot: "bg-brand-500",
    ring: "ring-brand-100",
    text: "text-brand-700",
  },
  warning: {
    label: "Needs attention",
    dot: "bg-gold-400",
    ring: "ring-gold-200",
    text: "text-gold-600",
  },
  critical: {
    label: "Critical",
    dot: "bg-red-500",
    ring: "ring-red-100",
    text: "text-red-600",
  },
};

const URGENCY_META: Record<Priority, { label: string; cls: string }> = {
  high: { label: "Urgent", cls: "bg-red-50 text-red-700 ring-red-100" },
  medium: { label: "Soon", cls: "bg-gold-50 text-gold-600 ring-gold-200" },
  low: { label: "When able", cls: "bg-slate-100 text-ink-700 ring-slate-200" },
};

export function HealthCheckReport({ data }: { data: HealthCheck }) {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Score header */}
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-6 sm:px-8">
          <div>
            <span className="badge-authority">Compliance Health Check</span>
            <h1 className="mt-2 text-2xl font-bold text-ink-900">
              {data.businessName}
            </h1>
          </div>
          <PrintButton />
        </div>
        <div className="grid gap-6 p-6 sm:grid-cols-[auto,1fr] sm:items-center sm:p-8">
          <div className="flex justify-center">
            <HealthGauge score={data.score} grade={data.grade} />
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">
              Overall assessment
            </h2>
            <p className="mt-2 text-ink-700">{data.summary}</p>
          </div>
        </div>
      </div>

      {/* Category audit */}
      <div>
        <h2 className="mb-3 px-1 text-lg font-bold text-ink-900">
          Compliance audit
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {data.categories.map((cat, i) => {
            const meta = STATUS_META[cat.status];
            return (
              <div key={i} className={`card p-5 ring-1 ring-inset ${meta.ring}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-ink-900">{cat.name}</h3>
                  <span
                    className={`chip bg-white ${meta.text} ring-1 ring-inset ${meta.ring}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink-700">{cat.detail}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority actions */}
      {data.priorityActions.length > 0 ? (
        <div>
          <h2 className="mb-3 px-1 text-lg font-bold text-ink-900">
            Priority actions
          </h2>
          <ol className="space-y-3">
            {data.priorityActions.map((action, i) => {
              const u = URGENCY_META[action.urgency];
              return (
                <li key={i} className="card flex gap-4 p-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-ink-700">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-ink-900">
                        {action.title}
                      </h3>
                      <span className="badge-authority">{action.authority}</span>
                      <span
                        className={`chip ring-1 ring-inset ${u.cls}`}
                      >
                        {u.label}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-ink-700">
                      {action.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}

      <SourceList sources={data.sources} />
    </div>
  );
}
