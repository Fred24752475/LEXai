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
      <div className="container-page flex h-16 items-center justify-between">
        <Logo href={authed ? "/dashboard" : "/"} />

        {authed ? (
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden text-sm font-medium text-ink-700 hover:text-brand-700 sm:block"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="hidden text-sm font-medium text-ink-700 hover:text-brand-700 sm:block"
            >
              Profile
            </Link>
            {email ? (
              <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-ink-700 md:inline">
                {email}
              </span>
            ) : null}
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="btn-secondary"
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
