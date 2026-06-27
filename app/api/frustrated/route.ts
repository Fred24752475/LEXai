import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { runGrokText } from "@/lib/grok";

export const runtime = "nodejs";
export const maxDuration = 60;

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(5000)
});

const requestSchema = z.object({
  conversationId: z.string().uuid().optional().nullable(),
  messages: z.array(messageSchema).min(1).max(12),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        size: z.number(),
        textPreview: z.string().max(4000).optional()
      })
    )
    .max(5)
    .default([])
});

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user }
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
      { error: "Send a message and up to five supporting files." },
      { status: 400 }
    );
  }

  const attachmentContext = parsed.data.attachments.length
    ? `\n\nUploaded file context:\n${parsed.data.attachments
        .map(
          (file, index) =>
            `${index + 1}. ${file.name} (${file.type || "unknown type"}, ${Math.round(
              file.size / 1024
            )} KB)\n${file.textPreview ? `Extracted text preview: ${file.textPreview}` : "No text preview available. Ask the user for key details if needed."}`
        )
        .join("\n\n")}`
    : "";
  const latestUserMessage = parsed.data.messages
    .slice()
    .reverse()
    .find((message) => message.role === "user");

  if (!latestUserMessage) {
    return NextResponse.json({ error: "Send a user message first." }, { status: 400 });
  }

  try {
    let conversationId = parsed.data.conversationId ?? null;

    if (conversationId) {
      const { data: existing } = await supabase
        .from("lexai_conversations")
        .select("id")
        .eq("id", conversationId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (!existing) conversationId = null;
    }

    if (!conversationId) {
      const title = latestUserMessage.content.slice(0, 70) || "LexAI conversation";
      const { data: conversation, error: conversationError } = await supabase
        .from("lexai_conversations")
        .insert({ user_id: user.id, title })
        .select("id")
        .single();

      if (conversationError || !conversation) {
        throw new Error(conversationError?.message ?? "Could not create conversation.");
      }

      conversationId = conversation.id;
    }

    await supabase.from("lexai_messages").insert({
      conversation_id: conversationId,
      user_id: user.id,
      role: "user",
      content: latestUserMessage.content,
      attachments: parsed.data.attachments
    });

    const answer = await runGrokText({
      system: `You are LexAI, a calm real-time support assistant inside LexGH.
Help frustrated Ghanaian entrepreneurs solve compliance, business registration, tax, document, and app-flow problems.
Be practical, concise, reassuring, and action-oriented.
If the user uploaded files, use the file context carefully. Do not claim to have visually inspected images or PDFs unless extracted text is provided.
Always give the next 2-4 concrete actions. If legal certainty is needed, suggest verifying with ORC, GRA, SSNIT, the local assembly, or a qualified professional.${attachmentContext}`,
      messages: parsed.data.messages
    });

    await supabase.from("lexai_messages").insert({
      conversation_id: conversationId,
      user_id: user.id,
      role: "assistant",
      content: answer,
      attachments: []
    });

    await supabase
      .from("lexai_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId)
      .eq("user_id", user.id);

    return NextResponse.json({ answer, conversationId });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "LexAI could not respond right now.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
