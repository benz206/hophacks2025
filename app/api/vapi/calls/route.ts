import { NextRequest, NextResponse } from 'next/server';
import { vapi } from '@/lib/vapi/client';

export async function POST(req: NextRequest) {
  try {
    const { assistantId, customerNumber } = await req.json();
    if (!assistantId || !customerNumber) {
      return NextResponse.json({ error: 'Missing required fields: assistantId, customerNumber' }, { status: 400 });
    }

    const call = await vapi.calls.create({
      assistantId,
      customer: { number: customerNumber }
    });

    return NextResponse.json({ call }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


