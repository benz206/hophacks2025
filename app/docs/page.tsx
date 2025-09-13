import Link from "next/link";

export const metadata = { title: "Docs • Cogent" };

export default function DocsIndexPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Documentation</h1>
        <p className="mt-3 text-muted-foreground">Learn how to integrate Cogent and build voice agents.</p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link href="/docs/api" className="rounded-lg border p-4 hover:bg-muted/30">
            <div className="text-base font-medium">API Reference</div>
            <div className="text-sm text-muted-foreground">Endpoints, schemas, and examples</div>
          </Link>
          <Link href="/docs/getting-started" className="rounded-lg border p-4 hover:bg-muted/30">
            <div className="text-base font-medium">Getting Started</div>
            <div className="text-sm text-muted-foreground">Create your first agent</div>
          </Link>
        </div>
      </div>
    </div>
  );
}


