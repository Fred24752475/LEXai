import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { runGrokJson } from "@/lib/grok";
import { healthCheckSchema } from "@/lib/schemas";
import { buildHealthCheckPrompts } from "@/lib/prompts";

export const runtime = "nodejs";
export const maxDuration = 120;

const requestSchema = z.object({
  businessName: z.string().trim().min(2).max(120),
  description: z.string().trim().min(20).max(4000),
});

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          "Please provide a business name and a description of at least 20 characters.",
      },
      { status: 400 }
    );
  }

  const { businessName, description } = parsed.data;

  try {
    const { system, user: userPrompt } = buildHealthCheckPrompts(
      businessName,
      description
    );

    const audit = await runGrokJson({
      system,
      user: userPrompt,
      schema: healthCheckSchema,
    });

    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .insert({ user_id: user.id, name: businessName, type: "existing" })
      .select("id")
      .single();

    if (businessError || !business) {
      throw new Error(businessError?.message ?? "Failed to save business.");
    }

    const { data: report, error: reportError } = await supabase
      .from("compliance_reports")
      .insert({
        business_id: business.id,
        report_type: "healthcheck",
        score: audit.score,
        data: audit,
      })
      .select("id")
      .single();

    if (reportError || !report) {
      throw new Error(reportError?.message ?? "Failed to save report.");
    }

    return NextResponse.json({ reportId: report.id, data: audit });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
