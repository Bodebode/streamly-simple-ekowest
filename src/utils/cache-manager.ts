
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const COALESCE_WINDOW = 2000; // 2 seconds window for coalescing requests
const CACHE_WINDOW = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
const pendingRequests = new Map<string, Promise<any>>();
const requestQueue: { videoId: string; timestamp: number }[] = [];
const BATCH_SIZE = 10;
const BATCH_INTERVAL = 5000; // Process batch every 5 seconds

// Process batched requests
const processBatch = async () => {
  const now = Date.now();
  const cutoff = now - BATCH_INTERVAL;
  const batchItems = requestQueue
    .filter(item => item.timestamp <= cutoff)
    .slice(0, BATCH_SIZE);

  if (batchItems.length === 0) return;

  // Remove processed items from queue
  requestQueue.splice(0, batchItems.length);

  try {
    const videoIds = batchItems.map(item => item.videoId);
    const { error } = await supabase.rpc('batch_update_access_counts', {
      video_ids: videoIds
    });

    if (error) {
      console.error('Error in batch update:', error);
      toast.error('Failed to update video stats');
    }
  } catch (error) {
    console.error('Error processing batch:', error);
  }
};

// Start batch processing interval
setInterval(processBatch, BATCH_INTERVAL);

export const prefetchVideos = async (category: string) => {
  try {
    // Get current hour (0-23)
    const currentHour = new Date().getHours();
    // Calculate current refresh window (0-11, each window is 2 hours)
    const refreshWindow = Math.floor(currentHour / 2);

    // Check memory cache first
    const cacheKey = `${category}-${refreshWindow}`;
    if (pendingRequests.has(cacheKey)) {
      console.log(`Using coalesced request for ${category}`);
      return pendingRequests.get(cacheKey);
    }

    const fetchPromise = (async () => {
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
        
        // Cache in memory
        setTimeout(() => {
          pendingRequests.delete(cacheKey);
        }, CACHE_WINDOW);
        
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
    })();

    pendingRequests.set(cacheKey, fetchPromise);

    return fetchPromise;
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
  // Add to request queue for batching
  requestQueue.push({
    videoId,
    timestamp: Date.now()
  });

  // Implement request coalescing
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
