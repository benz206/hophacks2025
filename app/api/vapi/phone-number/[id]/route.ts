import { NextRequest, NextResponse } from 'next/server';
import { vapi } from '@/lib/vapi/client';

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Missing phone number id' }, { status: 400 });
    }

    const { assistantId } = await _req.json();
    if (!assistantId) {
      return NextResponse.json({ error: 'Missing assistantId' }, { status: 400 });
    }

    // According to Vapi SDK, patch takes (id, body)
    const number = await vapi.phoneNumbers.update(id, { assistantId });

    return NextResponse.json({ number }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


