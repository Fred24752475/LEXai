import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Nearby offices — LexGH" };
export const dynamic = "force-dynamic";

const OFFICES = [
  {
    name: "Office of the Registrar of Companies",
    short: "ORC",
    query: "Office of the Registrar of Companies Ghana",
    use: "Business name reservation, incorporation and company filings"
  },
  {
    name: "Ghana Revenue Authority",
    short: "GRA",
    query: "Ghana Revenue Authority office",
    use: "TIN, tax registration, VAT and filing support"
  },
  {
    name: "SSNIT",
    short: "SSNIT",
    query: "SSNIT office Ghana",
    use: "Employer registration and employee social security"
  },
  {
    name: "District / Municipal Assembly",
    short: "Assembly",
    query: "District Assembly business operating permit office Ghana",
    use: "Business operating permits and local authority requirements"
  }
];

function mapsSearchUrl(query: string, lat?: number | null, lng?: number | null) {
  const near = lat && lng ? ` near ${lat},${lng}` : " near me";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + near)}`;
}

function mapsDirectionsUrl(query: string, lat?: number | null, lng?: number | null) {
  const origin = lat && lng ? `${lat},${lng}` : "";
  const params = new URLSearchParams({
    api: "1",
    destination: query,
    travelmode: "driving"
  });
  if (origin) params.set("origin", origin);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export default async function OfficesPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectedFrom=/offices");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("full_name, location_lat, location_lng, location_accuracy_m, location_permission")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) redirect("/onboarding");

  const hasLocation =
    typeof profile.location_lat === "number" && typeof profile.location_lng === "number";

  return (
    <>
      <Navbar authed email={user.email} />
      <main className="container-page py-8 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
              Nearby offices
            </p>
            <h1 className="mt-2 text-3xl font-bold text-ink-900">
              Find Ghana compliance offices close to you
            </h1>
            <p className="mt-2 max-w-2xl text-ink-500">
              Open Google Maps to see exact offices, live routes and travel duration from your
              saved location.
            </p>
          </div>
          <Link href="/dashboard" className="btn-secondary">
            Continue to dashboard
          </Link>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-ink-900">
            {hasLocation ? "Location enabled" : "Location not enabled"}
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            {hasLocation
              ? `Using saved location (${profile.location_lat.toFixed(4)}, ${profile.location_lng.toFixed(4)}) with approx. ${Math.round(profile.location_accuracy_m ?? 0)}m accuracy.`
              : "Google Maps will still open, but it will use your browser/device location or ask you to choose one."}
          </p>
        </section>

        <section className="mt-8 grid gap-5 sm:grid-cols-2">
          {OFFICES.map((office) => (
            <article key={office.short} className="card p-6">
              <span className="badge-authority">{office.short}</span>
              <h2 className="mt-3 text-xl font-bold text-ink-900">{office.name}</h2>
              <p className="mt-2 text-sm leading-6 text-ink-500">{office.use}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  className="btn-primary"
                  href={mapsSearchUrl(office.query, profile.location_lat, profile.location_lng)}
                  target="_blank"
                  rel="noreferrer"
                >
                  See nearby offices
                </a>
                <a
                  className="btn-secondary"
                  href={mapsDirectionsUrl(office.query, profile.location_lat, profile.location_lng)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Directions + duration
                </a>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 card p-6">
          <h2 className="text-lg font-bold text-ink-900">AI next step</h2>
          <p className="mt-2 text-sm leading-6 text-ink-500">
            After the user chooses an office, LexGH can use their saved profile plus business
            report data to suggest which documents to carry and what questions to ask at that
            agency.
          </p>
        </section>
      </main>
    </>
  );
}
