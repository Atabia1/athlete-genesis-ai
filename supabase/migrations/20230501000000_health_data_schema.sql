-- Health Data Schema
-- This migration creates the tables needed for health data synchronization

-- Connection codes table
CREATE TABLE IF NOT EXISTS health_connection_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP WITH TIME ZONE,
  
  -- Add indexes
  CONSTRAINT health_connection_codes_code_idx UNIQUE (code)
);

-- Connected devices table
CREATE TABLE IF NOT EXISTS health_connected_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL UNIQUE,
  device_info JSONB,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sync TIMESTAMP WITH TIME ZONE,
  
  -- Add indexes
  CONSTRAINT health_connected_devices_device_id_idx UNIQUE (device_id)
);

-- Health data table
CREATE TABLE IF NOT EXISTS health_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  source TEXT,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add indexes
  CONSTRAINT health_data_user_id_idx UNIQUE (user_id)
);

-- Health workouts table
CREATE TABLE IF NOT EXISTS health_workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL, -- in seconds
  calories INTEGER,
  distance FLOAT, -- in meters
  heart_rate_avg INTEGER,
  heart_rate_max INTEGER,
  metrics JSONB,
  source TEXT,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add indexes
  CREATE INDEX health_workouts_user_id_idx ON health_workouts (user_id),
  CREATE INDEX health_workouts_start_date_idx ON health_workouts (start_date)
);

-- Row Level Security (RLS) policies
-- Users can only access their own health data

-- Health connection codes policies
ALTER TABLE health_connection_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY health_connection_codes_select_policy
  ON health_connection_codes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY health_connection_codes_insert_policy
  ON health_connection_codes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Connected devices policies
ALTER TABLE health_connected_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY health_connected_devices_select_policy
  ON health_connected_devices
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY health_connected_devices_insert_policy
  ON health_connected_devices
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY health_connected_devices_update_policy
  ON health_connected_devices
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY health_connected_devices_delete_policy
  ON health_connected_devices
  FOR DELETE
  USING (auth.uid() = user_id);

-- Health data policies
ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY health_data_select_policy
  ON health_data
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY health_data_insert_policy
  ON health_data
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY health_data_update_policy
  ON health_data
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Health workouts policies
ALTER TABLE health_workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY health_workouts_select_policy
  ON health_workouts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY health_workouts_insert_policy
  ON health_workouts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY health_workouts_update_policy
  ON health_workouts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY health_workouts_delete_policy
  ON health_workouts
  FOR DELETE
  USING (auth.uid() = user_id);
