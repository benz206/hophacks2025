import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  async function signOutAction() {
    'use server'
    const supabase = await getSupabaseServerClient();
    await supabase.auth.signOut();
    revalidatePath('/');
    redirect('/');
  }

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-8 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Dashboard</h1>
      <section className="rounded-xl border border-border/70 p-5 sm:p-6 space-y-3 bg-card">
        <h2 className="text-base sm:text-lg font-medium">Your account</h2>
        <div className="text-sm space-y-1 text-foreground">
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">User ID:</span> {user.id}</p>
        </div>
      </section>
      <form action={signOutAction}>
        <button type="submit" className="h-10 rounded-md border border-border/70 px-4 text-sm">Sign out</button>
      </form>
    </div>
  );
}
