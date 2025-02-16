
import { supabase } from '@/integrations/supabase/client';

export const getStorageUrl = (bucket: string, path: string | null) => {
  if (!path) return null;
  
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
    
  return data.publicUrl;
};
