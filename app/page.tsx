import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { AnimatedDemo } from "@/components/AnimatedDemo";

export const dynamic = "force-dynamic";

function FeatureIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
      {children}
    </span>
  );
}

export default async function LandingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const authed = !!user;
  const ctaHref = authed ? "/dashboard" : "/login?mode=signup";

  return (
    <>
      <Navbar authed={authed} email={user?.email} />

      <main>
        {/* Hero */}
        <section className="container-page py-16 sm:py-24 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/80 backdrop-blur-md shadow-sm px-4 py-1.5 text-sm font-medium text-brand-700">
              <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              Powered by live AI web search
            </span>
            <h1 className="mt-6 font-heading text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
              Stay compliant with Ghana&apos;s business laws,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">without the guesswork</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 font-medium leading-relaxed">
              LexGH generates personalised compliance checklists and visual health
              checks for Ghanaian entrepreneurs and SMEs, using up-to-date rules
              from the ORC, GRA, SSNIT and more.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href={ctaHref} className="btn-primary">
                Get started free
              </Link>
              <Link
                href={authed ? "/setup" : "/login"}
                className="btn-secondary"
              >
                Start setup wizard
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              No credit card. Informational guidance for Ghanaian businesses.
            </p>
          </div>

          {/* Animated App Flow Demo */}
          <AnimatedDemo />
        </section>

        {/* Two products */}
        <section className="container-page pb-8 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="card p-7 hover:-translate-y-1 transition-all duration-300 ease-out hover:shadow-lg">
              <FeatureIcon>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </FeatureIcon>
              <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight text-slate-900">
                Business Setup Checklist
              </h2>
              <p className="mt-2 text-slate-600 font-medium leading-relaxed">
                Answer five quick questions and get an ordered, step-by-step
                registration checklist with current fees, timelines and the exact
                documents you need.
              </p>
              <Link
                href={authed ? "/setup" : "/login?redirectedFrom=/setup"}
                className="mt-5 inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-500 transition-colors duration-200"
              >
                Build my checklist
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="card p-7 hover:-translate-y-1 transition-all duration-300 ease-out hover:shadow-lg">
              <FeatureIcon>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </FeatureIcon>
              <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight text-slate-900">
                Compliance Health Check
              </h2>
              <p className="mt-2 text-slate-600 font-medium leading-relaxed">
                Describe your existing business and get a visual compliance score,
                a colour-coded audit across key areas, and a ranked list of
                priority actions to fix gaps.
              </p>
              <Link
                href={
                  authed ? "/healthcheck" : "/login?redirectedFrom=/healthcheck"
                }
                className="mt-5 inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-500 transition-colors duration-200 group"
              >
                Run a health check
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="container-page py-14 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <h2 className="text-center font-heading text-4xl font-bold tracking-tight text-slate-900">
            How LexGH works
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Tell us about your business",
                body: "Use the guided wizard or describe your existing operation in a few sentences.",
              },
              {
                step: "2",
                title: "AI searches the live web",
                body: "Lex AI pulls current Ghanaian regulations and fees from official authorities in real time.",
              },
              {
                step: "3",
                title: "Get a clear, saved report",
                body: "Receive a structured, printable checklist or audit, saved to your dashboard.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 shadow-[0_4px_14px_rgba(74,143,100,0.3)] text-lg font-bold text-white">
                  {item.step}
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-base text-slate-600 font-medium leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container-page pb-20 animate-fade-up" style={{ animationDelay: "400ms" }}>
          <div className="card overflow-hidden bg-gradient-to-br from-brand-600 to-brand-800 p-10 text-center text-white shadow-xl shadow-brand-500/20">
            <h2 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
              Ready to get compliant?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-100 font-medium text-lg leading-relaxed">
              Create a free account and generate your first compliance report in
              under a minute.
            </p>
            <Link
              href={ctaHref}
              className="mt-8 inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-brand-700 transition-all duration-300 ease-out bg-white rounded-xl shadow-[0_8px_20px_rgba(255,255,255,0.25)] hover:shadow-[0_12px_25px_rgba(255,255,255,0.4)] hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get started free
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/70 py-8">
        <div className="container-page flex flex-col items-center justify-between gap-3 text-sm text-ink-500 sm:flex-row">
          <p>
            Lex<span className="font-semibold text-brand-600">GH</span> ·
            Compliance guidance for Ghanaian businesses
          </p>
          <p>Informational support, not legal advice.</p>
        </div>
      </footer>
    </>
  );
}
