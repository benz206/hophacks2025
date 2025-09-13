import { NextRequest, NextResponse } from "next/server";
import { vapi } from "@/lib/vapi/client";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Missing assistant id' }, { status: 400 });
    
    const { toolIds }: { toolIds: string[] } = await req.json();
    if (!toolIds || !Array.isArray(toolIds) || toolIds.length === 0) {
      return NextResponse.json({ error: 'toolIds array is required' }, { status: 400 });
    }

    // Update the assistant with the new tools
    const updatedAssistant = await vapi.assistants.update(id, {
      model: {
        provider: 'openai',
        model: 'gpt-4o',
        toolIds: toolIds
      }
    });

    return NextResponse.json({ 
      success: true, 
      assistant: updatedAssistant,
      message: `Successfully attached ${toolIds.length} tool(s) to assistant`
    }, { status: 200 });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error attaching tools to assistant:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Missing assistant id' }, { status: 400 });
    
    const { toolIds }: { toolIds: string[] } = await req.json();
    if (!toolIds || !Array.isArray(toolIds)) {
      return NextResponse.json({ error: 'toolIds array is required' }, { status: 400 });
    }

    // Get current assistant to remove specific tools
    const assistant = await vapi.assistants.get(id);
    const currentToolIds = assistant.model?.toolIds || [];
    
    // Remove the specified tool IDs
    const updatedToolIds = currentToolIds.filter(toolId => !toolIds.includes(toolId));

    // Update the assistant with the remaining tools
    const updatedAssistant = await vapi.assistants.update(id, {
      model: {
        provider: 'openai',
        model: 'gpt-4o',
        toolIds: updatedToolIds
      }
    });

    return NextResponse.json({ 
      success: true, 
      assistant: updatedAssistant,
      message: `Successfully removed ${toolIds.length} tool(s) from assistant`
    }, { status: 200 });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error removing tools from assistant:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
