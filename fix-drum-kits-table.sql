-- Add slug and tags columns to drum_kits
ALTER TABLE drum_kits ADD COLUMN IF NOT EXISTS slug TEXT DEFAULT '';
ALTER TABLE drum_kits ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Create drum_kit_samples table
CREATE TABLE IF NOT EXISTS drum_kit_samples (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pack_id UUID REFERENCES drum_kits(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  duration TEXT DEFAULT '',
  key TEXT DEFAULT '',
  bpm INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE drum_kit_samples ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access for drum_kit_samples" ON drum_kit_samples FOR SELECT USING (true);

-- Allow authenticated insert/update/delete
CREATE POLICY "Auth insert drum_kit_samples" ON drum_kit_samples FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth update drum_kit_samples" ON drum_kit_samples FOR UPDATE USING (true);
CREATE POLICY "Auth delete drum_kit_samples" ON drum_kit_samples FOR DELETE USING (true);
