import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------
export const sourceSchema = z.object({
  title: z.string(),
  url: z.string(),
});
export type Source = z.infer<typeof sourceSchema>;

export const priorityEnum = z.enum(["high", "medium", "low"]);
export type Priority = z.infer<typeof priorityEnum>;

// ---------------------------------------------------------------------------
// Checklist (Business Setup Wizard output)
// ---------------------------------------------------------------------------
export const checklistStepSchema = z.object({
  title: z.string(),
  authority: z.string(), // e.g. "ORC", "GRA", "SSNIT", "Municipal Assembly"
  description: z.string(),
  estimatedCost: z.string(), // human-readable, e.g. "GHS 230" or "Free"
  estimatedTimeline: z.string(), // e.g. "1-3 business days"
  requiredDocuments: z.array(z.string()),
  officialLink: z.string().optional().default(""),
  priority: priorityEnum,
});
export type ChecklistStep = z.infer<typeof checklistStepSchema>;

export const checklistSchema = z.object({
  businessName: z.string(),
  businessType: z.string(),
  summary: z.string(),
  steps: z.array(checklistStepSchema).min(1),
  totalEstimatedCost: z.string(),
  sources: z.array(sourceSchema).default([]),
});
export type Checklist = z.infer<typeof checklistSchema>;

// ---------------------------------------------------------------------------
// Health Check (Compliance audit output)
// ---------------------------------------------------------------------------
export const categoryStatusEnum = z.enum(["compliant", "warning", "critical"]);
export type CategoryStatus = z.infer<typeof categoryStatusEnum>;

export const healthCategorySchema = z.object({
  name: z.string(),
  status: categoryStatusEnum,
  detail: z.string(),
});
export type HealthCategory = z.infer<typeof healthCategorySchema>;

export const priorityActionSchema = z.object({
  title: z.string(),
  description: z.string(),
  urgency: priorityEnum,
  authority: z.string(),
});
export type PriorityAction = z.infer<typeof priorityActionSchema>;

export const healthCheckSchema = z.object({
  businessName: z.string(),
  score: z.number().int().min(0).max(100),
  grade: z.string(), // e.g. "B+", "Needs attention"
  summary: z.string(),
  categories: z.array(healthCategorySchema).min(1),
  priorityActions: z.array(priorityActionSchema).default([]),
  sources: z.array(sourceSchema).default([]),
});
export type HealthCheck = z.infer<typeof healthCheckSchema>;
