import { supabase } from '@/integrations/supabase/client';
import { CachedVideo } from '@/types/video';

export const isValidNewRelease = (video: CachedVideo): boolean => {
  const MINIMUM_DURATION = 45 * 60; // 45 minutes in seconds
  
  return (
    video.video_id !== undefined &&
    video.duration !== undefined &&
    video.duration >= MINIMUM_DURATION
  );
};

export const checkVideoAvailability = async (videoId?: string): Promise<boolean> => {
  if (!videoId) return false;
  
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
    return data.available;
  } catch (error) {
    console.error('[checkVideoAvailability] Unexpected error:', error);
    return false;
  }
};