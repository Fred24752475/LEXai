import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";

export const metadata = { title: "Dashboard — LexGH" };
export const dynamic = "force-dynamic";

interface ReportRow {
  id: string;
  report_type: "checklist" | "healthcheck";
  score: number | null;
  created_at: string;
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

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectedFrom=/dashboard");

  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, name, type, created_at, compliance_reports(id, report_type, score, created_at)")
    .order("created_at", { ascending: false });

  const rows = (businesses ?? []) as BusinessRow[];
  const totalReports = rows.reduce(
    (sum, b) => sum + (b.compliance_reports?.length ?? 0),
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
                      .map((r) => (
                        <Link
                          key={r.id}
                          href={`/report/${r.id}`}
                          className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 transition hover:border-brand-300 hover:bg-brand-50/40"
                        >
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
                        </Link>
                      ))
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
