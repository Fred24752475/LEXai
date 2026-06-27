import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { PublicShell } from "@/components/shell";

export default function LoginPage() {
  return (
    <PublicShell>
      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-[1fr_420px] md:items-center">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-leaf">
            Secure workspace
          </p>
          <h1 className="text-4xl font-black tracking-tight text-ink">
            Save every business profile and compliance report.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Sign in to generate Ghana-specific startup checklists, audit existing businesses and
            access saved reports from your dashboard.
          </p>
        </div>
        <Suspense>
          <AuthForm />
        </Suspense>
      </section>
    </PublicShell>
  );
}
