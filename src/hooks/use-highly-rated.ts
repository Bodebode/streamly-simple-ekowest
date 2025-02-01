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
        
        // Optimized query with specific column selection and better indexing
        const { data: cachedVideos, error: cacheError, count } = await supabase
          .from('cached_videos')
          .select('id, title, image, category, video_id, views, like_ratio, is_available', { count: 'exact' })
          .eq('category', 'Highly Rated')
          .eq('is_available', true)
          .gt('views', 50000)
          .gt('like_ratio', 0.5)
          .order('views', { ascending: false })
          .limit(12);

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

        if (cachedVideos && cachedVideos.length > 0) {
          console.log(`Found ${cachedVideos.length} cached videos in ${executionTime.toFixed(2)}ms`);
          
          // Update access count and cache status in the background
          const updatePromises = cachedVideos.map(video => 
            supabase.rpc('increment_access_count', { video_id: video.id })
          );
          
          // Fire and forget - don't await these updates
          Promise.allSettled(updatePromises).then(results => {
            results.forEach((result, index) => {
              if (result.status === 'rejected') {
                console.error(`Failed to update cache metrics for video ${index}:`, result.reason);
              }
            });
          });

          return cachedVideos;
        }

        console.log('No videos found, using mock data');
        return MOCK_MOVIES.highlyRated;
      } catch (error) {
        console.error('Error in highly rated query:', error);
        toast.error('Failed to load videos, showing placeholders');
        return MOCK_MOVIES.highlyRated;
      }
    },
    staleTime: 1000 * 60 * 15, // Consider data fresh for 15 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
  });
};