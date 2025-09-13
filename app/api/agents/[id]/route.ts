import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { vapi } from '@/lib/vapi/client';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();
    if (userError) return NextResponse.json({ error: userError.message }, { status: 401 });
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params; // this is the row id in public.agents
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const { data: row, error: fetchErr } = await supabase
      .from('agents')
      .select('id, agent_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 404 });

    // Delete from Vapi first (ignore if already missing)
    try {
      await vapi.assistants.delete(row.agent_id);
    } catch {}

    // Delete from Supabase
    const { error: delErr } = await supabase
      .from('agents')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 400 });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
