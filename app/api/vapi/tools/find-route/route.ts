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
    const { origin, destination, travelMode } = message.toolCalls?.[0]?.function?.arguments || {};
    
    if (!origin || !destination) {
      return NextResponse.json({
        results: [{
          toolCallId: message.toolCalls?.[0]?.id,
          result: "I need both a starting location and destination to find the best route."
        }]
      });
    }

    // googleMapsClient is already created above

    try {
      // Get directions
      const mode = travelMode?.toLowerCase() || 'driving';
      const validModes = ['driving', 'walking', 'bicycling', 'transit'];
      const selectedMode = validModes.includes(mode) ? mode as any : 'driving';

      const directions = await googleMapsClient.getDirections(origin, destination, {
        mode: selectedMode,
        units: 'metric'
      });

      if (!directions.routes?.length) {
        return NextResponse.json({
          results: [{
            toolCallId: message.toolCalls?.[0]?.id,
            result: `I couldn't find a route from ${origin} to ${destination}. Please check if both locations are correct and accessible.`
          }]
        });
      }

      const route = directions.routes[0];
      const leg = route.legs[0];

      // Prepare route data
      const routeData = {
        origin: leg.start_address,
        destination: leg.end_address,
        distance: leg.distance,
        duration: leg.duration,
        steps: leg.steps.map(step => ({
          instructions: step.html_instructions.replace(/<[^>]*>/g, ''), // Remove HTML tags
          distance: step.distance,
          duration: step.duration
        }))
      };

      // Send email with detailed directions if email is provided
      if (userEmail) {
        try {
          const smtpClient = createSMTPClient();
          await smtpClient.sendMapResultEmail(userEmail, 'route_directions', {
            origin: routeData.origin,
            destination: routeData.destination,
            route: routeData,
            travelMode: selectedMode
          });
        } catch (emailError) {
          console.error('Failed to send email:', emailError);
          // Continue without failing the whole request
        }
      }

      // Format response for VAPI
      const modeTextMap = {
        driving: '🚗 Driving',
        walking: '🚶 Walking',
        bicycling: '🚴 Cycling',
        transit: '🚌 Public Transit'
      } as const;
      const modeText = modeTextMap[selectedMode as keyof typeof modeTextMap] || '🚗 Driving';

      const responseText = `${modeText} route from ${routeData.origin} to ${routeData.destination}:\n\n` +
        `📏 Distance: ${routeData.distance.text}\n` +
        `⏱️ Duration: ${routeData.duration.text}\n\n` +
        `📋 Turn-by-turn directions:\n` +
        routeData.steps.slice(0, 8).map((step, index) => // Limit to first 8 steps for voice
          `${index + 1}. ${step.instructions} (${step.distance.text})`
        ).join('\n') +
        (routeData.steps.length > 8 ? `\n... and ${routeData.steps.length - 8} more steps` : '') +
        `\n\n🔗 View full route: https://www.google.com/maps/dir/${encodeURIComponent(origin)}/${encodeURIComponent(destination)}` +
        (userEmail ? `\n📧 I've also sent detailed turn-by-turn directions to ${userEmail}` : '');

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
          result: `I encountered an error while finding the route from ${origin} to ${destination}. Please check if both locations are correct and try again.`
        }]
      });
    }

  } catch (error) {
    console.error('Find route tool error:', error);
    return NextResponse.json({
      results: [{
        toolCallId: undefined,
        result: "I'm sorry, I encountered an error while finding the route. Please try again."
      }]
    });
  }
}
