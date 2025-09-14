// Google Maps API client utilities

export interface GoogleMapsConfig {
  apiKey?: string;
  accessToken?: string;
  baseUrl?: string;
}

export interface GeocodeResult {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
  types: string[];
}

export interface DirectionsResult {
  routes: Array<{
    legs: Array<{
      distance: { text: string; value: number };
      duration: { text: string; value: number };
      start_address: string;
      end_address: string;
      steps: Array<{
        html_instructions: string;
        distance: { text: string; value: number };
        duration: { text: string; value: number };
      }>;
    }>;
    overview_polyline: {
      points: string;
    };
  }>;
}

export interface PlaceSearchResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  types: string[];
}

export class GoogleMapsClient {
  private config: GoogleMapsConfig;
  private baseUrl: string;

  constructor(config: GoogleMapsConfig) {
    if (!config.apiKey && !config.accessToken) {
      throw new Error('Either apiKey or accessToken must be provided');
    }
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://maps.googleapis.com/maps/api';
  }

  /**
   * Get authorization header for requests
   */
  private getAuthParams(): URLSearchParams {
    const params = new URLSearchParams();
    
    if (this.config.accessToken) {
      // OAuth token takes precedence
      params.set('access_token', this.config.accessToken);
    } else if (this.config.apiKey) {
      // Fall back to API key
      params.set('key', this.config.apiKey);
    }
    
    return params;
  }

