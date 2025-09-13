import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { StatCard } from '@/components/dashboard/overview-cards';
import { fakeCalls, fakeUsage } from '@/lib/fake-data';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">Signed in as {user.email}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total calls" value={String(fakeUsage.totalCalls)} hint="All calls this month" accent="violet" />
        <StatCard label="Minutes" value={String(fakeUsage.totalMinutes)} hint="This month" accent="blue" />
        <StatCard label="Avg duration" value={`${Math.round(fakeUsage.avgDurationSec / 60)}m`} hint="Per successful call" accent="sunset" />
        <StatCard label="Success rate" value={`${fakeUsage.successRatePct}%`} hint="Completed vs total" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border p-5 bg-card">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-medium">Recent calls</h2>
            <Link href="/dashboard/calls" className="text-sm text-primary underline">View all</Link>
          </div>
          <div className="mt-3 space-y-3">
            {fakeCalls.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                <div className="flex items-center gap-3">
                  <div className="font-medium">{c.assistantName}</div>
                  <div className="text-muted-foreground">→ {c.customerNumber}</div>
                </div>
                <div className="text-muted-foreground">{new Date(c.startedAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-xl border p-5 bg-card">
          <h2 className="text-base sm:text-lg font-medium">Usage</h2>
          <p className="mt-1 text-sm text-muted-foreground">You used {fakeUsage.totalMinutes} minutes across {fakeUsage.totalCalls} calls this month.</p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-md border bg-muted/30 p-3">
              <div className="text-muted-foreground">Avg duration</div>
              <div className="mt-1 font-medium">{Math.round(fakeUsage.avgDurationSec / 60)} min</div>
            </div>
            <div className="rounded-md border bg-muted/30 p-3">
              <div className="text-muted-foreground">Success rate</div>
              <div className="mt-1 font-medium">{fakeUsage.successRatePct}%</div>
            </div>
            <div className="rounded-md border bg-muted/30 p-3">
              <div className="text-muted-foreground">This month</div>
              <div className="mt-1 font-medium">{fakeUsage.month}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
