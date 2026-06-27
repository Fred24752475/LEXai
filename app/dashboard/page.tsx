export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  FileText,
  PlusCircle,
  ShieldCheck,
  ClipboardList,
  HeartPulse,
  Sparkles,
  ArrowRight,
  BarChart3
} from "lucide-react";
import { ButtonLink } from "@/components/button";
import { AppShell } from "@/components/shell";
import { createClient } from "@/lib/supabase/server";
import { formatDate, cn } from "@/lib/utils";
import type { ComplianceReport } from "@/lib/types";

type DashboardReport = Pick<
  ComplianceReport,
  "id" | "report_type" | "score" | "created_at" | "data"
> & {
  businesses: { name: string; type: string } | { name: string; type: string }[] | null;
};

const reportIcons = {
  checklist: ClipboardList,
  healthcheck: HeartPulse
} as const;

const reportLabels = {
  checklist: "Checklist",
  healthcheck: "Health Check"
} as const;

const reportColors = {
  checklist: "bg-emerald-100 text-leaf",
  healthcheck: "bg-amber-100 text-gold"
} as const;

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

  const checklistCount = savedReports.filter(
    (r) => r.report_type === "checklist"
  ).length;
  const healthcheckCount = savedReports.filter(
    (r) => r.report_type === "healthcheck"
  ).length;

  return (
    <AppShell>
      {/* ── Welcome section ── */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">
            Dashboard
          </p>
          <h1 className="mt-2 text-4xl font-black text-ink">
            Welcome back
            {user?.email ? `, ${user.email.split("@")[0]}` : ""}
          </h1>
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

      {/* ── Stats cards ── */}
      <section className="grid gap-4 md:grid-cols-3">
        {(
          [
            ["Total Reports", savedReports.length, BarChart3, "bg-violet-100 text-violet-700"],
            ["Checklists", checklistCount, ClipboardList, "bg-emerald-100 text-leaf"],
            ["Health Checks", healthcheckCount, HeartPulse, "bg-amber-100 text-gold"]
          ] as const
        ).map(([label, value, Icon, iconColor]) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                <p className="mt-2 text-4xl font-black text-ink">{value}</p>
              </div>
              <span className={cn("rounded-2xl p-3", iconColor)}>
                <Icon size={22} />
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* ── Quick actions ── */}
      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-black text-ink">Quick actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/setup"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 to-white p-6 ring-1 ring-emerald-200 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-black text-leaf">New Checklist</p>
                <p className="mt-1 text-sm text-slate-600">
                  Generate a compliance checklist for your business
                </p>
              </div>
              <span className="rounded-2xl bg-emerald-100 p-3 text-leaf transition-all group-hover:bg-emerald-200">
                <ClipboardList size={22} />
              </span>
            </div>
            <ArrowRight
              className="mt-4 text-emerald-600 transition-transform group-hover:translate-x-1"
              size={18}
            />
          </Link>

          <Link
            href="/healthcheck"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 to-white p-6 ring-1 ring-amber-200 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-black text-gold">Health Check</p>
                <p className="mt-1 text-sm text-slate-600">
                  Assess your business compliance health
                </p>
              </div>
              <span className="rounded-2xl bg-amber-100 p-3 text-gold transition-all group-hover:bg-amber-200">
                <HeartPulse size={22} />
              </span>
            </div>
            <ArrowRight
              className="mt-4 text-amber-600 transition-transform group-hover:translate-x-1"
              size={18}
            />
          </Link>

          <Link
            href="/dashboard#reports"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 to-white p-6 ring-1 ring-sky-200 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-black text-ink">View Reports</p>
                <p className="mt-1 text-sm text-slate-600">
                  Browse all your saved compliance reports
                </p>
              </div>
              <span className="rounded-2xl bg-sky-100 p-3 text-sky-700 transition-all group-hover:bg-sky-200">
                <FileText size={22} />
              </span>
            </div>
            <ArrowRight
              className="mt-4 text-sky-600 transition-transform group-hover:translate-x-1"
              size={18}
            />
          </Link>
        </div>
      </section>

      {/* ── Saved reports ── */}
      <section
        id="reports"
        className="mt-8 scroll-mt-24 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-200"
      >
        <h2 className="mb-5 text-2xl font-black text-ink">Saved reports</h2>
        <div className="grid gap-3">
          {savedReports.length ? (
            savedReports.map((report) => {
              const business = Array.isArray(report.businesses)
                ? report.businesses[0]
                : report.businesses;

              const Icon =
                reportIcons[
                  report.report_type as keyof typeof reportIcons
                ] ?? FileText;
              const iconColor =
                reportColors[
                  report.report_type as keyof typeof reportColors
                ] ?? "bg-slate-100 text-slate-600";
              const label =
                reportLabels[
                  report.report_type as keyof typeof reportLabels
                ] ?? "Report";

              return (
                <Link
                  key={report.id}
                  href={`/report/${report.id}`}
                  className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 transition-all hover:translate-x-0.5 hover:border-leaf/20 hover:bg-emerald-50/40 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "rounded-2xl p-3 transition-colors",
                        iconColor
                      )}
                    >
                      <Icon size={19} />
                    </span>
                    <div>
                      <p className="font-black text-ink transition-colors group-hover:text-leaf">
                        {business?.name ?? "Business report"}
                      </p>
                      <p className="text-sm capitalize text-slate-500">
                        {label} &bull; {formatDate(report.created_at)}
                      </p>
                    </div>
                  </div>
                  {report.score !== null ? (
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-ink transition-colors group-hover:bg-emerald-100 group-hover:text-leaf">
                      Score {report.score}
                    </span>
                  ) : null}
                </Link>
              );
            })
          ) : (
            <div className="flex flex-col items-center rounded-2xl bg-gradient-to-b from-slate-50 to-white p-10 text-center">
              <span className="rounded-2xl bg-emerald-100 p-4 text-leaf">
                <Sparkles size={32} />
              </span>
              <h3 className="mt-4 text-xl font-black text-ink">
                No reports yet
              </h3>
              <p className="mt-2 max-w-sm text-sm text-slate-500">
                Generate your first compliance checklist or health check to get
                started.
              </p>
              <div className="mt-6 flex gap-3">
                <ButtonLink href="/setup">
                  <PlusCircle className="mr-2" size={16} /> New checklist
                </ButtonLink>
                <ButtonLink href="/healthcheck" variant="secondary">
                  <ShieldCheck className="mr-2" size={16} /> Health check
                </ButtonLink>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Floating action button ── */}
      <Link
        href="/setup"
        className="no-print fixed bottom-8 right-8 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-leaf to-emerald-600 text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl md:h-16 md:w-16"
        title="Generate new report"
      >
        <PlusCircle size={24} />
      </Link>
    </AppShell>
  );
}
