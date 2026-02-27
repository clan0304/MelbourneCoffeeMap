-- Convert single address/latitude/longitude to addresses JSONB array
-- Each place can now have multiple locations

-- 1. Add new JSONB column
ALTER TABLE places ADD COLUMN addresses JSONB DEFAULT '[]'::jsonb;

-- 2. Migrate existing data
UPDATE places SET addresses = jsonb_build_array(
  jsonb_build_object(
    'address', address,
    'latitude', latitude,
    'longitude', longitude
  )
) WHERE address IS NOT NULL;

-- 3. Drop old columns
ALTER TABLE places DROP COLUMN address;
ALTER TABLE places DROP COLUMN latitude;
ALTER TABLE places DROP COLUMN longitude;
