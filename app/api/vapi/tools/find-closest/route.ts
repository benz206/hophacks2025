import { NextRequest, NextResponse } from 'next/server';
import { GoogleMapsClient } from '@/lib/google-maps/client';
import { createSMTPClient } from '@/lib/email/smtp-client';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getGoogleAccessToken } from '@/lib/google/access-token';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    
    // For VAPI tools, get Google OAuth access token
    const supabase = await getSupabaseServerClient();
    
    // Get the first active Google OAuth integration
    const { data: oauthIntegration } = await supabase
      .from('integrations')
      .select('user_id')
      .eq('service_name', 'google_oauth')
      .eq('status', 'active')
      .limit(1)
      .single();

    if (!oauthIntegration?.user_id) {
      return NextResponse.json({
        results: [{
          toolCallId: message.toolCalls?.[0]?.id,
          result: "Google OAuth integration is not configured. Please connect your Google account in the integrations page."
        }]
      });
    }

    // Get the current access token
    const accessToken = await getGoogleAccessToken(oauthIntegration.user_id);
    
    if (!accessToken) {
      return NextResponse.json({
        results: [{
          toolCallId: message.toolCalls?.[0]?.id,
          result: "Failed to get Google access token. Please reconnect your Google account."
        }]
      });
    }

    // Create Google Maps client with the access token
    const googleMapsClient = new GoogleMapsClient({ accessToken });
    
    // Get user info for email
    const { data: user } = await supabase.auth.admin.getUserById(oauthIntegration.user_id);
    const userEmail = user?.user?.email;
    
    // Extract parameters from the VAPI message
    const { searchQuery, userLocation } = message.toolCalls?.[0]?.function?.arguments || {};
    
    if (!searchQuery || !userLocation) {
      return NextResponse.json({
        results: [{
          toolCallId: message.toolCalls?.[0]?.id,
          result: "I need both a search query (what you're looking for) and your current location to find the closest places."
        }]
      });
    }

    // googleMapsClient is already created above

    try {
      // First, geocode the user's location to get coordinates
      const userLocationResults = await googleMapsClient.geocode(userLocation);
      if (!userLocationResults.length) {
        return NextResponse.json({
          results: [{
            toolCallId: message.toolCalls?.[0]?.id,
            result: `I couldn't find the location "${userLocation}". Please provide a more specific address or landmark.`
          }]
        });
      }

      const userCoords = userLocationResults[0].geometry.location;

      // Search for places near the user's location
      const searchResults = await googleMapsClient.searchPlaces(
        searchQuery,
        userCoords,
        5000 // 5km radius
      );

      if (!searchResults.length) {
        return NextResponse.json({
          results: [{
            toolCallId: message.toolCalls?.[0]?.id,
            result: `I couldn't find any "${searchQuery}" near ${userLocation}. You might want to try a broader search or check a different area.`
          }]
        });
      }

      // Sort by distance and get top 5 results
      const sortedResults = searchResults
        .slice(0, 5)
        .map((result) => {
          // Calculate approximate distance (this is a simple approximation)
          const distance = calculateDistance(
            userCoords.lat,
            userCoords.lng,
            result.geometry.location.lat,
            result.geometry.location.lng
          );

          return {
            name: result.name,
            formatted_address: result.formatted_address,
            distance: `${distance.toFixed(1)} km`,
            rating: result.rating,
            types: result.types,
            place_id: result.place_id
          };
        });

      // Send email with results if email is provided
      if (userEmail) {
        try {
          const smtpClient = createSMTPClient();
          await smtpClient.sendMapResultEmail(userEmail, 'closest_location', {
            searchQuery,
            userLocation,
            results: sortedResults
          });
        } catch (emailError) {
          console.error('Failed to send email:', emailError);
          // Continue without failing the whole request
        }
      }

      // Format response for VAPI
      const responseText = `I found ${sortedResults.length} closest ${searchQuery} near ${userLocation}:\n\n` +
        sortedResults.map((result, idx) => 
          `${idx + 1}. ${result.name}\n` +
          `   📍 ${result.formatted_address}\n` +
          `   📏 ${result.distance} away\n` +
          `   ${result.rating ? `⭐ ${result.rating}/5 rating\n` : ''}` +
          `   🔗 https://www.google.com/maps/place/?q=place_id:${result.place_id}\n`
        ).join('\n') +
        (userEmail ? `\n📧 I've also sent detailed information to ${userEmail}` : '');

      return NextResponse.json({
        results: [{
          toolCallId: message.toolCalls?.[0]?.id,
          result: responseText
        }]
      });

    } catch (mapsError) {
      console.error('Google Maps API error:', mapsError);
      return NextResponse.json({
        results: [{
          toolCallId: message.toolCalls?.[0]?.id,
          result: `I encountered an error while searching for ${searchQuery}. Please try again or check if your location is correct.`
        }]
      });
    }

  } catch (error) {
    console.error('Find closest tool error:', error);
    return NextResponse.json({
      results: [{
        toolCallId: undefined,
        result: "I'm sorry, I encountered an error while searching for nearby locations. Please try again."
      }]
    });
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}
