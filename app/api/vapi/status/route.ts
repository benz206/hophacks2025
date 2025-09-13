import { getSupabaseServerClient } from "@/lib/supabase/server";
import { vapi } from "@/lib/vapi/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message;

    switch (message.type) {
      case "end-of-call-report":
        const assistantId = message.call?.assistantId;
        const supabase = await getSupabaseServerClient();

        const { data, error } = await supabase
          .from("agents")
          .select("phone_number")
          .eq("agent_id", assistantId)
          .single();
        if (error) {
          console.error("Failed to fetch agent:", error);
          break;
        }

        const customerNumber = data?.phone_number;
        const summary = message.summary;

        const formattedNumber = customerNumber.startsWith("+")
          ? customerNumber
          : `+1${customerNumber}`;

        await vapi.calls.create({
          phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
          customer: { number: formattedNumber },
          assistant: {
            firstMessage: `Here's your summary: ${summary}`,
            model: {
              provider: "openai",
              model: "gpt-4o",
              messages: [
                {
                  role: "system",
                  content: "After delivering the first message, end the call.",
                },
              ],
              tools: [{ type: "endCall" }],
            },
          },
        });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error parsing Vapi webhook:", err);
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
