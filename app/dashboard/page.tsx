import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <section className="rounded-xl border border-border/70 p-5 bg-card md:col-span-2">
        <h2 className="text-base sm:text-lg font-medium">Welcome back</h2>
        <p className="mt-1 text-sm text-muted-foreground">Signed in as {user.email}</p>
      </section>
      <section className="rounded-xl border border-border/70 p-5 bg-card">
        <h2 className="text-base sm:text-lg font-medium">Usage</h2>
        <p className="mt-1 text-sm text-muted-foreground">Minutes this month: 0</p>
      </section>
    </div>
  );
}
