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
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <section className="rounded border p-4 space-y-2">
        <h2 className="text-lg font-medium">Your account</h2>
        <div className="text-sm space-y-1">
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">User ID:</span> {user.id}</p>
        </div>
      </section>
      <form action={signOutAction}>
        <button type="submit" className="h-10 rounded border px-4">Sign out</button>
      </form>
    </div>
  );
}
