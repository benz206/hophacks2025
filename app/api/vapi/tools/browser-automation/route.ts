import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    
    // Extract parameters from the VAPI message
    const { task, details } = message.toolCalls?.[0]?.function?.arguments || {};
    
    if (!task) {
      return NextResponse.json({
        results: [{
          toolCallId: message.toolCalls?.[0]?.id,
          result: "I need a task description to perform browser automation. Please tell me what you'd like me to do in the browser."
        }]
      });
    }

    try {
      // Make API call to localhost:8000
      const prompt = `${task}${details ? ` - ${details}` : ''}`;
      const url = `http://127.0.0.1:8000/run?prompt=${encodeURIComponent(prompt)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Browser automation server responded with status: ${response.status}`);
      }

      const result = await response.json();
      
      // Format response for VAPI
      const responseText = `I've completed the browser task: "${task}"\n\n` +
        `Status: ${result.status}\n` +
        `Result: ${result.result}\n\n` +
        `The browser automation has finished processing your request.`;

      return NextResponse.json({
        results: [{
          toolCallId: message.toolCalls?.[0]?.id,
          result: responseText
        }]
      });

    } catch (browserError) {
      console.error('Browser automation error:', browserError);
      return NextResponse.json({
        results: [{
          toolCallId: message.toolCalls?.[0]?.id,
          result: `I encountered an error while performing the browser task "${task}". The browser automation service may be unavailable. Please try again later or check if the service is running on localhost:8000.`
        }]
      });
    }

  } catch (error) {
    console.error('Browser automation tool error:', error);
    return NextResponse.json({
      results: [{
        toolCallId: undefined,
        result: "I'm sorry, I encountered an error while processing your browser automation request. Please try again."
      }]
    });
  }
}
