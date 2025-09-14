export const metadata = { title: "Demo • Hermes" };

import AgentsDemo from "@/components/dashboard/agents-demo";
import { CallsTable } from "@/components/dashboard/calls-table";
import { fakeCalls } from "@/lib/fake-data";

export default function DemoPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-10">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Interactive Demo</h1>
        <p className="mt-3 text-muted-foreground">A faithful copy of Agents and Calls screens with fake data and side panels.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Agents</h2>
        <AgentsDemo />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Calls</h2>
        <CallsTable calls={fakeCalls} />
      </section>
    </div>
  );
}


