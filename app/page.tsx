import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { AnimatedDemo } from "@/components/AnimatedDemo";
import { ScrollReveal } from "@/components/ScrollReveal";

export const dynamic = "force-dynamic";

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    ),
    title: "Live Web Research",
    body: "Lex AI searches official authority websites in real time — no outdated databases, always current fees and rules.",
    accent: "brand",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    title: "Step-by-Step Checklists",
    body: "Personalised registration checklists from the ORC, GRA, SSNIT and more — ordered by priority.",
    accent: "brand",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "Visual Compliance Score",
    body: "A colour-coded audit dashboard with a ranked list of priority actions to close compliance gaps fast.",
    accent: "amber",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      </svg>
    ),
    title: "Saved to Dashboard",
    body: "All your reports are securely stored. Revisit, share or print them anytime from your personal dashboard.",
    accent: "amber",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "ORC, GRA & SSNIT Coverage",
    body: "Covers all three key Ghanaian regulatory bodies under one roof so nothing falls through the cracks.",
    accent: "brand",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    title: "Print-Ready Reports",
    body: "Export clean, professional PDF-ready reports to share with your accountant, lawyer or co-founder.",
    accent: "amber",
  },
];

const steps = [
  {
    step: "01",
    title: "Tell us about your business",
    body: "Answer five quick questions through our guided wizard, or describe your existing operation in your own words.",
  },
  {
    step: "02",
    title: "Lex AI searches the live web",
    body: "Our AI pulls current Ghanaian regulations, fees, and requirements from official authorities in real time.",
  },
  {
    step: "03",
    title: "Get a clear, saved report",
    body: "Receive a structured, printable checklist or audit score — saved to your dashboard for future reference.",
  },
];

