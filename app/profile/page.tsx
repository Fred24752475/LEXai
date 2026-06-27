import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Profile — LexGH" };
export const dynamic = "force-dynamic";

interface ProfileRow {
  full_name: string | null;
  date_of_birth: string;
  role: string | null;
  phone: string | null;
  location_lat: number | null;
  location_lng: number | null;
  location_accuracy_m: number | null;
  location_captured_at: string | null;
  location_permission: "granted" | "denied" | "unavailable" | "not_requested";
  created_at: string;
  updated_at: string;
}

interface BusinessRow {
  id: string;
  name: string;
  type: "new" | "existing";
  created_at: string;
  compliance_reports: { id: string }[];
}

function formatDate(value: string | null) {
  if (!value) return "Not provided";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function formatDateTime(value: string | null) {
  if (!value) return "Not captured";
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-ink-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-ink-900">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink-900">{value}</p>
    </div>
  );
}

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectedFrom=/profile");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select(
      "full_name, date_of_birth, role, phone, location_lat, location_lng, location_accuracy_m, location_captured_at, location_permission, created_at, updated_at"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) redirect("/onboarding");

  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, name, type, created_at, compliance_reports(id)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const profileRow = profile as ProfileRow;
  const businessRows = (businesses ?? []) as BusinessRow[];
  const reportCount = businessRows.reduce(
    (sum, business) => sum + (business.compliance_reports?.length ?? 0),
    0
  );
  const hasLocation =
    typeof profileRow.location_lat === "number" && typeof profileRow.location_lng === "number";

  return (
    <>
      <Navbar authed email={user.email} />
      <main className="container-page py-8 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
              User profile
            </p>
            <h1 className="mt-2 text-3xl font-bold text-ink-900">
              {profileRow.full_name || user.email}
            </h1>
            <p className="mt-2 text-ink-500">
              Personal data saved for this signed-in user only.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/offices" className="btn-secondary">
              Nearby offices
            </Link>
            <Link href="/dashboard" className="btn-primary">
              Dashboard
            </Link>
          </div>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Businesses" value={businessRows.length} />
          <StatCard label="Saved reports" value={reportCount} />
          <StatCard
            label="Location"
            value={hasLocation ? "Enabled" : profileRow.location_permission.replace("_", " ")}
          />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-ink-900">Profile details</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <DetailRow label="Email" value={user.email ?? "Not provided"} />
              <DetailRow label="Full name" value={profileRow.full_name ?? "Not provided"} />
              <DetailRow label="Date of birth" value={formatDate(profileRow.date_of_birth)} />
              <DetailRow label="Role" value={profileRow.role ?? "Not provided"} />
              <DetailRow label="Phone" value={profileRow.phone ?? "Not provided"} />
              <DetailRow label="Profile updated" value={formatDateTime(profileRow.updated_at)} />
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-ink-900">Location record</h2>
            <p className="mt-2 text-sm leading-6 text-ink-500">
              This comes from the browser permission step during onboarding. It is only saved for
              this user profile.
            </p>
            <div className="mt-5 grid gap-3">
              <DetailRow label="Permission" value={profileRow.location_permission.replace("_", " ")} />
              <DetailRow
                label="Coordinates"
                value={
                  hasLocation
                    ? `${profileRow.location_lat?.toFixed(5)}, ${profileRow.location_lng?.toFixed(5)}`
                    : "Not captured"
                }
              />
              <DetailRow
                label="Accuracy"
                value={
                  typeof profileRow.location_accuracy_m === "number"
                    ? `${Math.round(profileRow.location_accuracy_m)}m`
                    : "Not captured"
                }
              />
              <DetailRow label="Captured at" value={formatDateTime(profileRow.location_captured_at)} />
            </div>
          </div>
        </section>

        <section className="mt-8 card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-ink-900">Your business instances</h2>
              <p className="mt-1 text-sm text-ink-500">
                These are pulled from Supabase for the current user only.
              </p>
            </div>
            <Link href="/setup" className="btn-secondary">
              + New setup checklist
            </Link>
          </div>

          <div className="mt-5 grid gap-3">
            {businessRows.length ? (
              businessRows.map((business) => (
                <Link
                  key={business.id}
                  href={`/business/${business.id}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3 transition hover:border-brand-300 hover:bg-brand-50/40"
                >
                  <div>
                    <p className="font-semibold text-ink-900">{business.name}</p>
                    <p className="text-xs text-ink-500">
                      {business.type === "new" ? "New business" : "Existing business"} ·{" "}
                      {business.compliance_reports?.length ?? 0} report
                      {(business.compliance_reports?.length ?? 0) === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span className="text-ink-300">→</span>
                </Link>
              ))
            ) : (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-ink-500">
                No businesses yet. Create a checklist or health check to save one.
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
