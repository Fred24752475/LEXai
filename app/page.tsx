import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";

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
        <section className="container-page py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              Powered by live AI web search
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              Stay compliant with Ghana&apos;s business laws,{" "}
              <span className="text-brand-600">without the guesswork</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-700">
              LexGH generates personalised compliance checklists and visual health
              checks for Ghanaian entrepreneurs and SMEs, using up-to-date rules
              from the ORC, GRA, SSNIT and more.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href={ctaHref} className="btn-primary px-6 py-3 text-base">
                Get started free
              </Link>
              <Link
                href={authed ? "/setup" : "/login"}
                className="btn-secondary px-6 py-3 text-base"
              >
                Start setup wizard
              </Link>
            </div>
            <p className="mt-4 text-sm text-ink-500">
              No credit card. Informational guidance for Ghanaian businesses.
            </p>
          </div>
        </section>

        {/* Two products */}
        <section className="container-page pb-8">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="card p-7">
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
              <h2 className="mt-4 text-xl font-bold text-ink-900">
                Business Setup Checklist
              </h2>
              <p className="mt-2 text-ink-700">
                Answer five quick questions and get an ordered, step-by-step
                registration checklist with current fees, timelines and the exact
                documents you need.
              </p>
              <Link
                href={authed ? "/setup" : "/login?redirectedFrom=/setup"}
                className="mt-5 inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:underline"
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
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="card p-7">
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
              <h2 className="mt-4 text-xl font-bold text-ink-900">
                Compliance Health Check
              </h2>
              <p className="mt-2 text-ink-700">
                Describe your existing business and get a visual compliance score,
                a colour-coded audit across key areas, and a ranked list of
                priority actions to fix gaps.
              </p>
              <Link
                href={
                  authed ? "/healthcheck" : "/login?redirectedFrom=/healthcheck"
                }
                className="mt-5 inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:underline"
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
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="container-page py-14">
          <h2 className="text-center text-2xl font-bold text-ink-900">
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
                body: "Grok pulls current Ghanaian regulations and fees from official authorities in real time.",
              },
              {
                step: "3",
                title: "Get a clear, saved report",
                body: "Receive a structured, printable checklist or audit, saved to your dashboard.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">
                  {item.step}
                </span>
                <h3 className="mt-4 font-semibold text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm text-ink-700">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container-page pb-20">
          <div className="card overflow-hidden bg-gradient-to-r from-brand-600 to-brand-700 p-10 text-center text-white">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to get compliant?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-brand-50">
              Create a free account and generate your first compliance report in
              under a minute.
            </p>
            <Link
              href={ctaHref}
              className="btn mt-6 bg-white px-6 py-3 text-base font-semibold text-brand-700 hover:bg-brand-50"
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
