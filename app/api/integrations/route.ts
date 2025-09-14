import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

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
      .from('integrations')
      .select('id, service_name, display_name, description, status, config, metadata, created_at, updated_at, last_used_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ integrations: data || [] }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    const { 
      service_name, 
      display_name, 
      description, 
      api_key, 
      config = {},
      metadata = {} 
    } = await req.json();

    if (!service_name || !display_name) {
      return NextResponse.json({ 
        error: 'Missing required fields: service_name, display_name' 
      }, { status: 400 });
    }

    // Encrypt API key if provided (in a real app, you'd use proper encryption)
    const encryptedApiKey = api_key ? btoa(api_key) : null;

    const { data, error } = await supabase
      .from('integrations')
      .insert({
        user_id: user.id,
        service_name,
        display_name,
        description,
        api_key: encryptedApiKey,
        config,
        metadata,
        status: api_key ? 'active' : 'inactive'
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Remove sensitive data from response
    const { api_key: _, ...safeData } = data;
    return NextResponse.json({ integration: safeData }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
