import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MOCK_MOVIES } from '@/data/mockMovies';

export const useHighlyRated = () => {
  return useQuery({
    queryKey: ['highlyRated'],
    queryFn: async () => {
      try {
        // First try to get cached videos
        const { data: cachedVideos, error: cacheError } = await supabase
          .from('cached_videos')
          .select('*')
          .eq('category', 'Highly Rated')
          .order('access_count', { ascending: false })
          .limit(12);

        if (cachedVideos && cachedVideos.length > 0) {
          console.log('Using cached highly rated videos:', cachedVideos.length);
          // Update access count for retrieved videos
          const videoIds = cachedVideos.map(video => video.id);
          await supabase
            .from('cached_videos')
            .update({ access_count: supabase.sql`access_count + 1` })
            .in('id', videoIds);

          return cachedVideos;
        }

        // If no cached videos, fetch from API with rate limiting
        const { data, error } = await supabase.functions.invoke('get-highly-rated', {
          body: { forceRefresh: false } // Only fetch if cache is expired
        });
        
        if (error) {
          console.error('Error fetching highly rated videos:', error);
          toast.error('Using cached content due to API limits');
          return MOCK_MOVIES.highlyRated;
        }
        
        return data;
      } catch (error) {
        console.error('Error in highly rated query:', error);
        toast.error('Using backup content due to API limits');
        return MOCK_MOVIES.highlyRated;
      }
    },
    staleTime: 2 * 60 * 60 * 1000, // Consider data fresh for 2 hours
    retry: 1, // Only retry once to avoid excessive API calls
  });
};