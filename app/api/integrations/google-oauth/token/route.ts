import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getValidGoogleAccessToken } from '@/lib/google/token-refresh';

/**
 * GET /api/integrations/google-oauth/token
 * Returns the current valid Google OAuth access token for the authenticated user
 */
export async function GET(req: NextRequest) {
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

    // Get valid access token (with automatic refresh if needed)
    const accessToken = await getValidGoogleAccessToken(user.id);
    
    if (!accessToken) {
      return NextResponse.json({ 
        error: 'No valid Google OAuth token found. Please connect your Google account first.',
        hasIntegration: false
      }, { status: 404 });
    }

    // Get integration details
    const { data: integration } = await supabase
      .from('integrations')
      .select('metadata, config')
      .eq('user_id', user.id)
      .eq('service_name', 'google_oauth')
      .eq('status', 'active')
      .single();

    return NextResponse.json({
      success: true,
      access_token: accessToken,
      token_type: integration?.metadata?.token_type || 'Bearer',
      expires_at: integration?.metadata?.expires_at,
      scopes: integration?.config?.scopes || [],
      user_email: integration?.config?.user_info?.email
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/integrations/google-oauth/token/refresh
 * Manually refresh the Google OAuth access token
 */
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

    // Get the integration ID
    const { data: integration } = await supabase
      .from('integrations')
      .select('id')
      .eq('user_id', user.id)
      .eq('service_name', 'google_oauth')
      .eq('status', 'active')
      .single();

    if (!integration) {
      return NextResponse.json({ 
        error: 'No Google OAuth integration found'
      }, { status: 404 });
    }

    // Force refresh the token
    const { refreshGoogleAccessToken } = await import('@/lib/google/token-refresh');
    const result = await refreshGoogleAccessToken(integration.id);

    if (!result.success) {
      return NextResponse.json({ 
        error: `Token refresh failed: ${result.error}`
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      access_token: result.accessToken,
      message: 'Token refreshed successfully'
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
