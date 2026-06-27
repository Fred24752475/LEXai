import { Suspense } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { AuthForm } from "@/components/AuthForm";

export const metadata = {
  title: "Log in — LexGH",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen">
      <div className="header-bar">
        <Logo href="/" />
      </div>

      <div className="container-page flex flex-col items-center justify-center py-10 sm:py-16">
        <div className="w-full max-w-md">
          <Suspense
            fallback={
              <div className="card h-[480px] animate-pulse bg-slate-50" />
            }
          >
            <AuthForm />
          </Suspense>

          <p className="mt-6 text-center text-sm text-ink-500">
            By continuing you agree to use LexGH guidance as informational
            support, not legal advice.{" "}
            <Link href="/" className="font-medium text-brand-700 hover:underline">
              Back home
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
