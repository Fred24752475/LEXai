import type { Checklist } from "@/lib/schemas";
import { PriorityBadge } from "./PriorityBadge";
import { PrintButton } from "./PrintButton";
import { SourceList } from "./SourceList";

function InfoChip({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-ink-700 ring-1 ring-inset ring-slate-200">
      {icon}
      {children}
    </span>
  );
}

export function ComplianceChecklist({ data }: { data: Checklist }) {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 bg-gradient-to-r from-brand-50 to-white p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="badge-authority">Setup Checklist</span>
              <h1 className="mt-2 text-2xl font-bold text-ink-900">
                {data.businessName}
              </h1>
              <p className="mt-1 text-sm font-medium text-brand-700">
                {data.businessType}
              </p>
            </div>
            <PrintButton />
          </div>
          <p className="mt-4 max-w-2xl text-ink-700">{data.summary}</p>
        </div>
        <div className="flex flex-wrap items-center gap-6 p-6 sm:px-8">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-500">
              Total estimated cost
            </p>
            <p className="text-xl font-bold text-ink-900">
              {data.totalEstimatedCost}
            </p>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-500">
              Total steps
            </p>
            <p className="text-xl font-bold text-ink-900">{data.steps.length}</p>
          </div>
        </div>
      </div>

      {/* Steps */}
      <ol className="space-y-4">
        {data.steps.map((step, i) => (
          <li key={i} className="card p-6">
            <div className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-ink-900">
                    {step.title}
                  </h2>
                  <span className="badge-authority">{step.authority}</span>
                  <PriorityBadge priority={step.priority} />
                </div>
                <p className="mt-2 text-ink-700">{step.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <InfoChip
                    icon={
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    }
                  >
                    {step.estimatedCost}
                  </InfoChip>
                  <InfoChip
                    icon={
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    }
                  >
                    {step.estimatedTimeline}
                  </InfoChip>
                </div>

                {step.requiredDocuments.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                      Required documents
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {step.requiredDocuments.map((doc, d) => (
                        <li
                          key={d}
                          className="rounded-lg bg-white px-2.5 py-1 text-xs text-ink-700 ring-1 ring-inset ring-slate-200"
                        >
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {step.officialLink ? (
                  <a
                    href={step.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline no-print"
                  >
                    Official resource
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M7 17L17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </a>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <SourceList sources={data.sources} />
    </div>
  );
}
