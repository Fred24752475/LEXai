export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { AppShell } from "@/components/shell";
import { ReportRenderer } from "@/components/report-renderer";
import { PrintButton } from "@/components/print-button";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { ComplianceReport } from "@/lib/types";

type ReportWithBusiness = Pick<
  ComplianceReport,
  "id" | "report_type" | "score" | "created_at" | "data"
> & {
  businesses: { name: string; type: string } | { name: string; type: string }[] | null;
};

export default async function ReportPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase
    .from("compliance_reports")
    .select("id, report_type, score, created_at, data, businesses(name, type)")
    .eq("id", params.id)
    .single();

  if (!data) notFound();

  const report = data as unknown as ReportWithBusiness;
  const business = Array.isArray(report.businesses) ? report.businesses[0] : report.businesses;

  return (
    <AppShell>
      <div className="print-page">
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">Saved report</p>
            <h1 className="mt-2 text-3xl font-black text-ink">
              {business?.name ?? "Compliance report"}
            </h1>
            <p className="mt-1 text-slate-500">{formatDate(report.created_at)}</p>
          </div>
          <PrintButton />
        </div>
        <ReportRenderer type={report.report_type} data={report.data} />
      </div>
    </AppShell>
  );
}
