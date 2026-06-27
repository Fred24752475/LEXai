import OpenAI from "openai";
import type { ChecklistData, HealthCheckData } from "@/lib/types";

const model = process.env.XAI_MODEL || "grok-4.3";

function getClient() {
  const apiKey = process.env.XAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing XAI_API_KEY environment variable.");
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://api.x.ai/v1"
  });
}

function extractJson(content: string) {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return JSON.parse(fenced ? fenced[1] : trimmed);
}

async function generateJson<T>(system: string, user: string): Promise<T> {
  const client = getClient();

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    // xAI live search uses OpenAI-compatible chat plus xAI-specific search parameters.
    search_parameters: {
      mode: "auto",
      sources: [{ type: "web" }]
    }
  } as any);

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Grok returned an empty response.");
  }

  return extractJson(content) as T;
}

const sharedRules = `
You are LexGH, a precise Ghana business compliance assistant for entrepreneurs and SMEs.
Use live web search before answering. Prefer current Ghana sources and agency sites such as ORC, GRA, SSNIT, Labour Department, Registrar-General's Department and Ghana.gov.
Do not invent citations. Put source names or URLs in sourceHint/sourcesToVerify fields.
Return only valid JSON. No markdown. No legal disclaimer paragraph.
`;

export async function generateChecklist(input: {
  businessName: string;
  sector: string;
  structure: string;
  employees: string;
  location: string;
  revenueStage: string;
}) {
  return generateJson<ChecklistData>(
    `${sharedRules}
Return JSON with this exact shape:
{
  "title": "string",
  "summary": "string",
  "assumptions": ["string"],
  "checklist": [
    {
      "category": "string",
      "priority": "High|Medium|Low",
      "action": "string",
      "agency": "string",
      "timeline": "string",
      "estimatedCostGHS": "string",
      "sourceHint": "string"
    }
  ],
  "documents": ["string"],
  "nextSteps": ["string"]
}`,
    `Create a personalised startup compliance checklist for a Ghanaian business:
Business name: ${input.businessName}
Sector: ${input.sector}
Legal structure preference: ${input.structure}
Employees: ${input.employees}
Location: ${input.location}
Revenue stage: ${input.revenueStage}

Include current registration, tax, employment and sector-specific obligations.`
  );
}

export async function generateHealthCheck(input: { businessName: string; description: string }) {
  return generateJson<HealthCheckData>(
    `${sharedRules}
Return JSON with this exact shape:
{
  "title": "string",
  "summary": "string",
  "score": 0,
  "riskLevel": "Low|Medium|High|Critical",
  "audit": [
    {
      "area": "string",
      "status": "Compliant|Needs attention|At risk|Unknown",
      "finding": "string",
      "priorityAction": "string",
      "agency": "string"
    }
  ],
  "priorityActions": ["string"],
  "sourcesToVerify": ["string"]
}`,
    `Audit this Ghanaian business for compliance gaps using current Ghana rules.
Business name: ${input.businessName}
Business description: ${input.description}

Score from 0 to 100. Evaluate ORC registration, GRA tax, VAT where relevant, SSNIT, employment, permits and industry obligations.`
  );
}
