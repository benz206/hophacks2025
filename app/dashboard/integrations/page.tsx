'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Settings, MapPin, Key, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { GoogleMapsDemo } from '@/components/integrations/google-maps-demo';

type Integration = {
  id: string;
  service_name: string;
  display_name: string;
  description: string;
  status: 'active' | 'inactive' | 'error' | 'pending';
  config: Record<string, any>;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  last_used_at: string | null;
};

const StatusBadge = ({ status }: { status: Integration['status'] }) => {
  const variants = {
    active: { variant: 'default' as const, icon: CheckCircle, text: 'Active' },
    inactive: { variant: 'secondary' as const, icon: XCircle, text: 'Inactive' },
    error: { variant: 'destructive' as const, icon: AlertCircle, text: 'Error' },
    pending: { variant: 'outline' as const, icon: AlertCircle, text: 'Pending' }
  };
  
  const config = variants[status];
  const Icon = config.icon;
  
  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.text}
    </Badge>
  );
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [formData, setFormData] = useState({
    display_name: '',
    description: '',
    api_key: '',
  });
  const [testingApiKey, setTestingApiKey] = useState(false);

  useEffect(() => {
    loadIntegrations();
    
    // Check for OAuth callback messages
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    
    if (success === 'google_connected') {
      toast.success('Google account connected successfully!');
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (error) {
      const errorMessages: { [key: string]: string } = {
        'missing_parameters': 'OAuth callback missing required parameters',
        'storage_failed': 'Failed to store Google connection',
        'token_exchange_failed': 'Failed to exchange OAuth tokens',
        'callback_failed': 'OAuth callback failed',
      };
      
      toast.error(errorMessages[error] || 'Google connection failed');
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const loadIntegrations = async () => {
    try {
      const response = await fetch('/api/integrations');
      if (!response.ok) throw new Error('Failed to load integrations');
      const { integrations } = await response.json();
      setIntegrations(integrations);
    } catch (error) {
      toast.error('Failed to load integrations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const testGoogleMapsApiKey = async (apiKey: string) => {
    if (!apiKey) {
      toast.error('Please enter an API key');
      return false;
    }

    setTestingApiKey(true);
    try {
      const response = await fetch('/api/integrations/google-maps/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey }),
      });

      const result = await response.json();
      
      if (result.valid) {
        toast.success('Google Maps API key is valid!');
        return true;
      } else {
        toast.error(`API key test failed: ${result.message}`);
        return false;
      }
    } catch (error) {
      toast.error('Failed to test API key');
      return false;
    } finally {
      setTestingApiKey(false);
    }
  };

  const handleSaveIntegration = async () => {
    if (!selectedIntegration) return;

    try {
      // Test API key first if it's Google Maps
      if (selectedIntegration.service_name === 'google_maps' && formData.api_key) {
        const isValid = await testGoogleMapsApiKey(formData.api_key);
        if (!isValid) return;
      }

      const response = await fetch(`/api/integrations/${selectedIntegration.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update integration');
      
      toast.success('Integration updated successfully');
      setDialogOpen(false);
      loadIntegrations();
    } catch (error) {
      toast.error('Failed to update integration');
      console.error(error);
    }
  };

  const openIntegrationDialog = (integration: Integration) => {
    setSelectedIntegration(integration);
    setFormData({
      display_name: integration.display_name,
      description: integration.description || '',
      api_key: '',
    });
    setDialogOpen(true);
  };

  const handleGoogleOAuth = async () => {
    try {
      const response = await fetch('/api/auth/google');
      const { authUrl } = await response.json();
      
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        toast.error('Failed to get Google authorization URL');
      }
    } catch (error) {
      toast.error('Failed to initiate Google OAuth');
    }
  };

  const handleDisconnectGoogle = async (integrationId: string) => {
    try {
      const response = await fetch(`/api/integrations/${integrationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to disconnect Google');
      
      toast.success('Google account disconnected');
      loadIntegrations();
    } catch (error) {
      toast.error('Failed to disconnect Google account');
      console.error(error);
    }
  };

  const getIntegrationIcon = (serviceName: string) => {
    switch (serviceName) {
      case 'google_maps':
        return <MapPin className="h-6 w-6" />;
      case 'google_oauth':
        return <Key className="h-6 w-6" />;
      default:
        return <Settings className="h-6 w-6" />;
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
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">
          Connect your account with third-party services to enhance your assistant&apos;s capabilities.
        </p>
      </div>

      {/* Google OAuth Connection Card - Show if not connected */}
      {!integrations.some(integration => integration.service_name === 'google_oauth' && integration.status === 'active') && (
        <div className="mb-6">
          <Card className="max-w-md border-2 border-dashed border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-6 w-6 text-primary" />
              Connect Google Account
            </CardTitle>
            <CardDescription>
              Connect your Google account to enable enhanced integrations with Google Maps, Calendar, and other Google services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGoogleOAuth} className="w-full">
              <Key className="mr-2 h-4 w-4" />
              Connect with Google
            </Button>
          </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <Card key={integration.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                {getIntegrationIcon(integration.service_name)}
                <CardTitle className="text-lg">{integration.display_name}</CardTitle>
              </div>
              <StatusBadge status={integration.status} />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {integration.description}
              </CardDescription>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Created: {new Date(integration.created_at).toLocaleDateString()}</div>
                {integration.last_used_at && (
                  <div>Last used: {new Date(integration.last_used_at).toLocaleDateString()}</div>
                )}
              </div>
              {integration.service_name === 'google_oauth' ? (
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Connected as: {integration.config?.user_info?.email}
                  </div>
                  <Button 
                    className="w-full bg-gray-500 hover:bg-gray-600 dark:bg-white dark:text-black dark:hover:bg-gray-200" 
                    onClick={() => handleDisconnectGoogle(integration.id)}
                  >
                    Disconnect Google
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full mt-4" 
                  variant={integration.status === 'active' ? 'outline' : 'default'}
                  onClick={() => openIntegrationDialog(integration)}
                >
                  {integration.status === 'active' ? 'Manage' : 'Configure'}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Google Maps Demo - only show if Google Maps is active */}
      {integrations.some(integration => 
        integration.service_name === 'google_maps' && integration.status === 'active'
      ) && (
        <GoogleMapsDemo />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedIntegration && getIntegrationIcon(selectedIntegration.service_name)}
              Configure {selectedIntegration?.display_name}
            </DialogTitle>
            <DialogDescription>
              {selectedIntegration?.service_name === 'google_maps' 
                ? 'Enter your Google Maps API key to enable location services, geocoding, and directions.'
                : 'Configure this integration to connect with the service.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="Enter display name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api_key" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                API Key
              </Label>
              <Input
                id="api_key"
                type="password"
                value={formData.api_key}
                onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                placeholder="Enter your API key"
              />
              {selectedIntegration?.service_name === 'google_maps' && (
                <p className="text-sm text-muted-foreground">
                  Get your API key from the{' '}
                  <a 
                    href="https://console.cloud.google.com/apis/credentials" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google Cloud Console
                  </a>
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            {selectedIntegration?.service_name === 'google_maps' && formData.api_key && (
              <Button 
                variant="outline" 
                onClick={() => testGoogleMapsApiKey(formData.api_key)}
                disabled={testingApiKey}
              >
                {testingApiKey ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Test Key'}
              </Button>
            )}
            <Button onClick={handleSaveIntegration}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
