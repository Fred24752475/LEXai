import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { DocumentVerificationButton, type VerificationState } from "@/components/DocumentVerificationButton";
import { checklistSchema, healthCheckSchema } from "@/lib/schemas";

export const metadata = { title: "Business — LexGH" };
export const dynamic = "force-dynamic";

interface ReportRow {
  id: string;
  report_type: "checklist" | "healthcheck";
  score: number | null;
  created_at: string;
  data: unknown;
}

interface UrgentItem {
  title: string;
  authority: string;
  description: string;
  reportId: string;
}

interface ChecklistVerificationItem {
  reportId: string;
  stepIndex: number;
  title: string;
  authority: string;
  description: string;
  requiredDocuments: string[];
}

interface VerificationRow {
  id: string;
  report_id: string;
  verification_kind: "checklist_step" | "health_action";
  step_index: number;
  status: "verified" | "failed";
  message: string;
  checked_at: string;
}

interface AuthorityStatus {
  key: string;
  label: string;
  status: "compliant" | "warning" | "critical" | "unknown";
  reportId: string | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
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

function collectUrgentItems(reports: ReportRow[]): UrgentItem[] {
  const items: UrgentItem[] = [];
  for (const report of reports) {
    if (report.report_type === "checklist") {
      const d = checklistSchema.safeParse(report.data);
      if (d.success) {
        for (const step of d.data.steps) {
          if (step.priority === "high") {
            items.push({ title: step.title, authority: step.authority, description: step.description, reportId: report.id });
          }
        }
      }
    } else if (report.report_type === "healthcheck") {
      const d = healthCheckSchema.safeParse(report.data);
      if (d.success) {
        for (const action of d.data.priorityActions) {
          items.push({ title: action.title, authority: action.authority, description: action.description, reportId: report.id });
        }
      }
    }
  }
  return items;
}

function collectChecklistVerificationItems(reports: ReportRow[]): ChecklistVerificationItem[] {
  const items: ChecklistVerificationItem[] = [];

  for (const report of reports) {
    if (report.report_type !== "checklist") continue;
    const parsed = checklistSchema.safeParse(report.data);
    if (!parsed.success) continue;

    parsed.data.steps.forEach((step, index) => {
      items.push({
        reportId: report.id,
        stepIndex: index,
        title: step.title,
        authority: step.authority,
        description: step.description,
        requiredDocuments: step.requiredDocuments
      });
    });
  }

  return items;
}

function verificationKey(reportId: string, kind: "checklist_step" | "health_action", stepIndex: number) {
  return `${reportId}:${kind}:${stepIndex}`;
}

const AUTHORITY_CONFIG = [
  { key: "gra", label: "Tax (GRA)", terms: ["gra", "tax", "revenue"] },
  { key: "orc", label: "Registration (ORC)", terms: ["orc", "registration", "registrar of companies"] },
  { key: "ssnit", label: "Labour (SSNIT)", terms: ["ssnit", "labour", "social security", "pension"] },
];

function getComplianceStatuses(reports: ReportRow[]): AuthorityStatus[] {
  const sorted = [...reports].filter(r => r.report_type === "healthcheck" && r.data != null)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  return AUTHORITY_CONFIG.map(cfg => {
    for (const report of sorted) {
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

export default async function BusinessPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirectedFrom=/business/${params.id}`);

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, type, created_at, compliance_reports(id, report_type, score, created_at, data)")
    .eq("id", params.id)
    .maybeSingle();

  if (!business) notFound();

  const reports = (business.compliance_reports ?? []) as ReportRow[];
  const urgentItems = collectUrgentItems(reports);
  const checklistVerificationItems = collectChecklistVerificationItems(reports);
  const complianceStatuses = getComplianceStatuses(reports);
  const reportIds = reports.map((report) => report.id);
  const { data: verifications } = reportIds.length
    ? await supabase
        .from("document_verifications")
        .select("id, report_id, verification_kind, step_index, status, message, checked_at")
        .in("report_id", reportIds)
    : { data: [] };
  const verificationMap = new Map(
    ((verifications ?? []) as VerificationRow[]).map((verification) => [
      verificationKey(
        verification.report_id,
        verification.verification_kind,
        verification.step_index
      ),
      {
        id: verification.id,
        status: verification.status,
        message: verification.message,
        checked_at: verification.checked_at
      } satisfies VerificationState
    ])
  );

  return (
    <>
      <Navbar authed email={user.email} />
      <main className="container-page py-8 sm:py-12">
        <div className="mb-6 no-print">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to dashboard
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 21h18" /><path d="M5 21V7l8-4v18" /><path d="M19 21V11l-6-4" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl font-bold text-ink-900">{business.name}</h1>
              <p className="text-sm text-ink-500">
                {business.type === "new" ? "New business" : "Existing business"} · added {formatDate(business.created_at)} · {reports.length} report{reports.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 no-print">
            <Link href="/setup" className="btn-primary">+ New checklist</Link>
            <Link href="/healthcheck" className="btn-secondary">+ Health check</Link>
          </div>
        </div>

        {urgentItems.length > 0 ? (
          <section className="mt-8 animate-fade-up">
            <div className="mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500" aria-hidden="true">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <h2 className="text-lg font-bold text-ink-900">Urgent items</h2>
              <span className="chip bg-red-50 text-red-700 ring-1 ring-inset ring-red-100">{urgentItems.length}</span>
            </div>
            <div className="space-y-2">
              {urgentItems.map((item, i) => (
                <Link key={i} href={`/report/${item.reportId}`} className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/40 px-4 py-3 transition hover:border-red-300 hover:bg-red-50">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-red-500" aria-hidden="true">
                    <path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-ink-900">{item.title}</span>
                      <span className="badge-authority">{item.authority}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-ink-500">{item.description.slice(0, 120)}{item.description.length > 120 ? "…" : ""}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {checklistVerificationItems.length > 0 ? (
          <section className="mt-8 animate-fade-up">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-ink-900">Document verification</h2>
                <p className="mt-1 text-sm text-ink-500">
                  Mark completed requirements and simulate a government database confirmation.
                </p>
              </div>
              <span className="chip bg-slate-50 text-ink-600 ring-1 ring-inset ring-slate-200">
                Demo registry check
              </span>
            </div>
            <div className="space-y-3">
              {checklistVerificationItems.map((item) => (
                <div
                  key={`${item.reportId}-${item.stepIndex}`}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-ink-900">{item.title}</h3>
                        <span className="badge-authority">{item.authority}</span>
                      </div>
                      <p className="mt-1 text-sm text-ink-500">
                        {item.description.length > 140
                          ? `${item.description.slice(0, 140)}…`
                          : item.description}
                      </p>
                      {item.requiredDocuments.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.requiredDocuments.map((document) => (
                            <span
                              key={document}
                              className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs text-ink-700 ring-1 ring-inset ring-slate-200"
                            >
                              {document}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <DocumentVerificationButton
                    reportId={item.reportId}
                    stepIndex={item.stepIndex}
                    itemTitle={item.title}
                    authority={item.authority}
                    requiredDocuments={item.requiredDocuments}
                    initialVerification={
                      verificationMap.get(
                        verificationKey(item.reportId, "checklist_step", item.stepIndex)
                      ) ?? null
                    }
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {reports.length > 0 ? (
          <section className="mt-8 animate-scale-in">
            <h2 className="mb-4 text-lg font-bold text-ink-900">Compliance overview</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {complianceStatuses.map(cs => {
                const m = STATUS_META[cs.status];
                return (
                  <Link key={cs.key} href={cs.reportId ? `/report/${cs.reportId}` : "#"} className={`card flex items-center gap-3 p-4 ring-1 ring-inset transition hover:shadow-sm ${m.ring} ${m.bg}`}>
                    <span className={`h-3 w-3 shrink-0 rounded-full ${m.dot}`} />
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{cs.label}</p>
                      <p className="text-xs text-ink-500">{m.label}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-ink-900">Reports</h2>
          {reports.length === 0 ? (
            <div className="card flex flex-col items-center p-10 text-center">
              <p className="text-ink-500">No reports for this business yet.</p>
              <div className="mt-4 flex gap-3">
                <Link href="/setup" className="btn-primary">Run setup wizard</Link>
                <Link href="/healthcheck" className="btn-secondary">Run health check</Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.sort((a, b) => b.created_at.localeCompare(a.created_at)).map(r => {
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
                  <Link key={r.id} href={`/report/${r.id}`} className="block rounded-xl border border-slate-200 px-5 py-4 transition hover:border-brand-300 hover:bg-brand-50/40">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-3">
                        <span className="badge-authority">{r.report_type === "checklist" ? "Setup Checklist" : "Health Check"}</span>
                        <span className="text-sm text-ink-500">{formatDate(r.created_at)}</span>
                      </span>
                      <span className="flex items-center gap-3">
                        {r.report_type === "healthcheck" && r.score !== null ? (
                          <span className={`chip ring-1 ring-inset ${scoreColor(r.score)}`}>Score {r.score}</span>
                        ) : null}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-300" aria-hidden="true">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </span>
                    </div>
                    {(preview.summary || stepCount !== undefined || grade !== undefined) ? (
                      <div className="mt-2 flex items-start gap-3">
                        {preview.summary ? (
                          <p className="min-w-0 flex-1 text-xs text-ink-500 line-clamp-2">
                            {preview.summary.length > 100 ? `${preview.summary.slice(0, 100)}…` : preview.summary}
                          </p>
                        ) : null}
                        <span className="flex shrink-0 items-center gap-2">
                          {stepCount !== undefined ? (
                            <span className="chip bg-slate-50 text-ink-600 ring-1 ring-inset ring-slate-200">{stepCount} step{stepCount === 1 ? "" : "s"}</span>
                          ) : null}
                          {grade !== undefined ? (
                            <span className={`chip ring-1 ring-inset ${r.score !== null ? scoreColor(r.score) : "text-ink-600 bg-slate-50 ring-slate-200"}`}>{grade}</span>
                          ) : null}
                        </span>
                      </div>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
