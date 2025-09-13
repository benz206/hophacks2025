import { NextRequest, NextResponse } from 'next/server';
import { vapi } from '@/lib/vapi/client';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { assistantId, customerNumber } = await req.json();
    
    // Better error logging
    if (!assistantId) {
      return NextResponse.json({ error: 'Missing assistantId' }, { status: 400 });
    }
    if (!customerNumber) {
      return NextResponse.json({ error: 'Missing customerNumber' }, { status: 400 });
    }
    if (!process.env.VAPI_PHONE_NUMBER_ID) {
      return NextResponse.json({ error: 'VAPI_PHONE_NUMBER_ID environment variable not set' }, { status: 500 });
    }
    const formattedNumber = customerNumber.startsWith('+') ? customerNumber : `+1${customerNumber}`;
    
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

    // Create call in Vapi
    const call = await vapi.calls.create({
      assistantId,
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
      customer: { number: formattedNumber }
    });

    // Store call record in Supabase
    const callId = 'id' in call ? call.id : call.results[0]?.id;
    if (!callId) {
      return NextResponse.json({ error: 'No call ID returned from Vapi' }, { status: 500 });
    }

    const { data: callRecord, error: dbError } = await supabase
      .from('calls')
      .insert({ 
        user_id: user.id, 
        call_id: callId
      })
      .select('*')
      .single();

    if (dbError) {
      console.error('Failed to store call record:', dbError);
      // Don't fail the request if DB storage fails, just log it
    }
    return NextResponse.json({ call, callRecord }, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in (error as unknown as object)) {
      const v = error as unknown as { statusCode?: number; body?: unknown; message?: string };
      return NextResponse.json({ error: v.message, details: v.body }, { status: v.statusCode ?? 500 });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


