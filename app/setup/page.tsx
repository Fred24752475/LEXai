import { SetupWizard } from "@/components/setup-wizard";
import { AppShell } from "@/components/shell";

export default function SetupPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <SetupWizard />
      </div>
    </AppShell>
  );
}
