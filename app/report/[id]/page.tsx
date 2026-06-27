import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { ComplianceChecklist } from "@/components/ComplianceChecklist";
import { HealthCheckReport } from "@/components/HealthCheckReport";
import { checklistSchema, healthCheckSchema } from "@/lib/schemas";

export const metadata = { title: "Report — LexGH" };
export const dynamic = "force-dynamic";

export default async function ReportPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/login?redirectedFrom=/report/${params.id}`);

  const { data: report } = await supabase
    .from("compliance_reports")
    .select("id, report_type, data, created_at")
    .eq("id", params.id)
    .maybeSingle();

  if (!report) notFound();

  return (
    <>
      <Navbar authed email={user.email} />
      <main className="container-page print-full py-8 sm:py-10">
        <div className="mb-6 no-print">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-700"
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
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to dashboard
          </Link>
        </div>

        <ReportBody type={report.report_type} data={report.data} />
      </main>
    </>
  );
}

function ReportBody({ type, data }: { type: string; data: unknown }) {
  if (type === "checklist") {
    const parsed = checklistSchema.safeParse(data);
    if (parsed.success) return <ComplianceChecklist data={parsed.data} />;
  }
  if (type === "healthcheck") {
    const parsed = healthCheckSchema.safeParse(data);
    if (parsed.success) return <HealthCheckReport data={parsed.data} />;
  }
  return (
    <div className="card p-8 text-center">
      <p className="text-ink-700">
        This report could not be displayed. The stored data may be incomplete.
      </p>
    </div>
  );
}
