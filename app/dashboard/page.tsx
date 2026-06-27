import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { checklistSchema, healthCheckSchema } from "@/lib/schemas";

export const metadata = { title: "Dashboard — LexGH" };
export const dynamic = "force-dynamic";

interface ReportRow {
  id: string;
  report_type: "checklist" | "healthcheck";
  score: number | null;
  created_at: string;
  data: unknown;
}

interface BusinessRow {
  id: string;
  name: string;
  type: "new" | "existing";
  created_at: string;
  compliance_reports: ReportRow[];
}

interface UrgentItem {
  title: string;
  businessName: string;
  authority: string;
  description: string;
  reportId: string;
}

interface AuthorityStatus {
  key: string;
  label: string;
  status: "compliant" | "warning" | "critical" | "unknown";
  reportId: string | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function scoreColor(score: number) {
  if (score >= 75) return "text-brand-700 bg-brand-50 ring-brand-100";
  if (score >= 50) return "text-gold-600 bg-gold-50 ring-gold-200";
  return "text-red-600 bg-red-50 ring-red-100";
}

function getReportSummary(report: { data: unknown; report_type: string }): { summary: string; detail?: string } {
  if (report.report_type === "checklist") {
    const d = checklistSchema.safeParse(report.data);
    if (d.success) return { summary: d.data.summary };
  }
  if (report.report_type === "healthcheck") {
    const d = healthCheckSchema.safeParse(report.data);
    if (d.success) return { summary: d.data.summary, detail: `Grade: ${d.data.grade}` };
  }
  return { summary: "" };
}

function collectUrgentItems(rows: BusinessRow[]): UrgentItem[] {
  const items: UrgentItem[] = [];
  for (const biz of rows) {
    for (const report of biz.compliance_reports ?? []) {
      if (report.report_type === "checklist") {
        const d = checklistSchema.safeParse(report.data);
        if (d.success) {
          for (const step of d.data.steps) {
            if (step.priority === "high") {
              items.push({
                title: step.title,
                businessName: d.data.businessName,
                authority: step.authority,
                description: step.description,
                reportId: report.id,
              });
            }
          }
        }
      } else if (report.report_type === "healthcheck") {
        const d = healthCheckSchema.safeParse(report.data);
        if (d.success) {
          for (const action of d.data.priorityActions) {
            items.push({
              title: action.title,
              businessName: d.data.businessName,
              authority: action.authority,
              description: action.description,
              reportId: report.id,
            });
          }
        }
      }
    }
  }
  return items;
}

const AUTHORITY_CONFIG = [
  { key: "gra", label: "Tax (GRA)", terms: ["gra", "tax", "revenue"] },
  { key: "orc", label: "Registration (ORC)", terms: ["orc", "registration", "registrar of companies"] },
  { key: "ssnit", label: "Labour (SSNIT)", terms: ["ssnit", "labour", "social security", "pension"] },
];

function getComplianceStatuses(rows: BusinessRow[]): AuthorityStatus[] {
  const allReports = rows
    .flatMap(b => b.compliance_reports ?? [])
    .filter(r => r.report_type === "healthcheck" && r.data != null)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  return AUTHORITY_CONFIG.map(cfg => {
    for (const report of allReports) {
      const d = healthCheckSchema.safeParse(report.data);
      if (!d.success) continue;
      for (const cat of d.data.categories) {
        if (cfg.terms.some(t => cat.name.toLowerCase().includes(t))) {
          return { key: cfg.key, label: cfg.label, status: cat.status, reportId: report.id };
        }
      }
    }
    return { key: cfg.key, label: cfg.label, status: "unknown" as const, reportId: null };
  });
}

const STATUS_META: Record<string, { dot: string; label: string; ring: string; bg: string }> = {
  compliant: { dot: "bg-brand-500", label: "Compliant", ring: "ring-brand-100", bg: "bg-brand-50" },
  warning: { dot: "bg-gold-400", label: "Warning", ring: "ring-gold-200", bg: "bg-gold-50" },
  critical: { dot: "bg-red-500", label: "Critical", ring: "ring-red-100", bg: "bg-red-50" },
  unknown: { dot: "bg-slate-300", label: "Check report", ring: "ring-slate-200", bg: "bg-white" },
};

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectedFrom=/dashboard");

  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, name, type, created_at, compliance_reports(id, report_type, score, created_at, data)")
    .order("created_at", { ascending: false });

  const rows = (businesses ?? []) as BusinessRow[];
  const totalReports = rows.reduce(
    (sum, b) => sum + (b.compliance_reports?.length ?? 0),
    0
  );

  const urgentItems = collectUrgentItems(rows);
  const complianceStatuses = getComplianceStatuses(rows);