const authorities = [
  "ORC",
  "GRA",
  "SSNIT",
  "EPA",
  "GIPC",
  "FDA",
  "BoG",
  "NPA",
  "NCA",
  "GSA",
  "DPC",
  "NIC",
];

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

      <main className="overflow-hidden">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative container-page pt-20 pb-10 sm:pt-28 sm:pb-16">
          {/* Decorative orb */}
          <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-brand-400/10 blur-[120px]" />
          <div className="pointer-events-none absolute top-0 right-0 h-80 w-80 rounded-full bg-amber-400/8 blur-[100px]" />

          <div className="relative mx-auto max-w-4xl text-center animate-fade-up" style={{ animationDelay: "60ms" }}>
            <span className="section-label">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              Powered by Npontu Technologies
            </span>

            <h1 className="mt-7 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl leading-[1.06]">
              Stay compliant with{" "}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400">
                  Ghana&apos;s business laws,
                </span>
              </span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">
                without the guesswork
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-600 leading-relaxed">
              LexGH generates personalised compliance checklists and visual health
              checks for Ghanaian entrepreneurs and SMEs — powered by up-to-date
              intelligence from the ORC, GRA, SSNIT and more.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link href={ctaHref} className="btn-primary text-base px-8 py-3.5">
                Get started free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href={authed ? "/setup" : "/login"} className="btn-secondary text-base px-8 py-3.5">
                See how it works
              </Link>
            </div>

            <p className="mt-4 text-sm text-slate-400">
              No credit card required · Informational guidance for Ghanaian businesses
            </p>
          </div>

          {/* Stats row */}
          <ScrollReveal delay={100} direction="up" className="mt-14">
            <div className="mx-auto max-w-2xl grid grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-sm shadow-sm">
              {[
                { value: "10+", label: "Regulatory bodies" },
                { value: "< 60s", label: "To your first report" },
                { value: "Always", label: "Up-to-date guidance" },
              ].map((s) => (
                <div key={s.label} className="py-6 text-center">
                  <p className="text-3xl font-extrabold text-slate-900">{s.value}</p>
                  <p className="mt-1 text-sm text-slate-500 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* App demo */}
          <ScrollReveal delay={200} direction="zoom" className="mt-16">
            <AnimatedDemo />
          </ScrollReveal>
        </section>

        {/* ── Authority trust bar ───────────────────────────────────────── */}
        <ScrollReveal direction="fade">
          <section className="border-y border-slate-200/60 bg-white/50 py-6 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-y-4">
              <div className="relative z-10 flex-shrink-0 md:pr-8">
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Regulatory bodies covered
                </p>
              </div>
              <div className="authority-marquee group flex w-full md:flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
                <div className="authority-marquee__track flex shrink-0 items-center gap-x-8 pr-8">
                  {authorities.map((a) => (
                    <span
                      key={a}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-sm font-bold text-slate-700 shadow-sm hover:border-slate-300 transition-colors cursor-default"
                    >
                      {a}
                    </span>
                  ))}
                </div>
                <div aria-hidden="true" className="authority-marquee__track flex shrink-0 items-center gap-x-8 pr-8">
                  {authorities.map((a) => (
                    <span
                      key={`${a}-dup`}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-sm font-bold text-slate-700 shadow-sm hover:border-slate-300 transition-colors cursor-default"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Two products ─────────────────────────────────────────────── */}
        <section className="container-page py-24">
          <ScrollReveal direction="up" className="text-center mb-14">
            <span className="section-label">What Lex AI does</span>
            <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Two powerful tools,<br />one compliance platform
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
              Whether you&apos;re registering a new business or auditing an existing one,
              Lex AI has you covered.
            </p>
          </ScrollReveal>

          <div className="grid gap-6 md:grid-cols-2">
            <ScrollReveal direction="left" delay={0}>
              <div className="glass-grain group relative h-full overflow-hidden rounded-3xl border border-white/85 bg-white/60 p-8 shadow-[0_26px_80px_rgba(15,23,42,0.17),0_2px_0_rgba(255,255,255,0.98)_inset,0_-1px_0_rgba(15,23,42,0.1)_inset,0_0_0_1px_rgba(255,255,255,0.75)] backdrop-blur-2xl transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_34px_96px_rgba(56,114,79,0.26),0_2px_0_rgba(255,255,255,0.98)_inset,0_-1px_0_rgba(15,23,42,0.12)_inset,0_0_0_1px_rgba(255,255,255,0.85)] flex flex-col">
                <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 shadow-[0_0_20px_rgba(56,114,79,0.55)]" />
                <div className="pointer-events-none absolute inset-0 rounded-3xl">
                  <div className="absolute inset-0 rounded-3xl ring-1 ring-white/75" />
                  <div className="absolute inset-[1.5px] rounded-[1.35rem] border border-slate-200/45" />
                  <div className="absolute inset-[1.5px] rounded-[1.35rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(148,163,184,0.22)]" />
                </div>
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -top-20 -left-16 h-48 w-48 rounded-full bg-brand-200/50 blur-3xl" />
                  <div className="luxury-aurora absolute -bottom-24 left-[-8%] h-56 w-[70%] rounded-full bg-brand-300/30 blur-3xl opacity-55 transition-opacity duration-700 group-hover:opacity-80" />
                  <div className="luxury-aurora luxury-aurora-reverse absolute -bottom-28 right-[-10%] h-52 w-[62%] rounded-full bg-emerald-200/25 blur-3xl opacity-40 transition-opacity duration-700 group-hover:opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/38 to-white/22" />
                </div>
                <div className="relative z-10 mb-8 flex items-center justify-between gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-white/80 bg-white/80 text-brand-700 shadow-sm shadow-brand-100/60">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="5" y="3.5" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.75" />
                      <path d="M9 8.5h6M9 12h6M9 15.5H12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                      <circle cx="16.5" cy="16.5" r="3.25" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M15.4 16.5l.75.75 1.85-1.85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div className="h-1.5 w-16 rounded-full bg-brand-400/45 sm:w-20" />
                </div>
                <h2 className="relative z-10 mt-5 text-[1.85rem] font-bold tracking-tight text-slate-900">
                  Business Setup Checklist
                </h2>
                <p className="relative z-10 mt-3 flex-1 leading-relaxed text-slate-600">
                  Answer five quick questions and get an ordered, step-by-step
                  registration checklist with current fees, timelines and the exact
                  documents you need from the ORC, GRA, and SSNIT.
                </p>
                <ul className="relative z-10 mt-5 space-y-2">
                  {["Personalised to your business type", "Current fees & timelines", "Ordered priority actions"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border border-white/80 bg-brand-100/90 text-brand-700">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={authed ? "/setup" : "/login?redirectedFrom=/setup"}
                  className="group relative z-10 mt-7 inline-flex items-center gap-2 font-semibold text-brand-700 transition-colors duration-200 hover:text-brand-600"
                >
                  Build my checklist
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:translate-x-1">
                    <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={100}>
              <div className="glass-grain group relative h-full overflow-hidden rounded-3xl border border-white/85 bg-white/60 p-8 shadow-[0_26px_80px_rgba(15,23,42,0.17),0_2px_0_rgba(255,255,255,0.98)_inset,0_-1px_0_rgba(15,23,42,0.1)_inset,0_0_0_1px_rgba(255,255,255,0.75)] backdrop-blur-2xl transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_34px_96px_rgba(201,125,46,0.28),0_2px_0_rgba(255,255,255,0.98)_inset,0_-1px_0_rgba(15,23,42,0.12)_inset,0_0_0_1px_rgba(255,255,255,0.85)] flex flex-col">
                <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 shadow-[0_0_20px_rgba(201,125,46,0.55)]" />
                <div className="pointer-events-none absolute inset-0 rounded-3xl">
                  <div className="absolute inset-0 rounded-3xl ring-1 ring-white/75" />
                  <div className="absolute inset-[1.5px] rounded-[1.35rem] border border-slate-200/45" />
                  <div className="absolute inset-[1.5px] rounded-[1.35rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(148,163,184,0.22)]" />
                </div>
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -top-20 -right-16 h-48 w-48 rounded-full bg-amber-200/55 blur-3xl" />
                  <div className="luxury-aurora absolute -bottom-24 right-[-8%] h-56 w-[70%] rounded-full bg-amber-300/30 blur-3xl opacity-55 transition-opacity duration-700 group-hover:opacity-80" />
                  <div className="luxury-aurora luxury-aurora-reverse absolute -bottom-28 left-[-10%] h-52 w-[62%] rounded-full bg-yellow-200/25 blur-3xl opacity-40 transition-opacity duration-700 group-hover:opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/38 to-white/22" />
                </div>
                <div className="relative z-10 mb-8 flex items-center justify-between gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-white/80 bg-white/80 text-amber-700 shadow-sm shadow-amber-100/60">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M5 14.5a7 7 0 0 1 14 0"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                      />
                      <path
                        d="M8.25 14.5A3.75 3.75 0 0 1 12 10.75"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                      />
                      <path
                        d="M12 14.5V11.25"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                      />
                      <circle cx="12" cy="14.5" r="1.25" fill="currentColor" />
                      <path d="M7.5 17.5h9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div className="h-1.5 w-16 rounded-full bg-amber-400/45 sm:w-20" />
                </div>
                <h2 className="relative z-10 mt-5 text-[1.85rem] font-bold tracking-tight text-slate-900">
                  Compliance Health Check
                </h2>
                <p className="relative z-10 mt-3 flex-1 leading-relaxed text-slate-600">
                  Describe your existing business and get a visual compliance score,
                  a colour-coded audit across key regulatory areas, and a ranked
                  list of priority actions to close gaps.
                </p>
                <ul className="relative z-10 mt-5 space-y-2">
                  {["Visual compliance score", "Colour-coded gap analysis", "Ranked remediation actions"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border border-white/80 bg-amber-100/90 text-amber-700">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={authed ? "/healthcheck" : "/login?redirectedFrom=/healthcheck"}
                  className="group relative z-10 mt-7 inline-flex items-center gap-2 font-semibold text-amber-700 transition-colors duration-200 hover:text-amber-600"
                >
                  Run a health check
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:translate-x-1">
                    <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-24">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-800 via-brand-900 to-slate-800" />
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-brand-500/15 blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-amber-500/10 blur-[100px]" />
          </div>
          <div className="container-page relative">
            <ScrollReveal direction="up" className="text-center mb-16">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-600/40 bg-brand-800/50 px-4 py-1.5 text-sm font-semibold text-brand-200">
                Simple process
              </span>
              <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Up and running in{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                  under a minute
                </span>
              </h2>
            </ScrollReveal>

            <div className="relative grid gap-0 sm:grid-cols-3">
              {/* Connecting line */}
              <div className="hidden sm:block absolute top-6 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-brand-500/60 via-amber-400/70 to-brand-500/60" />

              {steps.map((item, i) => (
                <ScrollReveal key={item.step} direction="up" delay={i * 120} className="relative text-center px-6 pb-4">
                  <span className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-brand-500 to-brand-700 text-sm font-extrabold text-white shadow-[0_0_0_4px_rgba(74,143,100,0.2)]">
                    {item.step}
                  </span>
                  <h3 className="mt-6 text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-slate-300 leading-relaxed">{item.body}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Feature grid ─────────────────────────────────────────────── */}
        <section className="container-page py-24">
          <ScrollReveal direction="up" className="text-center mb-14">
            <span className="section-label">Everything you need</span>
            <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Built for Ghanaian businesses
            </h2>
          </ScrollReveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} direction="up" delay={i * 70}>
                <div className="card p-6 hover:-translate-y-1 transition-all duration-300 ease-out hover:shadow-lg h-full">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${f.accent === "brand" ? "bg-brand-50 text-brand-600" : "bg-amber-50 text-amber-600"}`}>
                    {f.icon}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">{f.title}</h3>
                  <p className="mt-2 text-slate-600 leading-relaxed text-sm">{f.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="container-page pb-24">
          <ScrollReveal direction="zoom">
            <div className="cta-gradient relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 p-12 text-center shadow-2xl">
              <div className="cta-gradient__sheen pointer-events-none absolute inset-0" />
              <div className="pointer-events-none absolute inset-0">
                <div className="cta-orb cta-orb--green absolute -top-32 left-1/2 -translate-x-1/2 h-[480px] w-[480px] rounded-full bg-brand-500/35 blur-[100px]" />
                <div className="cta-orb cta-orb--amber absolute -bottom-20 right-[10%] h-80 w-80 rounded-full bg-amber-500/25 blur-[90px]" />
                <div className="cta-orb cta-orb--green absolute top-1/2 -left-20 h-72 w-72 rounded-full bg-brand-400/20 blur-[100px]" />
              </div>
              <div className="relative">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Ready to get compliant?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-slate-400 text-lg leading-relaxed">
                  Create an account and generate your first compliance report
                  in under a minute. No credit card required.
                </p>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                  <Link href={ctaHref} className="btn-amber text-base px-8 py-3.5">
                    Get started free
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link href={authed ? "/healthcheck" : "/login"} className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-300">
                    Run a health check
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200/70 bg-white/50 py-12">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            <div>
              <p className="text-lg font-bold text-slate-900">
                Lex<span className="text-brand-600">GH</span>
              </p>
              <p className="mt-1 text-sm text-slate-500">
                AI compliance guidance for Ghanaian businesses
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-500">
              <Link href="/setup" className="hover:text-brand-600 transition-colors">Setup Wizard</Link>
              <Link href="/healthcheck" className="hover:text-brand-600 transition-colors">Health Check</Link>
              <Link href="/login" className="hover:text-brand-600 transition-colors">Sign in</Link>
              <Link href="/login?mode=signup" className="hover:text-brand-600 transition-colors">Sign up</Link>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-200/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} LexGH. Informational guidance, not legal advice.</p>
            <p>Powered by NPONTU TECHNOLOGIES · Built for Ghana 🇬🇭</p>
          </div>
        </div>
      </footer>
    </>
  );
}
