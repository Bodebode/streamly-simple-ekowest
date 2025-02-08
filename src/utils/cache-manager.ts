
import { supabase } from '@/integrations/supabase/client';

export const prefetchVideos = async (category: string) => {
  try {
    // Get current hour (0-23)
    const currentHour = new Date().getHours();
    // Calculate current refresh window (0-11, each window is 2 hours)
    const refreshWindow = Math.floor(currentHour / 2);

    const { data: videos, error } = await supabase
      .from('cached_videos')
      .select('*')
      .eq('category', category)
      .eq('is_available', true)
      .eq('refresh_window', refreshWindow)
      .order('views', { ascending: false })
      .limit(24);

    if (error) {
      console.error(`Error prefetching ${category} videos:`, error);
      return;
    }

    if (videos && videos.length > 0) {
      console.log(`Prefetched ${videos.length} ${category} videos from refresh window ${refreshWindow}`);
      return videos;
    }

    // Fallback to any available videos if none found in current refresh window
    const { data: fallbackVideos, error: fallbackError } = await supabase
      .from('cached_videos')
      .select('*')
      .eq('category', category)
      .eq('is_available', true)
      .order('views', { ascending: false })
      .limit(24);

    if (fallbackError) {
      console.error(`Error fetching fallback ${category} videos:`, fallbackError);
      return;
    }

    if (fallbackVideos && fallbackVideos.length > 0) {
      console.log(`Using fallback cache for ${category}, found ${fallbackVideos.length} videos`);
      return fallbackVideos;
    }
  } catch (error) {
    console.error(`Error in prefetch for ${category}:`, error);
  }
};

export const updateVideoCache = async (videoId: string) => {
  try {
    // Update pending_access_count instead of direct access_count
    const { error } = await supabase
      .rpc('increment_pending_access_count', { video_id: videoId });

    if (error) {
      console.error('Error updating video cache:', error);
    }
  } catch (error) {
    console.error('Error in updateVideoCache:', error);
  }
};
