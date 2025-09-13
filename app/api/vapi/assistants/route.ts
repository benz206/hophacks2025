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
      server: { url: `http://localhost:3000/api/vapi/status` }, // for webhook
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemprompt,
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
