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
          .gt('views', 50000)
          .gt('like_ratio', 0.5)
          .order('views', { ascending: false })
          .limit(12);

        if (cacheError) {
          console.error('Error fetching from cache:', cacheError);
          throw cacheError;
        }

        if (cachedVideos && cachedVideos.length > 0) {
          console.log(`Found ${cachedVideos.length} cached videos`);
          return Promise.resolve(cachedVideos);
        }

        console.log('No videos found, using mock data');
        return Promise.resolve(MOCK_MOVIES.highlyRated);
      } catch (error) {
        console.error('Error in highly rated query:', error);
        toast.error('Failed to load videos, showing placeholders');
        return Promise.resolve(MOCK_MOVIES.highlyRated);
      }
    },
    staleTime: 1000 * 60 * 15, // Consider data fresh for 15 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
  });
};