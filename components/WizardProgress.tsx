interface WizardProgressProps {
  current: number; // 0-indexed current step
  total: number;
}

export function WizardProgress({ current, total }: WizardProgressProps) {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-brand-700">
          Step {current + 1} of {total}
        </span>
        <span className="text-ink-500">{pct}% complete</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-brand-600 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
