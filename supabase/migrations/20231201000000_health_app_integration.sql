-- Create health_connection_codes table
CREATE TABLE IF NOT EXISTS health_connection_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  used_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT health_connection_codes_code_length CHECK (LENGTH(code) >= 8)
);

-- Create index on health_connection_codes
CREATE INDEX IF NOT EXISTS health_connection_codes_user_id_idx ON health_connection_codes(user_id);
CREATE INDEX IF NOT EXISTS health_connection_codes_code_idx ON health_connection_codes(code);
CREATE INDEX IF NOT EXISTS health_connection_codes_used_idx ON health_connection_codes(used);

-- Create health_connected_devices table
CREATE TABLE IF NOT EXISTS health_connected_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL UNIQUE,
  device_info JSONB NOT NULL DEFAULT '{}'::JSONB,
  connected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_sync TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT health_connected_devices_device_id_length CHECK (LENGTH(device_id) >= 8)
);

-- Create index on health_connected_devices
CREATE INDEX IF NOT EXISTS health_connected_devices_user_id_idx ON health_connected_devices(user_id);
CREATE INDEX IF NOT EXISTS health_connected_devices_device_id_idx ON health_connected_devices(device_id);

-- Create health_data table
CREATE TABLE IF NOT EXISTS health_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  CONSTRAINT health_data_user_id_unique UNIQUE (user_id)
);

-- Create index on health_data
CREATE INDEX IF NOT EXISTS health_data_user_id_idx ON health_data(user_id);

-- Create health_sync_queue table
CREATE TABLE IF NOT EXISTS health_sync_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  type TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending',
  error TEXT,
  
  CONSTRAINT health_sync_queue_status_check CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

-- Create index on health_sync_queue
CREATE INDEX IF NOT EXISTS health_sync_queue_user_id_idx ON health_sync_queue(user_id);
CREATE INDEX IF NOT EXISTS health_sync_queue_device_id_idx ON health_sync_queue(device_id);
CREATE INDEX IF NOT EXISTS health_sync_queue_status_idx ON health_sync_queue(status);

-- Create RLS policies for health_connection_codes
ALTER TABLE health_connection_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY health_connection_codes_select_policy
  ON health_connection_codes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY health_connection_codes_insert_policy
  ON health_connection_codes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for health_connected_devices
ALTER TABLE health_connected_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY health_connected_devices_select_policy
  ON health_connected_devices
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create RLS policies for health_data
ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY health_data_select_policy
  ON health_data
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create RLS policies for health_sync_queue
ALTER TABLE health_sync_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY health_sync_queue_select_policy
  ON health_sync_queue
  FOR SELECT
  USING (auth.uid() = user_id);
