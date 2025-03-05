-- Create domain_mappings table
CREATE TABLE IF NOT EXISTS domain_mappings (
  question_id TEXT PRIMARY KEY,
  domain TEXT NOT NULL
);

-- Create assessment_criteria table
CREATE TABLE IF NOT EXISTS assessment_criteria (
  domain TEXT PRIMARY KEY,
  threshold INTEGER NOT NULL,
  assessment TEXT NOT NULL
);

-- Create screeners table
CREATE TABLE IF NOT EXISTS screeners (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create responses table to store user responses
CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answers JSONB NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_screeners_updated_at
BEFORE UPDATE ON screeners
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create a function to get the server timestamp (for connection testing)
CREATE OR REPLACE FUNCTION get_server_timestamp()
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE SQL
AS $$
  SELECT NOW();
$$; 