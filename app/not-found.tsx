import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <div className="header-bar">
        <Logo href="/" />
      </div>
      <div className="container-page flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold text-ink-900">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-2 max-w-md text-ink-500">
          The page or report you&apos;re looking for doesn&apos;t exist or you
          may not have access to it.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/dashboard" className="btn-primary">
            Go to dashboard
          </Link>
          <Link href="/" className="btn-secondary">
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
