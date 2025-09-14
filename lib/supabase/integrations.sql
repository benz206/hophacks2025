-- INTEGRATIONS: Third-party service connections for users
-- Stores API keys, configuration, and connection status for various services
CREATE TABLE integrations (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- owner of this integration
    service_name VARCHAR(100) NOT NULL, -- e.g., 'google_maps', 'stripe', 'twilio', etc.
    display_name VARCHAR(200) NOT NULL, -- human-readable name
    description TEXT, -- description of what this integration does
    status VARCHAR(50) DEFAULT 'inactive', -- 'active', 'inactive', 'error', 'pending'
    api_key TEXT, -- encrypted API key or token
    config JSONB DEFAULT '{}', -- flexible configuration storage
    metadata JSONB DEFAULT '{}', -- additional metadata (usage stats, last sync, etc.)
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_used_at TIMESTAMP,
    
    -- Ensure unique service per user
    UNIQUE(user_id, service_name)
);

-- Create index for faster queries
CREATE INDEX idx_integrations_user_id ON integrations(user_id);
CREATE INDEX idx_integrations_service_name ON integrations(service_name);
CREATE INDEX idx_integrations_status ON integrations(status);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_integrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update the updated_at column
CREATE TRIGGER trigger_update_integrations_updated_at
    BEFORE UPDATE ON integrations
    FOR EACH ROW
    EXECUTE FUNCTION update_integrations_updated_at();

-- Insert default Google Maps integration template
INSERT INTO integrations (user_id, service_name, display_name, description, status, config) 
SELECT 
    auth.uid() as user_id,
    'google_maps' as service_name,
    'Google Maps' as display_name,
    'Access Google Maps API for location services, geocoding, and directions' as description,
    'inactive' as status,
    '{
        "api_endpoint": "https://maps.googleapis.com/maps/api",
        "features": ["geocoding", "directions", "places", "maps_static"],
        "rate_limits": {
            "requests_per_day": 40000,
            "requests_per_minute": 100
        }
    }'::jsonb as config
WHERE auth.uid() IS NOT NULL
ON CONFLICT (user_id, service_name) DO NOTHING;

-- RLS (Row Level Security) policies
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own integrations
CREATE POLICY "Users can view their own integrations" ON integrations
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own integrations
CREATE POLICY "Users can insert their own integrations" ON integrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own integrations
CREATE POLICY "Users can update their own integrations" ON integrations
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own integrations
CREATE POLICY "Users can delete their own integrations" ON integrations
    FOR DELETE USING (auth.uid() = user_id);
