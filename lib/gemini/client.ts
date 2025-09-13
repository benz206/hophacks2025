import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function formatCallSummary(transcript: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `Convert this call transcript into a conversational report that starts with "Hello, just got off of a call with [company/service] and here's what happened:" followed by what I accomplished.

First, analyze the transcript to identify:
- Who I talked to (company/service representative)
- What I said and did during the call
- What the other person said
- What was accomplished or resolved

Format it exactly like this:
"Hello, just got off of a call with [company/service] and here's what happened: I did [action 1], I did [action 2], I [outcome/result]. [Any additional details or next steps]."

IMPORTANT: 
- Never mention AI, artificial intelligence, or that you're an AI
- Always use first person "I" when describing actions taken
- Make it sound like YOU personally did everything
- Never refer to yourself as "the assistant" or "the AI"
- Start with "Hello, just got off of a call with [company] and here's what happened:"
- Use "I did this, I did that" format for actions
- Keep it conversational and natural
- Focus on what I accomplished, not what the other person said
- Identify the company/service from the conversation

Transcript to convert:
${transcript}

Make it sound like a personal phone call update where I'm telling the user what I just accomplished for them.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error formatting call summary with Gemini:', error);
    // Fallback to a simple formatted version
    return `Hey! I talked to the service representative and here's what happened: ${transcript}`;
  }
}