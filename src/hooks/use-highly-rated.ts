import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MOCK_MOVIES } from '@/data/mockMovies';

export const useHighlyRated = () => {
  return useQuery({
    queryKey: ['highlyRated'],
    queryFn: async () => {
      try {
        console.log('Fetching highly rated videos...');
        const startTime = performance.now();
        
        // Relaxed criteria:
        // - Reduced minimum views to 10,000
        // - Reduced like ratio to 0.3
        // - Still ensure video is available
        const { data: cachedVideos, error: cacheError, count } = await supabase
          .from('cached_videos')
          .select('id, title, image, category, video_id, views, like_ratio, is_available', { count: 'exact' })
          .eq('category', 'Highly Rated')
          .eq('is_available', true)
          .gt('views', 10000)  // Reduced from 50,000
          .gt('like_ratio', 0.3)  // Reduced from 0.5
          .order('views', { ascending: false })
          .limit(24);  // Increased from 12 to get more results

        const endTime = performance.now();
        const executionTime = endTime - startTime;

        // Log query metrics
        await supabase.rpc('log_query_metrics', {
          p_query_name: 'fetch_highly_rated',
          p_execution_time: executionTime,
          p_rows_affected: count || 0,
          p_category: 'Highly Rated',
          p_user_id: (await supabase.auth.getUser()).data.user?.id
        });

        if (cacheError) {
          console.error('Error fetching from cache:', cacheError);
          throw cacheError;
        }

        if (!cachedVideos || cachedVideos.length === 0) {
          console.log('No cached videos found, fetching fresh data...');
          
          // If no cached videos, try fetching with even more relaxed criteria
          const { data: fallbackVideos, error: fallbackError } = await supabase
            .from('cached_videos')
            .select('id, title, image, category, video_id, views, like_ratio, is_available')
            .eq('category', 'Highly Rated')
            .eq('is_available', true)
            .gt('views', 5000)  // Even more relaxed view count
            .order('views', { ascending: false })
            .limit(24);

          if (fallbackError) {
            console.error('Error fetching fallback videos:', fallbackError);
            throw fallbackError;
          }

          if (fallbackVideos && fallbackVideos.length > 0) {
            console.log(`Found ${fallbackVideos.length} fallback videos`);
            return fallbackVideos;
          }
        }

        if (cachedVideos && cachedVideos.length > 0) {
          console.log(`Found ${cachedVideos.length} cached videos in ${executionTime.toFixed(2)}ms`);
          
          // Update access count and cache status in the background
          const updatePromises = cachedVideos.map(video => 
            supabase.rpc('increment_access_count', { video_id: video.id })
          );
          
          Promise.allSettled(updatePromises).then(results => {
            results.forEach((result, index) => {
              if (result.status === 'rejected') {
                console.error(`Failed to update cache metrics for video ${index}:`, result.reason);
              }
            });
          });

          return cachedVideos;
        }

        // Only use mock data as an absolute last resort
        console.log('No videos found even with relaxed criteria, using mock data');
        toast.error('Unable to fetch videos at this time');
        return MOCK_MOVIES.highlyRated;
      } catch (error) {
        console.error('Error in highly rated query:', error);
        toast.error('Failed to load videos');
        return MOCK_MOVIES.highlyRated;
      }
    },
    staleTime: 1000 * 60 * 15, // Consider data fresh for 15 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
  });
};