import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { FrustratedAssistant } from "@/components/FrustratedAssistant";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Are you frustrated? — LexGH" };
export const dynamic = "force-dynamic";

export default async function FrustratedPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectedFrom=/frustrated");

  return (
    <>
      <Navbar authed email={user.email} />
      <main className="container-page py-8 sm:py-12">
        <FrustratedAssistant />
      </main>
    </>
  );
}
