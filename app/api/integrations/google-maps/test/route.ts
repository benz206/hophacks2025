import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

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

    const { api_key } = await req.json();
    if (!api_key) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    // Test the Google Maps API key with a simple geocoding request
    try {
      const testResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${api_key}`
      );
      
      const testData = await testResponse.json();
      
      if (testData.status === 'OK') {
        // API key is valid
        return NextResponse.json({ 
          valid: true, 
          message: 'Google Maps API key is valid',
          test_result: {
            status: testData.status,
            results_count: testData.results?.length || 0
          }
        }, { status: 200 });
      } else if (testData.status === 'REQUEST_DENIED') {
        return NextResponse.json({ 
          valid: false, 
          message: 'API key is invalid or restricted',
          error: testData.error_message || 'Request denied'
        }, { status: 400 });
      } else {
        return NextResponse.json({ 
          valid: false, 
          message: 'API key test failed',
          error: testData.error_message || `Status: ${testData.status}`
        }, { status: 400 });
      }
    } catch (error) {
      return NextResponse.json({ 
        valid: false, 
        message: 'Failed to test API key',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
