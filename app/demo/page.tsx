export const metadata = { title: "Demo • Cogent" };

export default function DemoPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Product Demo</h1>
        <p className="mt-3 text-muted-foreground">Hear how Cogent handles real customer interactions.</p>

        <div className="mt-8 aspect-video w-full rounded-xl border bg-muted" />
        <p className="mt-3 text-sm text-muted-foreground">Demo video coming soon.</p>
      </div>
    </div>
  );
}


