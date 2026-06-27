export const dynamic = "force-dynamic";

import Link from "next/link";
import { FileText, PlusCircle, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { AppShell } from "@/components/shell";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { ComplianceReport } from "@/lib/types";

type DashboardReport = Pick<
  ComplianceReport,
  "id" | "report_type" | "score" | "created_at" | "data"
> & {
  businesses: { name: string; type: string } | { name: string; type: string }[] | null;
};

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: reports } = await supabase
    .from("compliance_reports")
    .select("id, report_type, score, created_at, data, businesses(name, type)")
    .order("created_at", { ascending: false })
    .limit(20);
  const savedReports = (reports ?? []) as unknown as DashboardReport[];

  return (
    <AppShell>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">Dashboard</p>
          <h1 className="mt-2 text-4xl font-black text-ink">Welcome back</h1>
          <p className="mt-2 text-slate-600">{user?.email}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/setup">
            <PlusCircle className="mr-2" size={18} /> New checklist
          </ButtonLink>
          <ButtonLink href="/healthcheck" variant="secondary">
            <ShieldCheck className="mr-2" size={18} /> Health check
          </ButtonLink>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Reports", savedReports.length],
          ["Checklists", savedReports.filter((report) => report.report_type === "checklist").length],
          ["Health checks", savedReports.filter((report) => report.report_type === "healthcheck").length]
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-2 text-4xl font-black text-ink">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-200">
        <h2 className="mb-5 text-2xl font-black text-ink">Saved reports</h2>
        <div className="grid gap-3">
          {savedReports.length ? (
            savedReports.map((report) => {
              const business = Array.isArray(report.businesses)
                ? report.businesses[0]
                : report.businesses;

              return (
              <Link
                key={report.id}
                href={`/report/${report.id}`}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-2xl bg-emerald-100 p-3 text-leaf">
                    <FileText size={19} />
                  </span>
                  <div>
                    <p className="font-black text-ink">{business?.name ?? "Business report"}</p>
                    <p className="text-sm capitalize text-slate-500">
                      {report.report_type} • {formatDate(report.created_at)}
                    </p>
                  </div>
                </div>
                {report.score !== null ? (
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-ink">
                    Score {report.score}
                  </span>
                ) : null}
              </Link>
              );
            })
          ) : (
            <div className="rounded-2xl bg-slate-50 p-8 text-center">
              <p className="font-bold text-slate-700">No reports yet.</p>
              <p className="mt-2 text-sm text-slate-500">Generate your first checklist for the demo flow.</p>
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
