import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Missing integration id' }, { status: 400 });

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
      .from('integrations')
      .select('id, service_name, display_name, description, status, config, metadata, created_at, updated_at, last_used_at')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ integration: data }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Missing integration id' }, { status: 400 });

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

    const { 
      display_name, 
      description, 
      status,
      api_key, 
      config,
      metadata 
    } = await req.json();

    const updateData: any = {};
    if (display_name !== undefined) updateData.display_name = display_name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (config !== undefined) updateData.config = config;
    if (metadata !== undefined) updateData.metadata = metadata;
    if (api_key !== undefined) {
      updateData.api_key = api_key ? btoa(api_key) : null;
      updateData.status = api_key ? 'active' : 'inactive';
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('integrations')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id, service_name, display_name, description, status, config, metadata, created_at, updated_at, last_used_at')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ integration: data }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Missing integration id' }, { status: 400 });

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

    const { error } = await supabase
      .from('integrations')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Integration deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
