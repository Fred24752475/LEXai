import { NextResponse } from "next/server";
import { z } from "zod";
import { generateChecklist } from "@/lib/grok";
import { createClient } from "@/lib/supabase/server";

const setupSchema = z.object({
  businessName: z.string().min(2),
  sector: z.string().min(2),
  structure: z.string().min(2),
  employees: z.string().min(1),
  location: z.string().min(2),
  revenueStage: z.string().min(2)
});

export async function POST(request: Request) {
  try {
    const payload = setupSchema.parse(await request.json());
    const supabase = createClient();
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const checklist = await generateChecklist(payload);

    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .insert({
        user_id: user.id,
        name: payload.businessName,
        type: "new"
      })
      .select("id")
      .single();

    if (businessError) throw businessError;

    const { data: report, error: reportError } = await supabase
      .from("compliance_reports")
      .insert({
        business_id: business.id,
        report_type: "checklist",
        score: null,
        data: checklist
      })
      .select("id")
      .single();

    if (reportError) throw reportError;

    return NextResponse.json({ reportId: report.id, data: checklist });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate checklist.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
