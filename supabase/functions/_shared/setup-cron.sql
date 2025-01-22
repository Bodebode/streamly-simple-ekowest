-- Update messages table to use channel instead of channel_id
ALTER TABLE IF EXISTS public.messages 
DROP COLUMN IF EXISTS channel_id,
ADD COLUMN IF NOT EXISTS channel text DEFAULT 'general';