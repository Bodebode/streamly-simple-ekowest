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
        
        // First try to get from cache with longer expiration
        const { data: cachedVideos, error: cacheError } = await supabase
          .from('cached_videos')
          .select('*')
          .eq('category', 'Highly Rated')
          .eq('is_available', true)
          .gt('views', 50000) // Lowered threshold for testing
          .gt('like_ratio', 0.5)
          .order('views', { ascending: false })
          .limit(12);

        if (cacheError) {
          console.error('Error fetching from cache:', cacheError);
          throw cacheError;
        }

        if (cachedVideos && cachedVideos.length > 0) {
          console.log(`Found ${cachedVideos.length} cached videos`);
          
          // Update access count in the background
          cachedVideos.forEach(video => {
            supabase.rpc('increment_access_count', { video_id: video.id })
              .then(() => console.log(`Incremented access count for ${video.id}`))
              .catch(err => console.error(`Failed to increment access count: ${err}`));
          });

          return cachedVideos;
        }

        // If no cached videos, try with relaxed criteria
        const { data: relaxedVideos, error: relaxedError } = await supabase
          .from('cached_videos')
          .select('*')
          .eq('category', 'Highly Rated')
          .eq('is_available', true)
          .gt('views', 10000)
          .order('views', { ascending: false })
          .limit(12);

        if (relaxedError) {
          console.error('Error fetching with relaxed criteria:', relaxedError);
          throw relaxedError;
        }

        if (relaxedVideos && relaxedVideos.length > 0) {
          console.log(`Found ${relaxedVideos.length} videos with relaxed criteria`);
          return relaxedVideos;
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