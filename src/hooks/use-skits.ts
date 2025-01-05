import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MOCK_MOVIES } from '@/data/mockMovies';

export const useSkits = () => {
  return useQuery({
    queryKey: ['skits'],
    queryFn: async () => {
      try {
        // First try to get cached videos
        const { data: cachedVideos, error: cacheError } = await supabase
          .from('cached_videos')
          .select('*')
          .eq('category', 'Skits')
          .order('access_count', { ascending: false })
          .limit(12);

        if (cachedVideos && cachedVideos.length > 0) {
          console.log('Using cached skits:', cachedVideos.length);
          // Update access count for retrieved videos
          const videoIds = cachedVideos.map(video => video.id);
          for (const id of videoIds) {
            await supabase.rpc('increment_access_count', { video_id: id });
          }

          return cachedVideos;
        }

        const { data, error } = await supabase.functions.invoke('get-skits', {
          body: {
            min_length: 0,
            max_length: 42,
            min_views: 4000
          }
        });
        
        if (error) {
          console.error('Error fetching skits:', error);
          toast.error('Using cached content due to API limits');
          return MOCK_MOVIES.skits;
        }
        
        return data;
      } catch (error) {
        console.error('Error in skits query:', error);
        toast.error('Using backup content due to API limits');
        return MOCK_MOVIES.skits;
      }
    },
    staleTime: 2 * 60 * 60 * 1000, // Consider data fresh for 2 hours
    retry: 1, // Only retry once to avoid excessive API calls
  });
};