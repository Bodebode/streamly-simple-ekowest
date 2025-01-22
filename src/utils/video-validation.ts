import { supabase } from '@/integrations/supabase/client';

export const checkVideoAvailability = async (videoId?: string): Promise<boolean> => {
  if (!videoId) {
    console.warn('[checkVideoAvailability] No videoId provided');
    return false;
  }
  
  try {
    console.log('[checkVideoAvailability] Checking video:', videoId);
    const { data, error } = await supabase.functions.invoke('check-video-availability', {
      body: { videoId }
    });

    if (error) {
      console.error('[checkVideoAvailability] Error:', error);
      return false;
    }

    console.log('[checkVideoAvailability] Result:', data);
    return data?.available ?? false;
  } catch (error) {
    console.error('[checkVideoAvailability] Unexpected error:', error);
    return false;
  }
};