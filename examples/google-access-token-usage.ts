// Example: How to use Google OAuth access token

import { getGoogleAccessTokenClient, getGoogleAccessTokenFromMetadata } from '@/lib/google/access-token';

/**
 * Example 1: Get access token from client-side (browser)
 */
export async function exampleGetAccessToken() {
  const result = await getGoogleAccessTokenClient();
  
  if (result.success && result.access_token) {
    console.log('✅ Got access token:', result.access_token);
    console.log('🔒 Scopes:', result.scopes);
    console.log('⏰ Expires at:', result.expires_at);
    
    // Use the access token for Google API calls
    return result.access_token;
  } else {
    console.error('❌ Failed to get access token:', result.error);
    return null;
  }
}

/**
 * Example 2: Use access token with Google Maps API directly
 */
export async function exampleUseWithGoogleMapsAPI() {
  const result = await getGoogleAccessTokenClient();
  
  if (result.success && result.access_token) {
    // Use access token with Google Maps Geocoding API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&access_token=${result.access_token}`
    );
    
    const data = await response.json();
    console.log('📍 Geocoding result:', data);
    return data;
  }
  
  return null;
}

/**
 * Example 3: Use access token with other Google APIs
 */
export async function exampleUseWithOtherGoogleAPIs() {
  const result = await getGoogleAccessTokenClient();
  
  if (result.success && result.access_token) {
    // Example: Use with Google Calendar API
    const calendarResponse = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        headers: {
          'Authorization': `Bearer ${result.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (calendarResponse.ok) {
      const calendarData = await calendarResponse.json();
      console.log('📅 Calendar events:', calendarData);
      return calendarData;
    }
  }
  
  return null;
}

/**
 * Example 4: Server-side usage (from API routes)
 */
export async function exampleServerSideUsage(userId: string) {
  // This would be used in API routes
  const { getGoogleAccessToken } = await import('@/lib/google/access-token');
  const accessToken = await getGoogleAccessToken(userId);
  
  if (accessToken) {
    console.log('✅ Server-side access token:', accessToken);
    
    // Use with any Google API
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    const userInfo = await response.json();
    console.log('👤 User info:', userInfo);
    return userInfo;
  }
  
  return null;
}

/**
 * Example 5: Get access token directly from Supabase metadata
 */
export async function exampleGetTokenFromMetadata(userId: string) {
  const tokenData = await getGoogleAccessTokenFromMetadata(userId);
  
  if (tokenData?.access_token) {
    console.log('✅ Access token from metadata:', tokenData.access_token);
    console.log('🔒 Token type:', tokenData.token_type);
    console.log('⏰ Expires at:', tokenData.expires_at);
    console.log('🔑 Scopes:', tokenData.scopes);
    
    return tokenData;
  } else {
    console.log('❌ No access token found in metadata');
    return null;
  }
}

/**
 * Example 6: Check if user has Google integration
 */
export async function exampleCheckGoogleIntegration() {
  const result = await getGoogleAccessTokenClient();
  
  return {
    hasGoogleIntegration: result.success,
    scopes: result.scopes || [],
    error: result.error
  };
}