  /**
   * Geocode an address to get coordinates
   */
  async geocode(address: string): Promise<GeocodeResult[]> {
    const url = new URL(`${this.baseUrl}/geocode/json`);
    url.searchParams.set('address', address);
    
    // Add auth parameters
    const authParams = this.getAuthParams();
    authParams.forEach((value, key) => url.searchParams.set(key, value));

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Geocoding failed: ${data.error_message || data.status}`);
    }

    return data.results;
  }

  /**
   * Reverse geocode coordinates to get address
   */
  async reverseGeocode(lat: number, lng: number): Promise<GeocodeResult[]> {
    const url = new URL(`${this.baseUrl}/geocode/json`);
    url.searchParams.set('latlng', `${lat},${lng}`);
    
    // Add auth parameters
    const authParams = this.getAuthParams();
    authParams.forEach((value, key) => url.searchParams.set(key, value));

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Reverse geocoding failed: ${data.error_message || data.status}`);
    }

    return data.results;
  }

  /**
   * Get directions between two points
   */
  async getDirections(
    origin: string,
    destination: string,
    options?: {
      mode?: 'driving' | 'walking' | 'bicycling' | 'transit';
      avoid?: 'tolls' | 'highways' | 'ferries' | 'indoor';
      units?: 'metric' | 'imperial';
    }
  ): Promise<DirectionsResult> {
    const url = new URL(`${this.baseUrl}/directions/json`);
    url.searchParams.set('origin', origin);
    url.searchParams.set('destination', destination);
    
    // Add auth parameters
    const authParams = this.getAuthParams();
    authParams.forEach((value, key) => url.searchParams.set(key, value));

    if (options?.mode) url.searchParams.set('mode', options.mode);
    if (options?.avoid) url.searchParams.set('avoid', options.avoid);
    if (options?.units) url.searchParams.set('units', options.units);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Directions failed: ${data.error_message || data.status}`);
    }

    return data;
  }

  /**
   * Search for places nearby
   */
  async searchPlaces(
    query: string,
    location?: { lat: number; lng: number },
    radius?: number
  ): Promise<PlaceSearchResult[]> {
    const url = new URL(`${this.baseUrl}/place/textsearch/json`);
    url.searchParams.set('query', query);
    
    // Add auth parameters
    const authParams = this.getAuthParams();
    authParams.forEach((value, key) => url.searchParams.set(key, value));

    if (location) {
      url.searchParams.set('location', `${location.lat},${location.lng}`);
    }
    if (radius) {
      url.searchParams.set('radius', radius.toString());
    }

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Place search failed: ${data.error_message || data.status}`);
    }

    return data.results;
  }

  /**
   * Get place details by place ID
   */
  async getPlaceDetails(placeId: string, fields?: string[]): Promise<any> {
    const url = new URL(`${this.baseUrl}/place/details/json`);
    url.searchParams.set('place_id', placeId);
    
    // Add auth parameters
    const authParams = this.getAuthParams();
    authParams.forEach((value, key) => url.searchParams.set(key, value));

    if (fields && fields.length > 0) {
      url.searchParams.set('fields', fields.join(','));
    }

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Place details failed: ${data.error_message || data.status}`);
    }

    return data.result;
  }

  /**
   * Generate a static map URL
   */
  generateStaticMapUrl(
    center: { lat: number; lng: number },
    options?: {
      zoom?: number;
      size?: string;
      maptype?: 'roadmap' | 'satellite' | 'terrain' | 'hybrid';
      markers?: Array<{
        location: { lat: number; lng: number };
        color?: string;
        label?: string;
      }>;
    }
  ): string {
    const url = new URL(`${this.baseUrl}/staticmap`);
    url.searchParams.set('center', `${center.lat},${center.lng}`);
    
    // Add auth parameters
    const authParams = this.getAuthParams();
    authParams.forEach((value, key) => url.searchParams.set(key, value));
    url.searchParams.set('zoom', (options?.zoom || 13).toString());
    url.searchParams.set('size', options?.size || '600x400');
    url.searchParams.set('maptype', options?.maptype || 'roadmap');

    if (options?.markers && options.markers.length > 0) {
      options.markers.forEach((marker) => {
        let markerParam = `${marker.location.lat},${marker.location.lng}`;
        if (marker.color) markerParam = `color:${marker.color}|${markerParam}`;
        if (marker.label) markerParam = `label:${marker.label}|${markerParam}`;
        url.searchParams.append('markers', markerParam);
      });
    }

    return url.toString();
  }

  /**
   * Test the API key validity
   */
  async testConnection(): Promise<{ valid: boolean; error?: string }> {
    try {
      await this.geocode('1600 Amphitheatre Parkway, Mountain View, CA');
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

/**
 * Create a Google Maps client instance with API key or OAuth token from integration
 */
export async function createGoogleMapsClient(userId: string): Promise<GoogleMapsClient | null> {
  try {
    const response = await fetch('/api/integrations');
    const { integrations } = await response.json();
    
    // First, try to find OAuth integration
    const googleOAuthIntegration = integrations.find(
      (integration: any) => integration.service_name === 'google_oauth' && integration.status === 'active'
    );

    if (googleOAuthIntegration?.api_key) {
      try {
        // Decrypt OAuth tokens (in a real app, use proper decryption)
        const tokens = JSON.parse(atob(googleOAuthIntegration.api_key));
        
        // Check if token is still valid (basic check)
        const expiresAt = new Date(googleOAuthIntegration.metadata?.expires_at);
        if (expiresAt > new Date()) {
          return new GoogleMapsClient({ accessToken: tokens.access_token });
        }
        
        // TODO: Implement token refresh logic here
        console.warn('OAuth token expired, falling back to API key');
      } catch (error) {
        console.warn('Failed to parse OAuth tokens, falling back to API key');
      }
    }
    
    // Fall back to API key method
    const googleMapsIntegration = integrations.find(
      (integration: any) => integration.service_name === 'google_maps' && integration.status === 'active'
    );

    if (!googleMapsIntegration?.api_key) {
      return null;
    }

    // Decrypt API key (in a real app, use proper decryption)
    const apiKey = atob(googleMapsIntegration.api_key);
    
    return new GoogleMapsClient({ apiKey });
  } catch (error) {
    console.error('Failed to create Google Maps client:', error);
    return null;
  }
}
