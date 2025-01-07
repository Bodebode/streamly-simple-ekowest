import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MOCK_MOVIES } from '@/data/mockMovies';
import { CachedMovie } from '@/types/movies';

export const useYorubaMovies = () => {
  return useQuery({
    queryKey: ['yorubaMovies'],
    queryFn: async () => {
      try {
        console.log('Starting Yoruba movies fetch...');
        const { data: cachedVideos, error } = await supabase
          .from('cached_videos')
          .select('*')
          .eq('category', 'Yoruba Movies')
          .eq('is_available', true)
          .gt('expires_at', new Date().toISOString());
        
        if (error) {
          console.error('Error fetching Yoruba movies:', error);
          toast.error('Failed to load Yoruba movies');
          return MOCK_MOVIES.yoruba;
        }

        console.log('Raw cached videos count:', cachedVideos?.length);
        
        if (!cachedVideos || cachedVideos.length === 0) {
          console.log('No cached videos found, using mock data');
          return MOCK_MOVIES.yoruba;
        }

        // Transform and validate the data
        const movies = cachedVideos
          .filter(video => {
            // Check if criteria_met exists and is an object
            const criteriaMet = typeof video.criteria_met === 'object' ? video.criteria_met : null;
            return criteriaMet?.meets_criteria === true;
          })
          .map((video, index) => ({
            id: index + 1,
            title: video.title,
            image: video.image,
            category: video.category,
            videoId: video.video_id
          }));

        console.log('Final valid movies count:', movies.length);
        
        if (movies.length === 0) {
          console.log('No videos passed criteria, using mock data');
          return MOCK_MOVIES.yoruba;
        }

        return movies;

      } catch (error) {
        console.error('Error in Yoruba movies query:', error);
        toast.error('Failed to load Yoruba movies');
        return MOCK_MOVIES.yoruba;
      }
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    retry: 1,
  });
};