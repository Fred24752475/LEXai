import OpenAI from "openai";
import { z } from "zod";

// xAI Grok is accessed through the OpenAI SDK by pointing at the xAI base URL.
// We use the Responses API (`responses.create`) together with the built-in
// `web_search` tool so Grok pulls current Ghanaian regulations and fees live.
// (xAI's old Live Search `search_parameters` API is deprecated -> 410.)
export const GROK_MODEL = "grok-4.3";

let client: OpenAI | null = null;

export function getGrokClient(): OpenAI {
  if (!process.env.XAI_API_KEY) {
    throw new Error(
      "XAI_API_KEY is not set. Add it to .env.local (see .env.local.example)."
    );
  }
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.XAI_API_KEY,
      baseURL: "https://api.x.ai/v1",
    });
  }
  return client;
}

// Pull the plain-text model output out of a Responses API result, tolerating
// SDK version differences.
function extractText(response: unknown): string {
  const r = response as {
    output_text?: string;
    output?: Array<{
      type?: string;
      content?: Array<{ type?: string; text?: string }>;
    }>;
  };

  if (typeof r.output_text === "string" && r.output_text.trim()) {
    return r.output_text;
  }

  let text = "";
  for (const item of r.output ?? []) {
    for (const part of item.content ?? []) {
      if (typeof part.text === "string") text += part.text;
    }
  }
  return text;
}

// Grok sometimes wraps JSON in ```json fences or adds prose. Pull out the JSON.
function cleanJson(raw: string): string {
  let text = raw.trim();

  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    text = text.slice(firstBrace, lastBrace + 1);
  }

  return text;
}

interface RunGrokOptions<T> {
  system: string;
  user: string;
  schema: z.ZodType<T>;
}

type GrokMessage = { role: "system" | "user" | "assistant"; content: string };

// Calls Grok with web_search enabled, expects strict JSON back, validates it
// against the provided Zod schema, and retries once with a repair prompt.
export async function runGrokJson<T>({
  system,
  user,
  schema,
}: RunGrokOptions<T>): Promise<T> {
  const grok = getGrokClient();

  async function call(input: GrokMessage[]): Promise<string> {
    const response = await grok.responses.create({
      model: GROK_MODEL,
      input: input as never,
      tools: [{ type: "web_search" }] as never,
    });
    return extractText(response);
  }

  const baseInput: GrokMessage[] = [
    { role: "system", content: system },
    { role: "user", content: user },
  ];

  const firstRaw = await call(baseInput);

  const tryParse = (raw: string): T | null => {
    try {
      const parsed = JSON.parse(cleanJson(raw));
      const result = schema.safeParse(parsed);
      return result.success ? result.data : null;
    } catch {
      return null;
    }
  };

  const first = tryParse(firstRaw);
  if (first) return first;

  // Repair pass: feed the broken output back and demand clean JSON only.
  const repairRaw = await call([
    ...baseInput,
    { role: "assistant", content: firstRaw.slice(0, 6000) },
    {
      role: "user",
      content:
        "Your previous response was not valid JSON matching the required schema. " +
        "Respond again with ONLY the corrected, complete, minified JSON object. " +
        "No prose, no markdown fences.",
    },
  ]);

  const repaired = tryParse(repairRaw);
  if (repaired) return repaired;

  throw new Error("Grok did not return valid structured data. Please try again.");
}
