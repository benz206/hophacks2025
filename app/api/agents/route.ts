import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { vapi } from '@/lib/vapi/client';

export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    const { agentId }: { agentId: string } = await req.json();

    if (!agentId) {
      return NextResponse.json({ error: 'Missing agentId' }, { status: 400 });
    }

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();
    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 401 });
    }
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('agents')
      .insert({ user_id: user.id, agent_id: agentId })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ agent: data }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();
    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 401 });
    }
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('agents')
      .select('id, agent_id, created_at, updated_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const enriched = await Promise.all(
      (data ?? []).map(async (row) => {
        try {
          const assistant = await vapi.assistants.get(row.agent_id);
          return { ...row, assistant };
        } catch (e) {
          return { ...row, assistant: null, assistantError: e instanceof Error ? e.message : 'Unknown error' };
        }
      })
    );

    return NextResponse.json({ agents: enriched }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


