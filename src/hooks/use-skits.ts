import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MOCK_MOVIES } from '@/data/mockMovies';
import { CachedMovie, Movie } from '@/types/movies';
import { transformCachedToMovie } from '@/utils/movie-transforms';

export const useSkits = () => {
  return useQuery({
    queryKey: ['skits'],
    queryFn: async () => {
      try {
        console.log('Fetching skits...');
        const { data, error } = await supabase
          .from('cached_videos')
          .select('*')
          .eq('category', 'Skits')
          .eq('is_available', true)
          .gt('expires_at', new Date().toISOString())
          .order('access_count', { ascending: false })
          .limit(12);
        
        if (error) {
          console.error('Error fetching skits:', error);
          return MOCK_MOVIES.skits;
        }

        if (!data || data.length === 0) {
          console.log('No skits found, using mock data');
          return MOCK_MOVIES.skits;
        }

        // Transform cached videos to Movie type
        const movies = transformCachedToMovie(data as CachedMovie[]);
        console.log(`Found ${movies.length} skits`);
        return movies;
      } catch (error) {
        console.error('Error in skits query:', error);
        return MOCK_MOVIES.skits;
      }
    },
    initialData: MOCK_MOVIES.skits,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};