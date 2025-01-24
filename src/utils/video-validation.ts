import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const checkVideoAvailability = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('check-video-availability', {
      body: { videoId: 'test' } // We'll just do a test check since this is called without params
    });

    if (error) {
      console.error('[checkVideoAvailability] Error:', error);
      return false;
    }

    console.log('[checkVideoAvailability] Response:', data);
    return data?.available || false;
  } catch (error) {
    console.error('[checkVideoAvailability] Failed to check video availability:', error);
    return false;
  }
};

export const checkThumbnailQuality = async (movie: {
  title: string;
  videoId?: string;
}): Promise<boolean> => {
  if (!movie.videoId) return false;
  
  try {
    const img = new Image();
    const maxResUrl = `https://img.youtube.com/vi/${movie.videoId}/maxresdefault.jpg`;
    
    return new Promise((resolve) => {
      img.onload = () => {
        const isHighQuality = !(img.width === 120 && img.height === 90);
        if (!isHighQuality) {
          console.log(`[Thumbnail Quality Alert] Low quality thumbnail detected for: "${movie.title}"`);
        }
        resolve(isHighQuality);
      };
      img.onerror = () => {
        console.log(`[Thumbnail Error] Failed to load thumbnail for: "${movie.title}"`);
        resolve(false);
      };
      img.src = maxResUrl;
    });
  } catch (error) {
    console.error(`[Thumbnail Error] Error checking thumbnail for: "${movie.title}"`, error);
    return false;
  }
};