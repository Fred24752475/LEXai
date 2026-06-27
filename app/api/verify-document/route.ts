import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const verifySchema = z.object({
  reportId: z.string().uuid(),
  stepIndex: z.number().int().min(0),
  itemTitle: z.string().min(2),
  authority: z.string().min(2),
  requiredDocuments: z.array(z.string()).default([]),
  verificationKind: z.enum(["checklist_step", "health_action"]).default("checklist_step")
});

const successMessages = [
  "Verified successfully. The submitted document record matches the simulated government registry check.",
  "Confirmed. Registry lookup returned a valid match for this compliance item.",
  "Verification passed. The agency record appears active and consistent with the provided documents."
];

const failureMessages = [
  "Verification failed. The simulated registry could not confirm one or more required documents.",
  "Verification declined. The agency record appears incomplete or pending review.",
  "Unable to verify. A required document may be missing, expired, or not yet reflected in the agency database."
];

function pick(items: string[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export async function POST(request: Request) {
  try {
    const payload = verifySchema.parse(await request.json());
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: report, error: reportError } = await supabase
      .from("compliance_reports")
      .select("id, businesses!inner(user_id)")
      .eq("id", payload.reportId)
      .eq("businesses.user_id", user.id)
      .maybeSingle();

    if (reportError) throw reportError;
    if (!report) {
      return NextResponse.json({ error: "Report not found for this user." }, { status: 404 });
    }

    // Hackathon simulation: most checks pass, but some fail to demo real-world uncertainty.
    const verified = Math.random() < 0.68;
    const status = verified ? "verified" : "failed";
    const message = verified ? pick(successMessages) : pick(failureMessages);

    const { data: verification, error: saveError } = await supabase
      .from("document_verifications")
      .upsert(
        {
          report_id: payload.reportId,
          user_id: user.id,
          verification_kind: payload.verificationKind,
          step_index: payload.stepIndex,
          item_title: payload.itemTitle,
          authority: payload.authority,
          required_documents: payload.requiredDocuments,
          status,
          message,
          checked_at: new Date().toISOString()
        },
        { onConflict: "report_id,user_id,verification_kind,step_index" }
      )
      .select("id, status, message, checked_at")
      .single();

    if (saveError) throw saveError;

    return NextResponse.json({ verification });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to verify document right now.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
