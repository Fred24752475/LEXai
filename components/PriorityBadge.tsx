import type { Priority } from "@/lib/schemas";

const STYLES: Record<Priority, string> = {
  high: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-100",
  medium: "bg-gold-50 text-gold-600 ring-1 ring-inset ring-gold-200",
  low: "bg-slate-100 text-ink-700 ring-1 ring-inset ring-slate-200",
};

const LABELS: Record<Priority, string> = {
  high: "High priority",
  medium: "Medium",
  low: "Low",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={`chip ${STYLES[priority]}`}>{LABELS[priority]}</span>;
}
