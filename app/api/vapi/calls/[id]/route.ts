import { NextRequest, NextResponse } from 'next/server';
import { vapi } from '@/lib/vapi/client';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const callId = params.id;
    if (!callId) {
      return NextResponse.json({ error: 'Call ID is required' }, { status: 400 });
    }

    const call = await vapi.calls.get(callId);
    return NextResponse.json({ call }, { status: 200 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in (error as unknown as object)) {
      const v = error as unknown as { statusCode?: number; body?: unknown; message?: string };
      return NextResponse.json({ error: v.message, details: v.body }, { status: v.statusCode ?? 500 });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
