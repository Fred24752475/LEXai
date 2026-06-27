import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { SetupWizard } from "@/components/SetupWizard";

export const metadata = { title: "Business Setup Wizard — LexGH" };

export default async function SetupPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectedFrom=/setup");

  return (
    <>
      <Navbar authed email={user.email} />
      <main className="container-page py-8 sm:py-12">
        <div className="mb-8 text-center no-print">
          <h1 className="text-sm font-semibold uppercase tracking-wide text-brand-700">
            Business Setup Wizard
          </h1>
          <p className="mt-1 text-2xl font-bold text-ink-900">
            Get your personalised registration checklist
          </p>
        </div>
        <SetupWizard />
      </main>
    </>
  );
}
