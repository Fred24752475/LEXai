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

  const { data: conversation } = await supabase
    .from("lexai_conversations")
    .select("id, title, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: messages } = conversation
    ? await supabase
        .from("lexai_messages")
        .select("role, content, created_at")
        .eq("conversation_id", conversation.id)
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(60)
    : { data: [] };

  return (
    <>
      <Navbar authed email={user.email} />
      <main className="container-page py-8 sm:py-12">
        <FrustratedAssistant
          initialConversationId={conversation?.id ?? null}
          initialMessages={(messages ?? []).map((message) => ({
            role: message.role as "user" | "assistant",
            content: message.content
          }))}
        />
      </main>
    </>
  );
}
