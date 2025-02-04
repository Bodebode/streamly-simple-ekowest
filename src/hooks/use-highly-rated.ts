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
        
        // Primary query with standard criteria
        const { data: cachedVideos, error: cacheError, count } = await supabase
          .from('cached_videos')
          .select('id, title, image, category, video_id, views, like_ratio, is_available', { count: 'exact' })
          .eq('category', 'Highly Rated')
          .eq('is_available', true)
          .gt('views', 5000)
          .gt('like_ratio', 0.2)
          .order('views', { ascending: false })
          .limit(24);

        if (cachedVideos && cachedVideos.length >= 12) {
          console.log(`Found ${cachedVideos.length} cached videos with standard criteria`);
          return cachedVideos;
        }

        // First fallback with relaxed criteria
        const { data: fallbackVideos, error: fallbackError } = await supabase
          .from('cached_videos')
          .select('id, title, image, category, video_id, views, like_ratio, is_available')
          .eq('category', 'Highly Rated')
          .eq('is_available', true)
          .gt('views', 1000)
          .order('views', { ascending: false })
          .limit(24);

        if (fallbackVideos && fallbackVideos.length >= 12) {
          console.log(`Found ${fallbackVideos.length} videos with first fallback criteria`);
          return fallbackVideos;
        }

        // Second fallback with minimum criteria
        const { data: minimalVideos, error: minimalError } = await supabase
          .from('cached_videos')
          .select('id, title, image, category, video_id, views, like_ratio, is_available')
          .eq('category', 'Highly Rated')
          .gt('views', 100)  // Very low view requirement
          .order('created_at', { ascending: false }) // Get newest videos first
          .limit(24);

        if (minimalVideos && minimalVideos.length > 0) {
          console.log(`Found ${minimalVideos.length} videos with minimal criteria`);
          return minimalVideos;
        }

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

        if (cacheError || fallbackError || minimalError) {
          console.error('Error fetching videos:', cacheError || fallbackError || minimalError);
          throw cacheError || fallbackError || minimalError;
        }

        // Only use mock data as an absolute last resort
        console.log('No videos found even with minimal criteria, using mock data');
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