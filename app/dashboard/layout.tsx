import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="border-r bg-muted/10 p-4 space-y-4 hidden md:block">
        <div className="text-sm font-semibold">Cogent</div>
        <nav className="space-y-1 text-sm">
          <Link href="/dashboard" className="block rounded px-2 py-1 hover:bg-muted">Overview</Link>
          <Link href="/dashboard/agents" className="block rounded px-2 py-1 hover:bg-muted">Agents</Link>
          <Link href="/dashboard/calls" className="block rounded px-2 py-1 hover:bg-muted">Calls</Link>
          <Link href="/dashboard/settings" className="block rounded px-2 py-1 hover:bg-muted">Settings</Link>
        </nav>
      </aside>
      <div className="flex flex-col min-h-screen">
        <header className="border-b bg-background/80 backdrop-blur-sm p-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Dashboard</div>
          <form action={async () => {
            'use server'
            const supabase = await getSupabaseServerClient();
            await supabase.auth.signOut();
            redirect('/');
          }}>
            <button type="submit" className="h-8 rounded border px-3 text-xs">Sign out</button>
          </form>
        </header>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}


