import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const envCheck = {
      VAPI_API_KEY: !!process.env.VAPI_API_KEY,
      VAPI_PHONE_NUMBER_ID: !!process.env.VAPI_PHONE_NUMBER_ID,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    };

    return NextResponse.json({
      environment: envCheck,
      message: 'VAPI environment check',
      required: {
        VAPI_API_KEY: 'Your VAPI API key',
        VAPI_PHONE_NUMBER_ID: 'Your VAPI phone number ID for making calls'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Environment check failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    return NextResponse.json({
      received: body,
      message: 'Test endpoint - this would normally create a call',
      required: {
        assistantId: 'Valid VAPI assistant ID',
        customerNumber: 'Phone number to call (e.g., +1234567890)'
      },
      example: {
        assistantId: 'your-assistant-id-here',
        customerNumber: '+1234567890'
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Invalid JSON in request body',
      message: 'Make sure to send valid JSON with assistantId and customerNumber'
    }, { status: 400 });
  }
}
