import type { WizardAnswers } from "./wizard";

const COMMON_RULES = `You are LexGH, an expert advisor on Ghanaian business compliance and corporate law.
Use the web_search tool to find the most current, accurate requirements, fees, and procedures from official Ghanaian authorities such as:
- Office of the Registrar of Companies (ORC / former RGD)
- Ghana Revenue Authority (GRA)
- Social Security and National Insurance Trust (SSNIT)
- Ghana Investment Promotion Centre (GIPC), FDA, and relevant Municipal/District Assemblies.

Rules:
- Costs must be in Ghana Cedis (GHS) and reflect the latest figures you find.
- Prefer official .gov.gh or authority sources; include them in "sources".
- Be specific and actionable for Ghana. Do not invent fees; if uncertain, state a realistic range.
- Respond with ONLY a single valid, minified JSON object. No markdown, no code fences, no commentary.`;

export function buildChecklistPrompts(
  businessName: string,
  answers: WizardAnswers
) {
  const system = `${COMMON_RULES}

Output JSON schema:
{
  "businessName": string,
  "businessType": string,
  "summary": string,            // 1-2 sentences overview of the registration journey
  "steps": [
    {
      "title": string,
      "authority": string,      // short code/name e.g. "ORC", "GRA", "SSNIT", "Municipal Assembly"
      "description": string,    // what to do and why
      "estimatedCost": string,  // e.g. "GHS 230" or "Free"
      "estimatedTimeline": string, // e.g. "1-3 business days"
      "requiredDocuments": string[],
      "officialLink": string,   // official URL if known, else ""
      "priority": "high" | "medium" | "low"
    }
  ],
  "totalEstimatedCost": string, // total/range across steps
  "sources": [ { "title": string, "url": string } ]
}`;

  const user = `Create a complete, ordered Ghana business registration and compliance checklist for a NEW business.

Business name: ${businessName}
Business structure: ${answers.structure}
Sector: ${answers.industry}
Team size: ${answers.teamSize}
Primary region: ${answers.region}
Regulated activity: ${answers.regulated}

Search the web for the current ORC registration steps and fees for this structure, GRA TIN/tax registration, SSNIT employer registration (if there are employees), the relevant Municipal/District Assembly business operating permit for ${answers.region}, and any sector-specific licences for "${answers.industry}" / "${answers.regulated}". Order the steps in the sequence the entrepreneur should complete them.`;

  return { system, user };
}

export function buildHealthCheckPrompts(
  businessName: string,
  description: string
) {
  const system = `${COMMON_RULES}

You are auditing an EXISTING Ghanaian business for compliance. Evaluate the description, identify gaps, and assign an overall compliance score from 0-100 (higher is better).

Scoring guidance:
- 85-100: strong compliance, minor items only
- 60-84: mostly compliant with some gaps
- 40-59: significant gaps needing attention
- 0-39: critical non-compliance risk

Output JSON schema:
{
  "businessName": string,
  "score": number,             // integer 0-100
  "grade": string,             // short label e.g. "Strong", "Needs attention", "At risk"
  "summary": string,           // 2-3 sentence overall assessment
  "categories": [
    {
      "name": string,          // e.g. "Company Registration", "Tax (GRA)", "SSNIT", "Permits & Licences", "Employment"
      "status": "compliant" | "warning" | "critical",
      "detail": string         // what was found and what is missing
    }
  ],
  "priorityActions": [
    {
      "title": string,
      "description": string,   // specific step to fix the gap
      "urgency": "high" | "medium" | "low",
      "authority": string
    }
  ],
  "sources": [ { "title": string, "url": string } ]
}`;

  const user = `Audit this existing Ghanaian business for regulatory compliance. Search the web for the current obligations from ORC (annual returns/renewals), GRA (taxes, VAT thresholds, filing), SSNIT (employer contributions), and any sector permits implied by the description. Then assess each area.

Business name: ${businessName}
Business description:
"""
${description}
"""

Cover at least: Company Registration, Tax (GRA), SSNIT / Employees, and Permits & Licences. Be concrete about what is missing and how to fix it.`;

  return { system, user };
}
