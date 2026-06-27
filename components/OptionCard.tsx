"use client";

interface OptionCardProps {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionCard({
  label,
  description,
  selected,
  onClick,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group flex w-full items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
        selected
          ? "border-brand-500 bg-brand-50 shadow-card"
          : "border-slate-200 bg-white hover:border-brand-300 hover:shadow-card"
      }`}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
          selected
            ? "border-brand-600 bg-brand-600 text-white"
            : "border-slate-300 bg-white text-transparent group-hover:border-brand-400"
        }`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </span>
      <span>
        <span className="block font-semibold text-ink-900">{label}</span>
        <span className="mt-0.5 block text-sm text-ink-500">{description}</span>
      </span>
    </button>
  );
}
