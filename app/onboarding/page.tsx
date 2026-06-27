import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { OnboardingForm } from "@/components/OnboardingForm";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Profile setup — LexGH" };
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectedFrom=/onboarding");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile) redirect("/offices");

  return (
    <>
      <Navbar authed email={user.email} />
      <main className="container-page flex min-h-[calc(100vh-4rem)] items-center justify-center py-10">
        <div className="w-full max-w-3xl">
          <OnboardingForm userId={user.id} email={user.email} />
        </div>
      </main>
    </>
  );
}
