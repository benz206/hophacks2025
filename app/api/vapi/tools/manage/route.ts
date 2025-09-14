import { NextRequest, NextResponse } from 'next/server';
import { createMapTools, getMapToolIds, allMapTools } from '@/lib/vapi/map-tools';
import { vapi } from '@/lib/vapi/client';

export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json();
    
    switch (action) {
      case 'create':
        const createdTools = await createMapTools();
        return NextResponse.json({ 
          success: true, 
          tools: createdTools,
          message: `Created ${createdTools.length} map tools`
        });
      
      case 'list':
        const tools = await vapi.tools.list();
        const mapToolNames = allMapTools.map(tool => tool.function.name);
        const mapTools = tools.filter((tool: any) => 
          mapToolNames.includes(tool.function?.name)
        );
        
        return NextResponse.json({ 
          success: true, 
          tools: mapTools,
          message: `Found ${mapTools.length} map tools`
        });
      
      case 'delete':
        const toolIds = await getMapToolIds();
        const deletedCount = [];
        
        for (const toolId of toolIds) {
          try {
            await vapi.tools.delete(toolId);
            deletedCount.push(toolId);
          } catch (error) {
            console.error(`Failed to delete tool ${toolId}:`, error);
          }
        }
        
        return NextResponse.json({ 
          success: true, 
          deletedIds: deletedCount,
          message: `Deleted ${deletedCount.length} map tools`
        });
      
      case 'recreate':
        // Delete existing tools first
        const existingToolIds = await getMapToolIds();
        for (const toolId of existingToolIds) {
          try {
            await vapi.tools.delete(toolId);
          } catch (error) {
            console.warn(`Failed to delete existing tool ${toolId}:`, error);
          }
        }
        
        // Create new tools
        const newTools = await createMapTools();
        return NextResponse.json({ 
          success: true, 
          tools: newTools,
          message: `Recreated ${newTools.length} map tools`
        });
      
      default:
        return NextResponse.json({ 
          error: 'Invalid action. Use: create, list, delete, or recreate' 
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error('VAPI tools management error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const tools = await vapi.tools.list();
    const mapToolNames = allMapTools.map(tool => tool.function.name);
    const mapTools = tools.filter((tool: any) => 
      mapToolNames.includes(tool.function?.name)
    );
    
    return NextResponse.json({ 
      success: true, 
      tools: mapTools,
      definitions: allMapTools
    });
  } catch (error) {
    console.error('Failed to list VAPI tools:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
