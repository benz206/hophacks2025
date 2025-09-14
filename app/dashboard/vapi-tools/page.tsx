'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, MapPin, Route, Info, Trash2, RefreshCw, Plus, Globe } from 'lucide-react';

type VAPITool = {
  id: string;
  function: {
    name: string;
    description: string;
    parameters: any;
  };
  server?: {
    url: string;
  };
};

export default function VAPIToolsPage() {
  const [tools, setTools] = useState<VAPITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const response = await fetch('/api/vapi/tools/manage');
      if (!response.ok) throw new Error('Failed to load tools');
      const { tools } = await response.json();
      setTools(tools);
    } catch (error) {
      toast.error('Failed to load VAPI tools');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToolAction = async (action: string) => {
    setActionLoading(action);
    try {
      const response = await fetch('/api/vapi/tools/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) throw new Error(`Failed to ${action} tools`);
      
      const result = await response.json();
      toast.success(result.message);
      
      // Reload tools after action
      await loadTools();
    } catch (error) {
      toast.error(`Failed to ${action} tools`);
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const getToolIcon = (toolName: string) => {
    switch (toolName) {
      case 'find_closest_location':
        return <MapPin className="h-5 w-5" />;
      case 'find_route':
        return <Route className="h-5 w-5" />;
      case 'get_location_info':
        return <Info className="h-5 w-5" />;
      case 'browser_automation':
        return <Globe className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  const getToolDescription = (toolName: string) => {
    switch (toolName) {
      case 'find_closest_location':
        return 'Find nearby businesses, restaurants, and services';
      case 'find_route':
        return 'Get directions and route information';
      case 'get_location_info':
        return 'Get detailed information about locations';
      case 'browser_automation':
        return 'Automate browser tasks using AI';
      default:
        return 'Integration tool';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">VAPI Tools Management</h1>
        <p className="text-muted-foreground">
          Manage your custom tools for VAPI assistants including Google Maps and browser automation.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => handleToolAction('create')}
          disabled={actionLoading !== null}
          className="flex items-center gap-2"
        >
          {actionLoading === 'create' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Create Tools
        </Button>
        
        <Button
          onClick={() => handleToolAction('recreate')}
          disabled={actionLoading !== null}
          variant="outline"
          className="flex items-center gap-2"
        >
          {actionLoading === 'recreate' ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Recreate All
        </Button>
        
        <Button
          onClick={() => handleToolAction('delete')}
          disabled={actionLoading !== null}
          variant="destructive"
          className="flex items-center gap-2"
        >
          {actionLoading === 'delete' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Delete All
        </Button>
        
        <Button
          onClick={loadTools}
          disabled={actionLoading !== null}
          variant="ghost"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Tools Grid */}
      {tools.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Card key={tool.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  {getToolIcon(tool.function.name)}
                  <CardTitle className="text-lg">{tool.function.name}</CardTitle>
                </div>
                <Badge variant="default">Active</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {tool.function.description}
                </CardDescription>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Tool ID:</strong>
                    <code className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                      {tool.id}
                    </code>
                  </div>
                  
                  {tool.server?.url && (
                    <div>
                      <strong>Endpoint:</strong>
                      <div className="text-xs text-muted-foreground mt-1 break-all">
                        {tool.server.url}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <strong>Parameters:</strong>
                    <div className="text-xs text-muted-foreground mt-1">
                      {Object.keys(tool.function.parameters.properties || {}).join(', ')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No VAPI Tools Found</h3>
            <p className="text-muted-foreground mb-4">
              Create tools to enable location features and browser automation in your VAPI assistants.
            </p>
            <Button onClick={() => handleToolAction('create')}>
              <Plus className="mr-2 h-4 w-4" />
              Create Tools
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>About VAPI Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">🗺️ Find Closest Location</h4>
            <p className="text-sm text-muted-foreground">
              Helps users find nearby businesses, restaurants, gas stations, hospitals, and other services. 
              Results include distance, ratings, and contact information.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">🚗 Find Route</h4>
            <p className="text-sm text-muted-foreground">
              Provides turn-by-turn directions between two locations with support for driving, walking, 
              cycling, and public transit modes.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">📍 Location Information</h4>
            <p className="text-sm text-muted-foreground">
              Gets detailed information about specific places including address, phone numbers, 
              website, hours, and ratings.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">🌐 Browser Automation</h4>
            <p className="text-sm text-muted-foreground">
              Automate browser tasks using AI. Users can describe any web-based task and the system 
              will perform the necessary browser actions to complete it.
            </p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">📧 Email Integration</h4>
            <p className="text-sm text-muted-foreground">
              All tools can send detailed results to the user's email address using your SMTP configuration. 
              The assistant will ask for the user's email when providing services.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
