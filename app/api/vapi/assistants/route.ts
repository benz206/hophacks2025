import { NextRequest, NextResponse } from "next/server";
import { vapi } from "@/lib/vapi/client";
import { getMapToolIds } from "@/lib/vapi/map-tools";
import { allBrowserTools } from "@/lib/vapi/browser-tool";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Assistant creation request body:", body);

    const { firstmessage, systemprompt, name, phoneNumber } = body;

    if (!firstmessage || !systemprompt || !name) {
      console.error("Missing required fields:", {
        firstmessage: !!firstmessage,
        systemprompt: !!systemprompt,
        name: !!name,
      });
      return NextResponse.json(
        {
          error: "Missing required fields: firstmessage, systemprompt, name",
          received: body,
          required: ["firstmessage", "systemprompt", "name"],
          note: "systemprompt cannot be empty - provide a description of the assistant's role",
        },
        { status: 400 }
      );
    }

    // Get map tool IDs to include in the assistant (optional)
    let mapToolIds: string[] = [];
    try {
      mapToolIds = await getMapToolIds();
      console.log("Map tool IDs found:", mapToolIds);
    } catch (error) {
      console.warn(
        "Could not get map tool IDs (tools may not be created yet):",
        error
      );
      // Continue without map tools - they can be added later
    }

    // Get browser tool IDs to include in the assistant
    let browserToolIds: string[] = [];
    try {
      const allTools = await vapi.tools.list();
      const browserToolNames = allBrowserTools.map(tool => tool.function.name);
      const browserTools = allTools.filter((tool: any) => 
        browserToolNames.includes(tool.function?.name)
      );
      browserToolIds = browserTools.map((tool: any) => tool.id);
      console.log("Browser tool IDs found:", browserToolIds);
    } catch (error) {
      console.warn(
        "Could not get browser tool IDs (tools may not be created yet):",
        error
      );
      // Continue without browser tools - they can be added later
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
If there is an error using a tool, explain the error technically in detail to the user as if they were a developer.
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
- find_closest_location (to find nearby businesses, restaurants, services, etc.)
- find_route (to get directions and route information between locations)
- get_location_info (to get detailed information about specific places)
- browser_automation (to automate browser tasks using AI - ask user for task description)

            Use these tools when appropriate to successfully complete the user's tasks.
            
            For location-based requests:
            - When finding closest locations, ask for their current location and what they're looking for
            - When getting directions, ask for both starting point and destination
            - Provide clear, helpful information and automatically send detailed results via email
            
            For browser automation requests:
            - Ask the user to describe the specific task they want performed in the browser
            - Examples: "search for restaurants", "book a flight", "check weather", "order food online"
            - The system will automatically perform the browser actions to complete the task 

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
        // Include map tools and browser tools if available
        toolIds: [...mapToolIds, ...browserToolIds].length > 0 ? [...mapToolIds, ...browserToolIds] : undefined,
      },
    });

    return NextResponse.json({ assistant }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating assistant:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
