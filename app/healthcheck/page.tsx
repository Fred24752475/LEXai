import { HealthcheckForm } from "@/components/healthcheck-form";
import { AppShell } from "@/components/shell";

export default function HealthcheckPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <HealthcheckForm />
      </div>
    </AppShell>
  );
}
