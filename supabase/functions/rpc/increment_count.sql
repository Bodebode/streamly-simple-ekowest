CREATE OR REPLACE FUNCTION increment_count()
RETURNS integer
LANGUAGE sql
AS $$
  SELECT COALESCE(access_count, 0) + 1
$$;