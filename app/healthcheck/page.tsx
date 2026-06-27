import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { HealthCheckForm } from "@/components/HealthCheckForm";

export const metadata = { title: "Compliance Health Check — LexGH" };

export default async function HealthCheckPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectedFrom=/healthcheck");

  return (
    <>
      <Navbar authed email={user.email} />
      <main className="container-page py-8 sm:py-12">
        <div className="mb-8 text-center no-print">
          <h1 className="text-sm font-semibold uppercase tracking-wide text-brand-700">
            Compliance Health Check
          </h1>
          <p className="mt-1 text-2xl font-bold text-ink-900">
            Audit your business in seconds
          </p>
        </div>
        <HealthCheckForm />
      </main>
    </>
  );
}
