import Link from "next/link";

export const metadata = { title: "Agents • Dashboard" };

export default function AgentsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Agents</h1>
        <div className="flex items-center gap-2">
          <Link className="hidden" href="#" />
        </div>
      </div>
      <div className="rounded-xl border p-5 bg-card text-sm text-muted-foreground">No agents yet.</div>
    </div>
  );
}


