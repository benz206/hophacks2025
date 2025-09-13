import { NextRequest, NextResponse } from 'next/server';
import { vapi } from '@/lib/vapi/client';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const assistant = await vapi.assistants.get(id);
    return NextResponse.json({ assistant }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const { name, firstmessage, systemprompt, phoneNumber }: { name?: string; firstmessage?: string; systemprompt?: string; phoneNumber?: string } = await req.json();
    if (!name && !firstmessage && !systemprompt) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }
    const updateBody: Record<string, unknown> = {};
    if (name) updateBody.name = name;
    if (firstmessage) updateBody.firstMessage = firstmessage;
    if (systemprompt) {
      updateBody.model = {
        provider: 'openai',
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemprompt }
        ],
      };
    }
    const assistant = await vapi.assistants.update(id, updateBody);
    return NextResponse.json({ assistant }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


