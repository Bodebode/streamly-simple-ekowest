import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MOCK_MOVIES } from '@/data/mockMovies';

export const useHighlyRated = () => {
  return useQuery({
    queryKey: ['highlyRated'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-highly-rated');
        
        if (error) {
          console.error('Error fetching highly rated videos:', error);
          toast.error('Failed to load videos, showing placeholders');
          return MOCK_MOVIES.highlyRated;
        }
        
        if (!data || data.length === 0) {
          console.log('No highly rated videos found, using placeholders');
          return MOCK_MOVIES.highlyRated;
        }

        // Increment access count for cached videos
        if (Array.isArray(data)) {
          data.forEach(async (video) => {
            if (video.id) {
              await supabase.rpc('increment_access_count', { video_id: video.id });
            }
          });
        }

        return data;
      } catch (error) {
        console.error('Error in highly rated query:', error);
        toast.error('Failed to load videos, showing placeholders');
        return MOCK_MOVIES.highlyRated;
      }
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
};