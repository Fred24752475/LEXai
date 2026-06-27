import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { runGrokJson } from "@/lib/grok";
import { checklistSchema } from "@/lib/schemas";
import { buildChecklistPrompts } from "@/lib/prompts";
import { WIZARD_QUESTIONS } from "@/lib/wizard";

export const runtime = "nodejs";
export const maxDuration = 120;

const requestSchema = z.object({
  businessName: z.string().trim().min(2).max(120),
  answers: z.record(z.string(), z.string()),
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
      { error: "Please provide a business name and answer all questions." },
      { status: 400 }
    );
  }

  const { businessName, answers } = parsed.data;

  // Ensure every wizard question was answered.
  const missing = WIZARD_QUESTIONS.find((q) => !answers[q.id]);
  if (missing) {
    return NextResponse.json(
      { error: "Please answer every step of the wizard." },
      { status: 400 }
    );
  }

  try {
    const { system, user: userPrompt } = buildChecklistPrompts(
      businessName,
      answers
    );

    const checklist = await runGrokJson({
      system,
      user: userPrompt,
      schema: checklistSchema,
    });

    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .insert({ user_id: user.id, name: businessName, type: "new" })
      .select("id")
      .single();

    if (businessError || !business) {
      throw new Error(businessError?.message ?? "Failed to save business.");
    }

    const { data: report, error: reportError } = await supabase
      .from("compliance_reports")
      .insert({
        business_id: business.id,
        report_type: "checklist",
        score: null,
        data: checklist,
      })
      .select("id")
      .single();

    if (reportError || !report) {
      throw new Error(reportError?.message ?? "Failed to save report.");
    }

    return NextResponse.json({ reportId: report.id, data: checklist });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
