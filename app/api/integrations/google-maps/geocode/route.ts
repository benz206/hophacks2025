import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { GoogleMapsClient } from '@/lib/google-maps/client';

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

    const { address } = await req.json();
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    // Get the user's Google Maps integration
    const { data: integrations, error: intError } = await supabase
      .from('integrations')
      .select('api_key, status')
      .eq('user_id', user.id)
      .eq('service_name', 'google_maps')
      .single();

    if (intError || !integrations) {
      return NextResponse.json({ 
        error: 'Google Maps integration not found. Please configure it first.' 
      }, { status: 400 });
    }

    if (integrations.status !== 'active' || !integrations.api_key) {
      return NextResponse.json({ 
        error: 'Google Maps integration is not active or missing API key.' 
      }, { status: 400 });
    }

    // Decrypt API key (in a real app, use proper decryption)
    const apiKey = atob(integrations.api_key);
    const googleMaps = new GoogleMapsClient({ apiKey });

    try {
      const results = await googleMaps.geocode(address);
      
      // Update last_used_at timestamp
      await supabase
        .from('integrations')
        .update({ last_used_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('service_name', 'google_maps');

      return NextResponse.json({ 
        success: true,
        results: results.map(result => ({
          formatted_address: result.formatted_address,
          location: result.geometry.location,
          place_id: result.place_id,
          types: result.types
        }))
      }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ 
        error: `Geocoding failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }, { status: 500 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
