
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const COALESCE_WINDOW = 2000; // 2 seconds window for coalescing requests
const pendingRequests = new Map<string, Promise<any>>();

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

    // Check if a refresh is already in progress
    const { data: refreshStatus } = await supabase
      .from('cached_videos')
      .select('refresh_in_progress, last_refresh_attempt')
      .eq('category', category)
      .limit(1)
      .single();

    if (refreshStatus?.refresh_in_progress && 
        refreshStatus.last_refresh_attempt && 
        Date.now() - new Date(refreshStatus.last_refresh_attempt).getTime() < 60000) {
      console.log(`Refresh already in progress for ${category}`);
      return await fallbackToAnyWindow(category);
    }

    // Fallback to any available videos if none found in current refresh window
    return await fallbackToAnyWindow(category);
  } catch (error) {
    console.error(`Error in prefetch for ${category}:`, error);
    toast.error(`Failed to load ${category} videos`);
  }
};

const fallbackToAnyWindow = async (category: string) => {
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
};

export const updateVideoCache = async (videoId: string) => {
  // Implement request coalescing for concurrent access count updates
  const cacheKey = `update-${videoId}`;
  
  if (pendingRequests.has(cacheKey)) {
    console.log(`Coalescing cache update request for video ${videoId}`);
    return pendingRequests.get(cacheKey);
  }

  const updatePromise = new Promise(async (resolve) => {
    try {
      // Use pending_access_count for batch updates
      const { error } = await supabase
        .rpc('increment_pending_access_count', { video_id: videoId });

      if (error) {
        console.error('Error updating video cache:', error);
        toast.error('Failed to update video stats');
      }

      // Remove from pending requests after COALESCE_WINDOW
      setTimeout(() => {
        pendingRequests.delete(cacheKey);
      }, COALESCE_WINDOW);

      resolve(true);
    } catch (error) {
      console.error('Error in updateVideoCache:', error);
      resolve(false);
    }
  });

  pendingRequests.set(cacheKey, updatePromise);
  return updatePromise;
};
