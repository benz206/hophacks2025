// Simple helper to get Google OAuth access token

import { getValidGoogleAccessToken } from './token-refresh';
import { getSupabaseServerClient } from '@/lib/supabase/server';

/**
 * Get the current Google OAuth access token for a user
 * This is a simplified interface for getting access tokens
 */
export async function getGoogleAccessToken(userId: string): Promise<string | null> {
  return await getValidGoogleAccessToken(userId);
}

/**
 * Get Google OAuth access token directly from metadata (no refresh check)
 * Use this when you just need the current token without automatic refresh
 */
export async function getGoogleAccessTokenFromMetadata(userId: string): Promise<{
  access_token?: string;
  token_type?: string;
  expires_at?: string;
  scopes?: string[];
} | null> {
  try {
    const supabase = await getSupabaseServerClient();
    
    const { data: integration } = await supabase
      .from('integrations')
      .select('metadata, config')
      .eq('user_id', userId)
      .eq('service_name', 'google_oauth')
      .eq('status', 'active')
      .single();

    if (!integration?.metadata?.access_token) {
      return null;
    }

    return {
      access_token: integration.metadata.access_token,
      token_type: integration.metadata.token_type || 'Bearer',
      expires_at: integration.metadata.expires_at,
      scopes: integration.config?.scopes || []
    };
  } catch (error) {
    console.error('Error getting access token from metadata:', error);
    return null;
  }
}

/**
 * Get Google OAuth access token from client-side (browser)
 * Makes a request to the token API endpoint
 */
export async function getGoogleAccessTokenClient(): Promise<{
  success: boolean;
  access_token?: string;
  error?: string;
  expires_at?: string;
  scopes?: string[];
}> {
  try {
    const response = await fetch('/api/integrations/google-oauth/token');
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    
    return {
      success: true,
      access_token: data.access_token,
      expires_at: data.expires_at,
      scopes: data.scopes
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get access token'
    };
  }
}

/**
 * Refresh Google OAuth access token from client-side
 */
export async function refreshGoogleAccessTokenClient(): Promise<{
  success: boolean;
  access_token?: string;
  error?: string;
}> {
  try {
    const response = await fetch('/api/integrations/google-oauth/token/refresh', {
      method: 'POST'
    });
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    
    return {
      success: true,
      access_token: data.access_token
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to refresh token'
    };
  }
}
