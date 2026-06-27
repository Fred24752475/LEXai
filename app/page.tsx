import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Github,
  Heart,
  Mail,
  Scale,
  ScrollText,
  Search,
  Shield,
  Sparkles,
  Twitter,
} from "lucide-react";
import { ButtonLink } from "@/components/button";
import { PublicShell } from "@/components/shell";
import { AnimateIn } from "@/components/in-view";
import { DemoCard } from "@/components/demo-card";

const features = [
  {
    icon: ScrollText,
    title: "5-question wizard",
    text: "Start with a business idea and receive a printable, actionable compliance checklist in minutes.",
  },
  {
    icon: Search,
    title: "Live legal research",
    text: "Grok searches current Ghanaian regulations before generating your personalized report.",
  },
  {
    icon: Shield,
    title: "Saved dashboard",
    text: "Keep multiple businesses and compliance reports in one secure, password-protected workspace.",
  },
];

const steps = [
  {
    icon: FileText,
    title: "Tell us about your business",
    text: "Answer a few simple questions about your business type and stage.",
  },
  {
    icon: Search,
    title: "AI researches requirements",
    text: "We scan current Ghanaian regulations for ORC, GRA, SSNIT and more.",
  },
  {
    icon: CheckCircle2,
    title: "Get your compliance checklist",
    text: "Receive a detailed, prioritized checklist tailored to your business.",
  },
];

const stats = [
  ["500+", "Businesses guided"],
  ["98%", "Accuracy rate"],
  ["3 min", "Average setup"],
  ["24/7", "AI support"],
] as const;

export default function HomePage() {
  return (
    <PublicShell>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <AnimateIn>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-leaf">
                <Sparkles size={14} />
                Launching at Accra Hackathon 2026
              </span>
            </AnimateIn>
            <AnimateIn delay={100}>
              <h1 className="text-5xl font-black leading-tight tracking-tight text-ink sm:text-6xl lg:text-7xl">
                AI-powered
                <br />
                <span className="text-leaf">compliance</span> for
                <br />
                Ghanaian businesses.
              </h1>
            </AnimateIn>
            <AnimateIn delay={200}>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                LexGH uses live web search through Grok to create actionable
                startup checklists and compliance health checks for ORC, GRA,
                SSNIT and other Ghanaian requirements.
              </p>
            </AnimateIn>
            <AnimateIn delay={300}>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/login">
                  Generate my checklist{" "}
                  <ArrowRight className="ml-2" size={18} />
                </ButtonLink>
                <ButtonLink href="/login" variant="secondary">
                  Run health check
                </ButtonLink>
              </div>
            </AnimateIn>
            <AnimateIn delay={400}>
              <p className="mt-6 text-sm text-slate-400">
                Free for Ghanaian entrepreneurs &bull; No credit card required
              </p>
            </AnimateIn>
          </div>
          <AnimateIn delay={200}>
            <DemoCard />
          </AnimateIn>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4">
          {stats.map(([num, label], i) => (
            <AnimateIn key={label} delay={i * 100}>
              <div className="text-center">
                <p className="text-3xl font-black text-leaf">{num}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {label}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <AnimateIn>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="mb-4 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-leaf">
              Why LexGH?
            </span>
            <h2 className="text-4xl font-black text-ink">
              Compliance, simplified
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Everything you need to register and run your business in Ghana,
              powered by AI.
            </p>
          </div>
        </AnimateIn>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <AnimateIn key={feature.title} delay={i * 150}>
              <div className="group rounded-3xl bg-white p-8 shadow-soft ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-5 inline-flex rounded-2xl bg-emerald-100 p-3 text-leaf">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-black text-ink">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {feature.text}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <AnimateIn>
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="mb-4 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-leaf">
                Simple process
              </span>
              <h2 className="text-4xl font-black text-ink">How it works</h2>
            </div>
          </AnimateIn>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <AnimateIn key={step.title} delay={i * 150}>
                <div className="relative text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-lg font-black text-white">
                    {i + 1}
                  </div>
                  <div className="mx-auto mb-4 inline-flex rounded-2xl bg-emerald-100 p-3 text-leaf">
                    <step.icon size={22} />
                  </div>
                  <h3 className="text-lg font-black text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {step.text}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <AnimateIn>
          <div className="rounded-[2.5rem] bg-ink px-8 py-16 text-center sm:px-16">
            <h2 className="text-4xl font-black text-white sm:text-5xl">
              Ready to simplify compliance?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-slate-300">
              Join hundreds of Ghanaian entrepreneurs who have streamlined their
              business registration.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink
                href="/login"
                className="bg-white text-ink hover:bg-slate-100"
              >
                Get started free{" "}
                <ArrowRight className="ml-2" size={18} />
              </ButtonLink>
              <ButtonLink
                href="/login"
                className="bg-transparent text-white ring-1 ring-white/20 hover:bg-white/10"
              >
                Learn more
              </ButtonLink>
            </div>
          </div>
        </AnimateIn>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3 font-bold text-ink">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-leaf">
                <Scale size={21} />
              </span>
              LexGH
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              AI-powered compliance guidance for Ghanaian entrepreneurs and
              SMEs.
            </p>
            <div className="mt-4 flex gap-2">
              <a
                href="#"
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-leaf"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="#"
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-leaf"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-leaf"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold text-ink">Product</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/login"
                  className="text-slate-500 transition-colors hover:text-ink"
                >
                  Checklist
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="text-slate-500 transition-colors hover:text-ink"
                >
                  Health check
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="text-slate-500 transition-colors hover:text-ink"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-500 transition-colors hover:text-ink"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold text-ink">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-slate-500 transition-colors hover:text-ink"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-500 transition-colors hover:text-ink"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-500 transition-colors hover:text-ink"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-500 transition-colors hover:text-ink"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold text-ink">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-slate-500 transition-colors hover:text-ink"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-500 transition-colors hover:text-ink"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-500 transition-colors hover:text-ink"
                >
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200">
          <p className="mx-auto max-w-6xl px-6 py-6 text-center text-sm text-slate-400">
            &copy; {new Date().getFullYear()} LexGH &mdash; Built with{" "}
            <Heart size={12} className="inline text-red-400" /> for Ghanaian
            entrepreneurs.
          </p>
        </div>
      </footer>
    </PublicShell>
  );
}
