import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { StatCard } from '@/components/dashboard/overview-cards';
import Link from 'next/link';
import { vapi } from '@/lib/vapi/client';
import { UsageChart } from '@/components/dashboard/overview-cards';

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch user's call records
  const { data: callRecords } = await supabase
    .from('calls')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Deduplicate records by call_id to avoid duplicate stats when the DB contains multiple rows
  const records = (callRecords || []).reduce((acc: any[], r: any) => {
    if (!acc.find((x) => x.call_id === r.call_id)) acc.push(r);
    return acc;
  }, []);

  // Resolve Vapi details for each call record
  const detailedCalls = (
    await Promise.all(
      records.map(async (r) => {
        try {
          const call = await vapi.calls.get(r.call_id);
          const startedAt = call.startedAt || r.created_at;
          const endedAt = call.endedAt || null;
          const durationSec = startedAt && endedAt
            ? Math.floor((new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000)
            : 0;
          const status = call.status === 'ended' ? 'completed' : 'ongoing';
          const direction = call.type === 'outboundPhoneCall' ? 'outbound' : 'inbound';
          return {
            id: r.id as string,
            assistantName: call.assistant?.name || 'Assistant',
            customerNumber: call.customer?.number || 'Unknown',
            startedAt,
            durationSec,
            direction,
            status,
          };
        } catch {
          return null;
        }
      })
    )
  ).filter((c): c is NonNullable<typeof c> => Boolean(c));

  // Aggregate monthly usage
  const monthPrefix = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthCalls = detailedCalls.filter((c) => (c.startedAt || '').slice(0, 7) === monthPrefix);
  const totalCalls = monthCalls.length;
  const totalMinutes = Math.round(monthCalls.reduce((m, c) => m + c.durationSec, 0) / 60);
  const completed = monthCalls.filter((c) => c.status === 'completed').length;
  const successRatePct = totalCalls > 0 ? Math.round((completed / totalCalls) * 100) : 0;
  const completedWithDuration = monthCalls.filter((c) => c.durationSec > 0);
  const avgDurationSec = completedWithDuration.length > 0
    ? Math.round(completedWithDuration.reduce((m, c) => m + c.durationSec, 0) / completedWithDuration.length)
    : 0;

  // Build per-day dataset for current month
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const usageData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = String(i + 1).padStart(2, '0');
    const dateKey = `${monthPrefix}-${day}`;
    const dayCalls = monthCalls.filter((c) => (c.startedAt || '').slice(0, 10) === `${dateKey}`);
    const minutes = Math.round(dayCalls.reduce((m, c) => m + c.durationSec, 0) / 60);
    return { date: day, calls: dayCalls.length, minutes };
  });

  // Additional usage metrics
  const peakCalls = usageData.length ? Math.max(...usageData.map((d) => d.calls)) : 0;
  const peakMinutes = usageData.length ? Math.max(...usageData.map((d) => d.minutes)) : 0;
  
  // Recent calls (top 5)
  const recent = detailedCalls.slice(0, 5);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">Signed in as {user.email}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total calls" value={String(totalCalls)} hint="All calls this month" accent="violet" />
        <StatCard label="Minutes" value={String(totalMinutes)} hint="This month" accent="blue" />
        <StatCard label="Avg duration" value={`${Math.round(avgDurationSec / 60)}m`} hint="Per successful call" accent="sunset" />
        <StatCard label="Success rate" value={`${successRatePct}%`} hint="Completed vs total" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border p-5 bg-card">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-medium">Recent calls</h2>
            <Link href="/dashboard/calls" className="text-sm text-primary underline">View all</Link>
          </div>
          <div className="mt-3 space-y-3">
            {recent.map((c) => (
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
          <p className="mt-1 text-sm text-muted-foreground">You used {totalMinutes} minutes across {totalCalls} calls this month.</p>
          <div className="mt-4">
            <UsageChart data={usageData} />
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
            <div className="rounded-md border bg-muted/30 p-3">
              <div className="text-muted-foreground">Avg duration</div>
              <div className="mt-1 font-medium">{Math.round(avgDurationSec / 60)} min</div>
            </div>
            <div className="rounded-md border bg-muted/30 p-3">
              <div className="text-muted-foreground">Success rate</div>
              <div className="mt-1 font-medium">{successRatePct}%</div>
            </div>
            <div className="rounded-md border bg-muted/30 p-3">
              <div className="text-muted-foreground">This month</div>
              <div className="mt-1 font-medium">{monthPrefix}</div>
            </div>
            <div className="rounded-md border bg-muted/30 p-3">
              <div className="text-muted-foreground">Peak calls/day</div>
              <div className="mt-1 font-medium">{peakCalls}</div>
            </div>
            <div className="rounded-md border bg-muted/30 p-3">
              <div className="text-muted-foreground">Peak minutes/day</div>
              <div className="mt-1 font-medium">{peakMinutes}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
