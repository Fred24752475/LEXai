"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "./Logo";
import { Spinner } from "./Spinner";

interface NavbarProps {
  email?: string | null;
  authed?: boolean;
}

export function Navbar({ email, authed = false }: NavbarProps) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md no-print">
      <div className="container-page flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
        <Logo href={authed ? "/dashboard" : "/"} />

        {authed ? (
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <Link
              href="/dashboard"
              className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-brand-50 hover:text-brand-700 sm:bg-transparent sm:px-0 sm:py-0 sm:text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-brand-50 hover:text-brand-700 sm:bg-transparent sm:px-0 sm:py-0 sm:text-sm"
            >
              Profile
            </Link>
            <Link
              href="/frustrated"
              className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100 hover:bg-brand-100 sm:text-sm"
            >
              LexAI
            </Link>
            {email ? (
              <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-ink-700 md:inline">
                {email}
              </span>
            ) : null}
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="btn-secondary px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm"
            >
              {signingOut ? <Spinner className="h-4 w-4" /> : null}
              Sign out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn-ghost">
              Log in
            </Link>
            <Link href="/login?mode=signup" className="btn-primary">
              Get started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
