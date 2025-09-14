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
    const { locationQuery } = message.toolCalls?.[0]?.function?.arguments || {};
    
    if (!locationQuery) {
      return NextResponse.json({
        results: [{
          toolCallId: message.toolCalls?.[0]?.id,
          result: "I need a location name or address to get information about it."
        }]
      });
    }

    // googleMapsClient is already created above

    try {
      // First, search for the location
      const searchResults = await googleMapsClient.searchPlaces(locationQuery);
      
      if (!searchResults.length) {
        return NextResponse.json({
          results: [{
            toolCallId: message.toolCalls?.[0]?.id,
            result: `I couldn't find any information about "${locationQuery}". Please try a more specific location name or address.`
          }]
        });
      }

      const location = searchResults[0];
      
      // Get detailed place information
      let placeDetails = {};
      try {
        placeDetails = await googleMapsClient.getPlaceDetails(location.place_id, [
          'name',
          'formatted_address',
          'formatted_phone_number',
          'website',
          'rating',
          'opening_hours',
          'price_level',
          'types',
          'geometry'
        ]);
      } catch (detailsError) {
        console.warn('Could not get place details:', detailsError);
      }

      // Prepare location data
      const locationData = {
        name: location.name,
        address: location.formatted_address,
        location: location.geometry.location,
        details: {
          rating: location.rating || placeDetails.rating,
          phone: placeDetails.formatted_phone_number,
          website: placeDetails.website,
          hours: placeDetails.opening_hours?.weekday_text?.join(', ') || 'Hours not available',
          price_level: placeDetails.price_level ? '$'.repeat(placeDetails.price_level) : undefined,
          types: location.types?.slice(0, 3).map((type: string) => type.replace(/_/g, ' ')).join(', ')
        }
      };

      // Send email with detailed information if email is provided
      if (userEmail) {
        try {
          const smtpClient = createSMTPClient();
          await smtpClient.sendMapResultEmail(userEmail, 'location_info', locationData);
        } catch (emailError) {
          console.error('Failed to send email:', emailError);
          // Continue without failing the whole request
        }
      }

      // Format response for VAPI
      let responseText = `📍 Information about ${locationData.name}:\n\n` +
        `🏠 Address: ${locationData.address}\n` +
        `📍 Coordinates: ${locationData.location.lat}, ${locationData.location.lng}\n`;

      if (locationData.details.rating) {
        responseText += `⭐ Rating: ${locationData.details.rating}/5\n`;
      }

      if (locationData.details.phone) {
        responseText += `📞 Phone: ${locationData.details.phone}\n`;
      }

      if (locationData.details.website) {
        responseText += `🌐 Website: ${locationData.details.website}\n`;
      }

      if (locationData.details.price_level) {
        responseText += `💰 Price Level: ${locationData.details.price_level}\n`;
      }

      if (locationData.details.types) {
        responseText += `🏷️ Categories: ${locationData.details.types}\n`;
      }

      responseText += `\n🔗 View on Google Maps: https://www.google.com/maps/place/?q=place_id:${location.place_id}`;

      if (userEmail) {
        responseText += `\n📧 I've also sent detailed information including hours and more details to ${userEmail}`;
      }

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
          result: `I encountered an error while getting information about "${locationQuery}". Please check if the location name is correct and try again.`
        }]
      });
    }

  } catch (error) {
    console.error('Location info tool error:', error);
    return NextResponse.json({
      results: [{
        toolCallId: req.body?.message?.toolCalls?.[0]?.id,
        result: "I'm sorry, I encountered an error while getting location information. Please try again."
      }]
    });
  }
}
