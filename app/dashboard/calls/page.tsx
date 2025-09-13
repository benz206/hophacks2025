export const metadata = { title: "Calls • Dashboard" };

export default function CallsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Calls</h1>
      </div>
      <div className="rounded-xl border p-5 bg-card text-sm text-muted-foreground">No calls to display.</div>
    </div>
  );
}


