-- Adicionar colunas faltantes na tabela beats
ALTER TABLE beats ADD COLUMN IF NOT EXISTS "producerId" text DEFAULT '';
ALTER TABLE beats ADD COLUMN IF NOT EXISTS "price_mp3" numeric DEFAULT 0;
ALTER TABLE beats ADD COLUMN IF NOT EXISTS "price_wav" numeric DEFAULT 0;
ALTER TABLE beats ADD COLUMN IF NOT EXISTS "price_stems" numeric DEFAULT 0;
ALTER TABLE beats ADD COLUMN IF NOT EXISTS "description" text DEFAULT '';
ALTER TABLE beats ADD COLUMN IF NOT EXISTS "audioPreviewUrl" text DEFAULT '';
ALTER TABLE beats ADD COLUMN IF NOT EXISTS "downloadUrl" text DEFAULT '';
ALTER TABLE beats ADD COLUMN IF NOT EXISTS "wavUrl" text;
ALTER TABLE beats ADD COLUMN IF NOT EXISTS "stemsUrl" text;
ALTER TABLE beats ADD COLUMN IF NOT EXISTS "artworkUrl" text DEFAULT '';
ALTER TABLE beats ADD COLUMN IF NOT EXISTS "tags" jsonb DEFAULT '[]'::jsonb;
