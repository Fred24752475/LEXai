import { NextResponse } from "next/server";
import { z } from "zod";
import { generateHealthCheck } from "@/lib/grok";
import { createClient } from "@/lib/supabase/server";

const healthcheckSchema = z.object({
  businessName: z.string().min(2),
  description: z.string().min(20)
});

export async function POST(request: Request) {
  try {
    const payload = healthcheckSchema.parse(await request.json());
    const supabase = createClient();
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const audit = await generateHealthCheck(payload);

    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .insert({
        user_id: user.id,
        name: payload.businessName,
        type: "existing"
      })
      .select("id")
      .single();

    if (businessError) throw businessError;

    const { data: report, error: reportError } = await supabase
      .from("compliance_reports")
      .insert({
        business_id: business.id,
        report_type: "healthcheck",
        score: audit.score,
        data: audit
      })
      .select("id")
      .single();

    if (reportError) throw reportError;

    return NextResponse.json({ reportId: report.id, data: audit });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate health check.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
