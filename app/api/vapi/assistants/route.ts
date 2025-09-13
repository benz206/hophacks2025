import { NextRequest, NextResponse } from "next/server";
import { vapi } from "@/lib/vapi/client";

export async function POST(req: NextRequest) {
  try {
    const { firstmessage, systemprompt, name, phoneNumber } = await req.json();
    if (!firstmessage || !systemprompt || !name) {
      return NextResponse.json(
        { error: "Missing required fields: firstmessage, systemprompt, name" },
        { status: 400 }
      );
    }

    const assistant = await vapi.assistants.create({
      name,
      firstMessage: firstmessage,
      server: { url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/vapi/status` }, // for webhook
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an assistant, making a phone call to a service or a service representative. 
Your goal is to act on the user's behalf and complete their tasks or objectives during the call. 

CURRENT DATE AND TIME: ${new Date().toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              timeZoneName: "short",
            })}

You have access to the following tools: 
- endCall (to end the conversation) 
- sms (to send text messages) 
- dtmf (to handle keypad input) 
- apiRequest (to make API calls like checking order status)
- checkAvailability (to check calendar availability)
- scheduleAppointment (to schedule appointments and create calendar events)
- transferCall (to transfer the call to the user when needed)

            Use these tools when appropriate to successfully complete the user's tasks. 

IMPORTANT TRANSFER RULES:
- Use transferCall ONLY when there are problems or issues during the call
- When you don't have sufficient information to complete the task, FIRST explain to the service representative that you don't have the necessary information, THEN use transferCall to connect them with the actual user
- When asked for sensitive security information (SSN, passwords, PINs, account numbers, etc.), FIRST explain that you cannot provide such sensitive information, THEN use transferCall
- Use transferCall when the service representative requests to speak with the actual account holder
- Always EXPLAIN the reason for transfer before actually transferring the call
- Do NOT transfer the call if the task is completed successfully - simply end the call

            User information: ${systemprompt}`,
          },
        ],
        tools: [
          { type: "endCall" },
          { type: "sms" },
          { type: "dtmf" },
          {
            type: "apiRequest",
            name: "checkOrderStatus",
            url: "https://api.yourcompany.com/orders/{{orderNumber}}",
            method: "GET",
          },
          {
            type: "google.calendar.availability.check",
          },
          {
            type: "google.calendar.event.create",
          },
          ...(phoneNumber
            ? [
                {
                  type: "transferCall" as const,
                  destinations: [
                    {
                      type: "number" as const,
                      number: `+1${phoneNumber}`,
                    },
                  ],
                },
              ]
            : []),
        ],
      },
    });

    return NextResponse.json({ assistant }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating assistant:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}