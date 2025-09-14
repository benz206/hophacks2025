import { NextRequest, NextResponse } from 'next/server';
import { createMapTools, getMapToolIds, allTools } from '@/lib/vapi/map-tools';
import { allBrowserTools } from '@/lib/vapi/browser-tool';
import { vapi } from '@/lib/vapi/client';

export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json();
    
    switch (action) {
      case 'create':
        const createdMapTools = await createMapTools();
        
        // Also create browser tools
        const createdBrowserTools = [];
        for (const toolDef of allBrowserTools) {
          try {
            const tool = await vapi.tools.create(toolDef);
            createdBrowserTools.push(tool);
            console.log(`Created VAPI tool: ${toolDef.function.name}`);
          } catch (error) {
            console.error(`Failed to create tool ${toolDef.function.name}:`, error);
          }
        }
        
        const allCreatedTools = [...createdMapTools, ...createdBrowserTools];
        return NextResponse.json({ 
          success: true, 
          tools: allCreatedTools,
          message: `Created ${allCreatedTools.length} tools (${createdMapTools.length} map + ${createdBrowserTools.length} browser)`
        });
      
      case 'list':
        const tools = await vapi.tools.list();
        const toolNames = allTools.map(tool => tool.function.name);
        const filteredTools = tools.filter((tool: any) => 
          toolNames.includes(tool.function?.name)
        );
        
        return NextResponse.json({ 
          success: true, 
          tools: filteredTools,
          message: `Found ${filteredTools.length} tools`
        });
      
      case 'delete':
        const toolIds = await getMapToolIds();
        
        // Also get browser tool IDs
        const deleteToolNames = allTools.map(tool => tool.function.name);
        const deleteToolsList = await vapi.tools.list();
        const browserToolIds = deleteToolsList
          .filter((tool: any) => deleteToolNames.includes(tool.function?.name))
          .map((tool: any) => tool.id);
        
        const allToolIds = [...toolIds, ...browserToolIds];
        const deletedCount = [];
        
        for (const toolId of allToolIds) {
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
          message: `Deleted ${deletedCount.length} tools`
        });
      
      case 'recreate':
        // Delete existing tools first
        const recreateToolNames = allTools.map(tool => tool.function.name);
        const recreateToolsList = await vapi.tools.list();
        const existingToolIds = recreateToolsList
          .filter((tool: any) => recreateToolNames.includes(tool.function?.name))
          .map((tool: any) => tool.id);
          
        for (const toolId of existingToolIds) {
          try {
            await vapi.tools.delete(toolId);
          } catch (error) {
            console.warn(`Failed to delete existing tool ${toolId}:`, error);
          }
        }
        
        // Create new tools
        const newMapTools = await createMapTools();
        const newBrowserTools = [];
        for (const toolDef of allBrowserTools) {
          try {
            const tool = await vapi.tools.create(toolDef);
            newBrowserTools.push(tool);
            console.log(`Created VAPI tool: ${toolDef.function.name}`);
          } catch (error) {
            console.error(`Failed to create tool ${toolDef.function.name}:`, error);
          }
        }
        
        const allNewTools = [...newMapTools, ...newBrowserTools];
        return NextResponse.json({ 
          success: true, 
          tools: allNewTools,
          message: `Recreated ${allNewTools.length} tools (${newMapTools.length} map + ${newBrowserTools.length} browser)`
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
    const allToolNames = allTools.map(tool => tool.function.name);
    const filteredTools = tools.filter((tool: any) => 
      allToolNames.includes(tool.function?.name)
    );
    
    return NextResponse.json({ 
      success: true, 
      tools: filteredTools,
      definitions: allTools
    });
  } catch (error) {
    console.error('Failed to list VAPI tools:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
