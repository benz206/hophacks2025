import { getSupabaseServerClient } from "@/lib/supabase/server";
import { vapi } from "@/lib/vapi/client";
import { formatCallSummary } from "@/lib/gemini/client";
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
          .select("phone_number, created_at")
          .eq("agent_id", assistantId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (error) {
          console.error("Failed to fetch agent:", error);
          break;
        }

        const customerNumber = data?.phone_number;
        const transcript = message.transcript;

        // Format the transcript using Gemini AI
        const formattedSummary = await formatCallSummary(transcript);

        const formattedNumber = String(customerNumber).startsWith("+")
          ? customerNumber
          : `+1${customerNumber}`;

        await vapi.calls.create({
          phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
          customer: { number: formattedNumber },
          assistant: {
            firstMessage: formattedSummary,
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
