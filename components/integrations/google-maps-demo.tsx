'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, MapPin, Navigation, Search } from 'lucide-react';

interface GeocodeResult {
  formatted_address: string;
  location: {
    lat: number;
    lng: number;
  };
  place_id: string;
  types: string[];
}

interface DirectionsResult {
  distance: { text: string; value: number };
  duration: { text: string; value: number };
  start_address: string;
  end_address: string;
  steps: Array<{
    instructions: string;
    distance: { text: string; value: number };
    duration: { text: string; value: number };
  }>;
}

export function GoogleMapsDemo() {
  const [geocodeAddress, setGeocodeAddress] = useState('');
  const [geocodeResults, setGeocodeResults] = useState<GeocodeResult[]>([]);
  const [geocodeLoading, setGeocodeLoading] = useState(false);

  const [directionsOrigin, setDirectionsOrigin] = useState('');
  const [directionsDestination, setDirectionsDestination] = useState('');
  const [directionsResult, setDirectionsResult] = useState<DirectionsResult | null>(null);
  const [directionsLoading, setDirectionsLoading] = useState(false);

  const handleGeocode = async () => {
    if (!geocodeAddress.trim()) {
      toast.error('Please enter an address');
      return;
    }

    setGeocodeLoading(true);
    try {
      const response = await fetch('/api/integrations/google-maps/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: geocodeAddress }),
      });

      const data = await response.json();
      
      if (data.success) {
        setGeocodeResults(data.results);
        toast.success(`Found ${data.results.length} result(s)`);
      } else {
        toast.error(data.error || 'Geocoding failed');
        setGeocodeResults([]);
      }
    } catch (error) {
      toast.error('Failed to geocode address');
      setGeocodeResults([]);
    } finally {
      setGeocodeLoading(false);
    }
  };

  const handleDirections = async () => {
    if (!directionsOrigin.trim() || !directionsDestination.trim()) {
      toast.error('Please enter both origin and destination');
      return;
    }

    setDirectionsLoading(true);
    try {
      const response = await fetch('/api/integrations/google-maps/directions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          origin: directionsOrigin, 
          destination: directionsDestination,
          mode: 'driving'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setDirectionsResult(data.route);
        toast.success('Directions found!');
      } else {
        toast.error(data.error || 'Failed to get directions');
        setDirectionsResult(null);
      }
    } catch (error) {
      toast.error('Failed to get directions');
      setDirectionsResult(null);
    } finally {
      setDirectionsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Google Maps Integration Demo</h2>
        <p className="text-muted-foreground">
          Test your Google Maps integration with geocoding and directions.
        </p>
      </div>

      {/* Geocoding Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Address Geocoding
          </CardTitle>
          <CardDescription>
            Convert an address to coordinates (latitude and longitude).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="geocode-address">Address</Label>
              <Input
                id="geocode-address"
                value={geocodeAddress}
                onChange={(e) => setGeocodeAddress(e.target.value)}
                placeholder="Enter an address (e.g., 1600 Amphitheatre Parkway, Mountain View, CA)"
                onKeyDown={(e) => e.key === 'Enter' && handleGeocode()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleGeocode} disabled={geocodeLoading}>
                {geocodeLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                Geocode
              </Button>
            </div>
          </div>

          {geocodeResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Results:</h4>
              {geocodeResults.map((result, index) => (
                <Card key={index} className="p-3">
                  <div className="space-y-2">
                    <div className="font-medium">{result.formatted_address}</div>
                    <div className="text-sm text-muted-foreground">
                      Coordinates: {result.location.lat}, {result.location.lng}
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {result.types.slice(0, 3).map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Directions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Directions
          </CardTitle>
          <CardDescription>
            Get driving directions between two locations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="directions-origin">Origin</Label>
              <Input
                id="directions-origin"
                value={directionsOrigin}
                onChange={(e) => setDirectionsOrigin(e.target.value)}
                placeholder="Starting location"
              />
            </div>
            <div>
              <Label htmlFor="directions-destination">Destination</Label>
              <Input
                id="directions-destination"
                value={directionsDestination}
                onChange={(e) => setDirectionsDestination(e.target.value)}
                placeholder="Ending location"
              />
            </div>
          </div>
          
          <Button onClick={handleDirections} disabled={directionsLoading}>
            {directionsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
            Get Directions
          </Button>

          {directionsResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-3">
                  <div className="text-sm font-medium">Distance</div>
                  <div className="text-lg">{directionsResult.distance.text}</div>
                </Card>
                <Card className="p-3">
                  <div className="text-sm font-medium">Duration</div>
                  <div className="text-lg">{directionsResult.duration.text}</div>
                </Card>
              </div>

              <div>
                <h4 className="font-medium mb-2">Route Details:</h4>
                <div className="text-sm text-muted-foreground mb-2">
                  From: {directionsResult.start_address}
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  To: {directionsResult.end_address}
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {directionsResult.steps.map((step, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <div className="text-sm" dangerouslySetInnerHTML={{ __html: step.instructions }} />
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          {step.distance.text} • {step.duration.text}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
