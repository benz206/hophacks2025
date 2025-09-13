import { NextRequest, NextResponse } from 'next/server';
import { vapi } from '@/lib/vapi/client';

export async function POST(req: NextRequest) {
  try {
    const { firstmessage, systemprompt, name } = await req.json();
    if (!firstmessage || !systemprompt || !name) {
      return NextResponse.json({ error: 'Missing required fields: firstmessage, systemprompt, name' }, { status: 400 });
    }

    const assistant = await vapi.assistants.create({
      name,
      firstMessage: firstmessage,
      model: {
        provider: 'openai',
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemprompt }
        ]
      }
    });

    return NextResponse.json({ assistant }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


