import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">Signed in as {user.email}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <section className="rounded-xl border border-border/70 p-5 bg-card md:col-span-2">
          <h2 className="text-base sm:text-lg font-medium">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">Track your agents and calls at a glance.</p>
        </section>
        <section className="rounded-xl border border-border/70 p-5 bg-card">
          <h2 className="text-base sm:text-lg font-medium">Usage</h2>
          <p className="mt-1 text-sm text-muted-foreground">Minutes this month: 0</p>
        </section>
      </div>
    </div>
  );
}
