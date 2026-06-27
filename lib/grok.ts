import OpenAI from "openai";
import { z } from "zod";

export const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

let client: OpenAI | null = null;

export function getGrokClient(): OpenAI {
  if (!process.env.GROQ_API_KEY) {
    throw new Error(
      "GROQ_API_KEY is not set. Add it to .env.local (see .env.local.example)."
    );
  }
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  return client;
}

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

// Calls Groq to generate structured JSON, validates against a Zod schema,
// and retries once with a repair prompt if parsing fails.
export async function runGrokJson<T>({
  system,
  user,
  schema,
}: RunGrokOptions<T>): Promise<T> {
  const grok = getGrokClient();

  async function call(messages: { role: "system" | "user" | "assistant"; content: string }[]): Promise<string> {
    const response = await grok.chat.completions.create({
      model: GROQ_MODEL,
      messages,
      temperature: 0.2,
      max_tokens: 4000,
    });
    return response.choices[0]?.message?.content || "";
  }

  const baseMessages = [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];

  const firstRaw = await call(baseMessages);

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

  const repairRaw = await call([
    ...baseMessages,
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

  throw new Error("Groq did not return valid structured data. Please try again.");
}

export async function runGrokText({
  system,
  messages,
}: {
  system: string;
  messages: { role: "user" | "assistant"; content: string }[];
}): Promise<string> {
  const grok = getGrokClient();
  const response = await grok.chat.completions.create({
    model: GROQ_MODEL,
    messages: [{ role: "system", content: system }, ...messages],
    temperature: 0.35,
    max_tokens: 1200,
  });

  return (
    response.choices[0]?.message?.content?.trim() ||
    "I could not generate a response right now. Please try again."
  );
}
