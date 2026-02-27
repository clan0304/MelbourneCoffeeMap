-- Split single 'note' column into 'note_en' and 'note_ko' for i18n support
ALTER TABLE places ADD COLUMN note_en TEXT;
ALTER TABLE places ADD COLUMN note_ko TEXT;

-- Migrate existing notes to English column
UPDATE places SET note_en = note WHERE note IS NOT NULL;

-- Drop the old column
ALTER TABLE places DROP COLUMN note;
