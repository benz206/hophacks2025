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
          { 
            role: 'system', 
            content: `You are an Assistant, making a phone call to a service or a service representative. 
Your goal is to act on the user's behalf and complete their tasks or objectives during the call. 

CURRENT DATE AND TIME: ${new Date().toLocaleString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZoneName: 'short'
})}

You have access to the following tools: 
- endCall (to end the conversation) 
- sms (to send text messages) 
- dtmf (to handle keypad input) 
- apiRequest (to make API calls like checking order status)
- checkAvailability (to check calendar availability)
- scheduleAppointment (to schedule appointments and create calendar events)
- transferCall (to transfer the call to the user when requested)

Use these tools when appropriate to successfully complete the user's tasks. 

IMPORTANT TRANSFER RULES:
- Use transferCall ONLY when there are problems or issues during the call
- Use transferCall when you don't have sufficient information to complete the task
- Use transferCall when asked for sensitive security information (SSN, passwords, PINs, account numbers, etc.)
- Use transferCall when the user asks to be transferred or wants to speak directly
- Use transferCall when the service representative requests to speak with the actual account holder
- Use transferCall when you encounter complex issues beyond your capabilities
- Use transferCall when there are technical difficulties or errors
- Do NOT transfer the call if the task is completed successfully - simply end the call

User information: ${systemprompt}`
          }
        ],
        tools: [
          { "type": "endCall" },
          { "type": "sms" },
          { "type": "dtmf" },
          { "type": "apiRequest", "name": "checkOrderStatus", "url": "https://api.yourcompany.com/orders/{{orderNumber}}", "method": "GET" },
          {
            "type": "google.calendar.availability.check"
          },
          {
            "type": "google.calendar.event.create"
          },
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
      };
    }
    const assistant = await vapi.assistants.update(id, updateBody);
    return NextResponse.json({ assistant }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


