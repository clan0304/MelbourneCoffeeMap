-- Add optional Reels and TikTok URL fields
ALTER TABLE places ADD COLUMN reels_url TEXT;
ALTER TABLE places ADD COLUMN tiktok_url TEXT;
