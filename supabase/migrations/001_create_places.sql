-- Places table
CREATE TABLE places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL DEFAULT 'cafe',
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  image_url TEXT,
  instagram_url TEXT,
  tags TEXT[] DEFAULT '{}',
  note TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_places_location ON places (latitude, longitude);
CREATE INDEX idx_places_category ON places (category);

-- Enable RLS
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

-- Public read: anyone can SELECT where is_public = true
CREATE POLICY "Public places are viewable by everyone"
  ON places FOR SELECT
  USING (is_public = true);

-- Only service_role can INSERT (bypasses RLS automatically)
-- No explicit INSERT/UPDATE/DELETE policies needed for anon —
-- service_role key bypasses RLS by default.

-- Storage bucket (run manually in Supabase dashboard or via SQL editor):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('places', 'places', true);
