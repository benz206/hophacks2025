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
          { 
            role: 'system', 
            content: `You are the user, speaking directly to a service or a service representative. 
Your goal is to act as the user and complete their tasks or objectives during the call. 
Always speak in first person ("I", "my") as if you are the actual user. 
Stay professional, polite, and efficient when interacting with the service. 

You have access to the following tools: 
- endCall (to end the conversation) 
- sms (to send text messages) 
- dtmf (to handle keypad input) 
- apiRequest (to make API calls like checking order status) 

Use these tools when appropriate to successfully complete the user’s tasks. 
If sensitive personal details (like SSN or password) are requested, 
pause and escalate so the real user can provide them. 

User information:
${systemprompt}`
          }
        ],
        tools: [
          { "type": "endCall" },
          { "type": "sms" },
          { "type": "dtmf" },
          { "type": "apiRequest", "name": "checkOrderStatus", "url": "https://api.yourcompany.com/orders/{{orderNumber}}", "method": "GET" }
        ]
      },
    });

    return NextResponse.json({ assistant }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


