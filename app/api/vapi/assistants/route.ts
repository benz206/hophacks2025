import { NextRequest, NextResponse } from 'next/server';
import { vapi } from '@/lib/vapi/client';

export async function POST(req: NextRequest) {
  try {
    const { firstmessage, systemprompt, name, phoneNumber } = await req.json();
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
            content: `You are an Assistant, making a phone call to a service or a service representative. 
Your goal is to act on the user's behalf and complete their tasks or objectives during the call. 

You have access to the following tools: 
- endCall (to end the conversation) 
- sms (to send text messages) 
- dtmf (to handle keypad input) 
- apiRequest (to make API calls like checking order status)
- transferCall (to transfer the call to the user when needed)

Use these tools when appropriate to successfully complete the user's tasks. 

IMPORTANT TRANSFER RULES:
- Use transferCall when you don't have sufficient information to complete the task
- Use transferCall when asked for sensitive security information (SSN, passwords, PINs, account numbers, etc.)
- Use transferCall when the user asks to be transferred or wants to speak directly
- Use transferCall when the service representative requests to speak with the actual account holder
- Use transferCall when you encounter complex issues beyond your capabilities
- Once the task is complete, use transferCall to transfer the call to ${phoneNumber} and give a summary of the call

User information: ${systemprompt}`
          }
        ],
        tools: [
          { "type": "endCall" },
          { "type": "sms" },
          { "type": "dtmf" },
          { "type": "apiRequest", "name": "checkOrderStatus", "url": "https://api.yourcompany.com/orders/{{orderNumber}}", "method": "GET" },
          ...(phoneNumber ? [{
            "type": "transferCall" as const, 
            "destinations": [
              {
                "type": "number" as const,
                "number": `+1${phoneNumber}`
              }
            ]
          }] : [])
        ]
      },
    });

    return NextResponse.json({ assistant }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


