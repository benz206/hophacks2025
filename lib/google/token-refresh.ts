// Google OAuth token refresh utility

import { createGoogleOAuthClient } from './oauth-client';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export interface RefreshTokenResult {
  success: boolean;
  accessToken?: string;
  error?: string;
}

/**
 * Refresh Google OAuth access token using refresh token
 */
export async function refreshGoogleAccessToken(integrationId: string): Promise<RefreshTokenResult> {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Get the current integration with refresh token
    const { data: integration, error } = await supabase
      .from('integrations')
      .select('api_key, user_id')
      .eq('id', integrationId)
      .eq('service_name', 'google_oauth')
      .single();

    if (error || !integration?.api_key) {
      return { success: false, error: 'Integration not found' };
    }

    // Parse current tokens
    const tokens = JSON.parse(atob(integration.api_key));
    
    if (!tokens.refresh_token) {
      return { success: false, error: 'No refresh token available' };
    }

    // Use Google OAuth client to refresh token
    const googleOAuth = createGoogleOAuthClient();
    const newTokens = await googleOAuth.refreshAccessToken(tokens.refresh_token);

    // Update the integration with new tokens
    const updatedTokens = {
      access_token: newTokens.access_token,
      refresh_token: newTokens.refresh_token || tokens.refresh_token, // Keep old refresh token if new one not provided
      expires_in: newTokens.expires_in,
      token_type: newTokens.token_type || 'Bearer',
      scope: newTokens.scope || tokens.scope,
    };

    const { error: updateError } = await supabase
      .from('integrations')
      .update({
        api_key: btoa(JSON.stringify(updatedTokens)),
        metadata: {
          ...integration.metadata,
          expires_at: new Date(Date.now() + (newTokens.expires_in * 1000)).toISOString(),
          last_refreshed_at: new Date().toISOString(),
          access_token: newTokens.access_token,
          token_type: newTokens.token_type || 'Bearer',
        },
      })
      .eq('id', integrationId);

    if (updateError) {
      return { success: false, error: 'Failed to update tokens' };
    }

    return { success: true, accessToken: newTokens.access_token };
  } catch (error) {
    console.error('Token refresh failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get a valid Google access token, refreshing if necessary
 */
export async function getValidGoogleAccessToken(userId: string): Promise<string | null> {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Get OAuth integration
    const { data: integration } = await supabase
      .from('integrations')
      .select('id, api_key, metadata')
      .eq('user_id', userId)
      .eq('service_name', 'google_oauth')
      .eq('status', 'active')
      .single();

    if (!integration?.metadata?.access_token) {
      return null;
    }

    const expiresAt = new Date(integration.metadata?.expires_at);
    const now = new Date();
    
    // If token is still valid (with 5 minute buffer), return it from metadata
    if (expiresAt > new Date(now.getTime() + 5 * 60 * 1000)) {
      return integration.metadata.access_token;
    }

    // Token is expired or about to expire, refresh it
    const refreshResult = await refreshGoogleAccessToken(integration.id);
    
    if (refreshResult.success && refreshResult.accessToken) {
      return refreshResult.accessToken;
    }

    console.warn('Failed to refresh token:', refreshResult.error);
    return null;
  } catch (error) {
    console.error('Error getting valid access token:', error);
    return null;
  }
}
