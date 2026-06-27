import { ArrowRight, Building2, CheckCircle2, Radar } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { PublicShell } from "@/components/shell";

export default function HomePage() {
  return (
    <PublicShell>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-leaf">
            Ghana compliance, explained in minutes
          </p>
          <h1 className="text-5xl font-black tracking-tight text-ink sm:text-6xl">
            AI-powered business compliance for Ghanaian entrepreneurs.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            LexGH uses live web search through Grok to create actionable startup checklists and
            compliance health checks for ORC, GRA, SSNIT and other Ghanaian requirements.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/login">
              Generate my checklist <ArrowRight className="ml-2" size={18} />
            </ButtonLink>
            <ButtonLink href="/login" variant="secondary">
              Run health check
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Demo output</p>
              <h2 className="text-2xl font-black">Compliance Snapshot</h2>
            </div>
            <div className="rounded-2xl bg-emerald-100 p-3 text-leaf">
              <Radar />
            </div>
          </div>
          <div className="grid gap-3">
            {[
              ["Business registration", "ORC incorporation documents", "High"],
              ["Tax compliance", "TIN and GRA registration", "High"],
              ["Employment obligations", "SSNIT registration", "Medium"]
            ].map(([title, detail, priority]) => (
              <div key={title} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 text-leaf" size={19} />
                  <div className="flex-1">
                    <p className="font-bold text-ink">{title}</p>
                    <p className="text-sm text-slate-500">{detail}</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-gold">
                    {priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-16 md:grid-cols-3">
        {[
          ["5-question wizard", "Start with a business idea and receive a printable checklist."],
          ["Live legal research", "Grok searches current Ghanaian rules before generating output."],
          ["Saved dashboard", "Keep multiple businesses and reports in one protected workspace."]
        ].map(([title, text]) => (
          <div key={title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <Building2 className="mb-4 text-leaf" />
            <h3 className="text-lg font-black text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
          </div>
        ))}
      </section>
    </PublicShell>
  );
}
