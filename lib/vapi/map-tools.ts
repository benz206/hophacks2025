// VAPI Tool definitions for Google Maps functionality

export const findClosestLocationTool = {
  type: "function" as const,
  function: {
    name: "find_closest_location",
    description: "Find the closest businesses, places, or points of interest near a user's location. Results are sent to the user's email if provided.",
    parameters: {
      type: "object",
      properties: {
        searchQuery: {
          type: "string",
          description: "What to search for (e.g., 'restaurants', 'gas stations', 'hospitals', 'coffee shops')"
        },
        userLocation: {
          type: "string",
          description: "User's current location (address, city, or landmark)"
        },
      },
      required: ["searchQuery", "userLocation"]
    }
  },
  server: {
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/vapi/tools/find-closest`
  }
};

export const findRouteTool = {
  type: "function" as const,
  function: {
    name: "find_route",
    description: "Get turn-by-turn directions and route information between two locations. Detailed directions are sent to the user's email if provided.",
    parameters: {
      type: "object",
      properties: {
        origin: {
          type: "string",
          description: "Starting location (address, city, or landmark)"
        },
        destination: {
          type: "string",
          description: "Destination location (address, city, or landmark)"
        },
        travelMode: {
          type: "string",
          enum: ["driving", "walking", "bicycling", "transit"],
          description: "Mode of transportation (default: driving)"
        },
      },
      required: ["origin", "destination"]
    }
  },
  server: {
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/vapi/tools/find-route`
  }
};

export const locationInfoTool = {
  type: "function" as const,
  function: {
    name: "get_location_info",
    description: "Get detailed information about a specific location including address, phone, website, hours, and ratings. Information is sent to the user's email if provided.",
    parameters: {
      type: "object",
      properties: {
        locationQuery: {
          type: "string",
          description: "Location name, business name, or address to get information about"
        },
      },
      required: ["locationQuery"]
    }
  },
  server: {
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/vapi/tools/location-info`
  }
};

export const allMapTools = [
  findClosestLocationTool,
  findRouteTool,
  locationInfoTool
];

/**
 * Create VAPI tools for Google Maps functionality
 */
export async function createMapTools() {
  const { vapi } = await import('@/lib/vapi/client');
  
  const createdTools = [];
  
  for (const toolDef of allMapTools) {
    try {
      const tool = await vapi.tools.create(toolDef);
      createdTools.push(tool);
      console.log(`Created VAPI tool: ${toolDef.function.name}`);
    } catch (error) {
      console.error(`Failed to create tool ${toolDef.function.name}:`, error);
    }
  }
  
  return createdTools;
}

/**
 * Get the IDs of existing map tools
 */
export async function getMapToolIds(): Promise<string[]> {
  const { vapi } = await import('@/lib/vapi/client');
  
  try {
    const tools = await vapi.tools.list();
    const mapToolNames = allMapTools.map(tool => tool.function.name);
    
    return tools
      .filter((tool: any) => mapToolNames.includes(tool.function?.name))
      .map((tool: any) => tool.id);
  } catch (error) {
    console.error('Failed to get map tool IDs:', error);
    return [];
  }
}