  return (
    <>
      <Navbar authed email={user.email} />
      <main className="container-page py-8 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">Your dashboard</h1>
            <p className="mt-1 text-ink-500">
              {rows.length} business{rows.length === 1 ? "" : "es"} ·{" "}
              {totalReports} saved report{totalReports === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/setup" className="btn-primary">
              + New setup checklist
            </Link>
            <Link href="/healthcheck" className="btn-secondary">
              + Health check
            </Link>
          </div>
        </div>

        {urgentItems.length > 0 ? (
          <section className="mt-8 animate-fade-up">
            <div className="mb-4 flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-500"
                aria-hidden="true"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <h2 className="text-lg font-bold text-ink-900">Urgent items</h2>
              <span className="chip bg-red-50 text-red-700 ring-1 ring-inset ring-red-100">
                {urgentItems.length}
              </span>
            </div>
            <div className="space-y-2">
              {urgentItems.map((item, i) => (
                <Link
                  key={i}
                  href={`/report/${item.reportId}`}
                  className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/40 px-4 py-3 transition hover:border-red-300 hover:bg-red-50"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 shrink-0 text-red-500"
                    aria-hidden="true"
                  >
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-ink-900">
                        {item.title}
                      </span>
                      <span className="badge-authority">{item.authority}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-ink-500">
                      {item.businessName}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {totalReports > 0 ? (
          <section className="mt-8 animate-scale-in">
            <h2 className="mb-4 text-lg font-bold text-ink-900">
              Compliance overview
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {complianceStatuses.map(cs => {
                const m = STATUS_META[cs.status];
                return (
                  <Link
                    key={cs.key}
                    href={cs.reportId ? `/report/${cs.reportId}` : "#"}
                    className={`card flex items-center gap-3 p-4 ring-1 ring-inset transition hover:shadow-sm ${m.ring} ${m.bg}`}
                  >
                    <span className={`h-3 w-3 shrink-0 rounded-full ${m.dot}`} />
                    <div>
                      <p className="text-sm font-semibold text-ink-900">
                        {cs.label}
                      </p>
                      <p className="text-xs text-ink-500">{m.label}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        {rows.length === 0 ? (
          <div className="card mt-8 flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M9 15l2 2 4-4" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-ink-900">
              No reports yet
            </h2>
            <p className="mt-1 max-w-sm text-sm text-ink-500">
              Generate your first compliance checklist or run a health check to
              see it saved here.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/setup" className="btn-primary">
                Start setup wizard
              </Link>
              <Link href="/healthcheck" className="btn-secondary">
                Run health check
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-5">
            {rows.map((biz) => (
              <div key={biz.id} className="card p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
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
                        <path d="M3 21h18" />
                        <path d="M5 21V7l8-4v18" />
                        <path d="M19 21V11l-6-4" />
                      </svg>
                    </span>
                    <div>
                      <h2 className="font-semibold text-ink-900">{biz.name}</h2>
                      <p className="text-xs text-ink-500">
                        {biz.type === "new" ? "New business" : "Existing business"}{" "}
                        · added {formatDate(biz.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                  {(biz.compliance_reports ?? []).length === 0 ? (
                    <p className="text-sm text-ink-500">No reports saved.</p>
                  ) : (
                    biz.compliance_reports
                      .slice()
                      .sort((a, b) => b.created_at.localeCompare(a.created_at))
                      .map((r) => {
                        const preview = getReportSummary(r);
                        let grade: string | undefined;
                        let stepCount: number | undefined;
                        if (r.report_type === "checklist") {
                          const d = checklistSchema.safeParse(r.data);
                          if (d.success) stepCount = d.data.steps.length;
                        } else if (r.report_type === "healthcheck") {
                          const d = healthCheckSchema.safeParse(r.data);
                          if (d.success) grade = d.data.grade;
                        }
                        return (
                          <Link
                            key={r.id}
                            href={`/report/${r.id}`}
                            className="block rounded-xl border border-slate-200 px-4 py-3 transition hover:border-brand-300 hover:bg-brand-50/40"
                          >
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-3">
                                <span className="badge-authority">
                                  {r.report_type === "checklist"
                                    ? "Setup Checklist"
                                    : "Health Check"}
                                </span>
                                <span className="text-sm text-ink-500">
                                  {formatDate(r.created_at)}
                                </span>
                              </span>
                              <span className="flex items-center gap-3">
                                {r.report_type === "healthcheck" &&
                                r.score !== null ? (
                                  <span
                                    className={`chip ring-1 ring-inset ${scoreColor(r.score)}`}
                                  >
                                    Score {r.score}
                                  </span>
                                ) : null}
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-ink-300"
                                  aria-hidden="true"
                                >
                                  <path d="M9 18l6-6-6-6" />
                                </svg>
                              </span>
                            </div>
                            {(preview.summary || stepCount !== undefined || grade !== undefined) ? (
                              <div className="mt-2 flex items-start gap-3">
                                {preview.summary ? (
                                  <p className="min-w-0 flex-1 text-xs text-ink-500 line-clamp-2">
                                    {preview.summary.length > 100
                                      ? `${preview.summary.slice(0, 100)}…`
                                      : preview.summary}
                                  </p>
                                ) : null}
                                <span className="flex shrink-0 items-center gap-2">
                                  {stepCount !== undefined ? (
                                    <span className="chip bg-slate-50 text-ink-600 ring-1 ring-inset ring-slate-200">
                                      {stepCount} step{stepCount === 1 ? "" : "s"}
                                    </span>
                                  ) : null}
                                  {grade !== undefined ? (
                                    <span
                                      className={`chip ring-1 ring-inset ${
                                        r.score !== null
                                          ? scoreColor(r.score)
                                          : "text-ink-600 bg-slate-50 ring-slate-200"
                                      }`}
                                    >
                                      {grade}
                                    </span>
                                  ) : null}
                                </span>
                              </div>
                            ) : null}
                          </Link>
                        );
                      })
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
