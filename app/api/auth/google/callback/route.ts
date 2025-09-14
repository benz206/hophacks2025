import { NextRequest, NextResponse } from 'next/server';
import { createGoogleOAuthClient } from '@/lib/google/oauth-client';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // This should be the user ID
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/integrations?error=${encodeURIComponent(error)}`);
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/integrations?error=missing_parameters`);
    }

    const supabase = await getSupabaseServerClient();
    const googleOAuth = createGoogleOAuthClient();

    try {
      // Exchange code for tokens
      const tokens = await googleOAuth.exchangeCodeForTokens(code);
      
      // Get user info to verify the connection
      const userInfo = await googleOAuth.getUserInfo(tokens.access_token);

      // Store the tokens in the integrations table
      const { error: upsertError } = await supabase
        .from('integrations')
        .upsert({
          user_id: state,
          service_name: 'google_oauth',
          display_name: 'Google Account',
          description: `Connected Google account: ${userInfo.email}`,
          status: 'active',
          api_key: btoa(JSON.stringify({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_in: tokens.expires_in,
            token_type: tokens.token_type,
            scope: tokens.scope,
          })),
          config: {
            user_info: {
              id: userInfo.id,
              email: userInfo.email,
              name: userInfo.name,
              picture: userInfo.picture,
            },
            scopes: tokens.scope.split(' '),
          },
          metadata: {
            connected_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + (tokens.expires_in * 1000)).toISOString(),
            access_token: tokens.access_token,
            token_type: tokens.token_type || 'Bearer',
          },
        }, {
          onConflict: 'user_id,service_name',
        });

      if (upsertError) {
        console.error('Failed to store Google OAuth tokens:', upsertError);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/integrations?error=storage_failed`);
      }

      // Also update/create Google Maps integration if it exists
      const { data: existingGoogleMaps } = await supabase
        .from('integrations')
        .select('id')
        .eq('user_id', state)
        .eq('service_name', 'google_maps')
        .single();

      if (existingGoogleMaps) {
        // Update Google Maps to use OAuth tokens instead of API key
        await supabase
          .from('integrations')
          .update({
            status: 'active',
            config: {
              ...existingGoogleMaps,
              oauth_enabled: true,
              oauth_scopes: tokens.scope.split(' '),
            },
            metadata: {
              oauth_connected_at: new Date().toISOString(),
              oauth_user_email: userInfo.email,
            },
          })
          .eq('id', existingGoogleMaps.id);
      }

      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/integrations?success=google_connected`);
    } catch (tokenError) {
      console.error('OAuth token exchange failed:', tokenError);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/integrations?error=token_exchange_failed`);
    }
  } catch (error: unknown) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/integrations?error=callback_failed`);
  }
}
