import Link from "next/link";
import { Scale } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-cloud">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3 font-bold text-ink">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-leaf">
            <Scale size={21} />
          </span>
          LexGH
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium">
          <Link href="/login" className="rounded-xl px-4 py-2 text-slate-600 hover:bg-white">
            Login
          </Link>
          <Link href="/login" className="rounded-xl bg-ink px-4 py-2 text-white">
            Start free
          </Link>
        </nav>
      </header>
      {children}
    </main>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-cloud">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-3 font-bold text-ink">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-leaf">
              <Scale size={21} />
            </span>
            LexGH
          </Link>
          <nav className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Link className="rounded-xl px-3 py-2 hover:bg-slate-100" href="/dashboard">
              Dashboard
            </Link>
            <Link className="rounded-xl px-3 py-2 hover:bg-slate-100" href="/setup">
              Setup
            </Link>
            <Link className="rounded-xl px-3 py-2 hover:bg-slate-100" href="/healthcheck">
              Health check
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </main>
  );
}
