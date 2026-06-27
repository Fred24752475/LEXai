import { AlertTriangle, CheckCircle2, Circle, ClipboardList } from "lucide-react";
import type { ChecklistData, HealthCheckData, ReportType } from "@/lib/types";

export function ScoreGauge({ score }: { score: number }) {
  const color = score >= 75 ? "text-leaf" : score >= 50 ? "text-gold" : "text-red-700";

  return (
    <div className="relative mx-auto flex h-44 w-44 items-center justify-center rounded-full bg-slate-100">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(#166534 ${score * 3.6}deg, #e2e8f0 0deg)`
        }}
      />
      <div className="relative flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white shadow-sm">
        <span className={`text-4xl font-black ${color}`}>{score}</span>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">score</span>
      </div>
    </div>
  );
}

export function ReportRenderer({ type, data }: { type: ReportType; data: unknown }) {
  if (type === "healthcheck") {
    return <HealthCheck data={data as HealthCheckData} />;
  }

  return <Checklist data={data as ChecklistData} />;
}

function Checklist({ data }: { data: ChecklistData }) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-200">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">Startup checklist</p>
        <h1 className="mt-2 text-3xl font-black text-ink">{data.title}</h1>
        <p className="mt-3 leading-7 text-slate-600">{data.summary}</p>
      </div>

      <div className="grid gap-4">
        {data.checklist?.map((item, index) => (
          <article key={`${item.action}-${index}`} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 font-black text-leaf">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-black text-ink">{item.action}</h2>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-gold">
                    {item.priority}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {item.category} • {item.agency} • {item.timeline}
                </p>
                <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                  Estimated cost: <strong>{item.estimatedCostGHS}</strong> | Verify: {item.sourceHint}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <InfoList title="Documents to prepare" items={data.documents} />
      <InfoList title="Immediate next steps" items={data.nextSteps} />
    </div>
  );
}

function HealthCheck({ data }: { data: HealthCheckData }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-200 md:grid-cols-[240px_1fr] md:items-center">
        <ScoreGauge score={data.score ?? 0} />
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">Compliance audit</p>
          <h1 className="mt-2 text-3xl font-black text-ink">{data.title}</h1>
          <p className="mt-3 leading-7 text-slate-600">{data.summary}</p>
          <span className="mt-4 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-ink">
            Risk level: {data.riskLevel}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {data.audit?.map((item) => (
          <article key={item.area} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start gap-3">
              {item.status === "Compliant" ? (
                <CheckCircle2 className="mt-1 text-leaf" />
              ) : item.status === "Unknown" ? (
                <Circle className="mt-1 text-slate-400" />
              ) : (
                <AlertTriangle className="mt-1 text-gold" />
              )}
              <div>
                <h2 className="font-black text-ink">{item.area}</h2>
                <p className="mt-1 text-sm font-bold text-slate-500">{item.status} • {item.agency}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.finding}</p>
                <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                  Action: {item.priorityAction}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <InfoList title="Priority actions" items={data.priorityActions} />
      <InfoList title="Sources to verify" items={data.sourcesToVerify} />
    </div>
  );
}

function InfoList({ title, items = [] }: { title: string; items?: string[] }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-ink">
        <ClipboardList className="text-leaf" /> {title}
      </h2>
      <ul className="grid gap-3">
        {items.map((item) => (
          <li key={item} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
