import { Spinner } from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-brand-600">
        <Spinner className="h-8 w-8" />
        <p className="text-sm font-medium text-ink-500">Loading…</p>
      </div>
    </div>
  );
}
