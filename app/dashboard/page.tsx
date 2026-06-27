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

function getReportPreview(report: ReportRow) {
  if (report.report_type === "checklist") {
    const parsed = checklistSchema.safeParse(report.data);
    if (!parsed.success) return { summary: "", meta: "Checklist" };
    return {
      summary: parsed.data.summary,
      meta: `${parsed.data.steps.length} step${parsed.data.steps.length === 1 ? "" : "s"}`
    };
  }

  const parsed = healthCheckSchema.safeParse(report.data);
  if (!parsed.success) return { summary: "", meta: "Health check" };
  return {
    summary: parsed.data.summary,
    meta: parsed.data.grade,
    score: report.score ?? parsed.data.score
  };
}

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectedFrom=/dashboard");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) redirect("/onboarding");

  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, name, type, created_at, compliance_reports(id, report_type, score, created_at, data)")
    .order("created_at", { ascending: false });

  const rows = (businesses ?? []) as BusinessRow[];
  const totalReports = rows.reduce(
    (sum, business) => sum + (business.compliance_reports?.length ?? 0),
    0
  );

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
              No business instances yet
            </h2>
            <p className="mt-1 max-w-sm text-sm text-ink-500">
              Generate a setup checklist or health check to create your first saved business.
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
            {rows.map((business) => {
              const reports = (business.compliance_reports ?? [])
                .slice()
                .sort((a, b) => b.created_at.localeCompare(a.created_at));
              const latestReport = reports[0];
              const preview = latestReport ? getReportPreview(latestReport) : null;

              return (
                <Link
                  key={business.id}
                  href={`/business/${business.id}`}
                  className="card group block p-6 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-100">
                        <svg
                          width="21"
                          height="21"
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
                        <h2 className="font-semibold text-ink-900 transition group-hover:text-brand-700">
                          {business.name}
                        </h2>
                        <p className="text-xs text-ink-500">
                          {business.type === "new" ? "New business" : "Existing business"} · added{" "}
                          {formatDate(business.created_at)}
                        </p>
                      </div>
                    </div>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-2 text-ink-300 transition group-hover:translate-x-1 group-hover:text-brand-600"
                      aria-hidden="true"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>

                  <div className="mt-5 rounded-xl border border-slate-200 px-4 py-3 transition group-hover:border-brand-200 group-hover:bg-brand-50/30">
                    {latestReport && preview ? (
                      <>
                        <div className="flex items-center justify-between gap-3">
                          <span className="flex items-center gap-3">
                            <span className="badge-authority">
                              {latestReport.report_type === "checklist"
                                ? "Setup Checklist"
                                : "Health Check"}
                            </span>
                            <span className="text-sm text-ink-500">
                              {formatDate(latestReport.created_at)}
                            </span>
                          </span>
                          <span className="flex shrink-0 items-center gap-2">
                            {typeof preview.score === "number" ? (
                              <span className={`chip ring-1 ring-inset ${scoreColor(preview.score)}`}>
                                Score {preview.score}
                              </span>
                            ) : null}
                            <span className="chip bg-slate-50 text-ink-600 ring-1 ring-inset ring-slate-200">
                              {preview.meta}
                            </span>
                          </span>
                        </div>
                        {preview.summary ? (
                          <p className="mt-2 line-clamp-2 text-xs text-ink-500">
                            {preview.summary.length > 120
                              ? `${preview.summary.slice(0, 120)}…`
                              : preview.summary}
                          </p>
                        ) : null}
                      </>
                    ) : (
                      <p className="text-sm text-ink-500">No reports saved for this business yet.</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
