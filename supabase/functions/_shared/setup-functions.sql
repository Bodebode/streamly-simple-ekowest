
CREATE OR REPLACE FUNCTION increment_pending_access_count(video_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE cached_videos 
  SET pending_access_count = COALESCE(pending_access_count, 0) + 1 
  WHERE id = video_id;
END;
$$;
