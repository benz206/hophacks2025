import { NextRequest, NextResponse } from 'next/server';
import { vapi } from '@/lib/vapi/client';

export async function POST(req: NextRequest) {
  try {
    const { assistantId, customerNumber } = await req.json();
    if (!assistantId || !customerNumber || !process.env.VAPI_PHONE_NUMBER_ID) {
      return NextResponse.json({ error: 'Missing required fields: assistantId, customerNumber' }, { status: 400 });
    }

    const call = await vapi.calls.create({
      assistantId,
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
      customer: { number: customerNumber }
    });

    return NextResponse.json({ call }, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in (error as unknown as object)) {
      const v = error as unknown as { statusCode?: number; body?: unknown; message?: string };
      return NextResponse.json({ error: v.message, details: v.body }, { status: v.statusCode ?? 500 });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


