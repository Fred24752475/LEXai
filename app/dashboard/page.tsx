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

interface HealthCheckItem {
  business: BusinessRow;
  report: ReportRow;
  preview: ReturnType<typeof getReportPreview>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
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

function getLatestChecklist(business: BusinessRow) {
  return (business.compliance_reports ?? [])
    .filter((report) => report.report_type === "checklist")
    .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
}

function isBusinessInstance(business: BusinessRow) {
  return business.type === "new" || Boolean(getLatestChecklist(business));
}

function getHealthChecks(rows: BusinessRow[]): HealthCheckItem[] {
  return rows
    .flatMap((business) =>
      (business.compliance_reports ?? [])
        .filter((report) => report.report_type === "healthcheck")
        .map((report) => ({
          business,
          report,
          preview: getReportPreview(report)
        }))
    )
    .sort((a, b) => b.report.created_at.localeCompare(a.report.created_at));
}

function EmptyState() {
  return (
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
      <h2 className="mt-4 text-lg font-semibold text-ink-900">No saved work yet</h2>
      <p className="mt-1 max-w-sm text-sm text-ink-500">
        Generate a setup checklist or run a health check to create your first saved item.
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
  );
}

function BusinessCard({ business }: { business: BusinessRow }) {
  const latestChecklist = getLatestChecklist(business);
  const preview = latestChecklist ? getReportPreview(latestChecklist) : null;

  return (
    <Link
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
              {business.type === "new" ? "New business" : "Business instance"} · added{" "}
              {formatDate(business.created_at)}
            </p>
          </div>
        </div>
        <span className="mt-2 text-ink-300 transition group-hover:translate-x-1 group-hover:text-brand-600">
          →
        </span>
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 px-4 py-3 transition group-hover:border-brand-200 group-hover:bg-brand-50/30">
        {latestChecklist && preview ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-3">
                <span className="badge-authority">Setup Checklist</span>
                <span className="text-sm text-ink-500">{formatDate(latestChecklist.created_at)}</span>
              </span>
              <span className="chip bg-slate-50 text-ink-600 ring-1 ring-inset ring-slate-200">
                {preview.meta}
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
          <p className="text-sm text-ink-500">No setup checklist saved for this business yet.</p>
        )}
      </div>
    </Link>
  );
}

function HealthCheckCard({ item }: { item: HealthCheckItem }) {
  const score = typeof item.preview.score === "number" ? item.preview.score : item.report.score;

  return (
    <Link
      href={`/report/${item.report.id}`}
      className="card group block p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="badge-authority">Health Check</span>
          <h3 className="mt-3 font-semibold text-ink-900 group-hover:text-brand-700">
            {item.business.name}
          </h3>
          <p className="mt-1 text-xs text-ink-500">
            Audit created {formatDate(item.report.created_at)}
          </p>
        </div>
        {typeof score === "number" ? (
          <span className={`chip shrink-0 ring-1 ring-inset ${scoreColor(score)}`}>
            Score {score}
          </span>
        ) : null}
      </div>
      {item.preview.summary ? (
        <p className="mt-3 line-clamp-2 text-xs leading-5 text-ink-500">
          {item.preview.summary.length > 140
            ? `${item.preview.summary.slice(0, 140)}…`
            : item.preview.summary}
        </p>
      ) : null}
      <div className="mt-4 flex items-center justify-between text-xs font-medium text-ink-500">
        <span>{item.preview.meta}</span>
        <span className="text-ink-300 transition group-hover:translate-x-1 group-hover:text-brand-600">
          Open audit →
        </span>
      </div>
    </Link>
  );
}

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user }
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
  const businessInstances = rows.filter(isBusinessInstance);
  const healthChecks = getHealthChecks(rows);
  const hasAnyWork = businessInstances.length > 0 || healthChecks.length > 0;

  return (
    <>
      <Navbar authed email={user.email} />
      <main className="container-page py-8 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">Your dashboard</h1>
            <p className="mt-1 text-ink-500">
              {businessInstances.length} business instance
              {businessInstances.length === 1 ? "" : "s"} · {healthChecks.length} health check
              {healthChecks.length === 1 ? "" : "s"}
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

        {!hasAnyWork ? <EmptyState /> : null}

        {businessInstances.length > 0 ? (
          <section className="mt-8">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-ink-900">Business instances</h2>
                <p className="mt-1 text-sm text-ink-500">
                  Setup checklist workspaces opened by the user.
                </p>
              </div>
            </div>
            <div className="grid gap-5">
              {businessInstances.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          </section>
        ) : null}

        {healthChecks.length > 0 ? (
          <section className="mt-10">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-ink-900">Health checks</h2>
                <p className="mt-1 text-sm text-ink-500">
                  Compliance audits stay separate from business setup instances.
                </p>
              </div>
              <Link href="/healthcheck" className="btn-secondary">
                + Run another audit
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {healthChecks.map((item) => (
                <HealthCheckCard key={item.report.id} item={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}
